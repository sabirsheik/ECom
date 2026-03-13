import React from "react";
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="w-64 text-white min-h-screen p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-3xl font-semibold tracking-wide hover:text-emerald-400 transition">
          E-Com Admin
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center text-gray-300">Admin Dashboard</h2>
      
      <nav className="space-y-4">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-emerald-500 text-white py-3 px-4 rounded-lg flex items-center space-x-3 hover:bg-emerald-600"
              : "text-gray-300 hover:bg-emerald-500 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-300"
          }
        >
          <FaUser size={20} />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-emerald-500 text-white py-3 px-4 rounded-lg flex items-center space-x-3 hover:bg-emerald-600"
              : "text-gray-300 hover:bg-emerald-500 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-300"
          }
        >
          <FaBoxOpen size={20} />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-emerald-500 text-white py-3 px-4 rounded-lg flex items-center space-x-3 hover:bg-emerald-600"
              : "text-gray-300 hover:bg-emerald-500 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-300"
          }
        >
          <FaClipboardList size={20} />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/admin/shop"
          className={({ isActive }) =>
            isActive
              ? "bg-emerald-500 text-white py-3 px-4 rounded-lg flex items-center space-x-3 hover:bg-emerald-600"
              : "text-gray-300 hover:bg-emerald-500 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-300"
          }
        >
          <FaStore size={20} />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-3 transition duration-300"
        >
          <FaSignOutAlt size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;