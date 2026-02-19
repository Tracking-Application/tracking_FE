import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/common/Home";
import Register from "../pages/common/Register";
import Login from "../pages/common/Login";
import UserHome from "../pages/user/UserHome";
import AdminHome from "../pages/admin/AdminHome";
import Cart from "../pages/user/Cart";
import Profile from "../pages/user/Profile";
import ProductDetails from "../pages/user/ProductDetails";
import Checkout from "../pages/user/Checkout";
import OrderSuccess from "../pages/user/OrderSuccess";
import MyOrders from "../pages/user/MyOrders";

import ProtectedRoute from "./ProtectedRoute";
import Payment from "../pages/user/Payment";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* legacy route redirect */}
      <Route
        path="/user-home"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* user flow */}

      <Route
        path="/user/:userId/home"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <UserHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/cart"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/profile"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/:userId/product/:id"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <ProductDetails />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/user/:userId/checkout"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/order-success"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/:userId/orders"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/payment"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Payment />
          </ProtectedRoute>
        }
      />

      {/* admin flow */}

      <Route
        path="/admin/:adminId/home"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminHome />
          </ProtectedRoute>
        }
      />




    </Routes>
  );
};

export default AppRoutes;

