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
    <div className="py-5">
      <div className="overflow-x-auto border-y border-[var(--line)]">
        <table className="min-w-full table-fixed">
          <thead className="text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-soft)]">
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

          <tbody className="text-sm text-[var(--ink)]">
            {orders.length > 0 ? (
              orders.map((order) => {
                const firstItem = Array.isArray(order.orderItem) && order.orderItem.length > 0
                  ? order.orderItem[0]
                  : null;

                return (
                <tr
                onClick={()=>handleRowClick(order._id)}
                  key={order._id}
                  className="cursor-pointer border-b border-[var(--line)] transition duration-200 hover:bg-[var(--surface)]"
                >
                  <td className="p-4">
                    {firstItem ? (
                      <img
                        src={firstItem.image}
                        alt={firstItem.name}
                        className="h-12 w-12 object-cover transition-transform duration-200 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center border border-[var(--line)] text-xs text-[var(--ink-soft)]">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-[var(--ink-soft)]">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4 text-[var(--ink-soft)]">
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
                          ? "bg-[#e2eee5] text-[var(--success)]"
                          : "bg-[#f3e3de] text-[var(--error)]"
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
                  className="py-12 text-center font-medium text-[var(--ink-soft)]"
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
