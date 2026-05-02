const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

// In-memory store (replace with DB in production)
const applications = [];

router.post('/apply',
  [
    body('jobId').notEmpty().withMessage('Job ID required'),
    body('name').trim().notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').notEmpty().withMessage('Phone required'),
    body('coverLetter').optional().trim()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const application = {
      id: uuidv4(),
      ...req.body,
      appliedAt: new Date().toISOString(),
      status: 'submitted'
    };

    applications.push(application);
    console.log('📬 New application:', application.name, '→', application.jobId);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: application.id,
      application
    });
  }
);

router.get('/', (req, res) => res.json({ applications, total: applications.length }));

module.exports = router;
