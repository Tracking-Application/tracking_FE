import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../slice/admin/usersSlice";
import { fetchTotalOrders, fetchTotalDelivered, fetchTotalPending, fetchTotalShipping } from "../../slice/admin/adminHomeSlice";
import AdminPanel from "./components/AdminPanel";
import Users from "./Users";
import Orders from "./Orders";
import Reviews from "./Reviews";
import AddProduct from "./AddProduct";
import AllProducts from "./AllProducts";
import "../../style/admin/AdminHome.css";
// import "../../style/admin/components/AdminPanel.css";

const AdminHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- Local State ---
  const [activeTab, setActiveTab] = useState("dashboard");

  // --- Redux State ---
  const { userId: adminId } = useSelector((state) => state.login);
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.adminUsers);

  const {
    totalOrders,
    deliveredOrders,
    pendingOrders,
    shippingOrders,
    loading: statsLoading,
  } = useSelector((state) => state.adminHome);

  const usersCount = users.length;

  const adminName = (() => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      return currentUser?.name || "Admin";
    } catch {
      return "Admin";
    }
  })();

  // --- Effects ---
  useEffect(() => {
    dispatch(fetchAllCustomers());
    if (adminId) {
      dispatch(fetchTotalOrders(adminId));
      dispatch(fetchTotalDelivered());
      dispatch(fetchTotalPending());
      dispatch(fetchTotalShipping());
    }
  }, [dispatch, adminId]);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <AdminPanel
        adminName={adminName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">
            {activeTab === "allProducts" ? "All Products" : activeTab}
          </h1>
        </header>

        <main
          className={`content-card ${activeTab === "addProduct" ? "content-card-hidden" : ""}`}
        >
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="dashboard-grid">
              <div className="stat-card stat-users">
                <div className="stat-icon-bg">👥</div>
                <div className="stat-info">
                  <h3 className="stat-title">Total Users</h3>
                  <p className="stat-value">{usersLoading ? "..." : usersCount}</p>
                </div>
              </div>
              <div className="stat-card stat-orders">
                <div className="stat-icon-bg">📦</div>
                <div className="stat-info">
                  <h3 className="stat-title">Total Orders</h3>
                  <p className="stat-value">{statsLoading ? "..." : totalOrders}</p>
                </div>
              </div>
              <div className="stat-card stat-delivered">
                <div className="stat-icon-bg">✅</div>
                <div className="stat-info">
                  <h3 className="stat-title">Delivered</h3>
                  <p className="stat-value">{statsLoading ? "..." : deliveredOrders}</p>
                </div>
              </div>
              <div className="stat-card stat-pending">
                <div className="stat-icon-bg">⏳</div>
                <div className="stat-info">
                  <h3 className="stat-title">Pending Orders</h3>
                  <p className="stat-value">{statsLoading ? "..." : pendingOrders}</p>
                </div>
              </div>
              <div className="stat-card stat-shipping">
                <div className="stat-icon-bg">🚚</div>
                <div className="stat-info">
                  <h3 className="stat-title">Shipping</h3>
                  <p className="stat-value">{statsLoading ? "..." : shippingOrders}</p>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && <Users />}

          {/* Orders Tab */}
          {activeTab === "orders" && <Orders />}

          {/* Reviews Tab */}
          {activeTab === "reviews" && <Reviews />}

          {/* All Products Tab */}
          {activeTab === "allProducts" && <AllProducts />}

          {/* Add Product Tab */}
          {activeTab === "addProduct" && <AddProduct />}
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
