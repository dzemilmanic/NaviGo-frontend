import React from "react";
import "./Partners.css";

import partner1 from "../../assets/partner1.png";
import partner2 from "../../assets/partner2.png";
import partner3 from "../../assets/partner3.png";
import partner4 from "../../assets/partner4.png";
import partner5 from "../../assets/partner5.png";
import partner6 from "../../assets/partner6.png";

const partnerLogos = [
  partner1,
  partner2,
  partner3,
  partner4,
  partner5,
  partner6,
];

const Partners = () => {
  const logosForScroll = [...partnerLogos, ...partnerLogos];

  return (
    <section className="partners" id="partners">
      <h2 className="partners-title">Our Trusted Partners</h2>
      <div className="partners-slider">
        <div className="partners-track">
          {logosForScroll.map((logo, index) => (
            <div className="partner-logo" key={index}>
              <img src={logo} alt={`Partner ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
