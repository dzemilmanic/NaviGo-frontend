import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import './AddVehicle.css';
import { createEmptyVehicleDto, validateVehicle, VehicleStatus, VehicleStatusLabels } from '../../types/vehicleTypes';
import vehicleService from '../../services/vehicleService';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState(createEmptyVehicleDto());
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Uzmi companyId iz trenutno ulogovanog korisnika (ovo biste trebali da imate u contextu ili localStorage)
  const [currentUser] = useState(() => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : { companyId: 1 }; // Fallback za testiranje
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Postavi companyId iz trenutnog korisnika
    setVehicleData(prev => ({
      ...prev,
      companyId: currentUser.companyId
    }));
  }, [currentUser.companyId]);

  const loadInitialData = async () => {
    setIsLoadingData(true);
    try {
      const [typesData, locationsData] = await Promise.all([
        vehicleService.getVehicleTypes(),
        vehicleService.getLocations()
      ]);

      setVehicleTypes(typesData);
      setLocations(locationsData);
    } catch (error) {
      showAlert('error', 'Greška pri učitavanju podataka: ' + error.message);
    } finally {
      setIsLoadingData(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    setVehicleData(prev => ({
      ...prev,
      [field]: value
    }));

    // Ukloni grešku za ovo polje ako postoji
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateVehicle(vehicleData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      showAlert('error', 'Molimo ispravite greške u formi');
      return;
    }

    setIsLoading(true);
    try {
      // Pripremi podatke za slanje
      const submitData = {
        ...vehicleData,
        lastInspectionDate: vehicleData.lastInspectionDate || null,
        insuranceExpiry: vehicleData.insuranceExpiry || null,
        currentLocationId: vehicleData.currentLocationId || null,
        categories: vehicleData.categories.trim() || null
      };

      await vehicleService.createVehicle(submitData);
      
      showAlert('success', 'Vozilo je uspešno dodato!');
      
      // Resetuj formu nakon uspešnog dodavanja
      setTimeout(() => {
        navigate('/vehicles'); // Preusmeri na listu vozila
      }, 2000);
      
    } catch (error) {
      showAlert('error', 'Greška pri dodavanju vozila: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/vehicles');
  };

  if (isLoadingData) {
    return (
      <div className="add-vehicle-page">
        <div className="add-vehicle-container">
          <div className="vehicle-form-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner" style={{ position: 'relative', left: 'auto', top: 'auto', transform: 'none', margin: '0 auto 1rem' }}></div>
            <p>Učitavanje podataka...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-vehicle-page">
      <div className="add-vehicle-container">
        <div className="page-header">
          <h1 className="page-title">
            <Truck style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Dodavanje novog vozila
          </h1>
          <p className="page-subtitle">
            Unesite osnovne informacije o vozilu koje dodajete u flotu vaše kompanije
          </p>
        </div>

        {alert.show && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === 'success' ? (
              <CheckCircle style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} size={20} />
            ) : (
              <AlertCircle style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} size={20} />
            )}
            {alert.message}
          </div>
        )}

        <div className="vehicle-form-card">
          <form onSubmit={handleSubmit} className="vehicle-form">
            <div className="form-section">
              <h2 className="section-title">Osnovne informacije</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">Registarski broj</label>
                  <input
                    type="text"
                    className={`form-input ${errors.registrationNumber ? 'error' : ''}`}
                    value={vehicleData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value.toUpperCase())}
                    placeholder="npr. BG-123-AB"
                  />
                  {errors.registrationNumber && (
                    <span className="error-message">{errors.registrationNumber}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Tip vozila</label>
                  <select
                    className={`form-select ${errors.vehicleTypeId ? 'error' : ''}`}
                    value={vehicleData.vehicleTypeId}
                    onChange={(e) => handleInputChange('vehicleTypeId', parseInt(e.target.value))}
                  >
                    <option value={0}>Izaberite tip vozila</option>
                    {vehicleTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.typeName}
                        {type.requiresSpecialLicense && ' (zahteva specijalnu dozvolu)'}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleTypeId && (
                    <span className="error-message">{errors.vehicleTypeId}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label required">Nosivost (kg)</label>
                  <input
                    type="number"
                    className={`form-input ${errors.capacityKg ? 'error' : ''}`}
                    value={vehicleData.capacityKg}
                    onChange={(e) => handleInputChange('capacityKg', parseInt(e.target.value) || 0)}
                    min="0"
                    step="1"
                  />
                  {errors.capacityKg && (
                    <span className="error-message">{errors.capacityKg}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label required">Godina proizvodnje</label>
                  <input
                    type="number"
                    className={`form-input ${errors.manufactureYear ? 'error' : ''}`}
                    value={vehicleData.manufactureYear}
                    onChange={(e) => handleInputChange('manufactureYear', parseInt(e.target.value) || new Date().getFullYear())}
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                  {errors.manufactureYear && (
                    <span className="error-message">{errors.manufactureYear}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status vozila</label>
                  <select
                    className="form-select"
                    value={vehicleData.vehicleStatus}
                    onChange={(e) => handleInputChange('vehicleStatus', parseInt(e.target.value))}
                  >
                    {Object.entries(VehicleStatusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trenutna lokacija</label>
                  <select
                    className="form-select"
                    value={vehicleData.currentLocationId || ''}
                    onChange={(e) => handleInputChange('currentLocationId', e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Izaberite lokaciju</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Dodatne informacije</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Poslednji tehnički pregled</label>
                  <input
                    type="date"
                    className="form-input"
                    value={vehicleData.lastInspectionDate}
                    onChange={(e) => handleInputChange('lastInspectionDate', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Istekosiguranja</label>
                  <input
                    type="date"
                    className="form-input"
                    value={vehicleData.insuranceExpiry}
                    onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Kategorije vozila</label>
                <textarea
                  className="form-textarea"
                  value={vehicleData.categories}
                  onChange={(e) => handleInputChange('categories', e.target.value)}
                  placeholder="Unesite kategorije razdvojene zarezom (npr. rashladna, hazardni materijali)"
                  rows={3}
                />
                <small style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                  Kategorije razdvojite zarezom
                </small>
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    className="form-checkbox"
                    checked={vehicleData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                  />
                  <label htmlFor="isAvailable" className="checkbox-label">
                    Vozilo je dostupno za korišćenje
                  </label>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} size={18} />
                Otkaži
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <Save style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} size={18} />
                    Dodaj vozilo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;