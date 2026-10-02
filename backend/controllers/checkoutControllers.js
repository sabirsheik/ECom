const Checkout = require("../models/Checkout");
const Order = require("../models/order");
const Cart = require("../models/Cart");
const Product = require("../models/products");
const mongoose = require("mongoose");
const { adjustInventory } = require("../utils/inventory");
const Stripe = require("stripe");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const ensureStripeConfigured = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        const error = new Error("Stripe secret key is missing");
        error.statusCode = 500;
        throw error;
    }
};

const getStripeClient = () => {
    ensureStripeConfigured();
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const normalizePaymentMethod = (value) => {
    if (value !== undefined && typeof value !== "string") {
        return null;
    }
    const method = (value || "COD").toUpperCase();
    return ["COD", "STRIPE"].includes(method) ? method : null;
};

const getVerifiedCheckoutItems = async (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw Object.assign(new Error("Checkout must contain at least one item"), { statusCode: 400 });
    }

    const quantities = new Map();
    for (const item of items) {
        const productId = item?.productId?.toString();
        const quantity = Number(item?.quantity);
        if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity < 1) {
            throw Object.assign(new Error("Checkout contains an invalid product or quantity"), { statusCode: 400 });
        }
        quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }

    const products = await Product.find({
        _id: { $in: [...quantities.keys()] },
        isPublished: true,
    });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const checkoutItems = items.map((item) => {
        const product = productsById.get(item.productId.toString());
        if (!product) {
            throw Object.assign(new Error("A product in this checkout is unavailable"), { statusCode: 409 });
        }
        const sizes = product.sizes || [];
        const colors = product.colors || [];
        if (sizes.length && (!item.size || !sizes.includes(item.size))) {
            throw Object.assign(new Error(`Choose a valid size for ${product.name}`), { statusCode: 400 });
        }
        if (colors.length && (!item.color || !colors.includes(item.color))) {
            throw Object.assign(new Error(`Choose a valid color for ${product.name}`), { statusCode: 400 });
        }
        return {
            productId: product._id,
            name: product.name,
            image: (product.images || [])[0]?.url || "",
            price: product.price,
            size: item.size,
            color: item.color,
            quantity: Number(item.quantity),
        };
    });

    for (const [productId, quantity] of quantities) {
        const product = productsById.get(productId);
        if (product.countInStock < quantity) {
            throw Object.assign(new Error(`${product.name} does not have enough stock`), { statusCode: 409 });
        }
    }

    return {
        checkoutItems,
        totalPrice: checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0),
    };
};

const createOrderFromCheckout = async (
    checkout,
    {
        isPaid,
        paymentStatus,
        paymentDetails,
        paidAt,
    }
) => {
    if (checkout.isFinalized) {
        return null;
    }

    const claimedCheckout = await Checkout.findOneAndUpdate(
        { _id: checkout._id, isFinalized: { $ne: true } },
        { $set: { isFinalized: true, finalizedAt: new Date() } },
        { new: true }
    );
    if (!claimedCheckout) {
        return null;
    }

    const hadStockReservation = claimedCheckout.stockReservationState === "reserved";
    let createdOrder;
    let inventoryDeductedHere = false;
    try {
        if (!hadStockReservation) {
            if (claimedCheckout.stockReservationState !== "none") {
                throw Object.assign(new Error("Stock reservation is already being processed"), { statusCode: 409 });
            }
            await adjustInventory(claimedCheckout.checkoutItem, -1);
            inventoryDeductedHere = true;
        }

        createdOrder = await Order.create({
            user: claimedCheckout.user,
            orderItem: claimedCheckout.checkoutItem,
            shippingAddress: claimedCheckout.shippingAddress,
            paymentMethod: claimedCheckout.paymentMethod,
            totalPrice: claimedCheckout.totalPrice,
            isPaid,
            paidAt: isPaid ? paidAt || new Date() : undefined,
            isDelivered: false,
            paymentStatus,
            status: "Processing",
            inventoryAdjusted: true,
        });

        claimedCheckout.isPaid = isPaid;
        claimedCheckout.paymentStatus = paymentStatus;
        claimedCheckout.paymentDetails = paymentDetails || claimedCheckout.paymentDetails;
        claimedCheckout.paidAt = isPaid ? paidAt || new Date() : claimedCheckout.paidAt;
        claimedCheckout.stockReservationState = "none";
        await claimedCheckout.save();
        await Cart.findOneAndDelete({ user: claimedCheckout.user });
        return createdOrder;
    } catch (error) {
        if (createdOrder) {
            await Order.deleteOne({ _id: createdOrder._id });
        }
        if (inventoryDeductedHere) {
            await adjustInventory(claimedCheckout.checkoutItem, 1);
        }
        await Checkout.updateOne(
            { _id: claimedCheckout._id, isFinalized: true },
            {
                $set: {
                    isFinalized: false,
                    finalizedAt: null,
                    stockReservationState: hadStockReservation ? "reserved" : "none",
                },
            }
        );
        throw error;
    }
};

const reserveCheckoutStock = async (checkout) => {
    const claimedCheckout = await Checkout.findOneAndUpdate(
        {
            _id: checkout._id,
            isFinalized: { $ne: true },
            stockReservationState: "none",
        },
        { $set: { stockReservationState: "reserving" } },
        { new: true }
    );
    if (!claimedCheckout) {
        throw Object.assign(new Error("Stock is already reserved or being processed for this checkout"), { statusCode: 409 });
    }

    let inventoryReserved = false;
    try {
        await adjustInventory(claimedCheckout.checkoutItem, -1);
        inventoryReserved = true;
        claimedCheckout.stockReservationState = "reserved";
        await claimedCheckout.save();
    } catch (error) {
        if (inventoryReserved) {
            await adjustInventory(claimedCheckout.checkoutItem, 1);
        }
        await Checkout.updateOne(
            { _id: claimedCheckout._id, stockReservationState: "reserving" },
            { $set: { stockReservationState: "none" } }
        );
        throw error;
    }
};

const releaseCheckoutStock = async (checkoutId) => {
    const claimedCheckout = await Checkout.findOneAndUpdate(
        { _id: checkoutId, stockReservationState: "reserved" },
        { $set: { stockReservationState: "releasing" } },
        { new: true }
    );
    if (!claimedCheckout) {
        return false;
    }

    let inventoryReleased = false;
    try {
        await adjustInventory(claimedCheckout.checkoutItem, 1);
        inventoryReleased = true;
        claimedCheckout.stockReservationState = "none";
        await claimedCheckout.save();
        return true;
    } catch (error) {
        if (inventoryReleased) {
            await adjustInventory(claimedCheckout.checkoutItem, -1);
        }
        await Checkout.updateOne(
            { _id: claimedCheckout._id, stockReservationState: "releasing" },
            { $set: { stockReservationState: "reserved" } }
        );
        throw error;
    }
};

// Post api/checkout/checkout

const checkoutPost = async (req, res, next) => {
    const { checkoutItems, shippingAddress, paymentMethod } = req.body || {};
    try {
        if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
            return res.status(400).json({ message: "Shipping address is incomplete" });
        }

        const normalizedMethod = normalizePaymentMethod(paymentMethod);
        if (!normalizedMethod) {
            return res.status(400).json({ message: "Payment method must be COD or STRIPE" });
        }
        const verified = await getVerifiedCheckoutItems(checkoutItems);

        if (normalizedMethod === "STRIPE") {
            ensureStripeConfigured();
        }

        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItem: verified.checkoutItems,
            shippingAddress,
            paymentMethod: normalizedMethod,
            totalPrice: verified.totalPrice,
            paymentStatus: normalizedMethod === "STRIPE" ? "pending" : "cod_pending",
            isPaid: false,
        });

        let order = null;
        if (normalizedMethod === "COD") {
            order = await createOrderFromCheckout(newCheckout, {
                isPaid: false,
                paymentStatus: "cod_pending",
                paymentDetails: {
                    method: "COD",
                },
            });
        }

        console.log(`Checkout created for user : ${req.user._id}`);
        return res.status(201).json({
            checkout: newCheckout,
            order,
            message: normalizedMethod === "COD"
                ? "Order placed with Cash on Delivery"
                : "Checkout created. Continue to Stripe payment.",
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Server error while creating checkout",
            error: error.message,
        });
    }
};

const createStripeCheckoutSession = async (req, res) => {
    try {
        ensureStripeConfigured();
        const stripe = getStripeClient();

        const { checkoutId } = req.body || {};
        if (!checkoutId) {
            return res.status(400).json({ message: "checkoutId is required" });
        }

        const checkout = await Checkout.findById(checkoutId);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (checkout.paymentMethod !== "STRIPE") {
            return res.status(400).json({ message: "Checkout payment method is not Stripe" });
        }

        if (checkout.isFinalized) {
            return res.status(400).json({ message: "Checkout is already finalized" });
        }

        let reservedForThisRequest = false;
        if (checkout.stockReservationState === "reserved" && checkout.paymentDetails?.stripeSessionId) {
            const existingSession = await stripe.checkout.sessions.retrieve(
                checkout.paymentDetails.stripeSessionId
            );
            if (existingSession.status === "open" && existingSession.url) {
                return res.status(200).json({
                    url: existingSession.url,
                    sessionId: existingSession.id,
                });
            }
            if (existingSession.payment_status === "paid") {
                return res.status(409).json({ message: "Payment is complete; verify the payment to finalize this checkout" });
            }
            await releaseCheckoutStock(checkout._id);
            checkout.stockReservationState = "none";
        }
        if (checkout.stockReservationState === "none") {
            await reserveCheckoutStock(checkout);
            reservedForThisRequest = true;
        } else if (checkout.stockReservationState !== "reserved") {
            return res.status(409).json({ message: "Stock reservation is currently being processed" });
        } else {
            return res.status(409).json({ message: "This checkout already has an active payment session" });
        }

        const successUrl = `${FRONTEND_URL}/checkout?payment=success&checkoutId=${checkout._id}&session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${FRONTEND_URL}/checkout?payment=failed&checkoutId=${checkout._id}`;

        const lineItems = (checkout.checkoutItem || []).map((item) => ({
            quantity: Number(item.quantity || 1),
            price_data: {
                currency: "pkr",
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                    metadata: {
                        productId: item.productId?.toString() || "",
                        size: item.size || "",
                        color: item.color || "",
                    },
                },
                unit_amount: Math.round(Number(item.price || 0) * 100),
            },
        }));

        let session;
        try {
            session = await stripe.checkout.sessions.create({
                mode: "payment",
                line_items: lineItems,
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    checkoutId: checkout._id.toString(),
                    userId: checkout.user.toString(),
                },
            });
        } catch (error) {
            if (reservedForThisRequest) {
                await releaseCheckoutStock(checkout._id);
            }
            throw error;
        }

        checkout.paymentDetails = {
            ...(checkout.paymentDetails || {}),
            stripeSessionId: session.id,
        };
        try {
            await checkout.save();
        } catch (error) {
            if (reservedForThisRequest) {
                await releaseCheckoutStock(checkout._id);
            }
            throw error;
        }

        return res.status(200).json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: "Server error while creating Stripe session",
            error: error.message,
        });
    }
};

const verifyStripeSession = async (req, res) => {
    try {
        ensureStripeConfigured();
        const stripe = getStripeClient();

        const { checkoutId, sessionId } = req.body || {};
        if (!checkoutId || !sessionId) {
            return res.status(400).json({ message: "checkoutId and sessionId are required" });
        }

        const checkout = await Checkout.findById(checkoutId);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (
            session.metadata?.checkoutId !== checkout._id.toString() ||
            session.metadata?.userId !== req.user._id.toString() ||
            checkout.paymentDetails?.stripeSessionId !== session.id
        ) {
            return res.status(403).json({ message: "Stripe session does not belong to this checkout" });
        }

        if (session.payment_status !== "paid") {
            await releaseCheckoutStock(checkout._id);
            checkout.paymentStatus = "failed";
            checkout.paymentDetails = {
                ...(checkout.paymentDetails || {}),
                stripeSessionId: session.id,
                paymentStatus: session.payment_status,
            };
            await checkout.save();
            return res.status(400).json({ message: "Payment not completed", paymentStatus: session.payment_status });
        }

        if (!checkout.isFinalized) {
            await createOrderFromCheckout(checkout, {
                isPaid: true,
                paymentStatus: "paid",
                paidAt: new Date(),
                paymentDetails: {
                    ...(checkout.paymentDetails || {}),
                    stripeSessionId: session.id,
                    stripePaymentIntentId: session.payment_intent,
                    paymentStatus: session.payment_status,
                },
            });
        }

        return res.status(200).json({
            message: "Stripe payment verified",
            isPaid: true,
            isFinalized: true,
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: "Server error while verifying Stripe payment",
            error: error.message,
        });
    }
};

const checkoutStatus = async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        return res.status(200).json({
            checkoutId: checkout._id,
            paymentMethod: checkout.paymentMethod,
            isPaid: checkout.isPaid,
            isFinalized: checkout.isFinalized,
            paymentStatus: checkout.paymentStatus,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while fetching checkout status",
            error: error.message,
        });
    }
};

const checkoutWebhook = async (req, res) => {
    try {
        ensureStripeConfigured();
        const stripe = getStripeClient();

        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!endpointSecret) {
            return res.status(500).json({ message: "Stripe webhook secret is missing" });
        }

        const signature = req.headers["stripe-signature"];
        if (!signature) {
            return res.status(400).json({ message: "Missing stripe signature" });
        }

        const event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);

        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
            const session = event.data.object;
            const checkoutId = session.metadata?.checkoutId;

            if (checkoutId) {
                const checkout = await Checkout.findById(checkoutId);
                if (
                    checkout &&
                    !checkout.isFinalized &&
                    checkout.user.toString() === session.metadata?.userId &&
                    checkout.paymentDetails?.stripeSessionId === session.id &&
                    session.payment_status === "paid"
                ) {
                    await createOrderFromCheckout(checkout, {
                        isPaid: true,
                        paymentStatus: "paid",
                        paidAt: new Date(),
                        paymentDetails: {
                            ...(checkout.paymentDetails || {}),
                            stripeSessionId: session.id,
                            stripePaymentIntentId: session.payment_intent,
                            paymentStatus: session.payment_status,
                        },
                    });
                }
            }
        }

        if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
            const session = event.data.object;
            const checkoutId = session.metadata?.checkoutId;

            if (checkoutId) {
                const checkout = await Checkout.findById(checkoutId);
                if (
                    checkout &&
                    !checkout.isFinalized &&
                    checkout.paymentDetails?.stripeSessionId === session.id
                ) {
                    await releaseCheckoutStock(checkout._id);
                    checkout.paymentStatus = "failed";
                    checkout.paymentDetails = {
                        ...(checkout.paymentDetails || {}),
                        stripeSessionId: session.id,
                        paymentStatus: "failed",
                    };
                    await checkout.save();
                }
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        const statusCode = error.type === "StripeSignatureVerificationError" ? 400 : error.statusCode || 500;
        return res.status(statusCode).json({
            message: "Webhook Error",
            error: error.message,
        });
    }
};

// PUT /api/checkout/:id/pay
const checkoutPay = async (req, res, next) => {
    const { sessionId } = req.body || {};
    if (!sessionId) {
        return res.status(400).json({ message: "A verified Stripe session id is required" });
    }
    return verifyStripeSession(
        { ...req, body: { checkoutId: req.params.id, sessionId } },
        res
    );
};


// POST /api/checkout/:id/finalize
const checkoutFinalize = async (req, res, next) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not Found" });
        }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (checkout.isFinalized) {
            return res.status(400).json({ message: "Checkout already Finalized" });
        }

        if (checkout.paymentMethod === "COD") {
            const order = await createOrderFromCheckout(checkout, {
                isPaid: false,
                paymentStatus: "cod_pending",
                paymentDetails: {
                    ...(checkout.paymentDetails || {}),
                    method: "COD",
                },
            });
            return res.status(201).json(order);
        }

        if (checkout.isPaid) {
            const order = await createOrderFromCheckout(checkout, {
                isPaid: true,
                paymentStatus: "paid",
                paidAt: checkout.paidAt || new Date(),
                paymentDetails: checkout.paymentDetails,
            });
            return res.status(201).json(order);
        } else if (checkout.isFinalized) {
            return res.status(400).json({ message: "Checkout already Finalized" });
        } else {
            return res.status(400).json({ message: "Checkout is not paid" });
        }
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};
module.exports = {
    checkoutPost,
    createStripeCheckoutSession,
    verifyStripeSession,
    checkoutStatus,
    checkoutWebhook,
    checkoutPay,
    checkoutFinalize,
};
