import React from 'react';
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import './Footer.css';

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
              Leading digital platform for logistics and transport companies in the region. 
              We connect all participants in the logistics chain through innovative technological solutions.
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
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><a href="#services">Services</a></li>
              <li><a href="#tracking">Tracking</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#api">API</a></li>
              <li><a href="#mobile">Mobile App</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#partners">Partners</a></li>
              <li><a href="#support">Support</a></li>
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
          <div className="footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;