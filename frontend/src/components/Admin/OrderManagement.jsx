import React from "react";

const OrderManagement = () => {
  const orders = [
    {
      _id: 12312312,
      user: { name: "Shah Nawaz" },
      totalPrice: 2000,
      status: "Processing",
    },
    {
      _id: 12312313,
      user: { name: "Ayesha Khan" },
      totalPrice: 3500,
      status: "Shipped",
    },
    {
      _id: 12312314,
      user: { name: "Ali Hassan" },
      totalPrice: 4200,
      status: "Delivered",
    },
    {
      _id: 12312315,
      user: { name: "Sarah Malik" },
      totalPrice: 1500,
      status: "Cancelled",
    },
    {
      _id: 12312316,
      user: { name: "Ahmed Bilal" },
      totalPrice: 1800,
      status: "Processing",
    },
    {
      _id: 12312317,
      user: { name: "Fatima Ali" },
      totalPrice: 2800,
      status: "Shipped",
    },
    {
      _id: 12312318,
      user: { name: "Usman Javed" },
      totalPrice: 2500,
      status: "Delivered",
    },
    {
      _id: 12312319,
      user: { name: "Zohaib Saeed" },
      totalPrice: 3000,
      status: "Processing",
    },
    {
      _id: 12312320,
      user: { name: "Mehmood Tariq" },
      totalPrice: 4500,
      status: "Shipped",
    },
    {
      _id: 12312321,
      user: { name: "Sania Khan" },
      totalPrice: 3500,
      status: "Delivered",
    },
    {
      _id: 12312322,
      user: { name: "Rehman Shah" },
      totalPrice: 4000,
      status: "Cancelled",
    },
    {
      _id: 12312323,
      user: { name: "Nadia Hameed" },
      totalPrice: 2200,
      status: "Processing",
    },
    {
      _id: 12312324,
      user: { name: "Arslan Ahmed" },
      totalPrice: 3600,
      status: "Shipped",
    },
    {
      _id: 12312325,
      user: { name: "Muneeb Khan" },
      totalPrice: 3000,
      status: "Delivered",
    },
    {
      _id: 12312326,
      user: { name: "Samina Shah" },
      totalPrice: 3200,
      status: "Processing",
    },
  ];
  

  const handleStatusChange = (orderId, status) => {
    console.log({ id: orderId, status: status });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">{order.user.name}</td>
                  <td className="p-4">Rs {order.totalPrice}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition duration-300"
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No Orders Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
