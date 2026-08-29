require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const resumeRoutes = require('./routes/resume');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS setup
const allowedOrigins = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/.*\.onrender\.com$/,
  'https://resume-ai-frontend.onrender.com',
  'https://resume-ai-frontend-m7j5.onrender.com',
  'https://resume-ai-frontend-dhg0.onrender.com',
  'https://ai-resume-pro.onrender.com',
  'https://ai-resume-pro-cmo0.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, mobile, same-origin)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    
    if (isAllowed || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    console.warn(`[CORS] Blocked request from origin: ${origin}`);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'AI Resume Platform running ✅' }));

// Serve frontend static files in production (only if NOT on Vercel)
// Vercel handles static serving and routing via vercel.json
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuildPath));
  
  // Catch-all route to serve React's index.html for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

module.exports = app;


