import React from 'react';
import './stylesheets/loader.css'

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      {/* Spinner */}
      <div className="custom-loader-spinner mb-3"></div>

      {/* Loader Text */}
      <p className="text-muted fs-5">{text}</p>
    </div>
  );
};

export default Loader;