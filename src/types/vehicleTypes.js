// DTO tipovi za vozila zasnovani na .NET modelima
export const VehicleStatus = {
  Free: 0,
  OnRoute: 1,
  InService: 2,
  Unavailable: 3
};

export const VehicleStatusLabels = {
  [VehicleStatus.Free]: 'Slobodno',
  [VehicleStatus.OnRoute]: 'Na ruti',
  [VehicleStatus.InService]: 'Na servisu',
  [VehicleStatus.Unavailable]: 'Nedostupno'
};

// DTO za kreiranje vozila
export const createEmptyVehicleDto = () => ({
  companyId: 0,
  vehicleTypeId: 0,
  registrationNumber: '',
  capacityKg: 0,
  manufactureYear: new Date().getFullYear(),
  vehicleStatus: VehicleStatus.Free,
  lastInspectionDate: '',
  insuranceExpiry: '',
  currentLocationId: null,
  isAvailable: true,
  categories: ''
});

// Validacione funkcije
export const validateVehicle = (vehicle) => {
  const errors = {};

  if (!vehicle.registrationNumber.trim()) {
    errors.registrationNumber = 'Registarski broj je obavezan';
  }

  if (!vehicle.vehicleTypeId || vehicle.vehicleTypeId === 0) {
    errors.vehicleTypeId = 'Tip vozila je obavezan';
  }

  if (!vehicle.capacityKg || vehicle.capacityKg <= 0) {
    errors.capacityKg = 'Nosivost mora biti veća od 0';
  }

  if (!vehicle.manufactureYear || vehicle.manufactureYear < 1950 || vehicle.manufactureYear > new Date().getFullYear()) {
    errors.manufactureYear = 'Godina proizvodnje nije validna';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};