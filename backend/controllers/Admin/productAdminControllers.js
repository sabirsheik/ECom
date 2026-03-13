const Product = require("../../models/products");

// admin dashborad show all product
// Get /auth/admin/products
const getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

// admin Create Products
// Post /auth/admin/products

const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, imageUrl } = req.body;
        const newProduct = new Product({
            name,
            price,
            description,
            imageUrl,
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    }catch(error) {
        return res.status(500).json({
            message: "Server error while creating product",
            error: error.message,
        });
    }
};
module.exports = {
    getAdminProducts,
}