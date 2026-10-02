const express = require("express");
const router = express.Router();
const { adminImageUpload, uploads } = require("../controllers/uploadControllers");
const { auth, checkRole } = require("../Middleware/authMiddleware");

router.post("/", auth, checkRole, adminImageUpload, uploads);

module.exports = router;
