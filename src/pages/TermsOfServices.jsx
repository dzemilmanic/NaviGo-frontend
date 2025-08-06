import React from 'react';
import './LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p className="legal-date">Last updated: January 2024</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using NaviGo's logistics platform ("Service"), you accept and agree 
              to be bound by the terms and provision of this agreement. If you do not agree to abide 
              by the above, please do not use this service.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Description of Service</h2>
            <p>
              NaviGo provides a digital platform that connects transport companies, freight forwarders, 
              and clients for logistics and transportation services. Our services include:
            </p>
            <ul>
              <li>Fleet management and tracking systems</li>
              <li>Route optimization and planning</li>
              <li>Document management and generation</li>
              <li>Real-time shipment tracking</li>
              <li>Communication tools between parties</li>
              <li>Analytics and reporting features</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. User Accounts and Registration</h2>
            <p>
              To access certain features of our Service, you must register for an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Acceptable Use Policy</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful, threatening, or offensive content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use the Service for any fraudulent or illegal activities</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Payment Terms</h2>
            <p>
              Certain features of our Service may require payment. By using paid features, you agree to:
            </p>
            <ul>
              <li>Pay all applicable fees as described in our pricing plans</li>
              <li>Provide accurate billing information</li>
              <li>Pay fees in advance on a monthly or annual basis</li>
              <li>Accept that fees are non-refundable except as required by law</li>
              <li>Be responsible for all taxes associated with your use of the Service</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Intellectual Property Rights</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain 
              the exclusive property of NaviGo and its licensors. The Service is protected by copyright, 
              trademark, and other laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. User Content</h2>
            <p>
              You retain ownership of any content you submit to the Service. By submitting content, 
              you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, 
              modify, and distribute your content in connection with the Service.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Service Availability</h2>
            <p>
              We strive to maintain high availability of our Service, but we do not guarantee 
              uninterrupted access. We may temporarily suspend the Service for maintenance, 
              updates, or other operational reasons.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, NaviGo shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or 
              revenues, whether incurred directly or indirectly.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless NaviGo and its officers, directors, 
              employees, and agents from and against any claims, damages, obligations, losses, 
              liabilities, costs, or debt arising from your use of the Service.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, 
              without prior notice, for conduct that we believe violates these Terms or is 
              harmful to other users, us, or third parties.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of 
              any material changes via email or through the Service. Your continued use of the 
              Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Serbia, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="legal-section">
            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="contact-info">
              <p>Email: legal@navigo.rs</p>
              <p>Phone: +381 11 123 4567</p>
              <p>Address: Belgrade, Knez Mihailova 42</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;