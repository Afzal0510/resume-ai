const express = require('express');
const router = express.Router();
const { jobsDatabase } = require('../data/jobs');

// Get all jobs
router.get('/', (req, res) => {
  const { category, remote, search } = req.query;
  let jobs = [...jobsDatabase];
  if (category) jobs = jobs.filter(j => j.category === category);
  if (remote === 'true') jobs = jobs.filter(j => j.remote);
  if (search) jobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );
  res.json({ jobs, total: jobs.length });
});

// Get single job
router.get('/:id', (req, res) => {
  const job = jobsDatabase.find(j => j.id === req.params.id);
  job ? res.json(job) : res.status(404).json({ error: 'Job not found' });
});

module.exports = router;
