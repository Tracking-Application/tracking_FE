import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetPaymentState } from "../../slice/user/paymentSlice";
import "../../style/user/Payment.css";

const FALLBACK_IMAGE = "/book-cover.svg";

const Payment = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingInfo, cartItems, subtotal } = location.state || {};
  const { userId } = useSelector((state) => state.login);
  const { loading } = useSelector((state) => state.payment);
  const [localLoading, setLocalLoading] = useState(false);

  // Card details states
  const [cardDetails, setCardDetails] = useState({
    number: "",
    cvv: "",
    year: "",
    month: "",
  });

  // Error messages state
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Number field-ku digits mattum allow panna (Regex)
    const numericValue = value.replace(/\D/g, "");

    setCardDetails({ ...cardDetails, [name]: numericValue });

    // Typing-il error message-ai clear panna
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    const currentYear = new Date().getFullYear();

    if (!cardDetails.number) tempErrors.number = "Card number is required";
    else if (cardDetails.number.length !== 8)
      tempErrors.number = "Must be exactly 8 digits";

    if (!cardDetails.cvv) tempErrors.cvv = "CVV is required";
    else if (cardDetails.cvv.length !== 3) tempErrors.cvv = "Must be 3 digits";

    if (!cardDetails.year) tempErrors.year = "Year is required";
    else if (
      cardDetails.year.length !== 4 ||
      parseInt(cardDetails.year) < currentYear
    )
      tempErrors.year = "Invalid year";

    if (!cardDetails.month) tempErrors.month = "Month is required";
    else if (
      parseInt(cardDetails.month) < 1 ||
      parseInt(cardDetails.month) > 12
    )
      tempErrors.month = "Invalid month (01-12)";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const processOrder = async () => {
    if (!userId || !cartItems || cartItems.length === 0) return;

    setLocalLoading(true);
    setGeneralError("");

    try {
      const orderPromises = cartItems.map((item) => {
        const orderData = {
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
        };
        return dispatch(createOrder(orderData)).unwrap();
      });

      await Promise.all(orderPromises);

      // Clear cart from localStorage after success
      const cartStorageKey = `cartItems_${userId}`;
      localStorage.removeItem(cartStorageKey);

      // 2 seconds load aagittu next page pogum
      setTimeout(() => {
        dispatch(resetPaymentState());
        navigate(`/user/${userId}/order-success`);
      }, 2000);
    } catch (error) {
      setGeneralError("Order failed. Please try again.");
      setLocalLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "card") {
      setShowPopup(true);
    } else {
      processOrder();
    }
  };

  const handleConfirmPayment = () => {
    if (validateForm()) {
      setShowPopup(false);
      processOrder();
    }
  };

  if (!shippingInfo || !cartItems || !subtotal) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <h2>Something went wrong</h2>
          <button
            className="back-btn"
            onClick={() => navigate(`/user/${userId}/checkout`)}
          >
            Go to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      {showPopup && (
        <div
          className="premium-overlay"
          onClick={() => setShowPopup(false)}
        ></div>
      )}

      <header className="payment-header">
        <h1 className="logo">BookShelf</h1>
      </header>

      <main className="payment-content">
        <div className="top-bar">
          <button
            className="back-btn"
            onClick={() => navigate(`/user/${userId}/checkout`)}
          >
            ← Back
          </button>
          <h2 className="page-title">Secure Payment</h2>
        </div>

        <div className="payment-grid">
          <div className="payment-options-area">
            <h3 className="section-subtitle">Choose Payment Mode</h3>
            <div className="payment-method-container">
              <div className="method-selection-stack">
                <label
                  className={`method-label ${paymentMethod === "card" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <div className="method-info">
                    <span className="method-icon">💳</span>
                    <div>
                      <strong>Debit / Credit Card</strong>
                      <span>Pay securely via card</span>
                    </div>
                  </div>
                </label>

                <label
                  className={`method-label ${paymentMethod === "cod" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div className="method-info">
                    <span className="method-icon">🚚</span>
                    <div>
                      <strong>Cash on Delivery</strong>
                      <span>Pay at your doorstep</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {generalError && (
          <p style={{ color: "red", textAlign: "center" }}>{generalError}</p>
        )}

        <div className="bottom-action-container">
          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading || localLoading}
          >
            {loading || localLoading ? "Processing..." : "Place the Order"}
          </button>
        </div>
      </main>

      {/* --- Card Details Popup --- */}
      {showPopup && (
        <div className="card-popup-container">
          <div className="premium-popup-card">
            <div className="popup-header">
              <h3>Debit Card details</h3>
              <button
                className="popup-close"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>
            </div>

            <div className="popup-body">
              <div className="popup-field">
                <label>Card number</label>
                <input
                  type="text"
                  name="number"
                  placeholder="8-digit number"
                  maxLength="8"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                />
                {errors.number && (
                  <span className="error-message">{errors.number}</span>
                )}
              </div>

              <div className="popup-field">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="3-digit number"
                  maxLength="3"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                />
                {errors.cvv && (
                  <span className="error-message">{errors.cvv}</span>
                )}
              </div>

              <div className="popup-input-row">
                <div className="popup-field">
                  <label>Expiration Year</label>
                  <input
                    type="text"
                    name="year"
                    placeholder="YYYY"
                    maxLength="4"
                    value={cardDetails.year}
                    onChange={handleInputChange}
                  />
                  {errors.year && (
                    <span className="error-message">{errors.year}</span>
                  )}
                </div>
                <div className="popup-field">
                  <label>Expiration Month</label>
                  <input
                    type="text"
                    name="month"
                    placeholder="MM"
                    maxLength="2"
                    value={cardDetails.month}
                    onChange={handleInputChange}
                  />
                  {errors.month && (
                    <span className="error-message">{errors.month}</span>
                  )}
                </div>
              </div>

              <button className="confirm-btn" onClick={handleConfirmPayment}>
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
