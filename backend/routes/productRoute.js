const express = require("express");
const router = express.Router();
const { auth, checkRole, optionalAuth } = require("../Middleware/authMiddleware");
const {
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
} = require("../controllers/productControllers");


router.get("/", getAllProducts);
router.get("/recommendations", optionalAuth, getRecommendations);
router.get("/similar/:id", productSimilar);
router.post("/:id/view", optionalAuth, trackProductView);
router.post("/:id/wishlist-toggle", auth, toggleWishlistProduct);
router.post("/:id/rate", auth, rateProduct);
router.post("/create", auth, checkRole, createProduct);
router.put("/:id", auth, checkRole, updateProduct);
router.delete("/:id", auth, checkRole, deleteProduct);
router.get("/all-products", auth, checkRole, getAllProducts);
router.get("/product-bestSeller", productBestSeller);
router.get("/product-newArrivals", productNewArrivals);
router.get("/product-newarrivals", productNewArrivals);
router.get("/product/:id", auth, checkRole, getProduct);
router.get("/product-similar/:id", auth, checkRole, productSimilar);
router.get("/:id", getProduct);

module.exports = router;