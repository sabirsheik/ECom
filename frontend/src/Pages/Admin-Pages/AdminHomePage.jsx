import React from "react";
import { Link } from "react-router-dom";

const AdminHomePage = () => {
  const orders = [
    { _id: 123123, user: { name: "Sabir Ali" }, totalPrice: 5000, status: "processing" },
    { _id: 234234, user: { name: "Haider Ali" }, totalPrice: 4000, status: "shipped" },
    { _id: 483234, user: { name: "Khan Ali" }, totalPrice: 3000, status: "delivered" },
    { _id: 348723847, user: { name: "Anyat Khan" }, totalPrice: 7000, status: "processing" },
    { _id: 989, user: { name: "Shah Nawaz" }, totalPrice: 9000, status: "cancelled" },
  ];

  // Status color map
  const statusColors = {
    processing: "bg-[#f3eadc] text-[var(--warning)]",
    shipped: "bg-[#e4e9ed] text-[#4d6575]",
    delivered: "bg-[#e2eee5] text-[var(--success)]",
    cancelled: "bg-[#f3e3de] text-[var(--error)]",
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] p-6">
      <p className="eyebrow mb-3 text-center">Operations / Overview</p>
      <h1 className="display-title mb-10 text-center text-5xl">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          { title: "Revenue", value: "Rs 250k", link: "" },
          { title: "Total Orders", value: "120", link: "/admin/orders" },
          { title: "Products", value: "200", link: "/admin/products" },
        ].map((card, idx) => (
          <div
            key={idx}
            className="premium-panel cursor-pointer p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--bronze)]"
          >
            <h2 className="eyebrow">{card.title}</h2>
            <p className="display-title my-3 text-4xl">{card.value}</p>
            {card.link && (
              <Link
                to={card.link}
                className="mt-2 inline-block text-sm font-medium text-[var(--bronze-deep)] hover:underline"
              >
                Manage {card.title}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="premium-panel p-6">
        <h2 className="display-title mb-6 text-4xl">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-[var(--ink-soft)]">
            <thead className="border-y border-[var(--line)] uppercase text-[var(--ink-soft)] text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Order ID</th>
                <th className="py-3 px-6 text-left">User</th>
                <th className="py-3 px-6 text-left">Total Price</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="cursor-pointer border-b border-[var(--line)] transition-all duration-300 hover:bg-[var(--paper)]"
                  >
                    <td className="py-4 px-6 font-semibold text-[var(--ink)]">#{order._id}</td>
                    <td className="py-4 px-6">{order.user.name}</td>
                    <td className="py-4 px-6">Rs {order.totalPrice}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center text-[var(--ink-soft)]">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
