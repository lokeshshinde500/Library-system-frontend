import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return <div>{children}</div>;
}

export default PrivateRoutes;
