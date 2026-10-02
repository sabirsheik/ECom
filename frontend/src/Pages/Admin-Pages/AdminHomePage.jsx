import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../redux/slices/AdminOrderSlice";

const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});

const statusStyles = {
  Processing: "bg-[#f3eadc] text-[var(--warning)]",
  Shipped: "bg-[#e4e9ed] text-[#4d6575]",
  Delivered: "bg-[#e2eee5] text-[var(--success)]",
  Cancelled: "bg-[#f3e3de] text-[var(--error)]",
};

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { dashboard, dashboardLoading, error } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const metrics = dashboard?.metrics;
  const cards = [
    { title: "Collected revenue", value: metrics ? currency.format(metrics.revenue) : "—", detail: "Paid orders to date", href: "/admin/orders" },
    { title: "Orders", value: metrics?.orders ?? "—", detail: "All order statuses", href: "/admin/orders" },
    { title: "Products", value: metrics?.products ?? "—", detail: `${metrics?.lowStock ?? 0} low or out of stock`, href: "/admin/products" },
    { title: "Customers & admins", value: metrics?.users ?? "—", detail: "Registered accounts", href: "/admin/users" },
  ];

  return (
    <section className="mx-auto max-w-7xl space-y-9">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Operations / Overview</p>
          <h1 className="display-title text-4xl sm:text-5xl">Admin dashboard</h1>
          <p className="mt-3 text-sm text-[var(--ink-soft)]">Live store performance and order activity.</p>
        </div>
        <button type="button" onClick={() => dispatch(fetchAdminDashboard())} disabled={dashboardLoading} className="border border-[var(--line)] px-4 py-3 text-sm font-semibold transition hover:border-[var(--bronze)] disabled:opacity-50">
          {dashboardLoading ? "Refreshing…" : "Refresh data"}
        </button>
      </header>

      {error && (
        <div role="alert" className="border border-[#d9aaa0] bg-[#f7e9e5] p-4 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} to={card.href} className="premium-panel block p-5 transition hover:-translate-y-0.5 hover:border-[var(--bronze)] sm:p-6">
            <p className="eyebrow">{card.title}</p>
            <p className="display-title my-4 text-3xl sm:text-4xl">{dashboardLoading && !metrics ? "…" : card.value}</p>
            <p className="text-sm text-[var(--ink-soft)]">{card.detail}</p>
            <span className="mt-5 inline-block text-sm font-semibold text-[var(--bronze-deep)]">View details →</span>
          </Link>
        ))}
      </div>

      <div className="premium-panel overflow-hidden">
        <div className="flex items-end justify-between gap-4 border-b border-[var(--line)] p-5 sm:p-6">
          <div>
            <p className="eyebrow mb-2">Latest activity</p>
            <h2 className="display-title text-3xl">Recent orders</h2>
          </div>
          <Link to="/admin/orders" className="text-sm font-semibold text-[var(--bronze-deep)] hover:underline">All orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--paper)] text-xs uppercase tracking-wide text-[var(--ink-soft)]">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {dashboardLoading && !dashboard ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--ink-soft)]">Loading store data…</td></tr>
              ) : dashboard?.recentOrders?.length ? (
                dashboard.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[var(--paper)]">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-[var(--ink)]">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-4 text-[var(--ink-soft)]">{order.user?.name || "Deleted account"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[var(--ink-soft)]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-[var(--ink)]">{currency.format(order.totalPrice || 0)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status] || "bg-[var(--paper)] text-[var(--ink-soft)]"}`}>{order.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--ink-soft)]">No orders have been placed yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminHomePage;
