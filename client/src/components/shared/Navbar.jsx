import React, { useState, useContext } from 'react';
import './stylesheets/navbar.css';
import { FaUser } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;
  const userRole = user ? user.role : 'guest';

  console.log('Navbar user state:', { user, isLoggedIn, userRole }); 

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-brand">
          <span className="navbar-logo">📅</span>
          EventEase
        </a>
      </div>

      <div className="navbar-center-links">
        <a href="/" className="nav-link">Home</a>
        {isLoggedIn && (
          <>
            <a href="/profile" className="nav-link">Profile</a>
            {userRole === "Standard User" && (
              <a href="/bookings" className="nav-link">My Bookings</a>
            )}
            {userRole === "Organizer" && (
              <a href="/my-events" className="nav-link">My Events</a>
            )}
            {userRole === "System Admin" && (
              <a href="/admin" className="nav-link">Admin Dashboard</a>
            )}
          </>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="navbar-auth-links">
            <a href="/profile" className="profile-icon-link">
              <FaUser className="profile-icon" />
            </a>
            <button onClick={handleLogoutClick} className="navbar-logout-button">Logout</button>
          </div>
        ) : (
          <div className="navbar-auth-links">
            <a href="/register" className="navbar-register-button">Get Started</a>
          </div>
        )}
      </div>

      <div className="navbar-mobile-toggle">
        <button onClick={toggleMenu} className="menu-icon">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {isOpen && (
        <div className="navbar-mobile-menu">
          <a href="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Home</a>
          {isLoggedIn ? (
            <>
              <a href="/profile" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Profile</a>
              {userRole === "user" && (
                <a href="/bookings" className="mobile-nav-link" onClick={() => setIsOpen(false)}>My Bookings</a>
              )}
              {userRole === "Organizer" && (
                <a href="/my-events" className="mobile-nav-link" onClick={() => setIsOpen(false)}>My Events</a>
              )}
              {userRole === "System Admin" && (
                <a href="/admin" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Admin Dashboard</a>
              )}
              <button onClick={handleLogoutClick} className="mobile-logout-button">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Login</a>
              <a href="/register" className="mobile-nav-link mobile-register-button" onClick={() => setIsOpen(false)}>Register</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;