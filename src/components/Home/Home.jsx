import React from 'react';
import { ArrowRight } from 'lucide-react';
import Services from '../Services/Services';
import Features from '../Features/Features';
import './Home.css';
import Partners from '../Partners/Partners';
import SupportChat from '../SupportChat/SupportChat';
const Home = () => {
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Digital Platform for
              <span className="hero-title-highlight">Logistics & Transport</span>
            </h1>
            
            <p className="hero-subtitle">
              NaviGo connects transport companies, freight forwarders and clients through one powerful platform. 
              Manage transport, track shipments and communicate transparently.
            </p>

            <div className="hero-actions">
              <a href="#register" className="btn btn-primary">
                Get Started Now <ArrowRight size={20} />
              </a>
              <a href="#services" className="btn btn-secondary">
                Learn More
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <h3 className="hero-stat-number">500+</h3>
                <p className="hero-stat-label">Transport Companies</p>
              </div>
              <div className="hero-stat">
                <h3 className="hero-stat-number">15k+</h3>
                <p className="hero-stat-label">Successful Deliveries</p>
              </div>
              <div className="hero-stat">
                <h3 className="hero-stat-number">24/7</h3>
                <p className="hero-stat-label">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Partners/>
      <Services />
      <Features />
      <SupportChat />
    </>
  );
};

export default Home;