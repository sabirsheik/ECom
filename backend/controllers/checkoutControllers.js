const Checkout = require("../models/Checkout");
const Order = require("../models/order");
const Cart = require("../models/Cart");
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
    const method = (value || "COD").toUpperCase();
    return method === "STRIPE" ? "STRIPE" : "COD";
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

    const order = await Order.create({
        user: checkout.user,
        orderItem: checkout.checkoutItem,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid,
        paidAt: isPaid ? paidAt || new Date() : undefined,
        isDelivered: false,
        paymentStatus,
        status: "Processing",
    });

    checkout.isPaid = isPaid;
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails || checkout.paymentDetails;
    checkout.paidAt = isPaid ? paidAt || new Date() : checkout.paidAt;
    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();
    await checkout.save();

    await Cart.findOneAndDelete({ user: checkout.user });

    return order;
};

// Post api/checkout/checkout

const checkoutPost = async (req, res, next) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
        req.body;
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "no item in checkout" });
    }
    try {
        if (!shippingAddress?.address || !shippingAddress?.city || !shippingAddress?.postalCode || !shippingAddress?.country) {
            return res.status(400).json({ message: "Shipping address is incomplete" });
        }

        const normalizedMethod = normalizePaymentMethod(paymentMethod);

        if (normalizedMethod === "STRIPE") {
            ensureStripeConfigured();
        }

        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItem: checkoutItems,
            shippingAddress,
            paymentMethod: normalizedMethod,
            totalPrice,
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
        return res.status(500).json({
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

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                checkoutId: checkout._id.toString(),
                userId: checkout.user.toString(),
            },
        });

        checkout.paymentDetails = {
            ...(checkout.paymentDetails || {}),
            stripeSessionId: session.id,
        };
        await checkout.save();

        return res.status(200).json({
            url: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        return res.status(500).json({
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

        if (session.payment_status !== "paid") {
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
        return res.status(500).json({
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

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const checkoutId = session.metadata?.checkoutId;

            if (checkoutId) {
                const checkout = await Checkout.findById(checkoutId);
                if (checkout && !checkout.isFinalized && session.payment_status === "paid") {
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
                if (checkout && !checkout.isFinalized) {
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
        return res.status(400).json({
            message: "Webhook Error",
            error: error.message,
        });
    }
};

// PUT /api/checkout/:id/pay
const checkoutPay = async (req, res, next) => {
  try {
    const { paymentStatus, paymentDetails } = req.body || {};

    if (!paymentStatus || paymentStatus !== "paid") {
      return res.status(400).json({ message: "Invalid or missing payment status" });
    }

    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

        if (checkout.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden" });
        }

    // Update payment details
    checkout.isPaid = true;
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails;
    checkout.paidAt = new Date();

    await checkout.save();

    res.status(200).json(checkout);
  } catch (error) {
    console.error("Checkout Payment Error:", error);
    res.status(500).json({
      message: "Server error while updating checkout",
      error: error.message,
    });
  }
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
        return res.status(500).json({
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
