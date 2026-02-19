import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/common/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo-section">
              <div className="logo-box">B</div>
              <span className="logo-text">BookShelf</span>
            </div>

            {/* <div className="nav-links">
              <a href="#" className="nav-link">
                Browse
              </a>
              <a href="#" className="nav-link">
                Categories
              </a>
              <a href="#" className="nav-link">
                Deals
              </a>
            </div> */}

            <div className="nav-actions">
              <button onClick={() => navigate("/login")} className="btn-signin">
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn-signup"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="hero-section">
          <div className="hero-container">
            <div className="hero-grid">
              <div>
                <h1 className="hero-title">
                  Discover Your Next <br />
                  <span className="hero-highlight">Great Story</span>
                </h1>
                <p className="hero-description">
                  Explore thousands of books from bestsellers to rare finds.
                  Start your reading journey today with our curated collections.
                </p>
                <div className="hero-btns">
                  {/* <button className="btn-primary">Explore Books</button> */}
                  <button
                    onClick={() => navigate("/register")}
                    className="btn-secondary"
                  >
                    Get Started
                  </button>
                </div>
              </div>

              <div className="hero-image-container">
                <div className="hero-image-box">
                  <div className="hero-image-text">BOOKS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo-section">
              <div className="footer-logo">
                <div className="footer-logo-box">B</div>
                <span className="footer-logo-text">BookShelf</span>
              </div>
              <p className="footer-desc">
                The best place to find your favorite books online.
              </p>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">
                Privacy
              </a>
              <a href="#" className="footer-link">
                Terms
              </a>
              <a href="#" className="footer-link">
                Contact
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 BookShelf E-Commerce. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
