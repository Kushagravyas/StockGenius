import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const NavbarLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        {/* adjust if your navbar height is different */}
        <Outlet />
      </main>
    </div>
  );
};

export default NavbarLayout;
