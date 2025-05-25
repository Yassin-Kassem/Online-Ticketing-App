import React from 'react';
import '../../pages/stylesheets/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer() {
    return (
        <footer className="footer py-5 bg-dark text-white-50">
  <div className="about-container">
    <div className="row">
      {/* Brand Info */}
      <div className="col-md-4 mb-4 mb-md-0">
        <h5 className="text-white">EventEase</h5>
        <p>Your one-stop platform for discovering and booking events effortlessly.</p>
      </div>
      {/* Quick Links */}
      <div className="col-md-4 mb-4 mb-md-0">
        <h5 className="text-white">Quick Links</h5>
        <ul className="list-unstyled">
          <li><a href="#" className="text-white-50">About Us</a></li>
          <li><a href="#" className="text-white-50">Contact</a></li>
          <li><a href="#" className="text-white-50">Events</a></li>
        </ul>
      </div>
      {/* Social Media */}
      <div className="col-md-4">
        <h5 className="text-white">Follow Us</h5>
        <ul className="list-unstyled list-inline social-icons">
          <li className="list-inline-item"><a href="#"><i className="fab fa-facebook-f"></i></a></li>
          <li className="list-inline-item"><a href="#"><i className="fab fa-twitter"></i></a></li>
          <li className="list-inline-item"><a href="https://www.instagram.com/yusefothman_?igsh=cTZ6Z3JqejV2eXBo"><i className="fab fa-instagram"></i></a></li>
        </ul>
      </div>
    </div>
    <hr className="bg-secondary"/>
    <div className="row">
      <div className="col text-center">
        <small>Copyright &copy; EventEase 2023</small>
      </div>
    </div>
  </div>
</footer>
    )
};

