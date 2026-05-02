const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { jobsDatabase } = require('../data/jobs');
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

// ... AI extraction and matching logic remains the same ...

// ─── AI-powered skill extraction via Claude ───────────────────────────────────
async function extractSkillsWithAI(resumeText) {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Analyze this resume and extract structured information. Return ONLY valid JSON, no markdown.

Resume text:
"""
${resumeText.substring(0, 4000)}
"""

Return this exact JSON structure:
{
  "name": "candidate full name or Unknown",
  "email": "email or null",
  "phone": "phone or null",
  "experienceYears": number (0 if fresher),
  "skills": ["array", "of", "technical", "skills", "in", "lowercase"],
  "education": "highest degree and field",
  "summary": "2-3 sentence professional summary",
  "experienceLevel": "fresher | junior | mid | senior",
  "jobTitles": ["previous job titles"],
  "certifications": ["any certifications"]
}`
      }]
    });

    const text = response.content[0].text.trim();
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    // Fallback: basic regex extraction
    console.error('AI extraction failed, using regex fallback:', err.message);
    return extractSkillsRegex(resumeText);
  }
}

// ─── Regex fallback skill extractor ───────────────────────────────────────────
function extractSkillsRegex(text) {
  const lowerText = text.toLowerCase();
  const allSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby',
    'react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'spring boot',
    'mongodb', 'postgresql', 'mysql', 'redis', 'firebase',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn',
    'figma', 'adobe xd', 'git', 'linux', 'bash', 'sql', 'rest api', 'graphql',
    'android', 'kotlin', 'swift', 'react native', 'flutter', 'expo',
    'data analysis', 'tableau', 'power bi', 'excel', 'nlp', 'deep learning'
  ];

  const found = allSkills.filter(skill => lowerText.includes(skill));
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const expMatch = lowerText.match(/(\d+)\+?\s*years?\s*(of\s+)?(experience|exp)/);

  return {
    name: 'Candidate',
    email: emailMatch ? emailMatch[0] : null,
    phone: null,
    experienceYears: expMatch ? parseInt(expMatch[1]) : 0,
    skills: found,
    education: 'Not extracted',
    summary: 'Resume parsed successfully. Skills identified from document.',
    experienceLevel: (expMatch && parseInt(expMatch[1]) > 3) ? 'senior' : expMatch ? 'mid' : 'fresher',
    jobTitles: [],
    certifications: []
  };
}

// ─── Job matching algorithm ────────────────────────────────────────────────────
function matchJobsToProfile(profile) {
  const candidateSkills = profile.skills.map(s => s.toLowerCase());

  const scored = jobsDatabase.map(job => {
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const matched = candidateSkills.filter(cs =>
      jobSkills.some(js => js.includes(cs) || cs.includes(js))
    );
    const matchScore = Math.round((matched.length / jobSkills.length) * 100);
    const missingSkills = jobSkills.filter(js =>
      !candidateSkills.some(cs => cs.includes(js) || js.includes(cs))
    );

    // Experience filter
    const expRange = job.experience.match(/(\d+)-(\d+)/);
    let expMatch = true;
    if (expRange) {
      const [min, max] = [parseInt(expRange[1]), parseInt(expRange[2])];
      expMatch = profile.experienceYears >= min && profile.experienceYears <= max + 1;
    }

    return {
      ...job,
      matchScore,
      matchedSkills: matched,
      missingSkills: missingSkills.slice(0, 5),
      experienceMatch: expMatch
    };
  });

  return scored
    .filter(j => j.matchScore >= 20)
    .sort((a, b) => {
      const scoreA = a.matchScore + (a.experienceMatch ? 15 : 0);
      const scoreB = b.matchScore + (b.experienceMatch ? 15 : 0);
      return scoreB - scoreA;
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
    const matches = matchJobsToProfile(profile);

    res.json({
      success: true,
      profile,
      matches,
      totalMatches: matches.length,
      topMatch: matches[0] || null
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
}


module.exports = { uploadAndAnalyze };
