const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

const ocrRoutes = require("./routes/ocr.routes");
const portfolioRoutes = require("./routes/portfolio.routes");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
const upload = multer({ dest: path.join(__dirname, "uploads/") });
app.use("/api/ocr", ocrRoutes);
app.use("/api/portfolio", portfolioRoutes);

// Export app for use in server.js
module.exports = app;
