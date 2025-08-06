import React from 'react';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p className="legal-date">Last updated: January 2024</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>
              NaviGo collects information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support. This may include:
            </p>
            <ul>
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Company information (company name, address, tax identification)</li>
              <li>Vehicle and shipment data</li>
              <li>Location data for tracking purposes</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our logistics platform services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy:
            </p>
            <ul>
              <li>With service providers who assist us in operating our platform</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
              <li>With your explicit consent for specific purposes</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul>
              <li>256-bit SSL encryption for data transmission</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular backup and disaster recovery procedures</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services 
              and fulfill the purposes outlined in this policy, unless a longer retention period 
              is required or permitted by law.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to collect and track information 
              about your use of our services. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information in accordance 
              with applicable data protection laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;