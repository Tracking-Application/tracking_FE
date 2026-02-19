import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "../../style/common/Login.css";
import { loginUser } from "../../slice/common/loginSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFormMessage("");
    setFormMessageType("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    setIsSubmitting(true);
    const resultAction = await dispatch(loginUser(payload));
    setIsSubmitting(false);

    if (loginUser.fulfilled.match(resultAction)) {
      const { role: apiRole, userId, raw } = resultAction.payload;
      
      // Temporary debug alert
      if (!userId) {
        alert(`Login Debug: UserID missing! Keys: ${Object.keys(raw || {}).join(", ")} | Raw: ${JSON.stringify(raw)}`);
      }
      
      // Store minimal session marker
      localStorage.setItem("token", "session-active");

      setFormMessage("Login successful");
      setFormMessageType("success");

      setTimeout(() => {
        if (apiRole === "admin") {
          navigate(`/admin/${userId}/home`);
        } else if (userId) {
          navigate(`/user/${userId}/home`);
        } else {
          // Fallback if ID is inexplicably missing but login succeeded
          console.error("Login succeeded but UserID is missing");
          navigate("/"); 
        }
      }, 1000);
    } else {
      setFormMessage(resultAction.payload || "Login failed");
      setFormMessageType("error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-logo-container">
          <div className="login-logo-box">B</div>
        </div>
        <h2 className="login-title">Account Login</h2>
        <p className="login-subtitle">
          Or{" "}
          <Link to="/" className="link-emerald">
            go back to home
          </Link>
        </p>
      </div>

      <div className="login-form-container">
        <div className="login-form-card">
          <form className="login-form" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input"
                  placeholder="Enter Email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input"
                  placeholder="********"
                />
              </div>
            </div>

            <div className="submit-row">
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Sign in"}
              </button>
            </div>

            {formMessage && (
              <p
                className={`form-status ${
                  formMessageType === "success"
                    ? "form-status-success"
                    : "form-status-error"
                }`}
              >
                {formMessage}
              </p>
            )}
          </form>

          <div className="divider-container">
            <div className="divider-line-box">
              <div className="divider-line"></div>
            </div>
            <div className="divider-label-box">
              <span className="divider-text">Don't have an account?</span>
            </div>
          </div>

          <div className="secondary-action-wrapper">
            <button
              onClick={() => navigate("/register")}
              className="btn-secondary-full"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


