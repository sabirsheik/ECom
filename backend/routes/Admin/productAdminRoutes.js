const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../../Middleware/authMiddleware");
const { getAdminProducts, getAdminProduct } = require("../../controllers/Admin/productAdminControllers");

router.get("/products", auth, checkRole, getAdminProducts);
router.get("/products/:id", auth, checkRole, getAdminProduct);


module.exports = router;