import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProfileMessage,
  fetchProfile,
  updateProfile,
} from "../../slice/user/profileSlice";
import "../../style/user/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading, updating, error, successMessage } = useSelector(
    (state) => state.profile,
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    if (currentUser?.userId) {
      dispatch(fetchProfile(currentUser.userId));
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...currentUser,
          ...profile,
          userId: profile.id || currentUser.userId,
        }),
      );
    }
  }, [profile, currentUser]);

  useEffect(() => {
    return () => {
      dispatch(clearProfileMessage());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      dispatch(clearProfileMessage());
    }, 2000);

    return () => clearTimeout(timer);
  }, [successMessage, dispatch]);

  const initials = useMemo(() => {
    const name = formData.name || "User";
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length === 0) return "U";
    if (words.length === 1) return words[0][0].toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }, [formData.name]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      if (phoneError) setPhoneError("");
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!currentUser?.userId) return;

    if (!/^\d{10}$/.test(formData.phone)) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }

    const result = await dispatch(
      updateProfile({
        userId: currentUser.userId,
        payload: {
          name: formData.name,
          phone: formData.phone,
        },
      }),
    );

    if (!result.error) {
      setIsEditMode(false);
      setPhoneError("");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <header className="profile-topbar">
          <button
            className="profile-back-btn"
            onClick={() => navigate(`/user/${currentUser?.userId}/home`)}
          >
            Back
          </button>
          <h1 className="profile-page-title">My Profile</h1>
        </header>

        <section className="profile-card">
          <div className="profile-hero">
            <div className="profile-avatar">{initials}</div>
            <div>
              <h2 className="profile-name">{formData.name || "User"}</h2>
              <p className="profile-role">{String(profile?.role || "customer").toUpperCase()}</p>
            </div>
            <button
              className="profile-edit-btn"
              onClick={() => {
                setIsEditMode((prev) => !prev);
                setPhoneError("");
              }}
              type="button"
              title={isEditMode ? "Cancel edit" : "Edit profile"}
              aria-label={isEditMode ? "Cancel edit" : "Edit profile"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="profile-edit-icon"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>
          </div>

          {loading ? <p className="profile-loading">Loading profile...</p> : null}
          {error ? <p className="profile-status profile-status-error">{error}</p> : null}
          {successMessage ? (
            <p className="profile-status profile-status-success">{successMessage}</p>
          ) : null}

          <div className="profile-details-grid">
            <article className="profile-detail-item">
              <p className="profile-label">Name</p>
              {isEditMode ? (
                <input
                  className="profile-input profile-input-compact"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <p className="profile-value">{formData.name || "-"}</p>
              )}
            </article>

            <article className="profile-detail-item">
              <p className="profile-label">Email</p>
              <p className="profile-value">{formData.email || "-"}</p>
            </article>

            <article className="profile-detail-item detail-wide">
              <p className="profile-label">Phone</p>
              {isEditMode ? (
                <>
                  <input
                    className="profile-input profile-input-compact"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    inputMode="numeric"
                  />
                  {phoneError ? <p className="profile-field-error">{phoneError}</p> : null}
                </>
              ) : (
                <p className="profile-value">{formData.phone || "-"}</p>
              )}
            </article>
          </div>

          {isEditMode ? (
            <div className="profile-actions">
              <button
                className="profile-save-btn"
                type="button"
                onClick={handleUpdate}
                disabled={updating}
              >
                {updating ? "Saving..." : "Update Profile"}
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default Profile;

