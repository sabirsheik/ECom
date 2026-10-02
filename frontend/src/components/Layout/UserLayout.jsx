import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet, useLocation } from "react-router-dom";

const UserLayout = () => {
  const location = useLocation();

  return (
    <div className="storefront-shell">
      <Header />
      <main className="pt-[5.7rem] md:pt-[7.1rem]">
        <Outlet />
      </main>
      <Footer showNewsletter={location.pathname !== "/"} />
    </div>
  );
};

export default UserLayout;
