const User = require("../../models/user");

// Get All User By Admin auth/admin/users

const getAdminUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

// POST /auth/admin/user

const postAdminUsers = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User Already Exists" });
        };
        user = new User({
            name,
            email,
            password,
            role: role || "customer",
        });
        await user.save();
        res.status(201).json({ message: "User Created Sucessfullt", user });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

const adminUserUpdate = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        };
        const updateUser = await user.save();
        return res.status(200).json({ message: "User Updated Sucessfully", updateUser });
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
            error: error.message,
        });
    }
};

// Delete User By Admin Req /auth/admin/user-del/:id

const adminDelUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            await user.deleteOne();
            res.json({ message: "User Deleted Sucessfully" })
        } else {
            return res.status(400).json({ message: "User Not Found" });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Server error while updating cart",
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