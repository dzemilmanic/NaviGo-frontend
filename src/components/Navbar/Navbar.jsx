import React, { useState } from 'react';
import { Menu, X, Truck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          <Truck size={32} />
          <h1>NaviGo</h1>
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        </ul>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-login" onClick={() => setIsMenuOpen(false)}>
            <User size={18} />
            Login
          </Link>
          <Link to="/register" className="navbar-register" onClick={() => setIsMenuOpen(false)}>
            Register
          </Link>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          </ul>
          <div className="navbar-mobile-actions">
            <Link to="/login" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>Login</Link>
            <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
