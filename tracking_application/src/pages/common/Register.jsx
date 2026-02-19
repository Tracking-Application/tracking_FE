import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/common/Register.css";
import registerAPI from "../../api/common/registerAPI";

const backendFieldToFormField = {
  name: "name",
  email: "email",
  phone: "phone",
  password: "password",
  admin_secret: "adminCode",
};

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  const onInputChange = (event) => {
    const { name } = event.target;
    if (!name) return;

    setFieldErrors((prev) => ({ ...prev, [name]: "" }));

    if (formMessageType === "error") {
      setFormMessage("");
      setFormMessageType("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setFieldErrors({});
    setFormMessage("");
    setFormMessageType("");

    const formData = new FormData(e.currentTarget);
    const phoneValue = String(formData.get("phone") || "").trim();
    const emailValue = String(formData.get("email") || "").trim();

    // 1. Client-side Phone Validation
    if (role === "user") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneValue)) {
        setFieldErrors({ phone: "Phone number must be exactly 10 digits." });
        return;
      }
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: emailValue,
      password: String(formData.get("password") || ""),
      role,
    };

    if (role === "user") payload.phone = phoneValue;
    if (role === "admin") payload.adminCode = String(formData.get("adminCode") || "");

    try {
      setIsSubmitting(true);
      const response = await registerAPI(payload);
      setFormMessage(response?.message || "Registered successfully");
      setFormMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      const genericMessage = error?.response?.data?.message || "";
      const nextFieldErrors = {};

      // 2. Handle Backend Validation Arrays (Pydantic/FastAPI style)
      if (Array.isArray(detail)) {
        detail.forEach((item) => {
          const backendKey = item?.loc?.[item.loc.length - 1];
          const formField = backendFieldToFormField[backendKey];
          if (formField) {
            nextFieldErrors[formField] = item?.msg || "Invalid value";
          }
        });
      } 
      // 3. Handle "Email already exists" specific string errors
      else if (typeof detail === "string" && detail.toLowerCase().includes("email")) {
        nextFieldErrors.email = detail;
      } 
      else if (genericMessage.toLowerCase().includes("email")) {
        nextFieldErrors.email = genericMessage;
      }

      setFieldErrors(nextFieldErrors);
      setFormMessageType("error");
      
      // If the error wasn't caught by a specific field, show it at the bottom
      if (Object.keys(nextFieldErrors).length === 0) {
        setFormMessage(detail || genericMessage || "Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-header">
        <div className="register-logo-container">
          <div className="register-logo-box">B</div>
        </div>
        <h2 className="register-title">
          {role === "admin" ? "Admin Registration" : "User Registration"}
        </h2>
        <p className="register-subtitle">
          Or <Link to="/" className="link-emerald">go back to home</Link>
        </p>
      </div>

      <div className="register-form-container">
        <div className="register-form-card">
          <div className="role-selection">
            <button
              type="button"
              className={`btn-role ${role === "user" ? "active" : ""}`}
              onClick={() => { setRole("user"); setFieldErrors({}); setFormMessage(""); }}
            >
              User
            </button>
            <button
              type="button"
              className={`btn-role ${role === "admin" ? "active" : ""}`}
              onClick={() => { setRole("admin"); setFieldErrors({}); setFormMessage(""); }}
            >
              Admin
            </button>
          </div>

          <form className="register-form" onSubmit={handleRegister}>
            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`form-input ${fieldErrors.name ? "form-input-error" : ""}`}
                  placeholder="Enter Name"
                  onChange={onInputChange}
                />
              </div>
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>

            {/* Email Field (Error will show here) */}
            <div>
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`form-input ${fieldErrors.email ? "form-input-error" : ""}`}
                  placeholder="Enter Email"
                  onChange={onInputChange}
                />
              </div>
              {fieldErrors.email && <p className="field-error" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>{fieldErrors.email}</p>}
            </div>

            {/* Phone Field */}
            {role === "user" && (
              <div>
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength="10"
                    className={`form-input ${fieldErrors.phone ? "form-input-error" : ""}`}
                    placeholder="1234567890"
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      onInputChange(e);
                    }}
                  />
                </div>
                {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
              </div>
            )}

            {/* Admin Secret Code */}
            {role === "admin" && (
              <div>
                <label htmlFor="adminCode" className="form-label">Admin Secret Code</label>
                <div className="input-wrapper">
                  <input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    required
                    className={`form-input ${fieldErrors.adminCode ? "form-input-error" : ""}`}
                    placeholder="Enter admin secret"
                    onChange={onInputChange}
                  />
                </div>
                {fieldErrors.adminCode && <p className="field-error">{fieldErrors.adminCode}</p>}
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`form-input ${fieldErrors.password ? "form-input-error" : ""}`}
                  placeholder="********"
                  onChange={onInputChange}
                />
              </div>
              {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
            </div>

            {/* <div className="terms-container">
              <input id="terms" name="terms" type="checkbox" required className="form-checkbox" />
              <label htmlFor="terms" className="terms-label">
                I agree to the <a href="#" className="link-emerald">Terms</a> and <a href="#" className="link-emerald">Privacy Policy</a>
              </label>
            </div> */}

            <div>
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : role === "admin" ? "Register as Admin" : "Sign up"}
              </button>
            </div>

            {formMessage && (
              <p className={`form-status ${formMessageType === "success" ? "form-status-success" : "form-status-error"}`}>
                {formMessage}
              </p>
            )}
          </form>

          <div className="divider-container">
            <div className="divider-line-box"><div className="divider-line"></div></div>
            <div className="divider-label-box"><span className="divider-text">Already have an account?</span></div>
          </div>

          <div className="secondary-action-wrapper">
            <button onClick={() => navigate("/login")} className="btn-secondary-full">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
