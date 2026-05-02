# ⚡ ResumeAI — AI-Powered Resume Matching Platform

A full-stack web app where candidates upload their resume and get **instantly matched** with relevant job vacancies using AI. Built with **React.js + Node.js + Claude AI**.

---

## 🚀 Features

| Feature | Description |
|---------|------------|
| 📄 Resume Upload | PDF, DOCX, or TXT — drag & drop or click |
| 🤖 AI Skill Extraction | Claude AI reads resume and extracts skills, experience, education |
| 🎯 Smart Job Matching | Scores every job against your profile (0–100% match) |
| 📊 Match Insights | Shows matched skills, missing skills, experience fit |
| 📝 Easy Apply Form | Pre-filled form with your data — submit in seconds |
| 🔍 Browse All Jobs | Filter by category, remote, search by title/company |
| 📱 Responsive | Works on mobile, tablet, and desktop |

---

## 🗂️ Project Structure

```
resume-ai/
├── backend/                 # Node.js + Express API
│   ├── server.js           # Entry point
│   ├── routes/
│   │   ├── resume.js       # POST /api/resume/upload
│   │   ├── jobs.js         # GET /api/jobs
│   │   └── applications.js # POST /api/applications/apply
│   ├── controllers/
│   │   └── resumeController.js  # AI extraction + matching logic
│   ├── data/
│   │   └── jobs.js         # Job database (12 jobs across 8 categories)
│   └── uploads/            # Temporary upload folder (auto-created)
│
└── frontend/               # React.js app
    └── src/
        ├── App.js           # Router setup
        ├── pages/
        │   ├── Home.js      # Landing page
        │   ├── UploadResume.js  # Resume upload with progress
        │   ├── JobMatches.js    # AI match results
        │   ├── AllJobs.js       # Browse all jobs
        │   └── JobDetail.js     # Single job view
        ├── components/
        │   ├── Navbar.js
        │   └── ApplicationModal.js  # Apply form
        └── styles/
            └── global.css   # Design system
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Anthropic API key (free tier works)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app runs at **http://localhost:3000** (proxied to backend at port 5000).

---

## 🔑 Environment Variables

**backend/.env**
```env
PORT=5000
ANTHROPIC_API_KEY=sk-ant-your-key-here
NODE_ENV=development
```

Get your API key at: https://console.anthropic.com

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/resume/upload` | Upload resume file → returns profile + job matches |
| GET | `/api/jobs` | Get all jobs (supports ?search=, ?category=, ?remote=) |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/applications/apply` | Submit job application |
| GET | `/api/applications` | Get all applications (admin) |
| GET | `/api/health` | Health check |

### POST /api/resume/upload
- **Body**: `multipart/form-data` with field `resume` (PDF/DOCX/TXT, max 5MB)
- **Returns**:
```json
{
  "success": true,
  "profile": {
    "name": "John Doe",
    "email": "john@email.com",
    "skills": ["react", "nodejs", "python"],
    "experienceYears": 3,
    "experienceLevel": "mid",
    "education": "B.Tech Computer Science",
    "summary": "..."
  },
  "matches": [
    {
      "id": "...", "title": "Full Stack Developer",
      "matchScore": 85,
      "matchedSkills": ["react", "nodejs"],
      "missingSkills": ["docker"]
    }
  ]
}
```

---

## 🛠️ How the AI Matching Works

1. **Text Extraction** — `pdf-parse` (PDF), `mammoth` (DOCX), or plain text
2. **AI Analysis** — Claude Sonnet reads resume text and returns structured JSON:
   - Name, email, phone
   - Skills array (normalized to lowercase)
   - Years of experience
   - Experience level (fresher/junior/mid/senior)
   - Education, certifications, job titles
3. **Scoring** — For each job in DB:
   - Calculate skill overlap: `matched / total_job_skills * 100`
   - Experience range check (+15 bonus if fits)
   - Sort by combined score
4. **Filter** — Show only jobs with ≥20% match, sorted best first

---

## 🗄️ Production Upgrade Guide

To make this production-ready:

### Database
Replace the in-memory `data/jobs.js` with:
- **MongoDB** + Mongoose
- **PostgreSQL** + Prisma or Knex
- **Firebase Firestore**

```bash
npm install mongoose
# or
npm install prisma @prisma/client
```

### Authentication
Add user accounts with JWT:
```bash
npm install jsonwebtoken bcryptjs passport
```

### File Storage
Replace local disk with cloud:
```bash
npm install aws-sdk multer-s3
# Store resumes in S3/GCS/Cloudinary
```

### Email Notifications
Send application confirmations:
```bash
npm install nodemailer
# or use SendGrid/Resend
```

---

## 🎨 Tech Stack

- **Frontend**: React 18, React Router 6, Axios
- **Backend**: Node.js, Express 4
- **AI**: Anthropic Claude Sonnet (claude-sonnet-4-20250514)
- **File Parsing**: pdf-parse, mammoth
- **Styling**: Custom CSS with CSS variables (dark theme)
- **Fonts**: Syne (headings) + DM Sans (body)

---

## 📦 Adding More Jobs

Edit `backend/data/jobs.js` and add entries to `jobsDatabase` array:

```js
{
  id: uuidv4(),
  title: 'Your Job Title',
  company: 'Company Name',
  location: 'City',
  type: 'Full-time',
  experience: '0-2 years',
  salary: '₹5-10 LPA',
  remote: true,
  skills: ['skill1', 'skill2'],  // lowercase!
  description: 'Job description',
  requirements: ['Req 1', 'Req 2'],
  category: 'frontend',  // frontend|backend|fullstack|data|ai|devops|design|mobile|general
  postedDate: '2025-03-05'
}
```

---

## 🌍 Deployment Guide (Render)

This project is configured for **Unified Deployment**, meaning the backend serves the frontend build.

### 1. Push to GitHub
Create a new repository on GitHub and push your code:
```bash
git init
git add .
git commit -m "Setup deployment"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Deploy to Render
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Use these settings:
   - **Name**: `resume-ai`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** and add **Environment Variables**:
   - `ANTHROPIC_API_KEY`: `your-claude-api-key`
   - `NODE_ENV`: `production`

---

Built with ❤️ using React, Node.js, and Anthropic Claude AI

