import React from "react";
import { useDispatch } from "react-redux";
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { FaGauge } from "react-icons/fa6";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlices";

const AdminSidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-[var(--bronze)] text-[var(--graphite)]"
        : "text-[#aaa59c] hover:bg-[var(--bronze-deep)] hover:text-white"
    }`;

  return (
    <div className="flex min-h-full flex-col p-6 text-white">
      <div className="mb-8">
        <Link to="/admin" onClick={onNavigate} className="display-title text-3xl font-semibold tracking-wide transition hover:text-[var(--bronze)]">
          E-Com Admin
        </Link>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#aaa59c]">Store operations</p>
      </div>
      <nav aria-label="Admin navigation" className="space-y-2">
        <NavLink to="/admin" end onClick={onNavigate} className={linkClass}>
          <FaGauge size={18} />
          <span>Overview</span>
        </NavLink>
        <NavLink
          to="/admin/users"
          onClick={onNavigate}
          className={linkClass}
        >
          <FaUser size={18} />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          onClick={onNavigate}
          className={linkClass}
        >
          <FaBoxOpen size={18} />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          onClick={onNavigate}
          className={linkClass}
        >
          <FaClipboardList size={18} />
          <span>Orders</span>
        </NavLink>

        <Link to="/" onClick={onNavigate} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#aaa59c] transition hover:bg-[var(--bronze-deep)] hover:text-white">
          <FaStore size={18} />
          <span>View storefront</span>
        </Link>
      </nav>

      <div className="mt-auto pt-8">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 border border-white/15 px-4 py-3 text-sm font-medium text-[#eee9df] transition hover:border-[var(--error)] hover:bg-[var(--error)]"
        >
          <FaSignOutAlt size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;