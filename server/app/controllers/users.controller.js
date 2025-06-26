const userService = require('../services/users.service');

const getProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const profile = await userService.pgetUserById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// CREATE profile
const createProfile = async (req, res) => {
  try {
    const newProfile = await userService.pcreateUser(req.body);
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE profile
const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProfile = await userService.pupdateUser(id, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE profile
const deleteProfile = async (req, res) => {
  try {
    const id = req.params.id;
    await userService.pdeleteUser(id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

const generateCrud = (entity) => {
  const cap = entity;
  return {
    [`getUser${cap}`]: async (req, res) => {
      try {
        const data = await userService[`getUser${cap}`](req.params.id);
        res.json(data || {});
      } catch (error) {
        handleError(res, error, `Failed to get user ${entity}`);
      }
    },
    [`createUser${cap}`]: async (req, res) => {
      try {
        const data = await userService[`createUser${cap}`](req.params.id, req.body);
        res.status(201).json(data);
      } catch (error) {
        handleError(res, error, `Failed to create user ${entity}`);
      }
    },
    [`updateUser${cap}`]: async (req, res) => {
      try {
        const data = await userService[`updateUser${cap}`](req.params.id, req.body);
        if (!data) return res.status(404).json({ error: `${cap} not found` });
        res.json(data);
      } catch (error) {
        handleError(res, error, `Failed to update user ${entity}`);
      }
    },
    [`deleteUser${cap}`]: async (req, res) => {
      try {
        const result = await userService[`deleteUser${cap}`](req.params.id);
        if (!result) return res.status(404).json({ error: `${cap} not found` });
        res.status(204).send();
      } catch (error) {
        handleError(res, error, `Failed to delete user ${entity}`);
      }
    }
  };
};

const {
  getUserLinks,
  createUserLinks,
  updateUserLinks,
  deleteUserLinks
} = generateCrud('Links');

const {
  getUserAbout,
  createUserAbout,
  updateUserAbout,
  deleteUserAbout
} = generateCrud('About');

const {
  getUserSkills,
  createUserSkills,
  updateUserSkills,
  deleteUserSkills
} = generateCrud('Skills');

const {
  getUserCertifications,
  createUserCertifications,
  updateUserCertifications,
  deleteUserCertifications
} = generateCrud('Certifications');

// ---------------------- Education ----------------------

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
    res.status(204).send();
  } catch (error) {
    handleError(res, error, 'Failed to delete education');
  }
};

// ---------------------- Experience ----------------------

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
    res.status(204).send();
  } catch (error) {
    handleError(res, error, 'Failed to delete experience');
  }
};

// ---------------------- References ----------------------

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
    res.status(204).send();
  } catch (error) {
    handleError(res, error, 'Failed to delete reference');
  }
};

// ---------------------- Portfolio ----------------------

const getCompletePortfolio = async (req, res) => {
  try {
    const portfolio = await userService.getCompletePortfolio(req.params.id);
    if (!portfolio.user) return res.status(404).json({ error: 'User not found' });
    res.json(portfolio);
  } catch (error) {
    handleError(res, error, 'Failed to get complete portfolio');
  }
};

// ---------------------- EXPORTS ----------------------

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getUser,
  createUser,
  loginUser,
  refreshToken,
  logoutUser,
  getUserLinks,
  createUserLinks,
  updateUserLinks,
  deleteUserLinks,
  getUserAbout,
  createUserAbout,
  updateUserAbout,
  deleteUserAbout,
  getUserSkills,
  createUserSkills,
  updateUserSkills,
  deleteUserSkills,
  getUserEducation,
  createEducation,
  getEducationById,
  updateEducation,
  deleteEducation,
  getUserExperience,
  createExperience,
  getExperienceById,
  updateExperience,
  deleteExperience,
  getUserCertifications,
  createUserCertifications,
  updateUserCertifications,
  deleteUserCertifications,
  getUserReferences,
  createReference,
  getReferenceById,
  updateReference,
  deleteReference,
  getCompletePortfolio
};