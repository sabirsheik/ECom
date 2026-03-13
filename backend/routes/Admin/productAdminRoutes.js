const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../../Middleware/authMiddleware");
const {
 getAdminProducts
} = require("../../controllers/Admin/productAdminControllers");

router.get("/products", auth, checkRole, getAdminProducts);


module.exports = router;