const express = require('express');
const userController = require('../controllers/users/users.controller');

const router = express.Router();

// get user by id
router.get('/:id', userController.getUser);

// create a new user
router.post('/', userController.createUser);

//login user
router.post('/login', userController.loginUser);


module.exports = router;