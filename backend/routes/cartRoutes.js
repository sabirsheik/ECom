const express = require("express");
const router = express.Router();
const {
    postCart,
    updateCartQuantity,
    deleteCart,
    getCarts,
    cartMerge,
} = require("../controllers/cartControllers");
const { auth, optionalAuth } = require("../Middleware/authMiddleware");

// Guest-accessible cart routes (no auth required)
router.get("/", optionalAuth, getCarts);
router.post("/create", optionalAuth, postCart);
router.put("/update", optionalAuth, updateCartQuantity);
router.delete("/delete", optionalAuth, deleteCart);

// Auth required — merge guest cart into user cart on login
router.post("/merge", auth, cartMerge);

module.exports = router;