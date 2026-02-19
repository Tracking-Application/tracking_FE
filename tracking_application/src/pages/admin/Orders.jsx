import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllOrders, updateOrder } from "../../slice/admin/ordersSlice";
import { fetchTotalOrders, fetchTotalDelivered, fetchTotalPending, fetchTotalShipping } from "../../slice/admin/adminHomeSlice";
import "../../style/admin/Orders.css";

const Orders = () => {
  const dispatch = useDispatch();
  const { adminId } = useParams();
  const { orders, loading, updating, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (adminId) {
      dispatch(fetchAllOrders(adminId));
    }
  }, [dispatch, adminId]);

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = "";
    let confirmMsg = "";

    if (currentStatus.toLowerCase() === "pending") {
      nextStatus = "Shipping";
      confirmMsg = "Are you sure you want to mark this order as shipping?";
    } else if (currentStatus.toLowerCase() === "shipping") {
      nextStatus = "Delivered";
      confirmMsg = "Are you sure you want to mark this order as delivered?";
    }

    if (nextStatus) {
      try {
        await dispatch(updateOrder({ adminId, orderId, status: nextStatus })).unwrap();
        // Refresh dashboard stats after successful update
        dispatch(fetchTotalOrders(adminId));
        dispatch(fetchTotalDelivered());
        dispatch(fetchTotalPending());
        dispatch(fetchTotalShipping());
      } catch (err) {
        console.error("Failed to update status or refresh stats:", err);
      }
    }
  };

  return (
    <div className="admin-orders-container">
      <div className="admin-orders-header">
        <h1>Customer Orders</h1>
        <p>Manage and track all customer purchases</p>
      </div>

      {loading ? (
        <div className="admin-loader-container">
          <div className="admin-spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="admin-error-box">
          <p>{error}</p>
          <button onClick={() => dispatch(fetchAllOrders(adminId))}>Retry</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-empty-state">
          <p>No orders found in the system.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Action</th>
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
                    <tr key={order.order_id}>
                      <td className="order-id-cell">#{order.order_id}</td>
                  <td className="customer-cell">{order.customer}</td>
                  <td className="product-cell">{order.product}</td>
                  <td className="qty-cell">{order.quantity}</td>
                  <td className="price-cell">₹{order.total_price.toLocaleString()}</td>
                  <td>
                    <span className={`status-pill ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status.toLowerCase() === "pending" ? (
                      <button
                        className="ship-btn"
                        onClick={() => handleUpdateStatus(order.order_id, order.status)}
                        disabled={updating}
                      >
                        {updating ? "..." : "Ship Order"}
                      </button>
                    ) : order.status.toLowerCase() === "shipping" ? (
                      <button
                        className="deliver-btn"
                        onClick={() => handleUpdateStatus(order.order_id, order.status)}
                        disabled={updating}
                      >
                        {updating ? "..." : "Mark Delivered"}
                      </button>
                    ) : (
                      <span className="completed-text">✅ Delivered</span>
                    )}
                  </td>
                </tr>
                ))})()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
