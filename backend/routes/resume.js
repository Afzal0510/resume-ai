const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadAndAnalyze } = require('../controllers/resumeController');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only PDF, DOCX, and TXT files are supported'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/upload', upload.single('resume'), uploadAndAnalyze);


module.exports = router;
