require('dotenv').config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const ocrRoutes = require("./app/routes/ocr.routes");
const portfolioRoutes = require("./app/routes/portfolio.routes");
const userRoutes = require("./app/routes/users.routes");
const cvRoutes = require('./app/routes/cv.routes');
const githubRoutes = require('./app/routes/github.routes');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(morgan("dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Increase timeout for large file operations
app.use((req, res, next) => {
  if (req.url.includes('/download')) {
    req.setTimeout(300000); // 5 minutes for download requests
    res.setTimeout(300000);
  } else if (req.url.includes('/github/deploy')) {
    req.setTimeout(600000); // 10 minutes for GitHub deployment requests
    res.setTimeout(600000);
  }
  next();
});

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true, // Changed to true to ensure session is created
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Added for better cross-origin support
  },
  name: 'portfolio.session' // Custom session name
}));

// Debug middleware for sessions
app.use((req, res, next) => {
  if (req.path.includes('/github/')) {
    console.log('Session debug:', {
      sessionID: req.sessionID,
      hasSession: !!req.session,
      githubOAuthState: req.session?.githubOAuthState,
      path: req.path
    });
  }
  next();
});

// File upload middleware
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// Routes
app.use("/api/ocr", ocrRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/users", userRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/github', githubRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve static files from frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Root route - serve the frontend application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Catch-all handler: send back React's index.html file for any non-API routes
// Note: Using a more specific pattern to avoid path-to-regexp issues
// app.get('/*', (req, res) => {
//   // Only serve index.html for non-API routes
//   if (!req.path.startsWith('/api/')) {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//   } else {
//     res.status(404).json({ error: 'API endpoint not found' });
//   }
// });

// Export app for use in server.js
module.exports = app;