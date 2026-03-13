const express = require("express");
const router = express.Router();
const { auth } = require("../Middleware/authMiddleware");
const {
    checkoutPost,
    createStripeCheckoutSession,
    verifyStripeSession,
    checkoutStatus,
    checkoutWebhook,
    checkoutPay,
    checkoutFinalize,
} = require("../controllers/checkoutControllers");

router.post("/webhook", checkoutWebhook);
router.post("/create", auth, checkoutPost);
router.post("/stripe/session", auth, createStripeCheckoutSession);
router.post("/stripe/verify-session", auth, verifyStripeSession);
router.get("/:id/status", auth, checkoutStatus);
router.put("/:id/pay", auth, checkoutPay)
router.post("/:id/finalize", auth, checkoutFinalize)

module.exports = router;