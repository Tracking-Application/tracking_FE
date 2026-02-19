import React from "react";
import "../../../style/admin/components/AdminPanel.css";

const AdminPanel = ({
  adminName,
  activeTab,
  setActiveTab,
  handleLogout,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div>Admin Panel</div>
        <p className="admin-welcome-text">Welcome, {adminName}</p>
      </div>
      <nav className="sidebar-nav">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`nav-item ${
            activeTab === "dashboard" ? "nav-item-active" : ""
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`nav-item ${
            activeTab === "users" ? "nav-item-active" : ""
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`nav-item ${
            activeTab === "orders" ? "nav-item-active" : ""
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("addProduct")}
          className={`nav-item ${
            activeTab === "addProduct" ? "nav-item-active" : ""
          }`}
        >
          Add Product
        </button>
        <button
          onClick={() => setActiveTab("allProducts")}
          className={`nav-item ${
            activeTab === "allProducts" ? "nav-item-active" : ""
          }`}
        >
          All Products
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`nav-item ${
            activeTab === "reviews" ? "nav-item-active" : ""
          }`}
        >
          Reviews
        </button>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
