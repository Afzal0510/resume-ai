const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { jobsDatabase } = require('../data/jobs');
const Anthropic = require('@anthropic-ai/sdk');

// Anthropic Client (initialized safely if key is provided)
let client = null;
if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== '') {
  try {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY.trim() });
  } catch (err) {
    console.warn('Could not initialize Anthropic client:', err.message);
  }
}

// ─── Extract text from uploaded file ──────────────────────────────────────────
async function extractTextFromFile(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  }
  throw new Error('Unsupported file type');
}

// ─── AI-powered skill extraction via Claude ───────────────────────────────────
async function extractSkillsWithAI(resumeText) {
  // If Anthropic API key is not configured, use comprehensive multi-domain parser
  if (!client || !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.trim() === '') {
    return extractSkillsRegex(resumeText);
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are an expert HR and resume parser. Analyze this resume and extract ALL relevant information. Return ONLY valid JSON, no markdown, no explanation.

Resume text:
"""
${resumeText.substring(0, 5000)}
"""

Return this exact JSON structure:
{
  "name": "candidate full name or Unknown",
  "email": "email or null",
  "phone": "phone or null",
  "experienceYears": number (TOTAL professional work years from employment date ranges only; 0 if fresher. Do NOT use skill lines like "5+ years in React"),
  "skills": ["array", "of", "ALL skills including technical, domain, medical, legal, finance, management, soft skills - in lowercase"],
  "education": "highest degree and field",
  "summary": "2-3 sentence professional summary",
  "experienceLevel": "fresher | junior | mid | senior",
  "jobTitles": ["previous job titles"],
  "certifications": ["any certifications"],
  "domain": "primary domain (IT | Medical | Healthcare | Finance | Sales | Marketing | Manufacturing | Education | Legal | Government | Hospitality | Logistics | HR | Media | Consulting | Other)"
}`
      }]
    });

    const text = response.content[0].text.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.warn('AI API call skipped/failed, using multi-domain parser:', err.message);
    return extractSkillsRegex(resumeText);
  }
}

// ─── Comprehensive multi-domain skill extractor ────────────────────────────────
function extractSkillsRegex(text) {
  const lowerText = text.toLowerCase();

  // IT / Software (Languages, AI/LLMs, APIs, Frameworks, Web Tech, Databases, Cloud)
  const itSkills = [
    // Programming Languages
    'c#', '.net', 'sql', 't-sql', 'pl/sql', 'javascript', 'typescript', 'python', 'java', 'c++', 'c', 'go', 'golang', 'rust', 'php', 'ruby', 'kotlin', 'swift', 'dart', 'scala', 'julia', 'matlab', 'bash', 'powershell',
    
    // AI, LLMs & Generative AI Integrations
    'generative ai', 'llm', 'llm integration', 'openai', 'gpt-4', 'gpt-3.5', 'anthropic', 'claude', 'deepgram', 'deepgram api', 'whisper', 'langchain', 'llamaindex', 'huggingface', 'hugging face', 'pinecone', 'chromadb', 'weaviate', 'vector database', 'rag', 'retrieval augmented generation', 'prompt engineering', 'fine-tuning', 'stable diffusion', 'midjourney', 'ollama', 'vllm', 'semantic kernel', 'agentic ai', 'crewai', 'autogen',

    // Frameworks & Web Tech
    'asp.net', 'asp.net core', '.net core', 'blazor', 'react', 'react.js', 'reactjs', 'nodejs', 'node.js', 'express', 'express.js', 'next.js', 'nextjs', 'fastapi', 'django', 'flask', 'spring boot', 'angular', 'vue', 'vue.js', 'svelte', 'sveltekit', 'nuxt', 'gatsby', 'remix', 'jquery', 'bootstrap', 'tailwind', 'tailwindcss', 'material ui', 'chakra ui', 'shadcn', 'css', 'css3', 'html', 'html5', 'sass', 'less',

    // Databases & Data Tech
    'sql server', 'mssql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cosmos db', 'cassandra', 'neo4j', 'snowflake', 'bigquery', 'sqlite', 'firebase', 'supabase',

    // Cloud, DevOps & Tools
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'git', 'github', 'gitlab', 'linux', 'unix',

    // APIs, Architecture & Others
    'rest api', 'restful api', 'graphql', 'grpc', 'websockets', 'microservices', 'serverless', 'kafka', 'rabbitmq', 'cybersecurity', 'penetration testing', 'blockchain', 'solidity', 'tableau', 'power bi', 'data analysis', 'data science', 'machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'nlp', 'deep learning', 'computer vision', 'figma', 'android', 'react native', 'flutter', 'sap', 'salesforce'
  ];

  // Medical / Healthcare
  const medicalSkills = [
    'mbbs', 'md', 'ms medicine', 'bsc nursing', 'gnm', 'nursing', 'patient care',
    'clinical diagnosis', 'emergency medicine', 'icu', 'critical care', 'surgery',
    'pharmacology', 'radiology', 'mri', 'ct scan', 'x-ray', 'ultrasound',
    'pharmacy', 'drug dispensing', 'pharmacovigilance', 'clinical research', 'gcp',
    'medical writing', 'ehr', 'hospital administration', 'healthcare management',
    'counseling', 'psychology', 'cbt', 'psychotherapy', 'mental health',
    'physiotherapy', 'dental', 'ayurveda', 'homeopathy', 'lab technician',
    'blood bank', 'operation theatre', 'telemedicine', 'healthcare analytics',
  ];

  // Finance / Accounting
  const financeSkills = [
    'financial modeling', 'valuation', 'financial analysis', 'accounting', 'ca', 'cpa',
    'cfa', 'auditing', 'taxation', 'gst', 'income tax', 'tds', 'tally', 'quickbooks',
    'investment banking', 'mergers acquisitions', 'ipo', 'venture capital',
    'risk management', 'credit risk', 'market risk', 'var', 'frm', 'insurance',
    'underwriting', 'actuarial', 'ifrs', 'indas', 'cost accounting', 'budget planning',
    'treasury', 'forex', 'derivatives', 'mutual funds', 'portfolio management',
    'banking', 'nbfc', 'microfinance', 'credit analysis',
  ];

  // Sales / Marketing
  const salesMarketingSkills = [
    'sales', 'b2b sales', 'b2c sales', 'fmcg', 'crm', 'salesforce crm', 'lead generation',
    'business development', 'account management', 'key accounts', 'cold calling',
    'digital marketing', 'seo', 'sem', 'ppc', 'google ads', 'facebook ads',
    'content marketing', 'social media', 'email marketing', 'brand management',
    'market research', 'consumer insights', 'advertising', 'copywriting',
    'wordpress', 'hubspot', 'mailchimp', 'analytics', 'growth hacking',
    'affiliate marketing', 'influencer marketing', 'pr', 'events management',
  ];

  // Manufacturing / Engineering
  const manufacturingSkills = [
    'lean manufacturing', 'six sigma', 'kaizen', 'quality control', 'quality assurance',
    'iso 9001', 'autocad', 'solidworks', 'catia', 'ansys', 'fea', 'cad cam',
    'production planning', 'manufacturing processes', 'mechanical design',
    'electrical engineering', 'plc', 'scada', 'hmi', 'automation', 'robotics',
    'industrial engineering', 'tooling', 'mold design', 'cnc', 'fabrication',
    'civil engineering', 'structural design', 'construction management', 'rcc',
    'project management', 'primavera', 'ms project', 'estimation', 'quantity surveying',
  ];

  // Education
  const educationSkills = [
    'teaching', 'curriculum development', 'lesson planning', 'classroom management',
    'instructional design', 'e-learning', 'lms', 'moodle', 'articulate',
    'b.ed', 'm.ed', 'academic research', 'thesis writing', 'assessment',
    'special education', 'montessori', 'coaching', 'tutoring', 'training',
  ];

  // Legal
  const legalSkills = [
    'llb', 'corporate law', 'contract drafting', 'legal research', 'due diligence',
    'mergers acquisitions', 'intellectual property', 'patent filing', 'trademark',
    'litigation', 'arbitration', 'compliance', 'regulatory affairs', 'sebi',
    'rbi regulations', 'legal writing', 'paralegal', 'legal advisor',
  ];

  // HR
  const hrSkills = [
    'hr management', 'recruitment', 'talent acquisition', 'payroll', 'hris',
    'performance management', 'employee relations', 'labor law', 'training',
    'organizational development', 'change management', 'compensation benefits',
    'succession planning', 'workforce planning', 'hris systems', 'workday',
    'darwinbox', 'zoho people', 'campus hiring', 'bulk hiring',
  ];

  // Hospitality
  const hospitalitySkills = [
    'hotel management', 'front office', 'housekeeping', 'f&b', 'food and beverage',
    'guest relations', 'revenue management', 'opera pms', 'restaurant management',
    'culinary arts', 'menu planning', 'haccp', 'food safety', 'catering',
    'travel planning', 'amadeus', 'galileo', 'ticketing', 'tourism',
    'event planning', 'banquet management', 'concierge', 'spa management',
  ];

  // Logistics / Supply Chain
  const logisticsSkills = [
    'supply chain management', 'logistics', 'procurement', 'vendor management',
    'warehouse management', 'inventory management', 'sap mm', 'sap ewm',
    'erp', 'import export', 'freight', 'customs clearance', 'incoterms',
    'fleet management', 'last mile delivery', 'order management',
    'demand planning', 's&op', 'lean logistics', 'distribution', 'cold chain',
  ];

  // Government / Public sector
  const governmentSkills = [
    'civil services', 'upsc', 'ias', 'ips', 'public administration', 'policy making',
    'governance', 'e-governance', 'project implementation', 'government schemes',
    'defence', 'drdo', 'isro', 'psu', 'ngo management', 'social work',
  ];

  // Office / Excel / Data ops (common across domains)
  const officeSkills = [
    'excel', 'ms excel', 'microsoft excel', 'advanced excel', 'google sheets',
    'ms office', 'microsoft office', 'powerpoint', 'ms word', 'outlook',
    'pivot tables', 'vlookup', 'xlookup', 'macros', 'vba', 'data entry',
    'data analysis', 'reporting', 'dashboard', 'spreadsheet',
  ];

  const allSkills = [
    ...itSkills, ...medicalSkills, ...financeSkills, ...salesMarketingSkills,
    ...manufacturingSkills, ...educationSkills, ...legalSkills, ...hrSkills,
    ...hospitalitySkills, ...logisticsSkills, ...governmentSkills, ...officeSkills,
  ];

  const found = [...new Set(allSkills.filter(skill => textHasSkill(lowerText, skill)))];
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const experienceYears = extractTotalExperienceYears(lowerText);

  // Try to detect domain
  let detectedDomain = 'IT';
  const officeHits = officeSkills.filter(s => textHasSkill(lowerText, s)).length;
  if (medicalSkills.filter(s => textHasSkill(lowerText, s)).length >= 3) detectedDomain = 'Healthcare';
  else if (financeSkills.filter(s => textHasSkill(lowerText, s)).length >= 3) detectedDomain = 'Finance';
  else if (officeHits >= 2 && financeSkills.filter(s => textHasSkill(lowerText, s)).length >= 1) detectedDomain = 'Finance';
  else if (officeHits >= 2) detectedDomain = 'Finance';
  else if (salesMarketingSkills.filter(s => textHasSkill(lowerText, s)).length >= 3) detectedDomain = 'Sales/Marketing';
  else if (manufacturingSkills.filter(s => textHasSkill(lowerText, s)).length >= 3) detectedDomain = 'Manufacturing';
  else if (educationSkills.filter(s => textHasSkill(lowerText, s)).length >= 2) detectedDomain = 'Education';
  else if (legalSkills.filter(s => textHasSkill(lowerText, s)).length >= 2) detectedDomain = 'Legal';
  else if (hospitalitySkills.filter(s => textHasSkill(lowerText, s)).length >= 2) detectedDomain = 'Hospitality';
  else if (logisticsSkills.filter(s => textHasSkill(lowerText, s)).length >= 2) detectedDomain = 'Logistics';

  return {
    name: 'Candidate',
    email: emailMatch ? emailMatch[0] : null,
    phone: null,
    experienceYears,
    skills: found,
    education: 'Not extracted',
    summary: `Resume parsed successfully. ${found.length} skills identified from document.`,
    experienceLevel: experienceYears > 5 ? 'senior' : experienceYears > 2 ? 'mid' : experienceYears > 0 ? 'junior' : 'fresher',
    jobTitles: [],
    certifications: [],
    domain: detectedDomain,
  };
}

// Word-boundary skill match so "excel" does not match "excellent"
function textHasSkill(text, skill) {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?:^|[^a-z0-9.+#])${escaped}(?=[^a-z0-9.+#]|$)`, 'i').test(text);
}

// Prefer total career experience; support years and months, and convert short durations like "16 months" to 1.3 years.
function extractTotalExperienceYears(lowerText) {
  const preferred = [
    /(?:total|overall|professional)\s+(?:work\s+)?(?:experience|exp)[:\s]*(\d+(?:\.\d+)?)\+?\s*(years?|yrs?)/,
    /(?:experience|exp)\s*[:\-]\s*(\d+(?:\.\d+)?)\+?\s*(years?|yrs?)/,
    /(\d+(?:\.\d+)?)\+?\s*(years?|yrs?)\s*(?:of\s+)?(?:total\s+|overall\s+|professional\s+)?(?:work\s+)?(?:experience|exp)\b(?!\s+(?:in|with|using)\b)/,
    /(?:total|overall|professional)\s+(?:work\s+)?(?:experience|exp)[:\s]*(\d+)\+?\s*months?/,
    /(?:experience|exp)\s*[:\-]\s*(\d+)\+?\s*months?/,
    /(\d+)\+?\s*months?\s*(?:of\s+)?(?:total\s+|overall\s+|professional\s+)?(?:work\s+)?(?:experience|exp)\b(?!\s+(?:in|with|using)\b)/,
  ];

  for (const pattern of preferred) {
    const match = lowerText.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = (match[2] || '').toLowerCase();
      if (unit.startsWith('month')) {
        const years = value / 12;
        if (years >= 0 && years <= 40) return Number(years.toFixed(1));
      }
      if (value >= 0 && value <= 40) return value;
    }
  }

  const monthPattern = /(?:\b|\D)(\d+)\s*months?\b/i;
  const monthMatch = lowerText.match(monthPattern);
  if (monthMatch) {
    const value = parseFloat(monthMatch[1]) / 12;
    return Number(value.toFixed(1));
  }

  return 0;
}

function extractCandidateName(resumeText, fallbackName = 'Candidate') {
  const cleaned = (resumeText || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return fallbackName;

  const lines = (resumeText || '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line.length < 2 || line.length > 60) continue;
    if (/[.@:/]/.test(line)) continue;
    if (/\b(resume|curriculum vitae|cv|summary|experience|education|skills|projects|contact|linkedin|github|phone|email|location)\b/i.test(line)) continue;
    if (/\d/.test(line)) continue;

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length < 2 || words.length > 5) continue;
    if (words.some(word => ['developer','engineer','manager','analyst','consultant','designer','student','professional','software','data','qa','hr','marketing','sales','teacher','doctor','nurse','lawyer','accountant'].includes(word.toLowerCase()))) continue;
    return line;
  }

  const firstLine = lines[0];
  if (firstLine && firstLine.length <= 60 && !/[.@:/]/.test(firstLine)) return firstLine;
  return fallbackName;
}

function extractJobTitle(resumeText, fallback = 'Professional') {
  const text = resumeText || '';
  const titlePatterns = [
    /(?:role|position|designation|title)[:\s]+([A-Za-z .&/-]{2,40})/i,
    /\b(frontend|backend|full stack|full-stack|fullstack|developer|engineer|designer|analyst|consultant|manager|lead|specialist|executive|director|teacher|doctor|nurse|lawyer|accountant|architect|scientist|researcher|coordinator|admin|operator)\b/i
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length > 40 || /[@:/]/.test(line) || /\b(resume|summary|experience|education|skills|projects|contact|linkedin|github|phone|email|location)\b/i.test(line)) continue;
    if (titlePatterns[1].test(line)) return line;
  }

  return fallback;
}

function normalizePhone(value) {
  if (!value) return '';
  const digits = String(value).replace(/[^0-9+]/g, '').trim();
  if (!digits) return '';
  if (digits.startsWith('+')) {
    const withoutPlus = digits.slice(1).replace(/\D/g, '');
    return withoutPlus.length >= 10 && withoutPlus.length <= 15 ? `+${withoutPlus}` : '';
  }
  const compact = digits.replace(/\D/g, '');
  return compact.length >= 10 && compact.length <= 15 ? compact : '';
}

function extractPhoneNumber(text, fallback = '') {
  const patterns = [
    /\b(?:\+?\d[\s.-]?){0,2}(?:\(?\d{2,4}\)?[\s.-]?){2,4}\d{3,4}\b/g,
    /\b(?:phone|mobile|contact)\b[^0-9+]{0,10}([+0-9][0-9\s.-]{7,15})/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const candidate = normalizePhone(match[1] || match[0]);
      if (candidate) return candidate;
    }
  }

  return normalizePhone(fallback);
}

function extractProfileFields(resumeText, fallbackProfile = {}) {
  const toText = (value) => (typeof value === 'string' ? value.trim() : '');
  const text = resumeText || '';

  const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[^\s/]+/i);
  const githubMatch = text.match(/https?:\/\/(?:www\.)?github\.com\/[^\s/]+/i);
  const phoneMatch = extractPhoneNumber(text, toText(fallbackProfile.phone || ''));
  const locationMatch = text.match(/(?:location|based in|current location|address)[:\s]+([A-Za-z ,.-]+)/i);
  const locationFallbackMatch = text.match(/\b(Delhi|Mumbai|Bengaluru|Bangalore|Hyderabad|Pune|Chennai|Kolkata|Gurugram|Gurgaon|Noida|Ahmedabad|Jaipur|Remote)\b/i);
  const titleMatch = text.match(/(?:role|position|designation|title)[:\s]+([A-Za-z .&/-]+(?:\s+[A-Za-z .&/-]+)*)/i);
  const inferredName = extractCandidateName(text, toText(fallbackProfile.name || fallbackProfile.fullName) || 'Candidate');
  const inferredTitle = extractJobTitle(text, toText(fallbackProfile.jobTitle || fallbackProfile.jobTitles?.[0] || titleMatch?.[1]) || 'Professional');

  return {
    photo: fallbackProfile.photo || null,
    fullName: toText(inferredName) || null,
    jobTitle: toText(inferredTitle) || null,
    location: toText(fallbackProfile.location || locationMatch?.[1] || locationFallbackMatch?.[1]) || null,
    linkedin: toText(fallbackProfile.linkedin || linkedinMatch?.[0]) || null,
    github: toText(fallbackProfile.github || githubMatch?.[0]) || null,
    phone: toText(fallbackProfile.phone || phoneMatch) || null,
    email: toText(fallbackProfile.email) || null,
    summary: toText(fallbackProfile.summary) || null,
    skills: fallbackProfile.skills || [],
    experienceYears: fallbackProfile.experienceYears || 0,
    experienceLevel: fallbackProfile.experienceLevel || 'fresher',
    education: toText(fallbackProfile.education) || null,
    domain: toText(fallbackProfile.domain) || null,
  };
}

// ─── Job matching algorithm (multi-domain & skill aware) ──────────────────────
function matchJobsToProfile(profile) {
  const candidateSkills = (profile.skills || []).map(s => s.toLowerCase());
  const candidateDomain = (profile.domain || '').toLowerCase().trim();
  const candidateExp = profile.experienceYears || 0;

  const scored = jobsDatabase.map(job => {
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());
    const jobDomain = (job.domain || '').toLowerCase().trim();
    const jobCategory = (job.category || '').toLowerCase().trim();

    // Check matched skills (exact or partial match; normalize excel aliases)
    const normalizeSkill = (s) => {
      if (['ms excel', 'microsoft excel', 'advanced excel'].includes(s)) return 'excel';
      if (['ms office', 'microsoft office'].includes(s)) return 'ms office';
      return s;
    };
    const normCandidate = candidateSkills.map(normalizeSkill);
    const matched = [...new Set(
      normCandidate.filter(cs =>
        jobSkills.some(js => {
          const njs = normalizeSkill(js);
          return njs === cs || njs.includes(cs) || cs.includes(njs);
        })
      )
    )];

    // Skill coverage percentage
    let skillMatchPct = jobSkills.length > 0
      ? Math.round((matched.length / jobSkills.length) * 100)
      : 0;

    // Check domain match
    const isDomainMatch = Boolean(
      candidateDomain && jobDomain && (
        jobDomain.includes(candidateDomain.split('/')[0]) ||
        candidateDomain.includes(jobDomain.split('/')[0]) ||
        (candidateDomain.includes('health') && jobDomain.includes('medical')) ||
        (candidateDomain.includes('medical') && jobDomain.includes('health')) ||
        (candidateDomain.includes('it') && ['frontend', 'backend', 'fullstack', 'data', 'devops', 'mobile', 'ai', 'cybersecurity', 'cloud'].includes(jobCategory))
      )
    );

    // Calculate dynamic match score
    let finalScore = skillMatchPct;

    // Boost score if domain matches
    if (isDomainMatch) {
      finalScore = Math.min(100, finalScore + 25);
    }

    // Boost score if high skill overlap
    if (matched.length >= 3) {
      finalScore = Math.min(100, finalScore + 15);
    }

    // If completely wrong domain and 0 matching skills -> 0 score
    if (!isDomainMatch && matched.length === 0) {
      finalScore = 0;
    }

    const missingSkills = jobSkills.filter(js =>
      !candidateSkills.some(cs => cs.includes(js) || js.includes(cs))
    );

    // Experience must fall within the job's stated range (no padded max)
    const expRange = job.experience ? job.experience.match(/(\d+)\s*-\s*(\d+)/) : null;
    let experienceMatch = true;
    if (expRange) {
      const min = parseInt(expRange[1], 10);
      const max = parseInt(expRange[2], 10);
      experienceMatch = candidateExp >= min && candidateExp <= max;
    }

    return {
      ...job,
      matchScore: finalScore,
      matchedSkills: matched,
      missingSkills: missingSkills.slice(0, 5),
      experienceMatch,
      isDomainMatch,
    };
  });

  // Require both: experience in range AND at least one shared skill
  let matchedJobs = scored.filter(j => j.experienceMatch && j.matchedSkills.length > 0);

  return matchedJobs.sort((a, b) => {
    // Prefer more overlapping skills, then score
    if (b.matchedSkills.length !== a.matchedSkills.length) {
      return b.matchedSkills.length - a.matchedSkills.length;
    }
    return b.matchScore - a.matchScore;
  });
}

// ─── Controller: upload & analyze ─────────────────────────────────────────────
async function uploadAndAnalyze(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Use buffer directly from memory storage
    const text = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract meaningful text from resume' });
    }

    const profile = await extractSkillsWithAI(text);
    const extractedProfile = extractProfileFields(text, profile);
    const resolvedName = extractedProfile.fullName || extractedProfile.name || profile.name || profile.fullName || 'Candidate';
    const enrichedProfile = {
      ...profile,
      ...extractedProfile,
      name: resolvedName,
      fullName: extractedProfile.fullName || resolvedName,
      experienceYears: Math.max(
        0,
        Math.min(40, parseInt(profile.experienceYears, 10) || 0)
      )
    };
    const matches = matchJobsToProfile(enrichedProfile);

    const uploadDir = path.join(__dirname, '..', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    const safeName = `${Date.now()}-${(req.file.originalname || 'resume').replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, req.file.buffer);
    const resumePath = `/uploads/${safeName}`;
    const backendBaseUrl = process.env.BACKEND_URL || process.env.API_BASE_URL || 'http://localhost:5000';
    const resumeUrl = `${backendBaseUrl}${resumePath}`;

    res.json({
      success: true,
      profile: enrichedProfile,
      matches,
      totalMatches: matches.length,
      topMatch: matches[0] || null,
      resumeUrl,
      resumePath,
      resumeFileName: safeName
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
}


module.exports = { uploadAndAnalyze };
