require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const ocrRoutes = require("./app/routes/ocr.routes");
const portfolioRoutes = require("./app/routes/portfolio.routes");
const userRoutes = require("./app/routes/users.routes");
const cvRoutes = require('./app/routes/cv.routes');
const githubRoutes = require('./app/routes/github.routes');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const socialRoutes = require('./app/routes/social.routes');
const app = express();

// Trust proxy - MUST come before CORS
app.set('trust proxy', 1);

// CORS Middleware - MUST come before other middleware
const allowedOrigins = [
  'https://www.portfolioportal.co.za',
  'https://portfolioportal.co.za',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('⚠️ Blocked by CORS:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

app.use(morgan("dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Increase timeout for large file operations
app.use((req, res, next) => {
  if (req.url.includes('/ocr') || req.url.includes('/download')) {
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);
  }
  next();
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false, // Changed from true - only save if modified
  saveUninitialized: false, // Changed from true - don't create session until something stored
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.portfolioportal.co.za' : undefined
  },
  name: 'portfolio.session',
  proxy: true,
  store: new MemoryStore({
    checkPeriod: 86400000 
  })
}));

// Debug middleware (optional - comment out in production)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('origin')}`);
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
app.use('/api/social', socialRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV
  });
});

// Serve static files from frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Root route - serve the frontend application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Catch-all route for SPA (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Export app for use in server.js
module.exports = app;
