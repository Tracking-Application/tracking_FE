import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../slice/user/userHomeSlice";
import { clearLoginState } from "../../slice/common/loginSlice";
import "../../style/user/UserHome.css";

const DEFAULT_BOOK_IMAGE = "/book-cover.svg";
const getCartKey = (userId) => (userId ? `cartItems_${userId}` : null);

const UserHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.userHome);
  const { userId } = useSelector((state) => state.login);
  const cartStorageKey = getCartKey(userId);

  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (!cartStorageKey) {
      setCartCount(0);
      return;
    }
    try {
      const storedItems =
        JSON.parse(localStorage.getItem(cartStorageKey)) || [];
      const count = storedItems.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0,
      );
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, [cartStorageKey]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const customerName = (() => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      return currentUser?.name || "Customer";
    } catch {
      return "Customer";
    }
  })();

  const handleSignOut = () => {
    dispatch(clearLoginState());
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleQuantityChange = (bookId, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [bookId]: Math.max(1, (prev[bookId] || 1) + amount),
    }));
  };

  const addToCart = (book, quantity) => {
    if (quantity <= 0) return;
    if (!cartStorageKey) {
      alert("Please login to add items to cart.");
      return;
    }
    let cartItems = [];
    try {
      cartItems = JSON.parse(localStorage.getItem(cartStorageKey)) || [];
    } catch {
      cartItems = [];
    }

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === book.id,
    );
    if (existingItemIndex >= 0) {
      const currentQty = Number(cartItems[existingItemIndex].quantity) || 0;
      cartItems[existingItemIndex].quantity = currentQty + quantity;
    } else {
      cartItems.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: Number(book.price),
        image: book.image_url || DEFAULT_BOOK_IMAGE,
        quantity,
      });
    }

    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    const nextCount = cartItems.reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0,
    );
    setCartCount(nextCount);
    setQuantities((prev) => ({ ...prev, [book.id]: 1 }));
  };

  return (
    <div className="user-home-container">
      {/* ORIGINAL NAVBAR START */}
      <nav className="user-navbar">
        <div className="nav-max-width">
          <div className="nav-flex">
            <div
              className="nav-logo-section"
              onClick={() => navigate(`/user/${userId}/home`)}
            >
              <div className="nav-logo-box">B</div>
              <span className="nav-logo-text">BookShelf</span>
            </div>

            <div className="nav-actions">
              <button
                onClick={() => navigate(`/user/${userId}/orders`)}
                className="icon-btn"
                title="My Orders"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "1.5rem", width: "1.5rem" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002 2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </button>

              <button
                onClick={() => navigate(`/user/${userId}/profile`)}
                className="icon-btn"
                title="Profile"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "1.5rem", width: "1.5rem" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              <button
                className="icon-btn"
                title="Cart"
                onClick={() => navigate(`/user/${userId}/cart`)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "1.5rem", width: "1.5rem" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>

              <button onClick={handleSignOut} className="btn-signout">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "1rem", width: "1rem" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* ORIGINAL NAVBAR END */}

      <main className="user-main">
        <header className="main-header">
          <h1 className="main-title">Welcome, {customerName}</h1>
          <p className="main-subtitle">
            Discover your next favorite book today.
          </p>
        </header>

        {loading && <div className="status-msg">Loading...</div>}
        {error && (
          <div className="status-msg error">Error: {error.message}</div>
        )}

        {!loading && !error && (
          <div className="books-grid">
            {products.map((book) => (
              <div key={book.id} className="book-card">
                <div
                  className="book-image-container"
                  onClick={() => navigate(`/user/${userId}/product/${book.id}`)}
                >
                  <img
                    src={book.image_url || DEFAULT_BOOK_IMAGE}
                    alt={book.title}
                    className="book-image"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_BOOK_IMAGE;
                    }}
                  />
                </div>

                <div className="book-details">
                  <div className="book-info-row">
                    <div
                      className="book-text"
                      onClick={() =>
                        navigate(`/user/${userId}/product/${book.id}`)
                      }
                    >
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                    </div>
                    {/* Qty button shifted lower */}
                    <div className="quantity-selector">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(book.id, -1);
                        }}
                      >
                        −
                      </button>
                      <span>{quantities[book.id] || 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(book.id, 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="book-footer">
                    <span className="book-price">₹{book.price}</span>
                    <button
                      className="btn-add-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book, quantities[book.id] || 1);
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserHome;
