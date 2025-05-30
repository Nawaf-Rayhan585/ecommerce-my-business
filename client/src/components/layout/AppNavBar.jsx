import React, { useState } from 'react';
import { FiShoppingCart, FiHeart, FiSearch, FiChevronDown } from 'react-icons/fi';
import '../../assets/css/appnavbar.css';
import logo from '../../assets/images/logo.png'; // Adjust the path as necessary

const AppNavBar = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setLangOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>
          Shukr
        </h1>
      </div>
      
      <div className="nav-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/products" className="nav-link">Products</a>
        <a href="/features" className="nav-link">Features</a>
        <a href="/about" className="nav-link">About</a>
      </div>

      <div className="nav-menu-buttons">
        <button className="menu-btn">Login</button>
        <button className="menu-btn signup-btn">Sign Up</button>
        <div
          className={`lang-dropdown${langOpen ? ' open' : ''}`}
          tabIndex={0}
          onBlur={() => setLangOpen(false)}
        >
          <button
            className="menu-btn lang-btn"
            onClick={() => setLangOpen((prev) => !prev)}
          >
            {selectedLang}
            <FiChevronDown className="lang-arrow" />
          </button>
          {langOpen && (
            <div className="lang-options">
              <div
                className={`lang-option${selectedLang === 'English' ? ' selected' : ''}`}
                onMouseDown={() => handleLangSelect('English')}
              >
                English
              </div>
              <div
                className={`lang-option${selectedLang === 'Bangla' ? ' selected' : ''}`}
                onMouseDown={() => handleLangSelect('Bangla')}
              >
                Bangla
              </div>
            </div>
          )}
        </div>
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
