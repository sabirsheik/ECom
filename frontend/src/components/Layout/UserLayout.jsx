import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <Header />
      <main className="pt-[6.5rem] md:pt-[6.6rem]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default UserLayout;
