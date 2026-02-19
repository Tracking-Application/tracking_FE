import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../style/user/Checkout.css";

const getCartKey = (userId) => (userId ? `cartItems_${userId}` : null);
const FALLBACK_IMAGE = "/book-cover.svg";

const Checkout = () => {
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.login);
  const cartStorageKey = getCartKey(userId);

  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
  });
  const [errors, setErrors] = useState({
    address: "",
    city: "",
    state: "",
  });

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!cartStorageKey) {
      setCartItems([]);
      return;
    }
    try {
      const storedItems =
        JSON.parse(localStorage.getItem(cartStorageKey)) || [];
      setCartItems(storedItems);
    } catch {
      setCartItems([]);
    }
  }, [cartStorageKey]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [cartItems]
  );

  const handleContinue = () => {
    const newErrors = {
      address: "",
      city: "",
      state: "",
    };
    let isValid = true;

    if (!shippingInfo.address) {
      newErrors.address = "Address is required";
      isValid = false;
    }
    if (!shippingInfo.city) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!shippingInfo.state) {
      newErrors.state = "State is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      navigate(`/user/${userId}/payment`, {
        state: {
          shippingInfo,
          cartItems,
          subtotal,
        },
      });
    }
  };

  return (
    <div className="checkout-container">
      <header className="checkout-header">
        <h1 className="logo">BookShelf</h1>
      </header>

      <main className="checkout-main">
        <button className="back-btn" onClick={() => navigate(`/user/${userId}/cart`)}>
          ← Back to cart
        </button>
        <h2 className="page-title">Checkout</h2>

        <div className="checkout-grid">
          <section className="card">
            <h3>Shipping Info</h3>
            <div className="input-group">
              <input
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleShippingInfoChange}
                placeholder="Address"
              />
              {errors.address && <p className="error-message">{errors.address}</p>}
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleShippingInfoChange}
                placeholder="City"
              />
              {errors.city && <p className="error-message">{errors.city}</p>}
              <input
                type="text"
                name="state"
                value={shippingInfo.state}
                onChange={handleShippingInfoChange}
                placeholder="State"
              />
              {errors.state && <p className="error-message">{errors.state}</p>}
            </div>
          </section>

          <section className="card">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div className="item-row" key={item.id}>
                <div className="item-details">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    className="item-img"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div>
                    <p className="item-name">
                      {item.title}
                    </p>
                    <p className="item-price">₹{Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
                <span className="item-qty">x{item.quantity}</span>
              </div>
            ))}
            <div className="total-row">
              <strong>Total: ₹{subtotal.toFixed(2)}</strong>
            </div>
          </section>
        </div>

        <div className="button-wrapper">
          <button
            className="continue-btn"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
};

export default Checkout;