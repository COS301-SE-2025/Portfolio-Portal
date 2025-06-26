const userService = require('../services/users.service');

const getProfile = async (req, res) => {
  return pgetUser(req, res);
};

const createProfile = async (req, res) => {
  return pcreateUser(req, res);
};

const loginProfile = async (req, res) => {
  return ploginUser(req, res);
};

const refreshProfileToken = async (req, res) => {
  return prefreshToken(req, res);
};

const logoutProfile = async (req, res) => {
  return logoutUser(req, res);
};
// Centralized error response handler
const handleError = (res, error, defaultMessage = 'Internal server error') => {
  console.error(error);
  
  if (error.message.includes('already registered') ){
    return res.status(409).json({ error: 'User already exists' });
  }
  
  if (error.message.includes('Invalid email')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  res.status(500).json({ error: defaultMessage });
};

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Failed to get user');
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Enhanced validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const user = await userService.createUser({ email, password });
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error, 'Failed to create user');
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const result = await userService.loginUser(email, password);
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    
    res.json(result);
  } catch (error) {
    handleError(res, error, 'Login failed');
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: 'Refresh token required' });
    
    const result = await userService.refreshToken(refresh_token);
    if (!result) return res.status(401).json({ error: 'Invalid refresh token' });
    
    res.json(result);
  } catch (error) {
    handleError(res, error, 'Token refresh failed');
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(400).json({ error: 'Authorization token required' });
    
    await userService.logoutUser(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    handleError(res, error, 'Logout failed');
  }
};

// Links controllers
const getUserLinks = async (req, res) => {
  try {
    const links = await userService.getUserLinks(req.params.id);
    res.json(links || {});
  } catch (error) {
    handleError(res, error, 'Failed to get user links');
  }
};

const createUserLinks = async (req, res) => {
  try {
    const links = await userService.createUserLinks(req.params.id, req.body);
    res.status(201).json(links);
  } catch (error) {
    handleError(res, error, 'Failed to create user links');
  }
};

const updateUserLinks = async (req, res) => {
  try {
    const links = await userService.updateUserLinks(req.params.id, req.body);
    if (!links) return res.status(404).json({ error: 'User links not found' });
    res.json(links);
  } catch (error) {
    handleError(res, error, 'Failed to update user links');
  }
};

const deleteUserLinks = async (req, res) => {
  try {
    const result = await userService.deleteUserLinks(req.params.id);
    if (!result) return res.status(404).json({ error: 'User links not found' });
    res.json({ message: 'User links deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete user links');
  }
};

// About controllers
const getUserAbout = async (req, res) => {
  try {
    const about = await userService.getUserAbout(req.params.id);
    res.json(about || {});
  } catch (error) {
    handleError(res, error, 'Failed to get user about');
  }
};

const createUserAbout = async (req, res) => {
  try {
    const { paragraphs } = req.body;
    if (!paragraphs) return res.status(400).json({ error: 'Paragraphs are required' });
    
    const about = await userService.createUserAbout(req.params.id, paragraphs);
    res.status(201).json(about);
  } catch (error) {
    handleError(res, error, 'Failed to create user about');
  }
};

const updateUserAbout = async (req, res) => {
  try {
    const { paragraphs } = req.body;
    if (!paragraphs) return res.status(400).json({ error: 'Paragraphs are required' });
    
    const about = await userService.updateUserAbout(req.params.id, paragraphs);
    if (!about) return res.status(404).json({ error: 'User about not found' });
    res.json(about);
  } catch (error) {
    handleError(res, error, 'Failed to update user about');
  }
};

const deleteUserAbout = async (req, res) => {
  try {
    const result = await userService.deleteUserAbout(req.params.id);
    if (!result) return res.status(404).json({ error: 'User about not found' });
    res.json({ message: 'User about deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete user about');
  }
};

// Skills controllers
const getUserSkills = async (req, res) => {
  try {
    const skills = await userService.getUserSkills(req.params.id);
    res.json(skills || {});
  } catch (error) {
    handleError(res, error, 'Failed to get user skills');
  }
};

const createUserSkills = async (req, res) => {
  try {
    const { skills_list } = req.body;
    if (!skills_list) return res.status(400).json({ error: 'Skills list is required' });
    
    const skills = await userService.createUserSkills(req.params.id, skills_list);
    res.status(201).json(skills);
  } catch (error) {
    handleError(res, error, 'Failed to create user skills');
  }
};

const updateUserSkills = async (req, res) => {
  try {
    const { skills_list } = req.body;
    if (!skills_list) return res.status(400).json({ error: 'Skills list is required' });
    
    const skills = await userService.updateUserSkills(req.params.id, skills_list);
    if (!skills) return res.status(404).json({ error: 'User skills not found' });
    res.json(skills);
  } catch (error) {
    handleError(res, error, 'Failed to update user skills');
  }
};

const deleteUserSkills = async (req, res) => {
  try {
    const result = await userService.deleteUserSkills(req.params.id);
    if (!result) return res.status(404).json({ error: 'User skills not found' });
    res.json({ message: 'User skills deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete user skills');
  }
};

// Education controllers
const getUserEducation = async (req, res) => {
  try {
    const education = await userService.getUserEducation(req.params.id);
    res.json(education || []);
  } catch (error) {
    handleError(res, error, 'Failed to get user education');
  }
};

const createEducation = async (req, res) => {
  try {
    const education = await userService.createEducation(req.params.id, req.body);
    res.status(201).json(education);
  } catch (error) {
    handleError(res, error, 'Failed to create education');
  }
};

const getEducationById = async (req, res) => {
  try {
    const education = await userService.getEducationById(req.params.eduId);
    if (!education) return res.status(404).json({ error: 'Education not found' });
    res.json(education);
  } catch (error) {
    handleError(res, error, 'Failed to get education');
  }
};

const updateEducation = async (req, res) => {
  try {
    const education = await userService.updateEducation(req.params.eduId, req.body);
    if (!education) return res.status(404).json({ error: 'Education not found' });
    res.json(education);
  } catch (error) {
    handleError(res, error, 'Failed to update education');
  }
};

const deleteEducation = async (req, res) => {
  try {
    const result = await userService.deleteEducation(req.params.eduId);
    if (!result) return res.status(404).json({ error: 'Education not found' });
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete education');
  }
};

// Experience controllers
const getUserExperience = async (req, res) => {
  try {
    const experience = await userService.getUserExperience(req.params.id);
    res.json(experience || []);
  } catch (error) {
    handleError(res, error, 'Failed to get user experience');
  }
};

const createExperience = async (req, res) => {
  try {
    const experience = await userService.createExperience(req.params.id, req.body);
    res.status(201).json(experience);
  } catch (error) {
    handleError(res, error, 'Failed to create experience');
  }
};

const getExperienceById = async (req, res) => {
  try {
    const experience = await userService.getExperienceById(req.params.expId);
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json(experience);
  } catch (error) {
    handleError(res, error, 'Failed to get experience');
  }
};

const updateExperience = async (req, res) => {
  try {
    const experience = await userService.updateExperience(req.params.expId, req.body);
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json(experience);
  } catch (error) {
    handleError(res, error, 'Failed to update experience');
  }
};

const deleteExperience = async (req, res) => {
  try {
    const result = await userService.deleteExperience(req.params.expId);
    if (!result) return res.status(404).json({ error: 'Experience not found' });
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete experience');
  }
};

// Certifications controllers
const getUserCertifications = async (req, res) => {
  try {
    const certifications = await userService.getUserCertifications(req.params.id);
    res.json(certifications || {});
  } catch (error) {
    handleError(res, error, 'Failed to get user certifications');
  }
};

const createUserCertifications = async (req, res) => {
  try {
    const { certifications_list } = req.body;
    if (!certifications_list) return res.status(400).json({ error: 'Certifications list is required' });
    
    const certifications = await userService.createUserCertifications(req.params.id, certifications_list);
    res.status(201).json(certifications);
  } catch (error) {
    handleError(res, error, 'Failed to create user certifications');
  }
};

const updateUserCertifications = async (req, res) => {
  try {
    const { certifications_list } = req.body;
    if (!certifications_list) return res.status(400).json({ error: 'Certifications list is required' });
    
    const certifications = await userService.updateUserCertifications(req.params.id, certifications_list);
    if (!certifications) return res.status(404).json({ error: 'User certifications not found' });
    res.json(certifications);
  } catch (error) {
    handleError(res, error, 'Failed to update user certifications');
  }
};

const deleteUserCertifications = async (req, res) => {
  try {
    const result = await userService.deleteUserCertifications(req.params.id);
    if (!result) return res.status(404).json({ error: 'User certifications not found' });
    res.json({ message: 'User certifications deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete user certifications');
  }
};

// References controllers
const getUserReferences = async (req, res) => {
  try {
    const references = await userService.getUserReferences(req.params.id);
    res.json(references || []);
  } catch (error) {
    handleError(res, error, 'Failed to get user references');
  }
};

const createReference = async (req, res) => {
  try {
    const reference = await userService.createReference(req.params.id, req.body);
    res.status(201).json(reference);
  } catch (error) {
    handleError(res, error, 'Failed to create reference');
  }
};

const getReferenceById = async (req, res) => {
  try {
    const reference = await userService.getReferenceById(req.params.refId);
    if (!reference) return res.status(404).json({ error: 'Reference not found' });
    res.json(reference);
  } catch (error) {
    handleError(res, error, 'Failed to get reference');
  }
};

const updateReference = async (req, res) => {
  try {
    const reference = await userService.updateReference(req.params.refId, req.body);
    if (!reference) return res.status(404).json({ error: 'Reference not found' });
    res.json(reference);
  } catch (error) {
    handleError(res, error, 'Failed to update reference');
  }
};

const deleteReference = async (req, res) => {
  try {
    const result = await userService.deleteReference(req.params.refId);
    if (!result) return res.status(404).json({ error: 'Reference not found' });
    res.json({ message: 'Reference deleted successfully' });
  } catch (error) {
    handleError(res, error, 'Failed to delete reference');
  }
};

// Portfolio controllers
const getCompletePortfolio = async (req, res) => {
  try {
    const portfolio = await userService.getCompletePortfolio(req.params.id);
    if (!portfolio.user) return res.status(404).json({ error: 'User not found' });
    res.json(portfolio);
  } catch (error) {
    handleError(res, error, 'Failed to get complete portfolio');
  }
};

module.exports = {
  //users table
  getProfile,
  createProfile,
  loginProfile,
  refreshProfileToken,
  logoutProfile,

  //profiles table
  getUser,
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
  // Portfolio
  getCompletePortfolio
};