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
    processing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
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
            className="p-6 cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:bg-blue-50"
          >
            <h2 className="text-lg font-semibold text-gray-600">{card.title}</h2>
            <p className="text-3xl font-bold text-gray-900 my-3">{card.value}</p>
            {card.link && (
              <Link
                to={card.link}
                className="inline-block mt-2 text-blue-600 font-medium text-sm hover:underline"
              >
                Manage {card.title}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 uppercase text-gray-600 text-xs">
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
                    className="border-b cursor-pointer hover:bg-blue-50 transition-all duration-300"
                  >
                    <td className="py-4 px-6 font-semibold text-gray-800">#{order._id}</td>
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
                  <td colSpan="4" className="py-6 px-6 text-center text-gray-500">
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
