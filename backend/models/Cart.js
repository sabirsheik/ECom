const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: String,
    image: String,
    price: Number,
    size: String,
    color: String,
    quantity: {
        type: Number,
        default: 1,
    },
}, { _id: false });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    guestId: {
        type: String,
        required: false,
    },
    products: [cartItemSchema],
    totalPrice: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Ensure one cart per identity.
cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ guestId: 1 }, { unique: true, sparse: true });

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
