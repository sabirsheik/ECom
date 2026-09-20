import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/OrderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (
        <p>{loading ? "Loading order details..." : "No Order Details Found"}</p>
      ) : (
        <div className="p-4 md:p-6 border">
          {/* order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID : #{orderDetails._id}
              </h3>
              <p className="text-[var(--ink-soft)]">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                } px-3 py-1 text-sm font-medium mb-2
                `}
              >
                {orderDetails.isPaid ? "Paid" : "Pending"}
              </span>
              <span
                className={`${
                  orderDetails.isDelivered
                    ? "bg-green-200 text-green-700"
                    : "bg-yellow-200 text-yellow-700"
                } px-3 py-1 text-sm font-medium mb-2
                `}
              >
                {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
              </span>
            </div>
          </div>
          {/* Customer, Payment, Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
                <h4 className="text-xl font-semibold mb-2">Payment Info</h4>
                <p><span className="font-bold">Payment : </span> {orderDetails.paymentMethod}</p>
                <p> <span className="font-bold">Status :</span> {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-2">Shipping Info</h4>
                <p><span className="font-bold">Shipping Method :</span> Standard</p>
                <p><span className="font-bold">Address :</span> {`${orderDetails.shippingAddress?.address || ""}, ${orderDetails.shippingAddress?.city || ""}, ${orderDetails.shippingAddress?.country || ""}`}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <table className="mb-4 min-w-full text-[var(--ink-soft)]">
              <thead className="border-y border-[var(--line)] text-left text-[0.62rem] uppercase tracking-[0.16em]">
                    <tr>
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Unit Price</th>
                        <th className="py-2 px-4">Quantity</th>
                        <th className="py-2 px-4">Total</th>
                    </tr>
                </thead>
                <tbody>
                {(orderDetails.orderItem || []).map((item) => {
  return (
    <tr key={item.productId?.toString()} className="border-b">
      <td className="py-2 px-4 flex items-center">
        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover mr-4" />
        <Link to={`/product/${item.productId}`} className="text-[var(--bronze-deep)] hover:underline">
          {item.name}
        </Link>
      </td>
      <td className="py-2 px-4">Rs {item.price}</td>
      <td className="py-2 px-4"> {item.quantity}</td>
      <td className="py-2 px-4">Rs {item.price * item.quantity}</td>
    </tr>
  );
})}

                </tbody>
            </table>
          </div>
       
        <Link to="/my-order" className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--bronze-deep)] hover:underline">
        Back to My Order
        </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
