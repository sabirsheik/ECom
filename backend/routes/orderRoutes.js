const express = require("express");
const router = express.Router();
const { auth } = require("../Middleware/authMiddleware");
const { 
    getMyOrder,
    getOrderDetails,
 } = require("../controllers/orderControllers");

router.get("/my-orders", auth, getMyOrder);
router.get("/:id", auth, getOrderDetails);





module.exports = router;