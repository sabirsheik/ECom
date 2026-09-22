const Cart = require("../models/Cart");
const Product = require("../models/products");
const mongoose = require("mongoose");

const MAX_CART_ITEM_QTY = 10;

// Helper Function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

const getProductKey = (item) => `${item.productId.toString()}_${item.size || ""}_${item.color || ""}`;

const recalculateCart = (cart) => {
    const mergedItems = new Map();

    (cart.products || []).forEach((item) => {
        const key = getProductKey(item);
        if (mergedItems.has(key)) {
            const existing = mergedItems.get(key);
            existing.quantity += Number(item.quantity || 0);
            mergedItems.set(key, existing);
        } else {
            mergedItems.set(key, {
                productId: item.productId,
                name: item.name,
                image: item.image,
                price: Number(item.price || 0),
                size: item.size,
                color: item.color,
                quantity: Number(item.quantity || 0),
            });
        }
    });

    cart.products = Array.from(mergedItems.values()).filter((item) => item.quantity > 0);
    cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
        0
    );
};

const normalizeQuantity = (value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
        return null;
    }
    return parsed;
};

const validateIdentity = (req, userId, guestId) => {
    if (!userId && !guestId) {
        return "Either userId or guestId is required";
    }

    if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return "Invalid userId";
        }
        if (!req.user || req.user._id.toString() !== userId.toString()) {
            return "Unauthorized cart access for userId";
        }
    }

    return null;
};

const validateProductSelection = (product, size, color) => {
    if (!product || !product._id) {
        return "Product not found";
    }

    if (!product.isPublished) {
        return "Product is inactive";
    }

    if (Number(product.countInStock || 0) < 1) {
        return "Product is out of stock";
    }

    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        if (!size || !product.sizes.includes(size)) {
            return "Invalid product size";
        }
    }

    if (Array.isArray(product.colors) && product.colors.length > 0) {
        if (!color || !product.colors.includes(color)) {
            return "Invalid product color";
        }
    }

    return null;
};

const getMaxAllowedQty = (product) => {
    const stock = Number(product.countInStock || 0);
    return Math.max(1, Math.min(stock, MAX_CART_ITEM_QTY));
};

// POST /api/post/cart
const postCart = async (req, res, next) => {
    const { productId, quantity = 1, size, color, guestId, userId } = req.body;

    try {
        const identityError = validateIdentity(req, userId, guestId);
        if (identityError) {
            return res.status(401).json({ message: identityError });
        }

        const normalizedQty = normalizeQuantity(quantity);
        if (!normalizedQty) {
            return res.status(400).json({ message: "Quantity must be a positive integer" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid productId" });
        }

        // Validate product
        const product = await Product.findById(productId);
        const productValidationError = validateProductSelection(product, size, color);
        if (productValidationError) {
            return res.status(400).json({ message: productValidationError });
        }

        const maxAllowedQty = getMaxAllowedQty(product);

        // Fetch cart
        let cart = await getCart(userId, guestId);

        // If cart exists
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // Update quantity
                const updatedQty = cart.products[productIndex].quantity + normalizedQty;
                cart.products[productIndex].quantity = Math.min(updatedQty, maxAllowedQty);
            } else {
                // Add new item
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0]?.url || "",
                    price: product.price,
                    size,
                    color,
                    quantity: Math.min(normalizedQty, maxAllowedQty),
                });
            }

            recalculateCart(cart);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create new cart
            const newCart = await Cart.create({
                user: userId || undefined,
                guestId: guestId || `guest_${Date.now()}`,
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0]?.url || "",
                        price: product.price,
                        size,
                        color,
                        quantity: Math.min(normalizedQty, maxAllowedQty),
                    },
                ],
                totalPrice: product.price * Math.min(normalizedQty, maxAllowedQty),
            });

            return res.status(200).json(newCart);
        }
    } catch (error) {
        console.error("Cart error:", error.message);
        return res.status(500).json({
            message: "Server error while adding to cart",
            error: error.message,
        });
    }
};

// Put /api/cart
// update product quatntity in the cart for a guest or looged-in user

const updateCartQuantity = async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        const identityError = validateIdentity(req, userId, guestId);
        if (identityError) {
            return res.status(401).json({ message: identityError });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid productId" });
        }

        const normalizedQty = Number(quantity);
        if (!Number.isInteger(normalizedQty) || normalizedQty < 0) {
            return res.status(400).json({ message: "Quantity must be a non-negative integer" });
        }

        const product = await Product.findById(productId);
        const productValidationError = validateProductSelection(product, size, color);
        if (productValidationError) {
            return res.status(400).json({ message: productValidationError });
        }

        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart Not Found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            // Update quantity or remove product
            if (normalizedQty > 0) {
                cart.products[productIndex].quantity = Math.min(normalizedQty, getMaxAllowedQty(product));
            } else {
                cart.products.splice(productIndex, 1); // remove product if quantity is zero
            }

            recalculateCart(cart);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};
// Delete api/delete

const deleteCart = async (req, res, next) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        const identityError = validateIdentity(req, userId, guestId);
        if (identityError) {
            return res.status(401).json({ message: identityError });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid productId" });
        }

        const cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart Not Fount" });
        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            recalculateCart(cart);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product Not Found in cart" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};
// Display cart api/cart

const getCarts = async (req, res, next) => {
    const { userId, guestId } = req.query;
    try {
        const identityError = validateIdentity(req, userId, guestId);
        if (identityError) {
            return res.status(401).json({ message: identityError });
        }

        const cart = await getCart(userId, guestId);
        if (cart) {
            recalculateCart(cart);
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Carts Not Found" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

// Cart Post /api/cart/merge

const cartMerge = async (req, res, next) => {
    try {
        const guestId = req.body.guestId; // ✅ Fix here
        if (!guestId) {
            return res.status(400).json({ message: "guestId is required" });
        }

        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest Cart is Empty" });
            }

            if (userCart) {
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) =>
                        item.productId.toString() === guestItem.productId.toString() &&
                        item.size === guestItem.size &&
                        item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        // ✅ Update quantity if item exists
                        const mergedQty = userCart.products[productIndex].quantity + guestItem.quantity;
                        userCart.products[productIndex].quantity = Math.min(mergedQty, MAX_CART_ITEM_QTY);
                    } else {
                        // ✅ Add new item if it doesn't exist
                        userCart.products.push(guestItem);
                    }
                });

                recalculateCart(userCart);

                await userCart.save();

                try {
                    // ✅ Delete guest cart after merging
                    await Cart.findOneAndDelete({ guestId }); // ❗Fix here — use `Cart.findOneAndDelete`, not `userCart.findOneAndDelete`
                } catch (error) {
                    console.log("Error deleting guest cart: ", error);
                }

                return res.status(200).json(userCart);

            } else {
                // ✅ Assign guest cart to user if user has no cart
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                recalculateCart(guestCart);
                await guestCart.save();
                return res.status(200).json(guestCart);
            }

        } else {
            if (userCart) {
                // ✅ Guest cart already merged earlier
                return res.status(200).json(userCart);
            } else {
                return res.status(404).json({ message: "Guest Cart not found" });
            }
        }

    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

module.exports = {
    postCart,
    updateCartQuantity,
    deleteCart,
    getCarts,
    cartMerge,
};
