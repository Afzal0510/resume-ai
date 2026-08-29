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
    // Silence internal TrueType font bytecode warnings from pdfjs-dist
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && (args[0].includes('TT:') || args[0].includes('undefined function: 21'))) {
        return;
      }
      originalWarn.apply(console, args);
    };
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } finally {
      console.warn = originalWarn;
    }
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
  "domain": "primary domain: (IT | Medical | Healthcare | Finance | Sales | Marketing | Manufacturing | Education | Legal | Government | Hospitality | Logistics | HR | Media | Consulting | Other). Note: If candidate is a Software Developer, Web Developer, Programmer, Engineer, Coder, Tech/IT specialist, domain MUST be 'IT'."
}`
      }]
    });

    const text = response.content[0].text.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    // Double-check domain accuracy
    parsed.domain = resolveDomain(resumeText, parsed.skills || [], parsed.jobTitles?.[0] || '', parsed.domain);
    return parsed;
  } catch (err) {
    console.warn('AI API call skipped/failed, using multi-domain parser:', err.message);
    return extractSkillsRegex(resumeText);
  }
}

// ─── Comprehensive multi-domain skill lists ────────────────────────────────────
const itSkillsList = [
  'c#', '.net', 'asp.net', 'asp.net core', '.net core', 'blazor', 'sql', 't-sql', 'pl/sql',
  'javascript', 'typescript', 'python', 'java', 'c++', 'c', 'go', 'golang', 'rust', 'php', 'ruby',
  'kotlin', 'swift', 'dart', 'scala', 'bash', 'powershell',
  // AI, LLMs & APIs
  'generative ai', 'llm', 'llm integration', 'openai', 'gpt-4', 'gpt-3.5', 'anthropic', 'claude',
  'deepgram', 'deepgram api', 'whisper', 'langchain', 'llamaindex', 'huggingface', 'hugging face',
  'pinecone', 'chromadb', 'weaviate', 'vector database', 'rag', 'retrieval augmented generation',
  'prompt engineering', 'fine-tuning', 'agentic ai',
  // Web & Frameworks
  'react', 'react.js', 'reactjs', 'nodejs', 'node.js', 'express', 'express.js', 'next.js', 'nextjs',
  'fastapi', 'django', 'flask', 'spring boot', 'angular', 'vue', 'vue.js', 'svelte', 'jquery',
  'bootstrap', 'tailwind', 'tailwindcss', 'material ui', 'chakra ui', 'css', 'css3', 'html', 'html5',
  // Databases
  'sql server', 'mssql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch',
  'dynamodb', 'sqlite', 'firebase', 'supabase',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'git', 'github', 'gitlab', 'linux',
  // APIs & Architecture
  'rest api', 'restful api', 'graphql', 'microservices', 'serverless', 'data science', 'machine learning',
  'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'nlp', 'deep learning', 'figma', 'react native', 'flutter'
];

const medicalSkillsList = [
  'mbbs', 'md', 'ms medicine', 'bsc nursing', 'gnm', 'nursing', 'patient care',
  'clinical diagnosis', 'emergency medicine', 'icu', 'critical care', 'surgery',
  'pharmacology', 'radiology', 'mri', 'ct scan', 'x-ray', 'ultrasound',
  'pharmacy', 'drug dispensing', 'pharmacovigilance', 'clinical research',
  'medical writing', 'hospital administration', 'healthcare management',
  'physiotherapy', 'dental', 'ayurveda', 'homeopathy', 'lab technician'
];

const financeSkillsList = [
  'financial modeling', 'valuation', 'financial analysis', 'accounting', 'ca', 'cpa',
  'cfa', 'auditing', 'taxation', 'gst', 'income tax', 'tds', 'tally', 'quickbooks',
  'investment banking', 'mergers acquisitions', 'risk management', 'credit risk',
  'underwriting', 'cost accounting', 'budget planning', 'treasury', 'forex', 'portfolio management',
  'banking', 'credit analysis', 'invoice processing', 'accounts payable', 'accounts receivable',
  'reconciliation', 'billing', 'invoicing', 'process compliance', 'financial reporting'
];

const salesMarketingSkillsList = [
  'sales', 'b2b sales', 'b2c sales', 'crm', 'salesforce crm', 'lead generation',
  'business development', 'account management', 'cold calling', 'digital marketing',
  'seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'content marketing', 'social media',
  'email marketing', 'brand management', 'market research', 'copywriting', 'growth hacking'
];

const manufacturingSkillsList = [
  'lean manufacturing', 'six sigma', 'kaizen', 'quality control', 'quality assurance',
  'iso 9001', 'autocad', 'solidworks', 'catia', 'ansys', 'fea', 'cad cam',
  'production planning', 'mechanical design', 'electrical engineering', 'plc', 'scada',
  'automation', 'robotics', 'industrial engineering', 'civil engineering', 'structural design'
];

const educationSkillsList = [
  'teaching', 'curriculum development', 'lesson planning', 'classroom management',
  'instructional design', 'e-learning', 'lms', 'b.ed', 'm.ed', 'academic research',
  'special education', 'coaching', 'tutoring', 'training'
];

const legalSkillsList = [
  'llb', 'corporate law', 'contract drafting', 'legal research', 'due diligence',
  'intellectual property', 'patent filing', 'trademark', 'litigation', 'arbitration',
  'compliance', 'regulatory affairs', 'legal writing', 'legal advisor'
];

const hrSkillsList = [
  'hr management', 'recruitment', 'talent acquisition', 'payroll', 'hris',
  'performance management', 'employee relations', 'labor law', 'training',
  'compensation benefits', 'workforce planning', 'workday', 'zoho people', 'campus hiring'
];

const hospitalitySkillsList = [
  'hotel management', 'front office', 'housekeeping', 'f&b', 'food and beverage',
  'guest relations', 'revenue management', 'opera pms', 'restaurant management',
  'culinary arts', 'catering', 'travel planning', 'tourism'
];

const logisticsSkillsList = [
  'supply chain management', 'logistics', 'procurement', 'vendor management',
  'warehouse management', 'inventory management', 'sap mm', 'freight', 'customs clearance',
  'fleet management', 'last mile delivery', 'demand planning'
];

const officeSkillsList = [
  'excel', 'ms excel', 'microsoft excel', 'advanced excel', 'google sheets',
  'ms office', 'microsoft office', 'powerpoint', 'ms word', 'outlook',
  'pivot tables', 'vlookup', 'xlookup', 'data entry', 'reporting', 'dashboard'
];

// ─── Domain Resolution Helper ──────────────────────────────────────────────────
function resolveDomain(text, skills = [], jobTitle = '', fallbackDomain = '') {
  const lower = (text || '').toLowerCase();
  const titleLower = (jobTitle || '').toLowerCase();
  const skillsLower = skills.map(s => s.toLowerCase());

  // 1. Strong IT Title / Role indicators
  const itTitlePatterns = [
    /\b(software developer|software engineer|web developer|frontend developer|backend developer|full[\s-]?stack developer|programmer|coder|sde|application developer|mobile developer|android developer|ios developer|react developer|node developer|python developer|java developer|\.net developer|c# developer|data scientist|data analyst|devops engineer|cloud engineer|ui\/ux designer|qa engineer|ai engineer|machine learning engineer|systems? engineer|database administrator)\b/i,
    /\b(developer|programmer|coder|software|sde|frontend|backend|fullstack|devops|full stack)\b/i
  ];

  if (itTitlePatterns[0].test(titleLower) || itTitlePatterns[0].test(lower)) {
    return 'IT';
  }

  // 2. Count skill hits per domain
  const itHits = itSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const medicalHits = medicalSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const financeHits = financeSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const salesHits = salesMarketingSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const mfgHits = manufacturingSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const eduHits = educationSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const legalHits = legalSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const hrHits = hrSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const hospHits = hospitalitySkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;
  const logHits = logisticsSkillsList.filter(s => skillsLower.includes(s) || textHasSkill(lower, s)).length;

  // If candidate has IT skills and IT keywords
  if (itHits >= 2 || (itHits >= 1 && itTitlePatterns[1].test(lower))) {
    return 'IT';
  }

  // Specific domain checks
  if (medicalHits >= 2 || /\b(doctor|physician|nurse|mbbs|hospital|patient care|clinical)\b/i.test(lower)) return 'Healthcare';
  if (financeHits >= 2 || /\b(chartered accountant|ca|cpa|cfa|auditor|taxation|financial modeling|tally|gst)\b/i.test(lower)) return 'Finance';
  if (salesHits >= 2 || /\b(sales executive|business development|bde|digital marketing|seo|lead generation)\b/i.test(lower)) return 'Sales';
  if (legalHits >= 2 || /\b(lawyer|advocate|attorney|llb|legal counsel|litigation)\b/i.test(lower)) return 'Legal';
  if (eduHits >= 2 || /\b(teacher|professor|lecturer|b\.ed|curriculum|teaching)\b/i.test(lower)) return 'Education';
  if (hrHits >= 2 || /\b(human resources|talent acquisition|recruiter|hr manager|payroll)\b/i.test(lower)) return 'HR';
  if (mfgHits >= 2 || /\b(mechanical engineer|civil engineer|autocad|solidworks|six sigma)\b/i.test(lower)) return 'Manufacturing';
  if (hospHits >= 2 || /\b(hotel management|f&b|chef|culinary|housekeeping)\b/i.test(lower)) return 'Hospitality';
  if (logHits >= 2 || /\b(supply chain|logistics|warehouse management|procurement)\b/i.test(lower)) return 'Logistics';

  // Fallback to existing or default to IT if has any tech skill
  if (fallbackDomain && fallbackDomain !== 'Other') return fallbackDomain;
  if (itHits >= 1) return 'IT';
  return 'IT';
}

// ─── Extract Summary from resume text ──────────────────────────────────────────
function extractSummaryFromText(resumeText) {
  const text = resumeText || '';

  // 1. Check for explicit header: Summary, Objective, About Me, Profile
  const headerMatch = text.match(/(?:summary|professional summary|career summary|about me|profile summary|profile|objective|career objective)[:\s\n\r]+([^\n\r]+(?:\n[^\n\r]+){0,4})/i);
  if (headerMatch && headerMatch[1]) {
    const candidate = headerMatch[1]
      .replace(/^(?:resume|experience|skills|education|projects|contact)[:\s]*/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (candidate.length >= 30 && candidate.length <= 600) {
      return candidate;
    }
  }

  // 2. Check for objective / summary paragraphs in the top portion (first 1500 chars)
  const topText = text.substring(0, 1500);
  const paragraphs = topText.split(/(?:\r?\n\s*){2,}/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);

  for (const para of paragraphs) {
    if (para.length < 40 || para.length > 600) continue;
    // Skip if it contains contact details or header keywords only
    if (/[@:/]/.test(para) && (para.includes('@') || para.includes('http') || para.includes('phone') || para.includes('linkedin'))) continue;
    if (/^(?:experience|skills|education|projects|technical skills|certifications)\b/i.test(para)) continue;

    // Check for common summary / objective phrases
    if (/^(?:to work in|to obtain|to secure|to leverage|seeking|experienced|dedicated|results-driven|passionate|professional with|focused on|motivated|a highly skilled|efficient in|looking for|dynamic)\b/i.test(para) || (para.length >= 60 && para.includes('.'))) {
      return para;
    }
  }

  return null;
}

// ─── Comprehensive multi-domain skill extractor ────────────────────────────────
function extractSkillsRegex(text) {
  const lowerText = text.toLowerCase();

  const allSkills = [
    ...itSkillsList, ...medicalSkillsList, ...financeSkillsList, ...salesMarketingSkillsList,
    ...manufacturingSkillsList, ...educationSkillsList, ...legalSkillsList, ...hrSkillsList,
    ...hospitalitySkillsList, ...logisticsSkillsList, ...officeSkillsList,
  ];

  const found = [...new Set(allSkills.filter(skill => textHasSkill(lowerText, skill)))];
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const experienceYears = extractTotalExperienceYears(lowerText);
  const inferredTitle = extractJobTitle(text, 'Professional');
  const detectedDomain = resolveDomain(text, found, inferredTitle, '');
  const realSummary = extractSummaryFromText(text);

  return {
    name: 'Candidate',
    email: emailMatch ? emailMatch[0] : null,
    phone: null,
    experienceYears,
    skills: found,
    education: 'Not extracted',
    summary: realSummary || null,
    experienceLevel: experienceYears > 5 ? 'senior' : experienceYears > 2 ? 'mid' : experienceYears > 0 ? 'junior' : 'fresher',
    jobTitles: inferredTitle !== 'Professional' ? [inferredTitle] : [],
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
    /\b(software developer|software engineer|web developer|frontend developer|backend developer|full[\s-]?stack developer|programmer|coder|sde|python developer|react developer|node developer|java developer|\.net developer|c# developer|data scientist|data analyst|devops engineer|cloud engineer|ui\/ux designer|qa engineer|ai engineer|machine learning engineer|mobile developer|android developer|ios developer|doctor|physician|nurse|surgeon|pharmacist|accountant|financial analyst|chartered accountant|sales executive|marketing manager|digital marketer|teacher|professor|lawyer|advocate|hr manager|recruiter|mechanical engineer|civil engineer|electrical engineer|hotel manager|chef|supply chain manager)\b/i,
    /\b(frontend|backend|full stack|full-stack|fullstack|developer|engineer|designer|analyst|consultant|manager|lead|specialist|executive|director|teacher|doctor|nurse|lawyer|accountant|architect|scientist|researcher|coordinator|admin|operator)\b/i
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) return match[1].trim();
  }

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length > 40 || /[@:/]/.test(line) || /\b(resume|summary|experience|education|skills|projects|contact|linkedin|github|phone|email|location)\b/i.test(line)) continue;
    if (titlePatterns[1].test(line) || titlePatterns[2].test(line)) return line;
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

  const detectedDomain = resolveDomain(
    text,
    fallbackProfile.skills || [],
    inferredTitle,
    toText(fallbackProfile.domain)
  );

  return {
    photo: fallbackProfile.photo || null,
    fullName: toText(inferredName) || null,
    jobTitle: toText(inferredTitle) || null,
    location: toText(fallbackProfile.location || locationMatch?.[1] || locationFallbackMatch?.[1]) || null,
    linkedin: toText(fallbackProfile.linkedin || linkedinMatch?.[0]) || null,
    github: toText(fallbackProfile.github || githubMatch?.[0]) || null,
    phone: toText(fallbackProfile.phone || phoneMatch) || null,
    email: toText(fallbackProfile.email) || null,
    summary: (toText(fallbackProfile.summary) && !toText(fallbackProfile.summary).startsWith('Resume parsed successfully'))
      ? toText(fallbackProfile.summary)
      : (extractSummaryFromText(text) || null),
    skills: fallbackProfile.skills || [],
    experienceYears: fallbackProfile.experienceYears || 0,
    experienceLevel: fallbackProfile.experienceLevel || 'fresher',
    education: toText(fallbackProfile.education) || null,
    domain: detectedDomain,
  };
}

// ─── Job matching algorithm (strict domain & skill aware) ──────────────────────
function matchJobsToProfile(profile) {
  const candidateSkills = (profile.skills || []).map(s => s.toLowerCase());
  const candidateDomain = (profile.domain || 'IT').toLowerCase().trim();
  const candidateExp = profile.experienceYears || 0;
  const candidateTitle = (profile.jobTitle || '').toLowerCase().trim();

  // Define IT category list
  const itCategories = ['frontend', 'backend', 'fullstack', 'data', 'devops', 'mobile', 'ai', 'cybersecurity', 'cloud', 'design', 'software', 'qa'];

  const scored = jobsDatabase.map(job => {
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());
    const jobDomain = (job.domain || '').toLowerCase().trim();
    const jobCategory = (job.category || '').toLowerCase().trim();
    const jobTitle = (job.title || '').toLowerCase().trim();

    // Check matched skills (exact or partial match; normalize excel/office aliases)
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

    // Check Domain Compatibility:
    // When candidate is in IT, ONLY match IT jobs (jobDomain === 'it'). Exclude Medical, Finance, Legal, Consulting, etc.
    let isDomainMatch = false;
    if (candidateDomain === 'it' || candidateDomain.includes('it') || candidateDomain.includes('software')) {
      isDomainMatch = (jobDomain === 'it');
    } else if (candidateDomain.includes('health') || candidateDomain.includes('medical')) {
      isDomainMatch = jobDomain === 'medical' || jobDomain === 'healthcare';
    } else if (candidateDomain.includes('finance')) {
      isDomainMatch = jobDomain === 'finance';
    } else if (candidateDomain.includes('sales') || candidateDomain.includes('marketing')) {
      isDomainMatch = jobDomain === 'sales' || jobDomain === 'marketing';
    } else if (candidateDomain.includes('legal')) {
      isDomainMatch = jobDomain === 'legal';
    } else if (candidateDomain.includes('education')) {
      isDomainMatch = jobDomain === 'education';
    } else if (candidateDomain.includes('hr')) {
      isDomainMatch = jobDomain === 'hr';
    } else if (candidateDomain.includes('manufactur')) {
      isDomainMatch = jobDomain === 'manufacturing';
    } else if (candidateDomain.includes('hospitality')) {
      isDomainMatch = jobDomain === 'hospitality';
    } else if (candidateDomain.includes('logistics')) {
      isDomainMatch = jobDomain === 'logistics';
    } else {
      isDomainMatch = jobDomain === candidateDomain || jobDomain.includes(candidateDomain);
    }

    // Role similarity bonus within domain (e.g. Frontend candidate applying to Frontend job)
    let roleBonus = 0;
    if (candidateTitle) {
      if (candidateTitle.includes('frontend') && (jobTitle.includes('frontend') || jobCategory === 'frontend')) roleBonus += 15;
      if (candidateTitle.includes('backend') && (jobTitle.includes('backend') || jobCategory === 'backend')) roleBonus += 15;
      if (candidateTitle.includes('full') && (jobTitle.includes('full') || jobCategory === 'fullstack')) roleBonus += 15;
      if (candidateTitle.includes('ai') && (jobTitle.includes('ai') || jobCategory === 'ai')) roleBonus += 15;
      if (candidateTitle.includes('data') && (jobTitle.includes('data') || jobCategory === 'data')) roleBonus += 15;
      if (candidateTitle.includes('devops') && (jobTitle.includes('devops') || jobCategory === 'devops')) roleBonus += 15;
    }

    // Skill coverage percentage
    let skillMatchPct = jobSkills.length > 0
      ? Math.round((matched.length / jobSkills.length) * 100)
      : 0;

    // Calculate dynamic match score
    let finalScore = skillMatchPct;

    if (isDomainMatch) {
      finalScore = Math.min(100, finalScore + 20 + roleBonus);
    }

    // Boost score if high skill overlap
    if (matched.length >= 3) {
      finalScore = Math.min(100, finalScore + 15);
    }

    // If wrong domain -> 0 score
    if (!isDomainMatch) {
      finalScore = 0;
    }

    const missingSkills = jobSkills.filter(js =>
      !candidateSkills.some(cs => cs.includes(js) || js.includes(cs))
    );

    // Experience matching
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

  // STRICT FILTERING:
  // 1. Candidate must ONLY match jobs within their domain (e.g. IT candidates only get IT jobs).
  // 2. Candidate must share at least 1 relevant skill.
  // 3. Experience must match.
  let matchedJobs = scored.filter(j => j.isDomainMatch && j.matchedSkills.length > 0 && j.experienceMatch);

  // If experience range filter returned 0 jobs, keep domain and skill match
  if (matchedJobs.length === 0) {
    matchedJobs = scored.filter(j => j.isDomainMatch && j.matchedSkills.length > 0);
  }

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
