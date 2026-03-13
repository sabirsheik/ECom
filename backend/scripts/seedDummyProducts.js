const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const dbConnect = require("../config/dbConnect");
const Product = require("../models/products");
const User = require("../models/user");

const seed = async () => {
  try {
    await dbConnect();

    const filePath = path.join(__dirname, "..", "data", "dummy-clothing-products.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(raw);

    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Seed Admin",
        email: "seed-admin@example.com",
        password: "SeedAdmin123",
        role: "admin",
      });
    }

    for (const product of products) {
      await Product.findOneAndUpdate(
        { sku: product.sku },
        { ...product, user: adminUser._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Seed completed: ${products.length} products synced`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
