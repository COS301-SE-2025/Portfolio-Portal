// middleware/profileValidation.js
const validator = require('validator');

// Validation schemas
const profileValidation = {
  validateProfileUpdate: (req, res, next) => {
    const { 
      name, 
      bio, 
      cv_url, 
      about_paragraphs, 
      certifications, 
      skills, 
      linkedin, 
      github 
    } = req.body;

    const errors = [];

    // Name validation
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
      if (name.length > 100) {
        errors.push('Name must be less than 100 characters');
      }
    }

    // Bio validation
    if (bio !== undefined) {
      if (typeof bio !== 'string') {
        errors.push('Bio must be a string');
      }
      if (bio.length > 500) {
        errors.push('Bio must be less than 500 characters');
      }
    }

    // CV URL validation
    if (cv_url !== undefined && cv_url !== null && cv_url !== '') {
      if (!validator.isURL(cv_url)) {
        errors.push('CV URL must be a valid URL');
      }
    }

    // About paragraphs validation
    if (about_paragraphs !== undefined) {
      if (!Array.isArray(about_paragraphs)) {
        errors.push('About paragraphs must be an array');
      } else {
        if (about_paragraphs.length > 10) {
          errors.push('Maximum 10 about paragraphs allowed');
        }
        about_paragraphs.forEach((paragraph, index) => {
          if (typeof paragraph !== 'string') {
            errors.push(`About paragraph ${index + 1} must be a string`);
          }
          if (paragraph.length > 1000) {
            errors.push(`About paragraph ${index + 1} must be less than 1000 characters`);
          }
        });
      }
    }

    // Certifications validation
    if (certifications !== undefined) {
      if (!Array.isArray(certifications)) {
        errors.push('Certifications must be an array');
      } else {
        if (certifications.length > 20) {
          errors.push('Maximum 20 certifications allowed');
        }
        certifications.forEach((cert, index) => {
          if (typeof cert !== 'string') {
            errors.push(`Certification ${index + 1} must be a string`);
          }
          if (cert.length > 200) {
            errors.push(`Certification ${index + 1} must be less than 200 characters`);
          }
        });
      }
    }

    // Skills validation
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        errors.push('Skills must be an array');
      } else {
        if (skills.length > 50) {
          errors.push('Maximum 50 skills allowed');
        }
        skills.forEach((skill, index) => {
          if (typeof skill !== 'string') {
            errors.push(`Skill ${index + 1} must be a string`);
          }
          if (skill.length > 50) {
            errors.push(`Skill ${index + 1} must be less than 50 characters`);
          }
        });
      }
    }

    // LinkedIn validation
    if (linkedin !== undefined && linkedin !== null && linkedin !== '') {
      if (!validator.isURL(linkedin)) {
        errors.push('LinkedIn must be a valid URL');
      }
      if (!linkedin.includes('linkedin.com')) {
        errors.push('LinkedIn URL must be a valid LinkedIn profile URL');
      }
    }

    // GitHub validation
    if (github !== undefined && github !== null && github !== '') {
      if (!validator.isURL(github)) {
        errors.push('GitHub must be a valid URL');
      }
      if (!github.includes('github.com')) {
        errors.push('GitHub URL must be a valid GitHub profile URL');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    next();
  },

  validateSearch: (req, res, next) => {
    const { q, page, limit } = req.query;
    const errors = [];

    // Query validation
    if (!q || typeof q !== 'string') {
      errors.push('Search query is required and must be a string');
    } else if (q.trim().length < 2) {
      errors.push('Search query must be at least 2 characters long');
    } else if (q.length > 100) {
      errors.push('Search query must be less than 100 characters');
    }

    // Page validation
    if (page !== undefined) {
      const pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        errors.push('Page must be a positive integer');
      }
      if (pageNum > 1000) {
        errors.push('Page number too high (maximum 1000)');
      }
    }

    // Limit validation
    if (limit !== undefined) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1) {
        errors.push('Limit must be a positive integer');
      }
      if (limitNum > 100) {
        errors.push('Limit cannot exceed 100');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    next();
  },

  validateSkillsSearch: (req, res, next) => {
    const { skills, limit } = req.query;
    const errors = [];

    // Skills validation
    if (!skills) {
      errors.push('Skills parameter is required');
    } else {
      const skillsArray = typeof skills === 'string' ? skills.split(',') : skills;
      if (!Array.isArray(skillsArray)) {
        errors.push('Skills must be an array or comma-separated string');
      } else if (skillsArray.length === 0) {
        errors.push('At least one skill must be provided');
      } else if (skillsArray.length > 10) {
        errors.push('Maximum 10 skills allowed for search');
      }
    }

    // Limit validation
    if (limit !== undefined) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1) {
        errors.push('Limit must be a positive integer');
      }
      if (limitNum > 50) {
        errors.push('Limit cannot exceed 50 for skills search');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors 
      });
    }

    next();
  }
};

module.exports = profileValidation;