import React, { useState, useRef, useEffect } from "react";
import {
  Truck,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ChevronDown,
} from "lucide-react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Social media profiles data
  const socialProfiles = {
    facebook: {
      dzemil: "https://facebook.com/dzemilmanic",
      ilhan: "https://facebook.com/ilhan.basic.102"
    },
    github: {
      dzemil: "https://github.com/dzemilmanic",
      ilhan: "https://github.com/ilhanbasic"
    },
    instagram: {
      dzemil: "https://instagram.com/dzemilmanic",
      ilhan: "https://instagram.com/ilhanbasic"
    },
    linkedin: {
      dzemil: "https://linkedin.com/in/dzemilmanic",
      ilhan: "https://linkedin.com/in/ilhan-basic"
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSocialClick = (platform, e) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === platform ? null : platform);
  };

  const handleProfileClick = (url) => {
    window.open(url, "_blank");
    setActiveDropdown(null);
  };

  const renderSocialLink = (platform, Icon) => (
    <div className="social-dropdown" ref={dropdownRef}>
      <button
        className={`social-link ${activeDropdown === platform ? 'active' : ''}`}
        onClick={(e) => handleSocialClick(platform, e)}
        aria-label={`${platform} profiles`}
      >
        <Icon size={20} />
        <ChevronDown size={14} className="dropdown-icon" />
      </button>
      
      {activeDropdown === platform && (
        <div className="dropdown-menu">
          <button
            className="dropdown-item"
            onMouseDown={(e) => {
              e.preventDefault();
              handleProfileClick(socialProfiles[platform].dzemil);
            }}
          >
            <span className="profile-name">Džemil</span>
            <span className="profile-username">@dzemilmanic</span>
          </button>
          <button
            className="dropdown-item"
            onMouseDown={(e) => {
              e.preventDefault();
              handleProfileClick(socialProfiles[platform].ilhan);
            }}
          >
            <span className="profile-name">Ilhan</span>
            <span className="profile-username">@ilhanbasic</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Truck size={32} />
              <h3>NaviGo</h3>
            </div>
            <p className="footer-description">
              Leading digital platform for logistics and transport companies in
              the region. We connect all participants in the logistics chain
              through innovative technological solutions.
            </p>
            <div className="footer-social">
              {renderSocialLink('facebook', Facebook)}
              {renderSocialLink('github', Github)}
              {renderSocialLink('instagram', Instagram)}
              {renderSocialLink('linkedin', Linkedin)}
            </div>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-links">
              <li>
                <a href="#who-are-we">About Us</a>
              </li>
              <li>
                <a href="#how-we-work">How we work</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies">Cookies</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <div className="footer-contact-info">
              <div className="contact-item">
                <MapPin size={18} />
                <span>Belgrade, Knez Mihailova 42</span>
              </div>
              <div className="contact-item">
                <Phone size={18} />
                <span>+381 11 123 4567</span>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <span>info@navigo.rs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 NaviGo. All rights reserved.
          </p>
          <p className="footer-design">
            Designed by{" "}
            <a target="_blank" href="https://github.com/dzemilmanic" rel="noopener noreferrer">
              Džemil
            </a>{" "}
            &{" "}
            <a target="_blank" href="https://github.com/ilhanbasic" rel="noopener noreferrer">
              Ilhan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;