import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Claude AI reads your resume and extracts all skills, experience, and qualifications automatically.' },
  { icon: '🎯', title: 'Precision Job Matching', desc: 'Our algorithm scores every job against your profile so you only see relevant opportunities.' },
  { icon: '📝', title: 'One-Click Apply', desc: 'Fill a simple form and apply to matched jobs instantly. No need to rewrite your details.' },
  { icon: '📊', title: 'Match Score Insights', desc: 'See exactly which skills you have, which you\'re missing, and how to improve your profile.' },
];

const steps = [
  { num: '01', title: 'Upload Resume', desc: 'PDF, DOCX, or TXT — any format works' },
  { num: '02', title: 'AI Scans & Extracts', desc: 'Skills, experience, and qualifications identified in seconds' },
  { num: '03', title: 'View Matched Jobs', desc: 'Jobs ranked by how well they match your profile' },
  { num: '04', title: 'Apply with 1 Form', desc: 'Submit your application directly — quick and easy' },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge animate-in">
            <span className="badge badge-purple">✨ AI-Powered Career Platform</span>
          </div>
          <h1 className="hero-title animate-in-delay-1">
            Land Your Dream Job<br />
            <span className="gradient-text">with AI Resume Matching</span>
          </h1>
          <p className="hero-subtitle animate-in-delay-2">
            Upload your resume once. Our AI extracts your skills and instantly
            matches you with the most relevant job vacancies — for freshers and experienced professionals alike.
          </p>
          <div className="hero-actions animate-in-delay-3">
            <Link to="/upload" className="btn btn-primary btn-lg">
              🚀 Analyze My Resume
            </Link>
            <Link to="/jobs" className="btn btn-outline btn-lg">
              Browse All Jobs
            </Link>
          </div>
          <div className="hero-stats animate-in-delay-3">
            <div className="stat"><span className="stat-num">12+</span><span className="stat-label">Job Categories</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-num">AI</span><span className="stat-label">Skill Extraction</span></div>
            <div className="stat-div" />
            <div className="stat"><span className="stat-num">100%</span><span className="stat-label">Free to Use</span></div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-pink">How It Works</span>
            <h2>From Resume to Job in 4 Steps</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card animate-in">
                <div className="step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-green">Features</span>
            <h2>Everything You Need to Get Hired</h2>
          </div>
          <div className="grid-2">
            {features.map((f, i) => (
              <div key={i} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <h3>{f.title}</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Find Your Perfect Job?</h2>
            <p>Upload your resume and let AI do the hard work. Takes less than 30 seconds.</p>
            <Link to="/upload" className="btn btn-primary btn-lg">Start for Free →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
