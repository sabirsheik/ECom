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
    <div className="relative flex min-h-screen flex-col bg-[var(--paper)] md:flex-row">
      {/* Mobile Toggle Button */}
      <div className="z-20 flex bg-[var(--graphite)] p-4 text-white md:hidden">
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
      <div className={`z-20 min-h-screen w-64 transform bg-[var(--graphite)] text-white absolute md:relative md:static md:block ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0`}>
        {/* Sidebar Components */}
        <AdminSidebar />
      </div>
      {/* Main Content */}
      <div className="flex-grow overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
