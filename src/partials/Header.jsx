import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Header({}) {
  const location = useLocation();
  const { pathname } = location;

  const routes = ["/", "/nomograms", "/trials"];

  const standardRoutes = [
    "/",
    "/nomograms",
    "/trials/",
    "/nomograms/",
    "/trials",
  ];

  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          <div className="flex items-center">
            <NavLink
              to="/"
              className={`${
                pathname === "/" ? "text-slate-900" : null
              } ml-4 text-slate-500 hover:text-slate-600`}
            >
              <div>Dashboard</div>
            </NavLink>
            {/* 
            <NavLink
              to="/visualizations"
              className={`${
                pathname === "/visualizations" ||
                pathname === "/visualizations/"
                  ? "text-black"
                  : null
              } ml-4 text-slate-500 hover:text-slate-600`}
            >
              <div>Visualize</div>
            </NavLink> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
