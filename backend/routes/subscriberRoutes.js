const express = require("express");
const { subscribe } = require("../controllers/subscriberControllers");
const router = express.Router();

router.post("/", subscribe);

module.exports = router;
