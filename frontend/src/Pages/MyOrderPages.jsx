import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/OrderSlice";

const MyOrderPages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId)=>{
    navigate(`/order/${orderId}`)
  }

  return (
    <div className="mx-auto max-w-screen-xl px-2 py-6 sm:px-4 sm:py-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:mb-8 sm:text-3xl">
        My Orders
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full table-fixed">
          <thead className="bg-gradient-to-r from-gray-200 via-gray to-gray-100 text-gray-700">
            <tr className="text-sm sm:text-base text-left whitespace-nowrap">
              <th className="px-4 py-4 font-semibold tracking-wide">Image</th>
              <th className="px-4 py-4 font-semibold tracking-wide">
                Order ID
              </th>
              <th className="px-4 py-4 font-semibold tracking-wide">
                Created At
              </th>
              <th className="px-4 py-4 font-semibold tracking-wide">
                Shipping Address
              </th>
              <th className="px-4 py-4 font-semibold text-center tracking-wide">
                Items
              </th>
              <th className="px-4 py-4 font-semibold text-center tracking-wide">
                Price (Rs.)
              </th>
              <th className="px-4 py-4 font-semibold text-center tracking-wide">
                Payment Status
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-800 text-sm sm:text-base">
            {orders.length > 0 ? (
              orders.map((order) => {
                const firstItem = Array.isArray(order.orderItem) && order.orderItem.length > 0
                  ? order.orderItem[0]
                  : null;

                return (
                <tr
                onClick={()=>handleRowClick(order._id)}
                  key={order._id}
                  className="hover:bg-gray-50 cursor-pointer transition duration-200 border-b"
                >
                  <td className="p-4">
                    {firstItem ? (
                      <img
                        src={firstItem.image}
                        alt={firstItem.name}
                        className="h-12 w-12 rounded-md border object-cover shadow-sm transition-transform duration-200 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md border text-xs text-slate-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {order.shippingAddress
                      ? `${order.shippingAddress.address || ""}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-center font-semibold">
                    {Array.isArray(order.orderItem) ? order.orderItem.length : 0}
                  </td>
                  <td className="p-4 text-center font-semibold">
                    {Number(order.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-400 py-10 font-medium"
                >
                  {loading ? "Loading orders..." : "No orders found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrderPages;
