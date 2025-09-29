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

// Middleware
app.use(cors({
  origin: [
    'https://www.portfolioportal.co.za',
    'https://portfolioportal.co.za',  // without www
    'http://localhost:5173',           // local dev
    'http://localhost:3000'            // local dev
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan("dev"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Increase timeout for large file operations
app.use((req, res, next) => {
  if (req.url.includes('/download')) {
    req.setTimeout(300000); // 5 minutes for download requests
    res.setTimeout(300000);
    res.setTimeout(600000);
  }
  next();
});

app.set('trust proxy', 1);


app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  name: 'portfolio.session',
  proxy: true, 
  store: new MemoryStore({
    checkPeriod: 86400000 
  })}));


// Debug middleware for sessions

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
    uptime: process.uptime()
  });
});

// Serve static files from frontend build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));


// Root route - serve the frontend application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Export app for use in server.js
module.exports = app;
