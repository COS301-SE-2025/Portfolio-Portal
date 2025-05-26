const express = require("express");
const router = express.Router();
const ocrController = require("../controllers/ocr.controller");

router.post("/upload", ocrController.handleUpload);

module.exports = router;