import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import './AllJobs.css';

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const navigate = useNavigate();

  const categories = ['frontend', 'backend', 'fullstack', 'data', 'ai', 'devops', 'design', 'mobile', 'general'];

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (remoteOnly) params.append('remote', 'true');
    api.get(`/api/jobs?${params}`).then(r => { setJobs(r.data.jobs); setLoading(false); });
  }, [search, category, remoteOnly]);

  return (
    <div className="all-jobs-page">
      <div className="container">
        <div className="jobs-header animate-in">
          <h1>Browse All Jobs</h1>
          <p className="jobs-subtitle">
            {jobs.length} opportunities across {categories.length} categories
          </p>
          <Link to="/upload" className="btn btn-primary">
            🤖 Auto-Match with My Resume
          </Link>
        </div>

        {/* Search & filter */}
        <div className="search-bar animate-in-delay-1">
          <input
            className="form-input search-input"
            placeholder="🔍 Search by title, company, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="form-select category-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <label className="remote-toggle">
            <input type="checkbox" checked={remoteOnly} onChange={e => setRemoteOnly(e.target.checked)} />
            <span>Remote only</span>
          </label>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job, i) => (
              <div key={job.id} className="job-card card animate-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="job-card-header">
                  <div className="company-avatar">{job.company[0]}</div>
                  <div>
                    <h3>{job.title}</h3>
                    <div className="company-name">{job.company}</div>
                  </div>
                  {job.remote && <span className="badge badge-green remote-badge">Remote</span>}
                </div>

                <div className="job-card-meta">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>⏱ {job.experience}</span>
                </div>

                <p className="job-card-desc">{job.description}</p>

                <div className="job-card-skills">
                  {job.skills.slice(0, 5).map(s => <span key={s} className="skill-chip">{s}</span>)}
                  {job.skills.length > 5 && <span className="skill-chip">+{job.skills.length - 5}</span>}
                </div>

                <div className="job-card-footer">
                  <span className="badge badge-purple">{job.type}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">Details</Link>
                    <Link to="/upload" className="btn btn-primary btn-sm">Quick Apply</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
