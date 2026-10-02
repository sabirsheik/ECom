import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[var(--paper)] md:flex">
      <header className="sticky top-0 z-20 flex items-center gap-4 bg-[var(--graphite)] px-4 py-3 text-white md:hidden">
        <button
          type="button"
          onClick={() => setIsSidebarOpen((open) => !open)}
          aria-label={isSidebarOpen ? "Close admin navigation" : "Open admin navigation"}
          aria-expanded={isSidebarOpen}
          className="grid h-10 w-10 place-items-center border border-white/20"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <span className="font-semibold tracking-wide">E-Com Admin</span>
      </header>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[var(--graphite)] transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-screen md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={closeSidebar} />
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
