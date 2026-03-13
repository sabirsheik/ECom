const express = require("express");
const {
    register,
    login,
    userProfile,
    updateUserProfile,
    deleteUserProfile,
} = require("../controllers/usersControllers");
const {auth} = require("../Middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @des Register a new user
// @access public

router.post("/register", register)
router.post("/login", login)
router.get("/profile",auth, userProfile)
router.put("/profile", auth, updateUserProfile)
router.delete("/profile", auth, deleteUserProfile)

module.exports = router;