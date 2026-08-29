const express = require('express');
const router = express.Router();
const { jobsDatabase } = require('../data/jobs');

// ─── All domain categories ─────────────────────────────────────────────────────
const ALL_DOMAINS = [
  'IT', 'Medical', 'Healthcare', 'Finance', 'Sales', 'Marketing',
  'Manufacturing', 'Education', 'Legal', 'Government', 'Hospitality',
  'Logistics', 'HR', 'Media', 'Consulting', 'Retail', 'Real Estate',
  'Agriculture', 'Environment', 'Social', 'Aviation', 'Telecom', 'Other'
];

// ─── Fetch jobs from Remotive API (free, no key needed) ──────────────────────
async function fetchRemotiveJobs(query) {
  try {
    const searchQ = query || 'software developer';
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(searchQ)}&limit=12`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.jobs || []).map(job => ({
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      type: job.job_type || 'Full-time',
      experience: 'Not specified',
      salary: job.salary || 'Competitive',
      remote: true,
      workMode: 'Remote',
      skills: (job.tags || []).map(t => t.toLowerCase()),
      description: job.description ? job.description.replace(/<[^>]+>/g, '').substring(0, 300) + '...' : 'See full description',
      requirements: [],
      category: (job.category || 'general').toLowerCase().replace(/\s+/g, '-'),
      domain: detectDomainFromCategory(job.category),
      domainIcon: '🌐',
      postedDate: job.publication_date ? job.publication_date.split('T')[0] : new Date().toISOString().split('T')[0],
      applyUrl: job.url || '#',
      source: 'Remotive',
      isLive: true,
    }));
  } catch (err) {
    console.error('Remotive API error:', err.message);
    return [];
  }
}

// ─── Fetch jobs from Arbeitnow API (free, no key needed) ─────────────────────
async function fetchArbeitnowJobs(query) {
  try {
    const url = `https://www.arbeitnow.com/api/job-board-api?page=1`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return [];
    const data = await response.json();
    const jobs = (data.data || []).slice(0, 8);
    const searchLower = (query || '').toLowerCase();
    return jobs
      .filter(job => !searchLower || job.title.toLowerCase().includes(searchLower) || (job.tags || []).some(t => t.toLowerCase().includes(searchLower)))
      .map(job => ({
        id: `arbeitnow-${job.slug}`,
        title: job.title,
        company: job.company_name,
        location: job.location || 'Remote',
        type: 'Full-time',
        experience: 'Not specified',
        salary: 'Competitive',
        remote: job.remote || false,
        workMode: job.remote ? 'Remote' : 'Onsite',
        skills: (job.tags || []).map(t => t.toLowerCase()),
        description: job.description ? job.description.replace(/<[^>]+>/g, '').substring(0, 300) + '...' : 'See full description',
        requirements: [],
        category: (job.tags?.[0] || 'general').toLowerCase(),
        domain: 'IT',
        domainIcon: '🌐',
        postedDate: job.created_at ? new Date(job.created_at * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        applyUrl: job.url || '#',
        source: 'Arbeitnow',
        isLive: true,
      }));
  } catch (err) {
    console.error('Arbeitnow API error:', err.message);
    return [];
  }
}

// ─── Fetch jobs from JSearch-like free endpoint (The Muse) ────────────────────
async function fetchTheMuseJobs(query) {
  try {
    const searchQ = query || 'engineer';
    const url = `https://www.themuse.com/api/public/jobs?descending=true&page=1&search=${encodeURIComponent(searchQ)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.results || []).slice(0, 8).map(job => ({
      id: `muse-${job.id}`,
      title: job.name,
      company: job.company?.name || 'Unknown Company',
      location: job.locations?.map(l => l.name).join(', ') || 'Global',
      type: 'Full-time',
      experience: 'Not specified',
      salary: 'Competitive',
      remote: (job.locations || []).some(l => l.name.toLowerCase().includes('remote')),
      workMode: (job.locations || []).some(l => l.name.toLowerCase().includes('remote')) ? 'Remote' : 'Onsite',
      skills: (job.categories || []).map(c => c.name.toLowerCase()),
      description: job.contents ? job.contents.replace(/<[^>]+>/g, '').substring(0, 300) + '...' : 'See full description',
      requirements: [],
      category: job.categories?.[0]?.name.toLowerCase() || 'general',
      domain: detectDomainFromCategory(job.categories?.[0]?.name),
      domainIcon: '🌐',
      postedDate: job.publication_date ? job.publication_date.split('T')[0] : new Date().toISOString().split('T')[0],
      applyUrl: job.refs?.landing_page || '#',
      source: 'The Muse',
      isLive: true,
    }));
  } catch (err) {
    console.error('The Muse API error:', err.message);
    return [];
  }
}

// ─── Helper: detect domain from category string ───────────────────────────────
function detectDomainFromCategory(category) {
  if (!category) return 'IT';
  const cat = category.toLowerCase();
  if (cat.includes('health') || cat.includes('medical') || cat.includes('nurse') || cat.includes('pharma')) return 'Healthcare';
  if (cat.includes('finance') || cat.includes('accounting') || cat.includes('banking')) return 'Finance';
  if (cat.includes('marketing') || cat.includes('seo') || cat.includes('content')) return 'Marketing';
  if (cat.includes('sales') || cat.includes('business dev')) return 'Sales';
  if (cat.includes('education') || cat.includes('teach') || cat.includes('train')) return 'Education';
  if (cat.includes('legal') || cat.includes('law') || cat.includes('compliance')) return 'Legal';
  if (cat.includes('hotel') || cat.includes('hospitality') || cat.includes('travel')) return 'Hospitality';
  if (cat.includes('logistics') || cat.includes('supply') || cat.includes('warehouse')) return 'Logistics';
  if (cat.includes('hr') || cat.includes('recruit') || cat.includes('talent')) return 'HR';
  if (cat.includes('manufactur') || cat.includes('engineer')) return 'Manufacturing';
  return 'IT';
}

// ─── GET /api/jobs — with domain and category filter ──────────────────────────
router.get('/', async (req, res) => {
  const { category, remote, search, domain, live, workMode, type } = req.query;

  // Filter local database
  let jobs = [...jobsDatabase];

  if (domain) jobs = jobs.filter(j => j.domain && j.domain.toLowerCase() === domain.toLowerCase());
  if (category) jobs = jobs.filter(j => j.category === category);
  if (workMode) {
    jobs = jobs.filter(j => (j.workMode || (j.remote ? 'Remote' : 'Onsite')).toLowerCase() === workMode.toLowerCase());
  } else if (remote === 'true') {
    jobs = jobs.filter(j => j.remote || j.workMode === 'Remote');
  }
  if (type) {
    jobs = jobs.filter(j => (j.type || 'Full-time').toLowerCase() === type.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      (j.skills || []).some(s => s.toLowerCase().includes(q)) ||
      (j.domain || '').toLowerCase().includes(q) ||
      (j.workMode || '').toLowerCase().includes(q) ||
      (j.type || '').toLowerCase().includes(q) ||
      (j.location || '').toLowerCase().includes(q)
    );
  }

  // Fetch live jobs from external APIs if requested
  let liveJobs = [];
  if (live === 'true') {
    const [remotiveJobs, arbeitnowJobs, theMuseJobs] = await Promise.allSettled([
      fetchRemotiveJobs(search),
      fetchArbeitnowJobs(search),
      fetchTheMuseJobs(search),
    ]);
    liveJobs = [
      ...(remotiveJobs.status === 'fulfilled' ? remotiveJobs.value : []),
      ...(arbeitnowJobs.status === 'fulfilled' ? arbeitnowJobs.value : []),
      ...(theMuseJobs.status === 'fulfilled' ? theMuseJobs.value : []),
    ];
  }

  res.json({
    jobs,
    liveJobs,
    total: jobs.length,
    liveTotal: liveJobs.length,
    domains: ALL_DOMAINS,
    categories: [...new Set(jobsDatabase.map(j => j.category))],
  });
});

// ─── GET /api/jobs/domains — list all domains ──────────────────────────────────
router.get('/domains', (req, res) => {
  const domainStats = ALL_DOMAINS.map(domain => ({
    domain,
    count: jobsDatabase.filter(j => j.domain === domain).length,
  })).filter(d => d.count > 0);
  res.json({ domains: domainStats, allDomains: ALL_DOMAINS });
});

// ─── GET /api/jobs/live — fetch only live external jobs ────────────────────────
router.get('/live', async (req, res) => {
  const { search, source } = req.query;
  try {
    let liveJobs = [];

    if (!source || source === 'remotive') {
      const r = await fetchRemotiveJobs(search);
      liveJobs = [...liveJobs, ...r];
    }
    if (!source || source === 'arbeitnow') {
      const a = await fetchArbeitnowJobs(search);
      liveJobs = [...liveJobs, ...a];
    }
    if (!source || source === 'themuse') {
      const m = await fetchTheMuseJobs(search);
      liveJobs = [...liveJobs, ...m];
    }

    res.json({ liveJobs, total: liveJobs.length });
  } catch (err) {
    console.error('Live jobs error:', err);
    res.json({ liveJobs: [], total: 0, error: err.message });
  }
});

// ─── GET /api/jobs/:id ─────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const job = jobsDatabase.find(j => j.id === req.params.id);
  job ? res.json(job) : res.status(404).json({ error: 'Job not found' });
});

module.exports = router;
