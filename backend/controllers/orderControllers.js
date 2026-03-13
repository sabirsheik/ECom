const Order = require("../models/order");

// Get /api/order/my-orders

const getMyOrder = async (req,res,next)=>{
    try {
        const orders = await Order.find({user: req.user._id}).sort({
            createdAt : -1,
        });
        res.json(orders);
    } catch (error) {
         return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

// Get /api/order/Id Order Details

const getOrderDetails = async (req, res, next)=>{
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user && order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You cannot access this order" });
        }

        res.json(order);
    } catch (error) {
         return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

module.exports = {
    getMyOrder,
    getOrderDetails,
}