// // Maps frontend form data to backend DTO format
// export const mapRegistrationData = (formData, clientType, selectedCompany) => {
//   // Determine user role based on form selections
//   let userRole;
  
//   switch (formData.userType) {
//     case 'client':
//       userRole = 1; // RegularUser
//       break;
//     case 'shipper':
//       userRole = 2; // CompanyUser  
//       break;
//     case 'transport':
//       userRole = 2; // CompanyUser
//       break;
//     default:
//       userRole = 1; // RegularUser as default
//   }

//   // Create the user DTO that matches backend UserCreateDto
//   const userCreateDto = {
//     email: formData.email,
//     password: formData.password,
//     firstName: formData.firstName,
//     lastName: formData.lastName,
//     phoneNumber: formData.phoneNumber,
//     userRole: userRole,
//     // Use the real company ID from backend, not the local mock ID
//     companyId: selectedCompany ? selectedCompany.id : null
//   };

//   console.log('Mapped user registration data:', {
//     ...userCreateDto,
//     password: '[HIDDEN]' // Don't log password
//   });

//   return userCreateDto;
// };

// // Validates if all required data is present
// export const validateRegistrationData = (formData, validations, clientType, selectedCompany) => {
//   // Check form validations
//   const allValid = Object.values(validations).every((v) => v.valid);
  
//   // Check required fields
//   const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'userType'];
//   const allFilled = requiredFields.every((field) => formData[field]);

//   // Check if company is needed
//   const needsCompany = 
//     formData.userType === 1 ||
//     formData.userType === 2 ||
//     (formData.userType === 'client' && clientType === 'company');

//   // Check if client type is needed
//   const needsClientType = formData.userType === 'client';

//   const errors = [];
  
//   if (!allValid) {
//     errors.push('Please correct all form validation errors');
//   }
  
//   if (!allFilled) {
//     errors.push('Please fill in all required fields');
//   }
  
//   if (needsCompany && !selectedCompany) {
//     errors.push('Please select or add a company');
//   }
  
//   if (needsCompany && selectedCompany && !selectedCompany.id) {
//     errors.push('Company must be properly saved before registration');
//   }
  
//   if (needsClientType && !clientType) {
//     errors.push('Please select client type');
//   }

//   return {
//     isValid: errors.length === 0,
//     errors: errors
//   };
// };

// // Helper function to map company type from string to enum
// export const mapCompanyTypeToEnum = (userType) => {
//   switch (userType) {
//     case 'client':
//       return 1; // CompanyType.Client
//     case 'shipper':
//       return 2; // CompanyType.Forwarder
//     case 'transport':
//       return 3; // CompanyType.Carrier
//     default:
//       return 1;
//   }
// };
// Helper function to determine backend UserRole dynamically
const determineUserRole = (formData, clientType, selectedCompany, isCompanyAdmin) => {
  if (isCompanyAdmin) {
    return 3; // CompanyAdmin
  } else if (selectedCompany) {
    return 2; // CompanyUser
  } else {
    // No company: choose based on clientType
    if (formData.userType === 'client' && clientType === 'company') {
      return 4; // SuperAdmin
    }
    return 1; // RegularUser
  }
};

// Map frontend userType string to UserRole enum (fallback)
export const mapUserTypeToRole = (userType) => {
  switch(userType) {
    case 'client': return 1;   // RegularUser
    case 'shipper': return 2;  // CompanyUser
    case 'transport': return 2; // CompanyUser
    default: return 1;         // Default RegularUser
  }
};

// Map frontend clientType string to CompanyType enum
export const mapCompanyTypeToEnum = (clientType) => {
  switch(clientType) {
    case 'client': return 1;    // CompanyType.Client
    case 'shipper': return 2;   // CompanyType.Forwarder
    case 'transport': return 3; // CompanyType.Carrier
    default: return 1;
  }
};

// Maps frontend form data to backend DTO format
export const mapRegistrationData = (formData, clientType, selectedCompany, isCompanyAdmin) => {
  const userRole = determineUserRole(formData, clientType, selectedCompany, isCompanyAdmin);

  const companyType = clientType ? mapCompanyTypeToEnum(clientType) : null;

  const userCreateDto = {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phoneNumber: formData.phoneNumber,
    userRole,
    companyId: selectedCompany ? selectedCompany.id : null,
    companyType
  };

  console.log('Mapped user registration data:', {
    ...userCreateDto,
    password: '[HIDDEN]'
  });

  return userCreateDto;
};

// Validates if all required data is present
export const validateRegistrationData = (formData, validations, clientType, selectedCompany) => {
  const allValid = Object.values(validations).every(v => v.valid);
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'userType'];
  const allFilled = requiredFields.every(field => formData[field]);

  const needsCompany = ['shipper', 'transport'].includes(formData.userType);
  const needsClientType = formData.userType === 'client';

  const errors = [];

  if (!allValid) errors.push('Please correct all form validation errors');
  if (!allFilled) errors.push('Please fill in all required fields');
  if (needsCompany && !selectedCompany) errors.push('Please select or add a company');
  if (needsCompany && selectedCompany && !selectedCompany.id) errors.push('Company must be properly saved before registration');
  if (needsClientType && !clientType) errors.push('Please select client type');

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
