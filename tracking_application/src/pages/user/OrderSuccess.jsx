import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../style/user/OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  return (
    <div className="os-container">
      {/* Background Confetti Elements */}
      <div className="confetti-wrapper">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`confetti piece-${i}`}></div>
        ))}
      </div>

      <div className="os-card">
        <div className="os-icon-wrapper">
          <div className="os-icon-circle">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          {/* Animated rings behind icon */}
          <div className="pulse-ring"></div>
        </div>

        <div className="os-text-section">
          <h1 className="os-title">Order Confirmed!</h1>
          <p className="os-subtitle">Thank you for your purchase</p>
          <div className="os-divider"></div>
          <p className="os-description">
            Your books are being prepared for shipping and will be with you
            shortly. A confirmation email has been sent to your inbox.
          </p>
        </div>

        <div className="os-button-group">
          <button
            className="os-btn-primary"
            onClick={() => navigate(`/user/${userId}/orders`)}
          >
            View My Orders
          </button>
          <button
            className="os-btn-secondary"
            onClick={() => navigate(`/user/${userId}/home`)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
