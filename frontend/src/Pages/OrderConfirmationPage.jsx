import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/OrderSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  const order = Array.isArray(orders) && orders.length > 0 ? orders[0] : null;

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-emerald-600 mb-10">
          🎉 Thank You for Your Order!
        </h1>

        {!order ? (
          <p className="text-center text-gray-500">
            {loading ? "Loading confirmation..." : "No recent order available."}
          </p>
        ) : (
          <>

        {/* Order Info */}
        <div className="flex flex-col md:flex-row justify-between mb-10 border-b pb-6">
          <div>
            <h2 className="text-lg font-semibold mb-1 text-gray-800">
              Order ID: <span className="font-normal text-gray-600">{order._id}</span>
            </h2>
            <p className="text-sm text-gray-500">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              Order Time:{" "}
              {new Date(order.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-emerald-700 text-sm font-medium">
            Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-6 mb-10">
          {(order.orderItem || []).map((item) => (
            <div
              key={item.productId?.toString()}
              className="flex items-center justify-between border p-4 rounded-lg bg-gray-50 shadow-sm"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover mr-4 border"
                />
                <div>
                  <h4 className="text-md font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | Size {item.size}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold text-gray-800">Rs {item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment & Delivery */}
        <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Payment Method</h4>
            <p className="text-gray-600 text-sm">{order.paymentMethod || "N/A"}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Delivery Address</h4>
            <p className="text-gray-600 text-sm">{order.shippingAddress?.address || "N/A"}</p>
            <p className="text-gray-600 text-sm">
              {order.shippingAddress?.city}, {order.shippingAddress?.country}
            </p>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
