import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../../slice/user/myOrdersSlice";
import "../../style/user/MyOrders.css";

const MyOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  const { orders, loading, error } = useSelector((state) => state.myOrders);

  useEffect(() => {
    if (userId) {
      dispatch(getMyOrders(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="my-orders-page">
      <div className="my-orders-shell">
        <div className="orders-header">
          <button
            className="back-btn"
            onClick={() => navigate(`/user/${userId}/home`)}
          >
            &larr; Back to Shop
          </button>
          <h1>My Order History</h1>
          <p className="subtitle">Track and manage your recent purchases</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Fetching your orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">Error: {error}</p>
            <button className="retry-btn" onClick={() => dispatch(getMyOrders(userId))}>
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>It looks like you haven't placed any orders yet.</p>
            <button onClick={() => navigate(`/user/${userId}/home`)} className="shop-now-btn">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
            {(() => {
              const statusPriority = {
                pending: 1,
                shipping: 2,
                delivered: 3,
              };

              return [...orders]
                .sort((a, b) => {
                  const priorityA = statusPriority[a.status.toLowerCase()] || 99;
                  const priorityB = statusPriority[b.status.toLowerCase()] || 99;
                  return priorityA - priorityB;
                })
                .map((order) => (
                  <tr key={order.id}>
                    <td><span className="order-id">#{order.id}</span></td>
                    <td className="product-title">{order.product_title}</td>
                    <td>{order.quantity}</td>
                    <td className="total-price">₹{order.total_price.toLocaleString()}</td>
                    <td className="order-date">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))})()}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
