const express = require('express');
const userController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth'); // Add authentication middleware

const router = express.Router();

// Get user by id
router.get('/:id', userController.getUser);

// Create a new user (register)
router.post('/register', userController.createUser);

// Login user
router.post('/login', userController.loginUser);

// Refresh access token
router.post('/refresh', userController.refreshToken);

// Logout user - requires valid access token
router.post('/logout', authMiddleware.validateToken, userController.logoutUser);

//profileUser
// Get user by id
router.get('/profile/:id', userController.getProfile);

// Create a new user (register)
router.post('/profile/register', userController.createProfile);

// Login user
router.post('/profile/login', userController.loginProfile);

// Refresh access token
router.post('/profile/refresh', userController.refreshProfileToken);

// Logout user - requires valid access token
router.post('/profile/logout', authMiddleware.validateToken, userController.logoutProfile);

// Links routes
router.get('/:id/links', userController.getUserLinks);
router.post('/:id/links', userController.createUserLinks);
router.put('/:id/links', userController.updateUserLinks);
router.delete('/:id/links', userController.deleteUserLinks);

// About routes
router.get('/:id/about', userController.getUserAbout);
router.post('/:id/about', userController.createUserAbout);
router.put('/:id/about', userController.updateUserAbout);
router.delete('/:id/about', userController.deleteUserAbout);

// Skills routes
router.get('/:id/skills', userController.getUserSkills);
router.post('/:id/skills', userController.createUserSkills);
router.put('/:id/skills', userController.updateUserSkills);
router.delete('/:id/skills', userController.deleteUserSkills);

// Education routes
router.get('/:id/education', userController.getUserEducation);
router.post('/:id/education', userController.createEducation);
router.get('/education/:eduId', userController.getEducationById);
router.put('/education/:eduId', userController.updateEducation);
router.delete('/education/:eduId', userController.deleteEducation);

// Experience routes
router.get('/:id/experience', userController.getUserExperience);
router.post('/:id/experience', userController.createExperience);
router.get('/experience/:expId', userController.getExperienceById);
router.put('/experience/:expId', userController.updateExperience);
router.delete('/experience/:expId', userController.deleteExperience);

// Certifications routes
router.get('/:id/certifications', userController.getUserCertifications);
router.post('/:id/certifications', userController.createUserCertifications);
router.put('/:id/certifications', userController.updateUserCertifications);
router.delete('/:id/certifications', userController.deleteUserCertifications);

// References routes
router.get('/:id/references', userController.getUserReferences);
router.post('/:id/references', userController.createReference);
router.get('/references/:refId', userController.getReferenceById);
router.put('/references/:refId', userController.updateReference);
router.delete('/references/:refId', userController.deleteReference);

// Complete portfolio
router.get('/:id/portfolio', userController.getCompletePortfolio);

module.exports = router;