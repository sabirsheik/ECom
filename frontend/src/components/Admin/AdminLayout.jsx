import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState();
  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* Mobile Toggle Button */}
      <div className="flex md:hidden p-4 bg-e-black text-white z-20">
        <button onClick={toggleSideBar}>
          <FaBars />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashborad</h1>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-e-black bg-opacity-50 md:hidden"
          onClick={toggleSideBar}
        ></div>
      )}
      {/* sidebar */}
      <div className={`bg-e-black w-64 min-h-screen text-white absolute md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
        {/* Sidebar Components */}
        <AdminSidebar />
      </div>
      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
