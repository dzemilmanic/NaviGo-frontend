import React from "react";
import { Outlet } from "react-router-dom";
import "../Layouts.css";

const RegularUserLayout = () => {
  return (
    <div className="layout-container">
      <Outlet />
    </div>
  );
};

export default RegularUserLayout;
