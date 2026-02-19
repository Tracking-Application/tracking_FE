import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../../slice/user/productDetailsSlice";
import "../../style/user/ProductDetails.css";

const getCartKey = (userId) => (userId ? `cartItems_${userId}` : null);
const DEFAULT_BOOK_IMAGE = "/book-cover.svg";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { userId } = useSelector((state) => state.login);
  const cartStorageKey = getCartKey(userId);


  const [quantity, setQuantity] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const addToCart = (productToAdd, quantity) => {
    if (!productToAdd) return;

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
      (item) => item.id === productToAdd.id
    );

    if (existingItemIndex >= 0) {
      const currentQty = Number(cartItems[existingItemIndex].quantity) || 0;
      cartItems[existingItemIndex].quantity = currentQty + quantity;
    } else {
      cartItems.push({
        id: productToAdd.id,
        title: productToAdd.title,
        author: productToAdd.author,
        price: Number(productToAdd.price),
        image: productToAdd.image_url || DEFAULT_BOOK_IMAGE,
        quantity,
      });
    }

    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    setQuantity(1);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error fetching product details.</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-details-page">
      {showSuccessMessage && (
        <div className="success-message">Product added to cart!</div>
      )}
      <button onClick={() => navigate(-1)} className="back-btn">
        &larr; Back
      </button>
      <div className="product-details-shell">
        <div className="details-left">
          <img
            src={product.image_url}
            alt={product.title}
            className="main-image"
          />
        </div>
        <div className="details-right">
          <h1>{product.title}</h1>
          <p className="author">by {product.author}</p>
          <p className="price">₹{product.price}</p>
          <p className="description">{product.description}</p>
          <div className="add-to-cart-section">
            <div className="quantity-modifier">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <button
              onClick={() => addToCart(product, quantity)}
              className="add-btn"
            >
              Add to Cart
            </button>
          </div>
          <div className="reviews">
            <h3>Reviews</h3>
            <p>No reviews yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
