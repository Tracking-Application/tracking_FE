import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../style/user/Cart.css";

const getCartKey = (userId) => (userId ? `cartItems_${userId}` : null);
const FALLBACK_IMAGE = "/book-cover.svg";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const { userId } = useSelector((state) => state.login);
  const cartStorageKey = getCartKey(userId);

  useEffect(() => {
    if (!cartStorageKey) {
      setCartItems([]);
      return;
    }
    try {
      const storedItems = JSON.parse(localStorage.getItem(cartStorageKey)) || [];
      setCartItems(storedItems);
    } catch {
      setCartItems([]);
    }
  }, [cartStorageKey]);

  const persistItems = (items) => {
    if (!cartStorageKey) return;
    setCartItems(items);
    localStorage.setItem(cartStorageKey, JSON.stringify(items));
  };

  const increaseQty = (itemId) => {
    const updatedItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
        : item,
    );
    persistItems(updatedItems);
  };

  const decreaseQty = (itemId) => {
    const updatedItems = cartItems
      .map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max((Number(item.quantity) || 1) - 1, 0) }
          : item,
      )
      .filter((item) => (Number(item.quantity) || 0) > 0);
    persistItems(updatedItems);
  };

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    persistItems(updatedItems);
  };

  const clearCart = () => {
    persistItems([]);
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0,
      ),
    [cartItems],
  );

  const totalItems = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cartItems],
  );

  return (
    <div className="cart-page">
      <div className="cart-shell">
        <header className="cart-header">
          <button className="cart-back-btn" onClick={() => navigate(`/user/${userId}/home`)}>
            Back
          </button>
          <h1 className="cart-title">My Cart</h1>
          {cartItems.length > 0 ? (
            <button className="cart-clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          ) : (
            <span className="cart-header-placeholder" />
          )}
        </header>

        {cartItems.length === 0 ? (
          <section className="cart-empty">
            <h2>No products in cart</h2>
            <p>Add books from home page to view them here.</p>
            <button
              className="cart-shop-btn"
              onClick={() => navigate(`/user/${userId}/home`)}
            >
              Continue Shopping
            </button>
          </section>
        ) : (
          <div className="cart-grid">
            <section className="cart-items">
              {cartItems.map((item) => (
                <article key={item.id} className="cart-item-card">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title}
                    className="cart-item-image"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="cart-item-content">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-author">{item.author}</p>
                    <p className="cart-item-price">₹{Number(item.price).toFixed(2)}</p>
                  </div>

                  <div className="cart-item-actions">
                    {/* <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQty(item.id)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="qty-value">{Number(item.quantity) || 0}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQty(item.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div> */}
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" type="button" onClick={() => navigate(`/user/${userId}/checkout`)}>
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
