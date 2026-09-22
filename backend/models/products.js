const mongoose = require("mongoose");
const productScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
    },
    sizes: {
        type: [String],
        required: true
    },
    colors: {
        type: [String],
        required: true
    },
    collections: {
        type: String,
        required: true
    },
    material: {
        type: String,
    },
    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"],
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            altText: {
                type: String
            }
        },
    ],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            value: {
                type: Number,
                min: 1,
                max: 5,
                required: true,
            },
        },
    ],
    tags: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    metaTitle: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    metaKeywords: {
        type: String,
    },
    dimensions: {
        lenght: Number,
        width: Number,
        height: Number,
    },
},
    { timestamps: true },
);

module.exports = mongoose.model("Product", productScheme);