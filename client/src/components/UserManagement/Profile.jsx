import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/api";
import "./Profile.css"; // Import the CSS file

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        setUser(res.data || res);
        setLoading(false);
      })
      .catch((err) => {
        setMessage("Failed to load profile.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You should create an updateProfile method in your api.js for this
    // For now, you can use fetch or axios directly if you don't have it:
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-large">
            {user.name ? user.name[0].toUpperCase() : "?"}
            <div className="status-badge"></div>
          </div>
          <div className="profile-meta">
            <h2 className="profile-name">{user.name || "Guest User"}</h2>
            <p className="profile-email">{user.email || "No email set"}</p>
          </div>
          <div className="profile-actions">
            {!editing && (
              <button
                className="edit-button-primary"
                onClick={() => setEditing(true)}
              >
                <i className="fas fa-edit"></i>
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-header">
            <h1>Profile Settings</h1>
            {message && <div className="message">{message}</div>}
          </div>

          {!editing ? (
            <div className="profile-details">
              <div className="details-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="details-grid">
                  <div className="info-card">
                    <div className="info-card-header">
                      <i className="fas fa-user"></i>
                      <span>Name</span>
                    </div>
                    <div className="info-card-content">
                      {user.name || "Not available"}
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-card-header">
                      <i className="fas fa-envelope"></i>
                      <span>Email</span>
                    </div>
                    <div className="info-card-content">
                      {user.email || "Not available"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="edit-section">
              <form className="profile-form edit-mode" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3 className="section-title">Edit Profile</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">
                        <i className="fas fa-user"></i>
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name || ""}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="glass-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">
                        <i className="fas fa-envelope"></i>
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email || ""}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        className="glass-input"
                      />
                    </div>
                  </div>
                  <div className="button-group">
                    <button type="submit" className="save-button">
                      <i className="fas fa-check"></i>
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setEditing(false)}
                    >
                      <i className="fas fa-times"></i>
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
