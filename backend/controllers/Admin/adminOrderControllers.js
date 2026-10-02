const Order = require("../../models/order");
const Product = require("../../models/products");
const User = require("../../models/user");
const { adjustInventory } = require("../../utils/inventory");

// Get Admin Order /auth/admin/orders
const getAdminOrders = async (req, res, next) => {
    try {
        const order = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while loading orders",
            error: error.message,
        });
    };
};

const getAdminDashboard = async (req, res) => {
    try {
        const [users, products, orders, lowStock, revenue] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Product.countDocuments({ countInStock: { $lte: 5 } }),
            Order.aggregate([
                { $match: { isPaid: true } },
                { $group: { _id: null, total: { $sum: "$totalPrice" } } },
            ]),
        ]);
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(8)
            .populate("user", "name email")
            .lean();

        return res.status(200).json({
            metrics: {
                users,
                products,
                orders,
                lowStock,
                revenue: revenue[0]?.total || 0,
            },
            recentOrders,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while loading admin dashboard",
            error: error.message,
        });
    }
};

// Put Order Update Order Status /auth/admin/order-update/:id
const ademinOrderUpdate = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status === "Cancelled" && status !== "Cancelled") {
            return res.status(409).json({ message: "Cancelled orders cannot be reopened" });
        }
        if (order.status === "Cancelled" && status === "Cancelled") {
            await order.populate("user", "name email");
            return res.status(200).json(order);
        }

        const deliveredAt = status === "Delivered" ? order.deliveredAt || new Date() : undefined;
        if (status === "Cancelled" && order.inventoryAdjusted) {
            const cancelledOrder = await Order.findOneAndUpdate(
                { _id: order._id, status: order.status, inventoryAdjusted: true },
                {
                    $set: {
                        status,
                        isDelivered: false,
                        inventoryAdjusted: false,
                    },
                    $unset: { deliveredAt: 1 },
                },
                { new: true }
            );
            if (!cancelledOrder) {
                return res.status(409).json({ message: "Order changed while it was being updated" });
            }
            try {
                await adjustInventory(cancelledOrder.orderItem, 1);
            } catch (error) {
                await Order.updateOne(
                    { _id: cancelledOrder._id, status: "Cancelled", inventoryAdjusted: false },
                    {
                        $set: {
                            status: order.status,
                            isDelivered: order.isDelivered,
                            deliveredAt: order.deliveredAt,
                            inventoryAdjusted: true,
                        },
                    }
                );
                throw error;
            }
            await cancelledOrder.populate("user", "name email");
            return res.status(200).json(cancelledOrder);
        }

        const statusUpdate = {
            $set: {
                status,
                isDelivered: status === "Delivered",
            },
        };
        if (deliveredAt) {
            statusUpdate.$set.deliveredAt = deliveredAt;
        } else {
            statusUpdate.$unset = { deliveredAt: 1 };
        }
        const updateOrder = await Order.findOneAndUpdate(
            { _id: order._id, status: { $ne: "Cancelled" } },
            statusUpdate,
            { new: true, runValidators: true }
        );
        if (!updateOrder) {
            return res.status(409).json({ message: "Order changed while it was being updated" });
        }
        await updateOrder.populate("user", "name email");
        return res.status(200).json(updateOrder);
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Server error while updating order",
            error: error.message,
        });
    };
};

//  Delete Order  auth/admin/order-delete/:id

const adminDeleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        let claimedOrder = order;
        let restocked = false;
        if (order.inventoryAdjusted) {
            claimedOrder = await Order.findOneAndUpdate(
                { _id: order._id, inventoryAdjusted: true },
                { $set: { inventoryAdjusted: false } },
                { new: true }
            );
            if (claimedOrder) {
                try {
                    await adjustInventory(claimedOrder.orderItem, 1);
                } catch (error) {
                    await Order.updateOne(
                        { _id: claimedOrder._id, inventoryAdjusted: false },
                        { $set: { inventoryAdjusted: true } }
                    );
                    throw error;
                }
                restocked = true;
            } else {
                claimedOrder = await Order.findById(order._id);
                if (!claimedOrder) {
                    return res.status(200).json({ message: "Order removed" });
                }
            }
        }
        try {
            await claimedOrder.deleteOne();
        } catch (error) {
            if (restocked) {
                await adjustInventory(claimedOrder.orderItem, -1);
                await Order.updateOne(
                    { _id: claimedOrder._id, inventoryAdjusted: false },
                    { $set: { inventoryAdjusted: true } }
                );
            }
            throw error;
        }
        return res.status(200).json({ message: "Order removed" });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while deleting order",
            error: error.message,
        });
    }
};
module.exports = {
    getAdminOrders,
    getAdminDashboard,
    ademinOrderUpdate,
    adminDeleteOrder
};