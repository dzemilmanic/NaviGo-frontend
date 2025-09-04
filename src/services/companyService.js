import { apiService } from './api';

class CompanyService {
  // Mapira frontend parametre u backend format
  mapSearchParams(searchParams = {}) {
    const mappedParams = {};
    
    // Map frontend parameters to backend expected format
    if (searchParams.pib) mappedParams.Pib = searchParams.pib;
    if (searchParams.companyType !== undefined) mappedParams.CompanyType = searchParams.companyType;
    if (searchParams.companyName) mappedParams.CompanyName = searchParams.companyName;
    if (searchParams.sortBy) mappedParams.SortBy = searchParams.sortBy;
    if (searchParams.sortDirection) mappedParams.SortDirection = searchParams.sortDirection;
    if (searchParams.page !== undefined) mappedParams.Page = searchParams.page;
    if (searchParams.pageSize !== undefined) mappedParams.PageSize = searchParams.pageSize;
    
    return mappedParams;
  }

  async getAll(searchParams = {}) {
    try {
      const mappedParams = this.mapSearchParams(searchParams);
      const queryString = new URLSearchParams(mappedParams).toString();
      const endpoint = queryString ? `/company?${queryString}` : '/company';
      
      console.log('Fetching companies with endpoint:', endpoint);
      console.log('Mapped parameters:', mappedParams);
      
      const result = await apiService.get(endpoint);
      
      if (result.success) {
        console.log('Companies fetched successfully:', result.data);
        return result;
      } else {
        console.error('Failed to fetch companies:', result.message);
        return result;
      }
    } catch (error) {
      console.error('Company getAll error:', error);
      return {
        success: false,
        message: 'Failed to fetch companies. Please try again.'
      };
    }
  }

  async getById(id) {
    try {
      const result = await apiService.get(`/company/${id}`);
      
      if (result.success) {
        console.log('Company fetched by ID successfully:', result.data);
        return result;
      } else {
        console.error('Failed to fetch company by ID:', result.message);
        return result;
      }
    } catch (error) {
      console.error('Company getById error:', error);
      return {
        success: false,
        message: 'Failed to fetch company. Please try again.'
      };
    }
  }

  async create(companyData) {
    try {
      console.log('Creating company with data:', companyData);
      const result = await apiService.post('/company', companyData);
      
      if (result.success) {
        console.log('Company created successfully:', result.data);
      } else {
        console.error('Failed to create company:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Company create error:', error);
      return {
        success: false,
        message: 'Failed to create company. Please try again.'
      };
    }
  }

  async update(id, companyData) {
    try {
      const result = await apiService.put(`/company/${id}`, companyData);
      
      if (result.success) {
        console.log('Company updated successfully:', result.data);
      } else {
        console.error('Failed to update company:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Company update error:', error);
      return {
        success: false,
        message: 'Failed to update company. Please try again.'
      };
    }
  }

  async updateStatus(id, status) {
    try {
      const result = await apiService.patch(`/company/${id}/status`, {
        companyStatus: status
      });
      
      if (result.success) {
        console.log('Company status updated successfully');
      } else {
        console.error('Failed to update company status:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Company updateStatus error:', error);
      return {
        success: false,
        message: 'Failed to update company status. Please try again.'
      };
    }
  }

  async delete(id) {
    try {
      const result = await apiService.delete(`/company/${id}`);
      
      if (result.success) {
        console.log('Company deleted successfully');
      } else {
        console.error('Failed to delete company:', result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Company delete error:', error);
      return {
        success: false,
        message: 'Failed to delete company. Please try again.'
      };
    }
  }
  
  // Koristi getAll metodu umesto direktnog API poziva
  async searchByPib(pib, companyType) {
    console.log('Searching by PIB:', pib, 'Type:', companyType);
    
    // Koristi getAll sa odgovarajućim parametrima
    return await this.getAll({
      pib: pib,
      companyType: companyType
    });
  }

  async uploadFile(file) {
    try {
      if (!file) {
        return {
          success: false,
          message: "No file provided"
        };
      }

      console.log('Uploading file:', file.name, 'Size:', file.size);
      
      const formData = new FormData();
      formData.append("file", file);
      
      const result = await apiService.upload("/File/upload", formData);
      
      if (result.success) {
        // Backend vraća URL u različitim formatima, pokušaj sve moguće varijante
        const fileUrl = result.data?.url || 
                       result.data?.filePath || 
                       result.data?.fileUrl ||
                       result.data?.Url ||
                       result.data?.FilePath ||
                       result.data?.FileUrl ||
                       result.url ||
                       result.filePath ||
                       result.fileUrl;
        
        console.log('File uploaded successfully:', fileUrl);
        
        return {
          success: true,
          url: fileUrl
        };
      } else {
        console.error('File upload failed:', result.message);
        return {
          success: false,
          message: result.message || "Failed to upload file"
        };
      }
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        message: "Failed to upload file. Please try again."
      };
    }
  }
}

export const companyService = new CompanyService();