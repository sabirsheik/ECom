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
    <div className="min-h-screen bg-[var(--paper)] px-5 py-12 sm:px-8">
      <div className="premium-panel mx-auto max-w-5xl p-6 sm:p-10">
        <p className="eyebrow mb-3 text-center">Order confirmed</p>
        <h1 className="display-title mb-10 text-center text-5xl sm:text-6xl">
          Thank you for your order.
        </h1>

        {!order ? (
          <p className="py-12 text-center text-[var(--ink-soft)]">
            {loading ? "Loading confirmation..." : "No recent order available."}
          </p>
        ) : (
          <>

        {/* Order Info */}
        <div className="mb-10 flex flex-col justify-between border-b border-[var(--line)] pb-6 md:flex-row">
          <div>
              <h2 className="text-lg font-semibold">
              Order ID: <span className="font-normal text-[var(--ink-soft)]">{order._id}</span>
            </h2>
              <p className="text-sm text-[var(--ink-soft)]">
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
              <p className="text-sm text-[var(--ink-soft)]">
              Order Time:{" "}
              {new Date(order.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div className="mt-4 text-sm font-medium text-[var(--success)] md:mt-0">
            Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-6 mb-10">
          {(order.orderItem || []).map((item) => (
            <div
              key={item.productId?.toString()}
              className="flex items-center justify-between border border-[var(--line)] bg-[var(--paper)] p-4"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover mr-4 border"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-[var(--ink-soft)]">
                    {item.color} | Size {item.size}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold">Rs {item.price}</p>
                <p className="text-sm text-[var(--ink-soft)]">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment & Delivery */}
        <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <h4 className="eyebrow mb-2">Payment method</h4>
            <p className="text-sm text-[var(--ink-soft)]">{order.paymentMethod || "N/A"}</p>
          </div>
          <div>
            <h4 className="eyebrow mb-2">Delivery address</h4>
            <p className="text-sm text-[var(--ink-soft)]">{order.shippingAddress?.address || "N/A"}</p>
            <p className="text-sm text-[var(--ink-soft)]">
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
