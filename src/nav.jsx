import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./nav.css";
import logo from "./assets/logos.png"; // Import the image from assets

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar3">
      <div className="navbar3-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
        </div>
        <div className="site-titlez">
          <h1>FISAT Forge</h1>
          <p className="subtitle">Together For Tomorrow</p>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <span className={`bar ${isOpen ? "active" : ""}`}></span>
          <span className={`bar ${isOpen ? "active" : ""}`}></span>
          <span className={`bar ${isOpen ? "active" : ""}`}></span>
        </div>

        <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">Contact</Link>
          </li>
          <li className="nav-item auth-buttons">
            <Link to="/login" className="nav-link login">Login</Link>
          </li>
          <li className="nav-item auth-buttons">
            <Link to="/admin-login" className="nav-link admin-login">Admin</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;