// services/cvDataService.js

class CVDataService {
  constructor() {
    this.data = null;
    this.listeners = [];
  }

  // Store CV data
  setData(cvData) {
    this.data = cvData;
    this.notifyListeners();
    
    // Optional: Also store in sessionStorage for persistence during the session
    try {
      sessionStorage.setItem('cvData', JSON.stringify(cvData));
    } catch (error) {
      console.warn('Could not store data in sessionStorage:', error);
    }
  }

  // Get CV data
  getData() {
    if (!this.data) {
      // Try to load from sessionStorage if available
      try {
        const storedData = sessionStorage.getItem('cvData');
        if (storedData) {
          this.data = JSON.parse(storedData);
        }
      } catch (error) {
        console.warn('Could not load data from sessionStorage:', error);
      }
    }
    return this.data;
  }

  // Check if data exists
  hasData() {
    return this.getData() !== null;
  }

  // Clear stored data
  clearData() {
    this.data = null;
    try {
      sessionStorage.removeItem('cvData');
    } catch (error) {
      console.warn('Could not clear sessionStorage:', error);
    }
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