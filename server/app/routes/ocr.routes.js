const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const ocrController = require("../controllers/ocr.controller");
const { validateToken } = require("../middleware/auth");

const upload = multer({ dest: path.join(__dirname, "../uploads/") });

// Make sure the field name matches the frontend: 'cv'
router.post("/upload", validateToken, upload.single("cv"), ocrController.handleUpload);

module.exports = router;