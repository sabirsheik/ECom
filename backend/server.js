// Imports Packages Which Use in BackEnd Application
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv")
dotenv.config();
const app = express();

// Stripe webhook must receive the raw body for signature verification.
app.use("/api/checkout/webhook", express.raw({ type: "application/json" }));

app.use((req, res, next) => {
  if (req.originalUrl === "/api/checkout/webhook") {
    return next();
  }
  return express.json()(req, res, next);
});
app.use(cors());
app.use(morgan("dev"));
const userRoute = require("./routes/userRoutes")
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoutes");
const checkoutRoute = require("./routes/checkoutRoutes");
const orderRoute = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoute");
const subscriberRoutes = require("./routes/subscriberRoutes");
// Admin Imports Routes
const adminRoutes = require("./routes/Admin/adminRoutes");
const adminProductRoutes = require("./routes/Admin/productAdminRoutes");
const adminOrderRoutes = require("./routes/Admin/adminOrderRoutes");
const dbConnect = require("./config/dbConnect");
dbConnect()
// Cors Privacy Policy
const corsOptions = {
  // origin: "http://localhost:5000",  // Allow frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.status(200).json({ message: "API Run Sucessfully" });
});
// API Routes
// Users
app.use("/api/users", userRoute);
// Products
app.use("/api/product", productRoute);
app.use("/api/products", productRoute);
// Carts
app.use("/api/cart", cartRoute);
// Checkouts
app.use("/api/checkout", checkoutRoute);
// Orders
app.use("/api/order", orderRoute);
// Uploads
app.use("/api/upload", uploadRoutes);
// Subscribe
app.use("/api/subscribe", subscriberRoutes);

// Admin Routes
app.use("/auth/admin", adminRoutes);
app.use("/auth/admin", adminProductRoutes);
app.use("/auth/admin", adminOrderRoutes);

const port = process.env.PORT || 5100;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

