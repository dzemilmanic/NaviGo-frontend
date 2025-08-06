import React from 'react';
import './LegalPages.css';

const Cookies = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Cookie Policy</h1>
          <p className="legal-date">Last updated: January 2024</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when 
              you visit our website. They help us provide you with a better experience by remembering 
              your preferences and understanding how you use our platform.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Cookies</h2>
            <p>NaviGo uses cookies for several purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Provide insights into website usage and performance</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Types of Cookies We Use</h2>
            
            <div className="cookie-category">
              <h3>Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function and cannot be switched off. 
                They are usually set in response to actions made by you, such as logging in or 
                filling in forms.
              </p>
              <ul>
                <li>Session management cookies</li>
                <li>Authentication cookies</li>
                <li>Security cookies</li>
              </ul>
            </div>

            <div className="cookie-category">
              <h3>Performance and Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors interact with our website by 
                collecting and reporting information anonymously.
              </p>
              <ul>
                <li>Google Analytics cookies</li>
                <li>Page view tracking cookies</li>
                <li>User behavior analysis cookies</li>
              </ul>
            </div>

            <div className="cookie-category">
              <h3>Functionality Cookies</h3>
              <p>
                These cookies enable the website to provide enhanced functionality and personalization, 
                such as remembering your language preferences.
              </p>
              <ul>
                <li>Language preference cookies</li>
                <li>User interface customization cookies</li>
                <li>Remember me cookies</li>
              </ul>
            </div>

            <div className="cookie-category">
              <h3>Marketing and Advertising Cookies</h3>
              <p>
                These cookies are used to deliver advertisements that are relevant to you and 
                your interests. They may also be used to limit the number of times you see an 
                advertisement.
              </p>
              <ul>
                <li>Targeted advertising cookies</li>
                <li>Social media integration cookies</li>
                <li>Conversion tracking cookies</li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Third-Party Cookies</h2>
            <p>
              Some cookies on our website are set by third-party services. We use these services 
              to enhance your experience and provide additional functionality:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Social Media Platforms:</strong> For social sharing and integration features</li>
              <li><strong>Payment Processors:</strong> For secure payment processing</li>
              <li><strong>Customer Support Tools:</strong> For live chat and support features</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Managing Your Cookie Preferences</h2>
            <p>
              You have several options for managing cookies:
            </p>
            
            <div className="cookie-management">
              <h3>Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul>
                <li>Block all cookies</li>
                <li>Block third-party cookies</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
              </ul>

              <h3>Cookie Consent Tool</h3>
              <p>
                When you first visit our website, you'll see a cookie consent banner that allows 
                you to choose which types of cookies you want to accept.
              </p>

              <h3>Opt-Out Links</h3>
              <p>For specific third-party services, you can opt out directly:</p>
              <ul>
                <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                <li>Facebook: <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener noreferrer">Facebook Ad Preferences</a></li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>6. Impact of Disabling Cookies</h2>
            <p>
              While you can disable cookies, please note that doing so may affect your experience 
              on our website:
            </p>
            <ul>
              <li>Some features may not work properly</li>
              <li>You may need to re-enter information more frequently</li>
              <li>Personalized content and recommendations may not be available</li>
              <li>Website performance tracking may be limited</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Cookie Retention</h2>
            <p>
              Different cookies have different lifespans:
            </p>
            <ul>
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
              <li><strong>Third-party Cookies:</strong> Managed according to the third party's retention policy</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any 
              material changes by posting the updated policy on our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <div className="contact-info">
              <p>Email: privacy@navigo.rs</p>
              <p>Phone: +381 11 123 4567</p>
              <p>Address: Belgrade, Knez Mihailova 42</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;