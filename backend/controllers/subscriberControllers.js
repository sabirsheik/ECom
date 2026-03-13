const Subscriber = require("../models/subscriber");

const subscribe = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is Required" });
    }

    try {
        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            return res.status(400).json({ message: "Email is Already Subscribed" });
        }

        subscriber = new Subscriber({ email });
        await subscriber.save();

        res.status(201).json({ message: "Successfully Subscribed to the E-Commerce" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { subscribe };
