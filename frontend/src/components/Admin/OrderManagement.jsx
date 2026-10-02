import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  deleteOrder,
  fetchAdminOrders,
  updateOrderStatus,
} from "../../redux/slices/AdminOrderSlice";

const statuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, updatingId, deletingId, error } = useSelector((state) => state.adminOrder);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        !query ||
        order._id?.toLowerCase().includes(query) ||
        order.user?.name?.toLowerCase().includes(query) ||
        order.user?.email?.toLowerCase().includes(query);
      return matchesQuery && (statusFilter === "all" || order.status === statusFilter);
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (order, status) => {
    if (status === order.status) return;
    try {
      await dispatch(updateOrderStatus({ id: order._id, status })).unwrap();
      toast.success(`Order status changed to ${status}`);
    } catch (requestError) {
      toast.error(requestError.message || "Could not update order status");
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order #${order._id.slice(-8)}? This cannot be undone.`)) return;
    try {
      await dispatch(deleteOrder(order._id)).unwrap();
      toast.success("Order deleted");
    } catch (requestError) {
      toast.error(requestError.message || "Could not delete order");
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-7">
      <header>
        <p className="eyebrow mb-2">Operations / Fulfillment</p>
        <h1 className="display-title text-4xl sm:text-5xl">Orders</h1>
        <p className="mt-3 text-sm text-[var(--ink-soft)]">{orders.length} orders in total.</p>
      </header>

      {error && (
        <div role="alert" className="border border-[#d9aaa0] bg-[#f7e9e5] p-4 text-sm text-[var(--error)]">{error}</div>
      )}

      <div className="premium-panel overflow-hidden">
        <div className="grid gap-3 border-b border-[var(--line)] p-5 sm:grid-cols-[minmax(15rem,1fr)_12rem] sm:p-6">
          <input
            type="search"
            aria-label="Search orders"
            placeholder="Search order, customer or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="premium-input"
          />
          <select aria-label="Filter orders by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="premium-input">
            <option value="all">All statuses</option>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--paper)] text-xs uppercase tracking-wide text-[var(--ink-soft)]">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Placed</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {loading ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-[var(--ink-soft)]">Loading orders…</td></tr>
              ) : filteredOrders.length ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[var(--paper)]">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-[var(--ink)]">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="min-w-[12rem] px-5 py-4">
                      <div className="font-medium text-[var(--ink)]">{order.user?.name || "Deleted account"}</div>
                      {order.user?.email && <div className="mt-1 text-xs text-[var(--ink-soft)]">{order.user.email}</div>}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--ink-soft)]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-[var(--ink)]">{currency.format(order.totalPrice || 0)}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--ink-soft)]">
                      <div>{order.paymentMethod || "—"}</div>
                      <div className="mt-1 text-xs">{order.isPaid ? "Paid" : order.paymentStatus || "Unpaid"}</div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Status for order ${order._id}`}
                        value={order.status}
                        disabled={updatingId === order._id || order.status === "Cancelled"}
                        onChange={(event) => handleStatusChange(order, event.target.value)}
                        className="border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-2 disabled:opacity-60"
                      >
                        {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                      {order.status === "Cancelled" && <span className="ml-2 text-xs text-[var(--ink-soft)]">Final</span>}
                      {updatingId === order._id && <span role="status" className="ml-2 text-xs text-[var(--ink-soft)]">Saving…</span>}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(order)}
                        disabled={deletingId === order._id}
                        className="border border-[var(--error)] px-3 py-2 text-xs font-semibold text-[var(--error)] transition hover:bg-[var(--error)] hover:text-white disabled:opacity-50"
                      >
                        {deletingId === order._id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-[var(--ink-soft)]">No matching orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default OrderManagement;
