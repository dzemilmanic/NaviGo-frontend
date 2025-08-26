import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="about-hero-section">
        {/* Video Background */}
        <video
          className="about-hero-video"
          autoPlay
          muted
          loop
          playsInline
          src="https://videos.pexels.com/video-files/5200378/5200378-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />

        {/* Overlay for better readability */}
        <div className="about-hero-overlay"></div>

        <div className="about-container">
          <h1 className="about-hero-title">About NaviGo Platform</h1>
          <p className="about-hero-subtitle">
            We are revolutionizing the logistics industry through digital
            transformation and connecting all participants in the transport
            chain.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="about-main-content">
        <div className="about-container">
          <div className="about-intro-section">
            <h2>Who are we?</h2>
            <p>
              NaviGo is an advanced digital platform that enables transport
              companies, freight forwarders, and clients to efficiently manage
              complex logistics processes. Our goal is to improve communication,
              increase transparency, and optimize operations in the transport
              industry through technology.
            </p>
          </div>

          {/* How It Works */}
          <div className="about-how-it-works">
            <h2>How does our platform work?</h2>
            <div className="about-user-types">
              <div className="about-user-type">
                <div className="about-icon about-transport-icon">🚛</div>
                <h3>Transport Companies</h3>
                <ul>
                  <li>Fleet and driver management</li>
                  <li>Route and shipment planning</li>
                  <li>Automatic pricing creation</li>
                  <li>Vehicle tracking and maintenance</li>
                  <li>Failure and service management</li>
                </ul>
              </div>

              <div className="about-user-type">
                <div className="about-icon about-spediter-icon">🤝</div>
                <h3>Freight Forwarders</h3>
                <ul>
                  <li>Overview of all available routes</li>
                  <li>Booking transport for clients</li>
                  <li>Commission management</li>
                  <li>Delivery status tracking</li>
                  <li>Special offers for urgent cases</li>
                </ul>
              </div>

              <div className="about-user-type">
                <div className="about-icon about-client-icon">📦</div>
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

          {/* Mission & Vision */}
          <div className="about-mission-vision">
            <div className="about-mission">
              <h3>Our Mission</h3>
              <p>
                To simplify and digitalize logistics processes through
                innovative technology, enabling all participants in the
                transport chain to collaborate more efficiently and conduct
                business transparently.
              </p>
            </div>
            <div className="about-vision">
              <h3>Our Vision</h3>
              <p>
                To become the leading digital logistics platform in the Balkans,
                connecting transport companies, freight forwarders, and clients
                into a single, reliable, and efficient network.
              </p>
            </div>
          </div>

          {/* Key Features */}
          <div className="about-key-features">
            <h2>Key Features</h2>
            <div className="about-features-grid">
              <div className="about-feature">
                <div className="about-feature-icon">⚡</div>
                <h4>Automation</h4>
                <p>Automatic creation of price lists and late penalties</p>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">📊</div>
                <h4>Transparency</h4>
                <p>Full visibility of all processes and costs</p>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">🔒</div>
                <h4>Security</h4>
                <p>Verification of payments and contractual obligations</p>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">📱</div>
                <h4>Mobility</h4>
                <p>Track shipments and manage from any device</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="about-stats-section">
            <h2>NaviGo in Numbers</h2>
            <div className="about-stats-grid">
              <div className="about-stat">
                <div className="about-stat-number">500+</div>
                <div className="about-stat-label">Registered Vehicles</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-number">50+</div>
                <div className="about-stat-label">Partner Companies</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-number">1000+</div>
                <div className="about-stat-label">Successful Deliveries</div>
              </div>
              <div className="about-stat">
                <div className="about-stat-number">24/7</div>
                <div className="about-stat-label">Customer Support</div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="about-contact-section">
            <h2>Contact Us</h2>
            <p>
              Do you have questions about our platform? Want to become part of
              the NaviGo community? Our team is here to help you digitalize your
              logistics business.
            </p>
            <div className="about-contact-info">
              <div className="about-contact-item">
                <strong>Email:</strong> info@navigo.rs
              </div>
              <div className="about-contact-item">
                <strong>Phone:</strong> +381 11 123 4567
              </div>
              <div className="about-contact-item">
                <strong>Address:</strong> Belgrade, Serbia
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
