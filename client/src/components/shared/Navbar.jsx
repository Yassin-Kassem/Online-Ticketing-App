// src/components/Navbar.jsx
import React, { useState, useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import './stylesheets/navbar.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const userRole = user ? user.role : 'guest';

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm w-100 fixed-top" style={{ top: '20px' }}>
      <div className="container-fluid px-3">
      <a className="navbar-brand d-flex align-items-center" href="/">
          <span role="img" aria-label="logo" className="me-2 fs-3">📅</span>
          <strong className="text-primary fs-4">EventEase</strong>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-md-0">
            <li className="nav-item">
              <a className="nav-link fw-bold" href="/">Home</a>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <a className="nav-link fw-bold" href="/profile">Profile</a>
                </li>
                {userRole === "Standard User" && (
                  <li className="nav-item">
                    <a className="nav-link fw-bold" href="/bookings">My Bookings</a>
                  </li>
                )}
                {userRole === "Organizer" && (
                  <li className="nav-item">
                    <a className="nav-link fw-bold" href="/my-events">My Events</a>
                  </li>
                )}
                {userRole === "System Admin" && (
                  <li className="nav-item">
                    <a className="nav-link fw-bold" href="/admin">Admin Dashboard</a>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <a href="/profile" className="text-primary me-3">
                  <FaUser size={18} />
                </a>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-dark btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <a href="/register" className="btn btn-primary btn-sm">
                Get Started
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;