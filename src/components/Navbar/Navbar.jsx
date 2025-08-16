import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Truck, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.firstName) {
      return user.firstName;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  // Get user role display
  const getUserRole = () => {
    if (!user) return '';
    
    switch (user.userRole) {
      case 1:
        return 'Client';
      case 2:
        return 'Company User';
      default:
        return 'User';
    }
  };

  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Truck size={32} />
            <h1>NaviGo</h1>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          <Truck size={32} />
          <h1>NaviGo</h1>
        </Link>

        <ul className="navbar-menu">
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
              <li><Link to="/shipments" onClick={() => setIsMenuOpen(false)}>Shipments</Link></li>
            </>
          )}
        </ul>

        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar-login" onClick={() => setIsMenuOpen(false)}>
                <User size={18} />
                Login
              </Link>
              <Link to="/register" className="navbar-register" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-menu-button"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                <div className="user-avatar">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="user-name">{getUserDisplayName()}</span>
                  <span className="user-role">{getUserRole()}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`chevron ${isDropdownOpen ? 'open' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="user-avatar large">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="dropdown-user-name">{getUserDisplayName()}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-menu">
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      Profile Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            {isAuthenticated && (
              <>
                <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/shipments" onClick={() => setIsMenuOpen(false)}>Shipments</Link></li>
              </>
            )}
          </ul>
          
          <div className="navbar-mobile-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            ) : (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="mobile-user-name">{getUserDisplayName()}</div>
                    <div className="mobile-user-email">{user.email}</div>
                  </div>
                </div>
                
                <div className="mobile-user-actions">
                  <Link
                    to="/profile"
                    className="btn btn-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;