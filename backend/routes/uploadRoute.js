const express = require("express");
const router = express.Router();
const { upload, uploads } = require("../controllers/uploadControllers");

router.post("/", upload.single("image"), uploads);

module.exports = router;
