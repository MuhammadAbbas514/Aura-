import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaProductHunt, FaShoppingCart, FaSignInAlt, FaBoxOpen, FaAward } from 'react-icons/fa'; // Importing icons
import SearchBar from './SearchBar';

const Navbar = ({ onSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navbar">
      <h1 className="brand-name">Aura+</h1>
      <SearchBar onSearch={onSearch} />
      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="navbar-btn" onClick={() => setMenuOpen(false)}>
          <FaHome title="Home" />
          <span>Home</span>
        </Link>
        <Link to="/aboutus" className="navbar-btn" onClick={() => setMenuOpen(false)}>
          <FaInfoCircle title="About Us" />
          <span>About Us</span>
        </Link>
        <Link to="/products" className="navbar-btn" onClick={() => setMenuOpen(false)}>
          <FaProductHunt title="Products" />
          <span>Products</span>
        </Link>
        <Link to="/my-orders" className="navbar-btn" onClick={() => setMenuOpen(false)}>
          <FaBoxOpen title="My Orders" />
          <span>My Orders</span>
        </Link>
        <Link to="/login" className="navbar-btn" onClick={() => setMenuOpen(false)}>
          <FaSignInAlt title="Login" />
          <span>Login</span>
        </Link>
        <Link to="/cart" className="navbar-btn" onClick={() => setMenuOpen(false)}>
          <FaShoppingCart title="Cart" />
          <span>Cart</span>
        </Link>
        <Link to="/favorites" className="navbar-btn" onClick={() => setMenuOpen(false)}>
          <FaAward title="Favorites" />
          <span>Favorites</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
