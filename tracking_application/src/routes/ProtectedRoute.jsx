import React from "react";
import { Navigate } from "react-router-dom";

const normalizeRole = (rawRole) => {
  const value = String(rawRole || "").toLowerCase();
  if (value.includes("admin")) return "admin";
  if (value.includes("customer") || value.includes("user")) return "customer";
  return "";
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch {
    currentUser = {};
  }

  const userRole = normalizeRole(currentUser?.role);

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "admin") {
      return <Navigate to={`/admin/${currentUser.userId}/home`} replace />;
    }
    return <Navigate to={`/user/${currentUser.userId}/home`} replace />;
  }

  return children;
};

export default ProtectedRoute;
