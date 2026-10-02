const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/products");
const Checkout = require("../models/Checkout");
const Order = require("../models/order");
const Cart = require("../models/Cart");
const { auth, checkRole } = require("../Middleware/authMiddleware");
const { adjustInventory } = require("../utils/inventory");
const { checkoutPost } = require("../controllers/checkoutControllers");
const { ademinOrderUpdate } = require("../controllers/Admin/adminOrderControllers");

const originalFindById = User.findById;
const originalUpdateOne = Product.updateOne;
const originalProductFind = Product.find;
const originalCheckoutCreate = Checkout.create;
const originalCheckoutFindOneAndUpdate = Checkout.findOneAndUpdate;
const originalCheckoutUpdateOne = Checkout.updateOne;
const originalOrderCreate = Order.create;
const originalOrderDeleteOne = Order.deleteOne;
const originalOrderFindById = Order.findById;
const originalOrderFindOneAndUpdate = Order.findOneAndUpdate;
const originalCartFindOneAndDelete = Cart.findOneAndDelete;
const jwtSecret = "admin-test-secret";
process.env.JWT_SECRET = jwtSecret;

const response = () => ({
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  },
});

after(() => {
  User.findById = originalFindById;
  Product.updateOne = originalUpdateOne;
  Product.find = originalProductFind;
  Checkout.create = originalCheckoutCreate;
  Checkout.findOneAndUpdate = originalCheckoutFindOneAndUpdate;
  Checkout.updateOne = originalCheckoutUpdateOne;
  Order.create = originalOrderCreate;
  Order.deleteOne = originalOrderDeleteOne;
  Order.findById = originalOrderFindById;
  Order.findOneAndUpdate = originalOrderFindOneAndUpdate;
  Cart.findOneAndDelete = originalCartFindOneAndDelete;
});

test("admin auth rejects missing and invalid bearer tokens", async () => {
  const missingResponse = response();
  await auth({ headers: {} }, missingResponse, () => assert.fail("next should not run"));
  assert.equal(missingResponse.statusCode, 401);

  const invalidResponse = response();
  await auth(
    { headers: { authorization: "Bearer invalid" } },
    invalidResponse,
    () => assert.fail("next should not run")
  );
  assert.equal(invalidResponse.statusCode, 401);
});

test("admin role check denies customers and permits administrators", () => {
  const denied = response();
  checkRole({ user: { role: "customer" } }, denied, () => assert.fail("next should not run"));
  assert.equal(denied.statusCode, 403);

  let nextCalled = false;
  checkRole({ user: { role: "admin" } }, response(), () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
});

test("inventory deduction, restock, and insufficient-stock protection", async () => {
  const id = new mongoose.Types.ObjectId().toString();
  const stock = new Map([[id, { count: 4, published: true }]]);
  Product.updateOne = async (filter, update) => {
    const product = stock.get(String(filter._id));
    if (!product || (filter.isPublished !== undefined && !product.published) ||
      (filter.countInStock?.$gte !== undefined && product.count < filter.countInStock.$gte)) {
      return { matchedCount: 0 };
    }
    product.count += update.$inc.countInStock;
    return { matchedCount: 1 };
  };

  await adjustInventory([
    { productId: id, quantity: 1 },
    { productId: id, quantity: 2 },
  ], -1);
  assert.equal(stock.get(id).count, 1);

  await adjustInventory([{ productId: id, quantity: 3 }], 1);
  assert.equal(stock.get(id).count, 4);

  await assert.rejects(
    adjustInventory([{ productId: id, quantity: 5 }], -1),
    { statusCode: 409 }
  );
  assert.equal(stock.get(id).count, 4);
});

test("partial multi-product deduction rolls back prior stock changes", async () => {
  const firstId = new mongoose.Types.ObjectId().toString();
  const secondId = new mongoose.Types.ObjectId().toString();
  const stock = new Map([
    [firstId, { count: 3, published: true }],
    [secondId, { count: 0, published: true }],
  ]);
  Product.updateOne = async (filter, update) => {
    const product = stock.get(String(filter._id));
    if (!product || (filter.isPublished !== undefined && !product.published) ||
      (filter.countInStock?.$gte !== undefined && product.count < filter.countInStock.$gte)) {
      return { matchedCount: 0 };
    }
    product.count += update.$inc.countInStock;
    return { matchedCount: 1 };
  };

  await assert.rejects(
    adjustInventory([
      { productId: firstId, quantity: 2 },
      { productId: secondId, quantity: 1 },
    ], -1),
    { statusCode: 409 }
  );
  assert.equal(stock.get(firstId).count, 3);
  assert.equal(stock.get(secondId).count, 0);
});

test("COD checkout uses server product prices and deducts live inventory", async () => {
  const productId = new mongoose.Types.ObjectId().toString();
  const userId = new mongoose.Types.ObjectId();
  const checkoutId = new mongoose.Types.ObjectId();
  const product = {
    _id: productId,
    name: "Field jacket",
    price: 120,
    countInStock: 3,
    isPublished: true,
    sizes: ["M"],
    colors: ["Olive"],
    images: [{ url: "https://images.example/jacket.webp" }],
  };
  let remaining = product.countInStock;
  let storedCheckout;
  let orderData;
  Product.find = async () => [product];
  Product.updateOne = async (filter, update) => {
    if (
      String(filter._id) !== productId ||
      (filter.isPublished !== undefined && !product.isPublished) ||
      (filter.countInStock?.$gte !== undefined && remaining < filter.countInStock.$gte)
    ) return { matchedCount: 0 };
    remaining += update.$inc.countInStock;
    return { matchedCount: 1 };
  };
  Checkout.create = async (data) => {
    storedCheckout = {
      ...data,
      _id: checkoutId,
      isFinalized: false,
      stockReservationState: "none",
      save: async function save() { return this; },
    };
    return storedCheckout;
  };
  Checkout.findOneAndUpdate = async (_filter, update) => {
    Object.assign(storedCheckout, update.$set);
    return storedCheckout;
  };
  Checkout.updateOne = async (_filter, update) => {
    Object.assign(storedCheckout, update.$set);
    return { matchedCount: 1 };
  };
  Order.create = async (data) => {
    orderData = data;
    return { ...data, _id: new mongoose.Types.ObjectId() };
  };
  Order.deleteOne = async () => ({ deletedCount: 1 });
  Cart.findOneAndDelete = async () => null;

  const res = response();
  await checkoutPost({
    user: { _id: userId },
    body: {
      checkoutItems: [{
        productId,
        name: "Client supplied name",
        price: 1,
        image: "https://images.example/untrusted.webp",
        size: "M",
        color: "Olive",
        quantity: 1,
      }],
      totalPrice: 1,
      paymentMethod: "COD",
      shippingAddress: { address: "10 Market St", city: "Lahore", postalCode: 54000, country: "Pakistan" },
    },
  }, res);

  assert.equal(res.statusCode, 201);
  assert.equal(orderData.orderItem[0].name, "Field jacket");
  assert.equal(orderData.orderItem[0].price, 120);
  assert.equal(orderData.totalPrice, 120);
  assert.equal(orderData.inventoryAdjusted, true);
  assert.equal(remaining, 2);
});

test("cancelling a tracked order restores stock once and cancellation is terminal", async () => {
  const productId = new mongoose.Types.ObjectId().toString();
  const orderId = new mongoose.Types.ObjectId();
  let remaining = 2;
  const order = {
    _id: orderId,
    status: "Processing",
    inventoryAdjusted: true,
    isDelivered: false,
    orderItem: [{ productId, quantity: 2 }],
    populate: async function populate() { return this; },
  };
  Product.updateOne = async (filter, update) => {
    if (String(filter._id) !== productId) return { matchedCount: 0 };
    remaining += update.$inc.countInStock;
    return { matchedCount: 1 };
  };
  Order.findById = async () => order;
  Order.findOneAndUpdate = async (_filter, update) => {
    Object.assign(order, update.$set);
    if (update.$unset) order.deliveredAt = undefined;
    return order;
  };

  const cancelledResponse = response();
  await ademinOrderUpdate({ params: { id: String(orderId) }, body: { status: "Cancelled" } }, cancelledResponse);
  assert.equal(cancelledResponse.statusCode, 200);
  assert.equal(order.inventoryAdjusted, false);
  assert.equal(remaining, 4);

  const repeatedResponse = response();
  await ademinOrderUpdate({ params: { id: String(orderId) }, body: { status: "Cancelled" } }, repeatedResponse);
  assert.equal(repeatedResponse.statusCode, 200);
  assert.equal(remaining, 4);

  const reopenResponse = response();
  await ademinOrderUpdate({ params: { id: String(orderId) }, body: { status: "Processing" } }, reopenResponse);
  assert.equal(reopenResponse.statusCode, 409);
  assert.equal(remaining, 4);
});

test("authentication loads the current database user rather than trusting JWT role", async () => {
  const user = { _id: new mongoose.Types.ObjectId(), role: "customer" };
  User.findById = (id) => ({
    select: async () => (id === user._id.toString() ? user : null),
  });
  const token = jwt.sign({ id: user._id.toString(), role: "admin" }, jwtSecret);
  const res = response();
  const req = { headers: { authorization: `Bearer ${token}` } };
  let nextCalled = false;

  await auth(req, res, () => {
    nextCalled = true;
  });
  assert.equal(nextCalled, true);
  assert.equal(req.user.role, "customer");
});
