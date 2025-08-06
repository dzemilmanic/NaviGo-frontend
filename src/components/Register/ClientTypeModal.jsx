import React from 'react';
import { X, User, Building } from 'lucide-react';
import './ClientTypeModal.css';

const ClientTypeModal = ({ onClientTypeSelect, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="client-type-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="client-type-modal-header">
          <h3>
            <User size={24} />
            Select Client Type
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="client-type-modal-body">
          <p className="client-type-description">
            Please select whether you are registering as an individual or representing a company:
          </p>

          <div className="client-type-options">
            <button
              type="button"
              className="client-type-btn"
              onClick={() => onClientTypeSelect('individual')}
            >
              <div className="client-type-icon">
                <User size={32} />
              </div>
              <div className="client-type-text">
                <h4>Individual</h4>
                <p>Personal account for individual clients</p>
              </div>
            </button>

            <button
              type="button"
              className="client-type-btn"
              onClick={() => onClientTypeSelect('company')}
            >
              <div className="client-type-icon">
                <Building size={32} />
              </div>
              <div className="client-type-text">
                <h4>Company</h4>
                <p>Business account representing a company</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTypeModal; 