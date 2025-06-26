import api from './api.service';

class CVDataService {
  constructor() {
    this.data = null;
    this.listeners = [];
  }

  // Store CV data
  setData(cvData) {
    this.data = cvData;
    this.notifyListeners();
  }

  // Get CV data
  getData() {
    return this.data;
  }

  // Check if data exists
  hasData() {
    return this.getData() !== null;
  }

  // Clear stored data
  clearData() {
    this.data = null;
    this.notifyListeners();
  }

  // Subscribe to data changes
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners when data changes
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.data));
  }

  // Convenient getters for specific data
  getName() {
    const data = this.getData();
    return data?.name || '';
  }

  getEmail() {
    const data = this.getData();
    return data?.email || '';
  }

  getPhone() {
    const data = this.getData();
    return data?.phone || '';
  }

  getAbout() {
    const data = this.getData();
    return data?.about || [];
  }

  getSkills() {
    const data = this.getData();
    return data?.skills || [];
  }

  getExperience() {
    const data = this.getData();
    return data?.experience || [];
  }

  getEducation() {
    const data = this.getData();
    return data?.education || [];
  }

  getCertifications() {
    const data = this.getData();
    return data?.certifications || [];
  }

  getLinks() {
    const data = this.getData();
    return data?.links || {};
  }

  getReferences() {
    const data = this.getData();
    return data?.references || [];
  }
}

// Create and export a singleton instance
const cvDataService = new CVDataService();
export default cvDataService;