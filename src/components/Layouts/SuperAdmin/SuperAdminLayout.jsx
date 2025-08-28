import React from "react";
import { Outlet } from "react-router-dom";
import "../Layouts.css";

const SuperAdminLayout = () => {
  return (
    <div className="layout-container">
      <Outlet />
    </div>
  );
};

export default SuperAdminLayout;
