const express = require("express");
const router = express.Router();
const { auth, checkRole } = require("../../Middleware/authMiddleware");
const {
    getAdminUsers,
    postAdminUsers,
    adminUserUpdate,
    adminDelUser,
} = require("../../controllers/Admin/adminControllers");

router.get("/all-users", auth, checkRole, getAdminUsers);
router.post("/create-user", auth, checkRole, postAdminUsers);
router.put("/user-update/:id", auth, checkRole, adminUserUpdate);
router.delete("/user-delete/:id", auth, checkRole, adminDelUser);

module.exports = router;