const Product = require("../../models/products");
const mongoose = require("mongoose");

// admin dashborad show all product
// Get /auth/admin/products
const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while loading products",
            error: error.message,
        });
    }
};

const getAdminProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while loading product",
            error: error.message,
        });
    }
};

module.exports = {
    getAdminProducts,
    getAdminProduct,
}