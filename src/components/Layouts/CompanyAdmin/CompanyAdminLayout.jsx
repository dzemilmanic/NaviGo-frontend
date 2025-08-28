import React from "react";
import { Outlet } from "react-router-dom";
import "../Layouts.css";

const CompanyAdminLayout = () => {
  return (
    <div className="layout-container">
      <Outlet />
    </div>
  );
};

export default CompanyAdminLayout;
