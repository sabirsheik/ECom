const User = require("../../models/user");

const safeUser = (user) => {
    const result = user.toObject();
    delete result.password;
    return result;
};

// Get All User By Admin auth/admin/users

const getAdminUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 }).lean();
        res.json(users);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while loading users",
            error: error.message,
        });
    }
};

// POST /auth/admin/user

const postAdminUsers = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    try {
        if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        if (role && !["customer", "admin"].includes(role)) {
            return res.status(400).json({ message: "Role must be customer or admin" });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User Already Exists" });
        };
        user = new User({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: role || "customer",
        });
        await user.save();
        res.status(201).json({ message: "User created successfully", user: safeUser(user) });
    } catch (error) {
        if (error.name === "ValidationError" || error.code === 11000) {
            return res.status(400).json({ message: error.code === 11000 ? "Email already in use" : error.message });
        }
        return res.status(500).json({
            message: "Server error while creating user",
            error: error.message,
        });
    }
};

const adminUserUpdate = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { name, email, role } = req.body;
        if (name !== undefined) {
            if (typeof name !== "string") {
                return res.status(400).json({ message: "Name must be a string" });
            }
            user.name = name.trim();
        }
        if (email !== undefined) {
            if (typeof email !== "string") {
                return res.status(400).json({ message: "Email must be a string" });
            }
            user.email = email.trim().toLowerCase();
        }
        if (role !== undefined) {
            if (!["customer", "admin"].includes(role)) {
                return res.status(400).json({ message: "Role must be customer or admin" });
            }
            if (user._id.equals(req.user._id) && role !== "admin") {
                return res.status(400).json({ message: "You cannot remove your own admin role" });
            }
            user.role = role;
        }
        const updatedUser = await user.save();
        return res.status(200).json({ message: "User updated successfully", user: safeUser(updatedUser) });
    } catch (error) {
        if (error.name === "ValidationError" || error.code === 11000) {
            return res.status(400).json({ message: error.code === 11000 ? "Email already in use" : error.message });
        }
        return res.status(500).json({
            message: "Server error while updating user",
            error: error.message,
        });
    }
};

// Delete User By Admin Req /auth/admin/user-del/:id

const adminDelUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            if (user._id.equals(req.user._id)) {
                return res.status(400).json({ message: "You cannot delete your own admin account" });
            }
            await user.deleteOne();
            res.json({ message: "User Deleted Sucessfully" })
        } else {
            return res.status(404).json({ message: "User Not Found" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error while deleting user",
            error: error.message,
        });
    }
};
module.exports = {
    getAdminUsers,
    postAdminUsers,
    adminUserUpdate,
    adminDelUser,
};