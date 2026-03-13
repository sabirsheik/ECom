const Order = require("../../models/order");

// Get Admin Order /auth/admin/orders
const getAdminOrders = async (req, res, next) => {
    try {
        const order = await Order.find({}).populate("user", "name email")
        res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    };
};


// Put Order Update Order Status /auth/admin/order-update/:id
const ademinOrderUpdate = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
            const updateOrder = await order.save();
            return res.status(200).json(updateOrder);
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    };
};

//  Delete Order  auth/admin/order-delete/:id

const adminDeleteOrder = async (req, res, next) =>{
    try{
const order = await Order.findById(req.params.id);
if(order){
    await order.deleteOne();
    res.status(200).json({message : "Order Removed"});
}else{
    res.status(400).json({message : "Order Not Found"});
}
    }catch(error){
         return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    };
};
module.exports = {
    getAdminOrders,
    ademinOrderUpdate,
    adminDeleteOrder
};