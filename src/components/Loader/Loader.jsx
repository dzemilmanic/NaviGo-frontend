import React from 'react';
import { Truck } from 'lucide-react';
import './Loader.css';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="loader-logo">
          <Truck size={48} />
        </div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
