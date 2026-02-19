import React, { useState } from "react";
import "../../style/admin/Reviews.css";

const Reviews = () => {
  // Mock data for display - extracted from AdminHome
  const [reviews] = useState([
    {
      id: 1,
      user: "John Doe",
      product: "React Mastery",
      rating: 5,
      comment: "Great book!",
    },
    {
      id: 2,
      user: "Jane Smith",
      product: "Tailwind Guide",
      rating: 4,
      comment: "Very helpful.",
    },
  ]);

  return (
    <div className="reviews-page-container">
      <div className="beta-emblem-banner">
        <div className="beta-emblem-content">
          <span className="beta-icon">✨</span>
          <div className="beta-text">
            <h3>BETA PREVIEW</h3>
            <p>Upcoming Feature: Customer Reviews & Ratings</p>
          </div>
          <span className="beta-badge">Golden Beta</span>
        </div>
      </div>

      {/* <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <h4 className="review-product">{review.product}</h4>
              <span className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
            </div>
            <p className="review-comment">"{review.comment}"</p>
            <p className="review-user">By {review.user}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Reviews;
