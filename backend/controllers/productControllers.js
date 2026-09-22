const Product = require("../models/products");
const User = require("../models/user");
const mongoose = require("mongoose");
const Order = require("../models/order");

// Create Product Req
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            height,
        } = req.body;

        if (
            !name ||
            !description ||
            !price ||
            countInStock === undefined ||
            !category ||
            !sku ||
            !sizes ||
            !colors ||
            !collections
        ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            height,
            user: req.user._id, // ✅ ensure this is set by middleware
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Error creating product:", error.message);
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res
                .status(400)
                .json({ message: "Validation failed", errors: messages });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Update Product Req
const updateProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            sku,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            height,
        } = req.body;

        // Find Product by Id
        const product = await Product.findById(req.params.id);

        if (product) {
            // Update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock ?? product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured =
                isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished =
                isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.height = height || product.height;
            product.sku = sku || product.sku;

            // Save the updated product
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Delete Product Req

const deleteProduct = async (req, res, next) => {
    try {
        // Find Product By Id
        const product = await Product.findById(req.params.id);
        if (product) {
            // Remove the Product From MongoDB
            await product.deleteOne();
            res.json({ message: "Product Delete" });
        } else {
            res.status(404).json({ message: "Product Not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get All Produtct
const getAllProducts = async (req, res, next) => {
    try {
        const {
            collection,
            sizes,
            colors,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit,
            minRating,
            availability,
        } = req.query;

        let query = {};
        let sort = {};

        // Filter Logic
        if (collection && collection.toLowerCase() !== "all") {
            query.collections = collection;
        }

        if (category && category.toLowerCase() !== "all") {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (sizes) {
            query.sizes = { $in: sizes.split(",") };
        }

        if (colors) {
            query.colors = { $in: colors.split(",") }; // Use split to support multiple colors
        }

        if (gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (minRating) {
            query.rating = { ...(query.rating || {}), $gte: Number(minRating) };
        }

        if (availability === "inStock") {
            query.countInStock = { $gt: 0 };
        }

        if (availability === "outOfStock") {
            query.countInStock = { $lte: 0 };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Sorting Logic
        switch (sortBy) {
            case "priceAsc":
                sort = { price: 1 };
                break;
            case "priceDesc":
                sort = { price: -1 };
                break;
            case "popularity":
                sort = { rating: -1 };
                break;
            default:
                sort = { createdAt: -1 }; // default: newest first
                break;
        }

        const products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit) || 0);

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get / Products / Products / Best-Seller

const productBestSeller = async (req, res, next) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.status(200).json(bestSeller);
        } else {
            res.status(404).json({ message: "No Best Seller" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get / product /new-arrivals
const productNewArrivals = async (req, res, next) => {
    try {
        const newArrivals = await Product.find()
            .sort({ createdAt: -1 })
            .limit(8)
            .select('name price images createdAt') // adjust as per your needs
            .lean();

        res.status(200).json(newArrivals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get product
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product Not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get / products /similar/:id
const productSimilar = async (req, res, next) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ message: " Product not Found" });
        };
        const similarProduct = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category,
        }).limit(4);
        res.status(200).json(similarProduct);
        console.log(similarProduct.length)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const trackProductView = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findById(id).select("_id");
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { viewedProducts: product._id },
            });

            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    viewedProducts: {
                        $each: [product._id],
                        $slice: -30,
                    },
                },
            });
        }

        return res.status(200).json({ message: "View tracked" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const toggleWishlistProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        const product = await Product.findById(id).select("_id");
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const exists = user.wishlist.some((item) => item.toString() === id);
        if (exists) {
            user.wishlist = user.wishlist.filter((item) => item.toString() !== id);
        } else {
            user.wishlist.push(product._id);
        }

        await user.save();

        return res.status(200).json({
            message: exists ? "Removed from wishlist" : "Added to wishlist",
            wishlist: user.wishlist,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getRecommendations = async (req, res) => {
    try {
        const likedQuery = (req.query.liked || "")
            .split(",")
            .map((id) => id.trim())
            .filter((id) => mongoose.Types.ObjectId.isValid(id));

        const viewedQuery = (req.query.viewed || "")
            .split(",")
            .map((id) => id.trim())
            .filter((id) => mongoose.Types.ObjectId.isValid(id));

        let likedIds = likedQuery;
        let viewedIds = viewedQuery;
        let purchasedIds = [];

        if (req.user) {
            const user = await User.findById(req.user._id).select("wishlist viewedProducts");
            likedIds = (user?.wishlist || []).map((id) => id.toString());
            viewedIds = (user?.viewedProducts || []).map((id) => id.toString());

            const orders = await Order.find({ user: req.user._id }).select("orderItem.productId");
            purchasedIds = orders
                .flatMap((order) => order.orderItem || [])
                .map((item) => item.productId?.toString())
                .filter(Boolean);
        }

        const seedIds = [...new Set([...likedIds, ...viewedIds, ...purchasedIds])]
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        let categorySeeds = [];
        if (seedIds.length > 0) {
            categorySeeds = await Product.find({ _id: { $in: seedIds } }).select("category");
        }

        const categories = [...new Set(categorySeeds.map((item) => item.category).filter(Boolean))];
        const query = {
            isPublished: true,
            $or: [
                ...(seedIds.length ? [{ _id: { $in: seedIds } }] : []),
                ...(categories.length ? [{ category: { $in: categories } }] : []),
            ],
        };

        const finalQuery = query.$or.length ? query : { isPublished: true };
        const recommendations = await Product.find(finalQuery)
            .sort({ rating: -1, createdAt: -1 })
            .limit(8);

        return res.status(200).json(recommendations);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const rateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const ratingValue = Number(req.body.rating);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product id" });
        }

        if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
            return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }

        const existingIndex = product.ratings.findIndex(
            (entry) => entry.user.toString() === req.user._id.toString()
        );

        if (existingIndex > -1) {
            product.ratings[existingIndex].value = ratingValue;
        } else {
            product.ratings.push({ user: req.user._id, value: ratingValue });
        }

        const sum = product.ratings.reduce((acc, item) => acc + item.value, 0);
        product.ratingCount = product.ratings.length;
        product.rating = product.ratingCount > 0 ? Number((sum / product.ratingCount).toFixed(2)) : 0;

        await product.save();

        return res.status(200).json({
            productId: product._id,
            rating: product.rating,
            ratingCount: product.ratingCount,
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    productBestSeller,
    productNewArrivals,
    getProduct,
    productSimilar,
    trackProductView,
    toggleWishlistProduct,
    getRecommendations,
    rateProduct,
};
