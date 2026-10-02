const mongoose = require("mongoose");
const Product = require("../models/products");

const inventoryError = (message, statusCode = 409) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const getQuantities = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw inventoryError("An order must contain at least one item", 400);
    }

    const quantities = new Map();
    for (const item of items) {
        const productId = item.productId?.toString();
        const quantity = Number(item.quantity);
        if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity < 1) {
            throw inventoryError("Order contains an invalid product or quantity", 400);
        }
        quantities.set(productId, (quantities.get(productId) || 0) + quantity);
    }
    return [...quantities].map(([productId, quantity]) => ({ productId, quantity }));
};

const adjustInventory = async (items, direction) => {
    if (direction !== -1 && direction !== 1) {
        throw new Error("Inventory adjustment direction must be -1 or 1");
    }

    const adjustments = getQuantities(items);
    const applied = [];
    try {
        for (const adjustment of adjustments) {
            const filter = { _id: adjustment.productId };
            if (direction === -1) {
                filter.isPublished = true;
                filter.countInStock = { $gte: adjustment.quantity };
            }
            const result = await Product.updateOne(filter, {
                $inc: { countInStock: direction * adjustment.quantity },
            });
            if (result.matchedCount !== 1) {
                if (direction === 1) {
                    continue;
                }
                throw inventoryError(
                    "A product is unpublished or no longer has enough stock"
                );
            }
            applied.push(adjustment);
        }
    } catch (error) {
        for (const adjustment of applied.reverse()) {
            try {
                await Product.updateOne(
                    { _id: adjustment.productId },
                    { $inc: { countInStock: -direction * adjustment.quantity } }
                );
            } catch (rollbackError) {
                const failure = new Error(
                    `Inventory adjustment failed and stock rollback also failed: ${rollbackError.message}`
                );
                failure.statusCode = 500;
                throw failure;
            }
        }
        throw error;
    }
};

module.exports = { adjustInventory };
