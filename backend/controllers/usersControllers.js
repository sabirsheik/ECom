const User = require("../models/user");
const Cart = require("../models/Cart");
const Checkout = require("../models/Checkout");
const jwt = require("jsonwebtoken");
const createToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    const options = { expiresIn: "7d" };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if username is taken
        const existingName = await User.findOne({ name });
        if (existingName) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Check if email is taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create the user
        const user = await User.create({ name, email, password });

        // Create token
        const token = createToken(user);

        // Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                wishlist: user.wishlist || [],
                viewedProducts: user.viewedProducts || [],
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = createToken(user);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                wishlist: user.wishlist || [],
                viewedProducts: user.viewedProducts || [],
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};
const userProfile = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        user.name = name?.trim() || user.name;
        user.email = email?.trim() || user.email;

        if (password && password.trim().length > 0) {
            user.password = password;
        }

        const updated = await user.save();

        return res.status(200).json({
            id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            wishlist: updated.wishlist || [],
            viewedProducts: updated.viewedProducts || [],
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating user profile", error: error.message });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await Promise.all([
            Cart.deleteMany({ user: userId }),
            Checkout.deleteMany({ user: userId }),
            User.findByIdAndDelete(userId),
        ]);

        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting account", error: error.message });
    }
};



module.exports = {
    register,
    login,
    userProfile,
    updateUserProfile,
    deleteUserProfile,
}