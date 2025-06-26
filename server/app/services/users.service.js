const User = require('../models/User');
const About = require('../models/About');
const Links = require('../models/Links');
const Skills = require('../models/Skills');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Certifications = require('../models/Certifications');
const References = require('../models/References');
const profileUser = require('../models/profileUser')
// Simple user services (no auth)
const getUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const { email, name, ...otherData } = userData;
  return await User.create({ email, name, ...otherData });
};

const getAllUsers = async () => {
  return await User.findAll();
};

const updateUser = async (id, userData) => {
  return await User.update(id, userData);
};

const deleteUser = async (id) => {
  return await User.delete(id);
};

const pgetUserById = async (id) => {
  return await profileUser.findById(id);
};

const pcreateUser = async (userData) => {
  const { email, name, ...otherData } = userData;
  return await profileUser.create({ email, name, ...otherData });
};

const pgetAllUsers = async () => {
  return await profileUser.findAll();
};

const pupdateUser = async (id, userData) => {
  return await profileUser.update(id, userData);
};

const pdeleteUser = async (id) => {
  return await profileUser.delete(id);
};
// Links services
const getUserLinks = async (userId) => {
  return await Links.findByUserId(userId);
};

const createUserLinks = async (userId, linksData) => {
  return await Links.create(userId, linksData);
};

const updateUserLinks = async (userId, linksData) => {
  return await Links.update(userId, linksData);
};

const deleteUserLinks = async (userId) => {
  return await Links.delete(userId);
};

// About services
const getUserAbout = async (userId) => {
  return await About.findByUserId(userId);
};

const createUserAbout = async (userId, paragraphs) => {
  return await About.create(userId, paragraphs);
};

const updateUserAbout = async (userId, paragraphs) => {
  return await About.update(userId, paragraphs);
};

const deleteUserAbout = async (userId) => {
  return await About.delete(userId);
};

// Skills services
const getUserSkills = async (userId) => {
  return await Skills.findByUserId(userId);
};

const createUserSkills = async (userId, skillsList) => {
  return await Skills.create(userId, skillsList);
};

const updateUserSkills = async (userId, skillsList) => {
  return await Skills.update(userId, skillsList);
};

const deleteUserSkills = async (userId) => {
  return await Skills.delete(userId);
};

// Education services
const getUserEducation = async (userId) => {
  return await Education.findByUserId(userId);
};

const createEducation = async (userId, educationData) => {
  return await Education.create(userId, educationData);
};

const getEducationById = async (id) => {
  return await Education.findById(id);
};

const updateEducation = async (id, educationData) => {
  return await Education.update(id, educationData);
};

const deleteEducation = async (id) => {
  return await Education.delete(id);
};

// Experience services
const getUserExperience = async (userId) => {
  return await Experience.findByUserId(userId);
};

const createExperience = async (userId, experienceData) => {
  return await Experience.create(userId, experienceData);
};

const getExperienceById = async (id) => {
  return await Experience.findById(id);
};

const updateExperience = async (id, experienceData) => {
  return await Experience.update(id, experienceData);
};

const deleteExperience = async (id) => {
  return await Experience.delete(id);
};

// Certifications services
const getUserCertifications = async (userId) => {
  return await Certifications.findByUserId(userId);
};

const createUserCertifications = async (userId, certificationsList) => {
  return await Certifications.create(userId, certificationsList);
};

const updateUserCertifications = async (userId, certificationsList) => {
  return await Certifications.update(userId, certificationsList);
};

const deleteUserCertifications = async (userId) => {
  return await Certifications.delete(userId);
};

// References services
const getUserReferences = async (userId) => {
  return await References.findByUserId(userId);
};

const createReference = async (userId, referenceData) => {
  return await References.create(userId, referenceData);
};

const getReferenceById = async (id) => {
  return await References.findById(id);
};

const updateReference = async (id, referenceData) => {
  return await References.update(id, referenceData);
};

const deleteReference = async (id) => {
  return await References.delete(id);
};

// Complete portfolio data getter
const getCompletePortfolio = async (userId) => {
  try {
    const [user, links, about, skills, education, experience, certifications, references] = await Promise.all([
      profileUser.findById(userId),
      Links.findByUserId(userId),
      About.findByUserId(userId),
      Skills.findByUserId(userId),
      Education.findByUserId(userId),
      Experience.findByUserId(userId),
      Certifications.findByUserId(userId),
      References.findByUserId(userId)
    ]);

    return {
      user,
      links,
      about: about?.paragraphs || [],
      skills: skills?.skills_list || [],
      education: education || [],
      experience: experience || [],
      certifications: certifications?.certifications_list || [],
      references: references || []
    };
  } catch (error) {
    console.error('Error fetching complete portfolio:', error);
    throw error;
  }
};

// Get public portfolio (for viewing without auth)
const getPublicPortfolio = async (userId) => {
  try {
    const portfolio = await getCompletePortfolio(userId);
    
    // Remove sensitive user data for public view
    if (portfolio.user) {
      const { password, email, ...publicUserData } = portfolio.user;
      portfolio.user = publicUserData;
    }
    
    return portfolio;
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    throw error;
  }
};

module.exports = {
  // User management
  getUserById,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  //profileUser 
  pgetUserById,
  pcreateUser,
  pgetAllUsers,
  pupdateUser,
  pdeleteUser,
  // Links
  getUserLinks,
  createUserLinks,
  updateUserLinks,
  deleteUserLinks,
  // About
  getUserAbout,
  createUserAbout,
  updateUserAbout,
  deleteUserAbout,
  // Skills
  getUserSkills,
  createUserSkills,
  updateUserSkills,
  deleteUserSkills,
  // Education
  getUserEducation,
  createEducation,
  getEducationById,
  updateEducation,
  deleteEducation,
  // Experience
  getUserExperience,
  createExperience,
  getExperienceById,
  updateExperience,
  deleteExperience,
  // Certifications
  getUserCertifications,
  createUserCertifications,
  updateUserCertifications,
  deleteUserCertifications,
  // References
  getUserReferences,
  createReference,
  getReferenceById,
  updateReference,
  deleteReference,
  // Portfolio data
  getCompletePortfolio,
  getPublicPortfolio
};