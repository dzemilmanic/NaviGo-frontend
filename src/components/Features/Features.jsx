import React from 'react';
import { MapPin, Clock, Shield, Smartphone, FileText, TrendingUp } from 'lucide-react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <MapPin size={32} />,
      title: "GPS Tracking",
      description: "Track vehicle and shipment locations in real time with precise GPS system."
    },
    {
      icon: <Clock size={32} />,
      title: "Route Optimization",
      description: "AI algorithms for the fastest and most economical route with up to 30% fuel savings."
    },
    {
      icon: <Shield size={32} />,
      title: "Data Security",
      description: "Enterprise level security with 256-bit encryption and GDPR compliance."
    },
    {
      icon: <Smartphone size={32} />,
      title: "Mobile Application",
      description: "Access the platform anywhere, anytime through our intuitive mobile app."
    },
    {
      icon: <FileText size={32} />,
      title: "Digital Documentation",
      description: "Automatic creation and management of all transport documents."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Analytics and Reports",
      description: "Detailed performance insights with dashboard and custom reports."
    }
  ];

  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Advanced Features</h2>
          <p className="features-subtitle">
            NaviGo platform uses the latest technologies to provide the best solutions 
            in logistics and transport. Discover features that will transform your business.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="service-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="features-showcase">
          <h3 className="showcase-title">Results that speak for themselves</h3>
          <p className="showcase-description">
            Companies using the NaviGo platform achieve significant savings and increase 
            the efficiency of their logistics operations.
          </p>

          <div className="showcase-stats">
            <div className="showcase-stat">
              <h4 className="showcase-stat-number">98%</h4>
              <p className="showcase-stat-label">User satisfaction</p>
            </div>
            <div className="showcase-stat">
              <h4 className="showcase-stat-number">35%</h4>
              <p className="showcase-stat-label">Cost reduction</p>
            </div>
            <div className="showcase-stat">
              <h4 className="showcase-stat-number">50%</h4>
              <p className="showcase-stat-label">Faster deliveries</p>
            </div>
            <div className="showcase-stat">
              <h4 className="showcase-stat-number">24/7</h4>
              <p className="showcase-stat-label">Technical support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;