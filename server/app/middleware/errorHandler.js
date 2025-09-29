// middleware/errorHandler.js

/**
 * Centralized error handling middleware.
 * This catches errors thrown by controllers or services and sends an appropriate JSON response.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  console.error('An error occurred:', err); // Log the error for debugging

  // Default error status and message
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types or messages
  if (err.message.includes('already registered') || err.message.includes('User already registered')) {
    statusCode = 409; // Conflict
    message = 'User already exists';
  } else if (err.message.includes('Invalid email format')) {
    statusCode = 400; // Bad Request
    message = 'Invalid email format';
  } else if (err.message.includes('User not found') || err.message.includes('Profile not found')) {
    statusCode = 404; // Not Found
    message = 'User not found';
  } else if (err.message.includes('Invalid file type') || err.message.includes('Only image files are allowed')) {
    statusCode = 400; // Bad Request
    message = err.message; // Use the specific message from the error
  } else if (err.message.includes('File size too large')) {
    statusCode = 413; // Payload Too Large
    message = err.message;
  } else if (err.message.includes('Search query must be')) {
    statusCode = 400; // Bad Request
    message = err.message;
  } else if (err.message.includes('Invalid credentials') || err.message.includes('Invalid refresh token')) {
    statusCode = 401; // Unauthorized
    message = err.message;
  } else if (err.message.includes('Authorization token required')) {
    statusCode = 401; // Unauthorized
    message = 'Authorization token required';
  } else if (err.message.includes('Cannot update another user\'s profile')) {
    statusCode = 403; // Forbidden
    message = err.message;
  } else if (err.message.includes('No file provided')) {
    statusCode = 400; // Bad Request
    message = 'No file provided for upload';
  }

  // Handle Multer errors specifically
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      message = 'File size too large. Maximum size is 5MB';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      statusCode = 400;
      message = 'Unexpected file field';
    }
  }

  // Send the error response
  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;