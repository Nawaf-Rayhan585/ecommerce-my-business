import React from 'react';
import { FiShoppingCart, FiHeart, FiSearch } from 'react-icons/fi';
import '../../assets/css/appnavbar.css';

const AppNavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>
          {/* You can add a logo icon here if you want */}
          EduLord
        </h1>
      </div>
      
      <div className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/products" className="nav-link">Products</a>
        <a href="/features" className="nav-link">Features</a>
        <a href="/about" className="nav-link">About</a>

        <a href="/products" className="nav-link btn-link">Login</a>
        <a href="/features" className="nav-link btn-link">Sign Up</a>
        <a href="/about" className="nav-link btn-link">Language</a>
      </div>

      

      <div className="nav-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search"
        />
        <button className="search-btn">
          <FiSearch />
        </button>
      </div>

      <div className="nav-icons">
        <div className="icon-container">
          <FiHeart className="nav-icon" />
          <span className="notification-pill">0</span>
        </div>
        <div className="icon-container">
          <FiShoppingCart className="nav-icon" />
          <span className="notification-pill">0</span>
        </div>
      </div>
    </nav>
  );
};

export default AppNavBar;
