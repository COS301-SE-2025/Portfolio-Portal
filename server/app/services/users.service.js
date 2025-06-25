const User = require('../models/User');
const About = require('../models/About');
const Links = require('../models/Links');
Skills = require('../models/Skills');
Education = require('../models/Education');
Experience = require('../models/Experience');
Certifications = require('../models/Certifications');
References  = require('../models/References');
const supabase = require('../config/supabase');

const getUserById = async (id) => {
  return await User.findById(id);
};

const createUser = async (userData) => {
  const { email, password } = userData;
  return await User.create(email, password);
};

const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
    if (error || !data.session) return null;
        
    const userProfile = await User.findById(data.user.id);
    if (!userProfile) return null;

    return {
      user: userProfile,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data.session) return null;

    return {
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

const logoutUser = async (token) => {
  try {
    await supabase.auth.setSession({ access_token: token });
    const { error } = await supabase.auth.signOut();
    return !error;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
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
      User.findById(userId),
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

module.exports = {
  getUserById,
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
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
  // Complete portfolio
  getCompletePortfolio
};