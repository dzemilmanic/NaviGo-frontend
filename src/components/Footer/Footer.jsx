import React from "react";
import {
  Truck,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
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
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-links">
              <li>
                <a href="#who-are-we">About Us</a>
              </li>
              <li>
                <a href="#features">How we work</a>
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
          <p className="footer-design">Designed by <a target="blank" href="https://github.com/dzemilmanic">Dzemil</a> & <a target="blank" href="https://github.com/ilhanbasic">Ilhan</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
