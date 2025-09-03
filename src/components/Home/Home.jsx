import React from 'react';
import { Link } from "react-router-dom";
import SupportChat from "../SupportChat/SupportChat";
import { ArrowRight, Truck, Users, BarChart3 } from 'lucide-react';
import './Home.css';
import logo from "../../assets/logo.png";

const Home = () => {
  return (
    <>
    <div className="home-page">
      {/* Hero Section with Video */}
      <section className="home-hero-section">
        <video
          className="home-hero-video"
          autoPlay
          muted
          loop
          playsInline
          src="https://videos.pexels.com/video-files/5200378/5200378-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
        
        <div className="home-hero-overlay"></div>
        
        <div className="home-container">
          <h1 className="home-hero-title">
            Digital Platform for
            <span className="home-hero-highlight">Logistics & Transport</span>
          </h1>
          <p className="home-hero-subtitle">
            NaviGo connects transport companies, freight forwarders and clients through one powerful platform. 
            Manage transport, track shipments and communicate transparently.
          </p>
          
          <div className="home-hero-actions">
            <Link to="/register" className="btn btn-primary">
               Get Started Now <ArrowRight size={20} />
            </Link>
            <a href="#who-are-we" className="btn btn-secondary">
              Learn More
            </a>
          </div>

          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <h3 className="home-hero-stat-number">500+</h3>
              <p className="home-hero-stat-label">Transport Companies</p>
            </div>
            <div className="home-hero-stat">
              <h3 className="home-hero-stat-number">15k+</h3>
              <p className="home-hero-stat-label">Successful Deliveries</p>
            </div>
            <div className="home-hero-stat">
              <h3 className="home-hero-stat-number">24/7</h3>
              <p className="home-hero-stat-label">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section */}
      <section id="who-are-we" className="home-who-section">
        <div className="home-container">
          <div className="home-intro-section">
            <h2 className="home-logo-title">
              Who are
              <img src={logo} alt="logo" className="home-logo-img" />
              ?
            </h2>
            
            <p className="home-intro-text">
              NaviGo is an advanced digital platform that enables transport
              companies, freight forwarders, and clients to efficiently manage
              complex logistics processes. Our goal is to improve communication,
              increase transparency, and optimize operations in the transport
              industry through technology.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home-how-works">
        <div className="home-container">
          <h2 className="home-section-title">How does our platform work?</h2>
          
          <div className="home-user-types">
            <div className="home-user-type">
              <div className="home-user-icon">
                <Truck size={40} />
              </div>
              <h3>Transport Companies</h3>
              <ul>
                <li>Fleet and driver management</li>
                <li>Route and shipment planning</li>
                <li>Automatic pricing creation</li>
                <li>Vehicle tracking and maintenance</li>
                <li>Failure and service management</li>
              </ul>
            </div>

            <div className="home-user-type">
              <div className="home-user-icon">
                <Users size={40} />
              </div>
              <h3>Freight Forwarders</h3>
              <ul>
                <li>Overview of all available routes</li>
                <li>Booking transport for clients</li>
                <li>Commission management</li>
                <li>Delivery status tracking</li>
                <li>Special offers for urgent cases</li>
              </ul>
            </div>

            <div className="home-user-type">
              <div className="home-user-icon">
                <BarChart3 size={40} />
              </div>
              <h3>Clients</h3>
              <ul>
                <li>Search transport companies</li>
                <li>Filter by destination and price</li>
                <li>Book vehicles up to 7 days in advance</li>
                <li>Real-time shipment tracking</li>
                <li>Transparent cost management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="home-mission-vision">
        <div className="home-container">
          <div className="home-mission-vision-grid">
            <div className="home-mission">
              <h3>Our Mission</h3>
              <p>
                To simplify and digitalize logistics processes through
                innovative technology, enabling all participants in the
                transport chain to collaborate more efficiently and conduct
                business transparently.
              </p>
            </div>
            <div className="home-vision">
              <h3>Our Vision</h3>
              <p>
                To become the leading digital logistics platform in the Balkans,
                connecting transport companies, freight forwarders, and clients
                into a single, reliable, and efficient network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta-section">
        <div className="home-container">
          <div className="home-cta">
            <h2 className="home-cta-title">Ready to Transform Your Logistics?</h2>
            <p className="home-cta-text">
              Join hundreds of companies already using NaviGo to optimize their transport operations. 
              Start your digital transformation today and experience the future of logistics.
            </p>
            <div className="home-cta-actions">
              <Link to="/register" className="btn btn-primary">
               Get Started Now <ArrowRight size={20} />
            </Link>
              <a href="mailto:info@navigo.rs" className="btn btn-secondary">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    <SupportChat />
    </>
  );
};

export default Home;