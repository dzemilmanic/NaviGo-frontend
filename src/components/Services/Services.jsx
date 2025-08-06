import React from 'react';
import { Truck, Users, BarChart3, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: <Truck size={32} />,
      title: "For Transport Companies",
      description: "Complete digitalization of your transport business with advanced fleet management and route optimization tools.",
      features: [
        "Fleet management",
        "Route and cost optimization",
        "Real-time vehicle tracking",
        "Automatic document generation",
        "Analytics and reports"
      ]
    },
    {
      icon: <Users size={32} />,
      title: "For Freight Forwarders",
      description: "Centralized platform for coordinating all logistics processes with complete control over shipments.",
      features: [
        "Centralized booking system",
        "Communication with carriers",
        "Tracking all shipments",
        "Document management",
        "Customer portal"
      ]
    },
    {
      icon: <BarChart3 size={32} />,
      title: "For Clients",
      description: "Transparent tracking of your shipments with access to all relevant information in real time.",
      features: [
        "Online booking system",
        "Real-time tracking",
        "Status notifications",
        "History of all transports",
        "Direct communication"
      ]
    }
  ];

  return (
    <section id="services" className="services">
      <div className="services-header">
        <h2 className="services-title">Our Services</h2>
        <p className="services-subtitle">
          NaviGo platform is designed to meet the needs of all participants in the logistics chain. 
          From transport companies to end users, we provide solutions that simplify and optimize processes.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">
              {service.icon}
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature, featureIndex) => (
                <li key={featureIndex}>
                  <CheckCircle size={16} className="check-icon" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="services-cta">
        <p className="services-cta-text">
          Ready to digitalize your logistics business?
        </p>
        <a href="#contact" className="btn btn-primary">
          Contact Us <ArrowRight size={20} />
        </a>
      </div>
    </section>
  );
};

export default Services;