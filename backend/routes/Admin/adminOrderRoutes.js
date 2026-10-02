const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../../Middleware/authMiddleware");
const {
    getAdminOrders,
    getAdminDashboard,
    ademinOrderUpdate,
    adminDeleteOrder,
} = require("../../controllers/Admin/adminOrderControllers");

router.get("/dashboard", auth, checkRole, getAdminDashboard);
router.get("/orders", auth, checkRole, getAdminOrders);
router.put("/order-update/:id", auth, checkRole, ademinOrderUpdate);
router.delete("/order-delete/:id", auth, checkRole, adminDeleteOrder);


module.exports = router;