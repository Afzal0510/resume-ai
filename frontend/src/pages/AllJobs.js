import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import './AllJobs.css';

const DOMAIN_CONFIG = {
  'IT':           { icon: '💻', color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' },
  'Medical':      { icon: '🏥', color: '#e74c8b', bg: 'rgba(231,76,139,0.12)' },
  'Healthcare':   { icon: '💊', color: '#e74c8b', bg: 'rgba(231,76,139,0.12)' },
  'Finance':      { icon: '📈', color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
  'Sales':        { icon: '🤝', color: '#27ae60', bg: 'rgba(39,174,96,0.12)' },
  'Marketing':    { icon: '📢', color: '#e67e22', bg: 'rgba(230,126,34,0.12)' },
  'Manufacturing':{ icon: '🏭', color: '#8e44ad', bg: 'rgba(142,68,173,0.12)' },
  'Education':    { icon: '📚', color: '#2980b9', bg: 'rgba(41,128,185,0.12)' },
  'Legal':        { icon: '⚖️', color: '#c0392b', bg: 'rgba(192,57,43,0.12)' },
  'Government':   { icon: '🏛️', color: '#16a085', bg: 'rgba(22,160,133,0.12)' },
  'Hospitality':  { icon: '🏨', color: '#d35400', bg: 'rgba(211,84,0,0.12)' },
  'Logistics':    { icon: '🚚', color: '#1abc9c', bg: 'rgba(26,188,156,0.12)' },
  'HR':           { icon: '👥', color: '#9b59b6', bg: 'rgba(155,89,182,0.12)' },
  'Media':        { icon: '🎬', color: '#e91e63', bg: 'rgba(233,30,99,0.12)' },
  'Consulting':   { icon: '💼', color: '#607d8b', bg: 'rgba(96,125,139,0.12)' },
  'Retail':       { icon: '🛒', color: '#ff5722', bg: 'rgba(255,87,34,0.12)' },
  'Real Estate':  { icon: '🏠', color: '#795548', bg: 'rgba(121,85,72,0.12)' },
  'Agriculture':  { icon: '🌾', color: '#8bc34a', bg: 'rgba(139,195,74,0.12)' },
  'Environment':  { icon: '🌿', color: '#4caf50', bg: 'rgba(76,175,80,0.12)' },
  'Social':       { icon: '❤️', color: '#f44336', bg: 'rgba(244,67,54,0.12)' },
  'Aviation':     { icon: '✈️', color: '#03a9f4', bg: 'rgba(3,169,244,0.12)' },
  'Telecom':      { icon: '📡', color: '#673ab7', bg: 'rgba(103,58,183,0.12)' },
};

function DomainBadge({ domain }) {
  const cfg = DOMAIN_CONFIG[domain] || { icon: '🏢', color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' };
  return (
    <span className="domain-badge" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {domain}
    </span>
  );
}

function JobCard({ job, index }) {
  const cfg = DOMAIN_CONFIG[job.domain] || { icon: '🏢', color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' };
  const isLive = job.isLive || job.source;

  return (
    <div className="job-card card animate-in" style={{ animationDelay: `${index * 0.04}s` }}>
      {isLive && (
        <div className="live-badge">
          <span className="live-dot" />
          Live · {job.source}
        </div>
      )}
      <div className="job-card-header">
        <div className="company-avatar" style={{ background: cfg.bg, color: cfg.color }}>
          {cfg.icon}
        </div>
        <div style={{ flex: 1 }}>
          <h3>{job.title}</h3>
          <div className="company-name">🏢 {job.company}</div>
        </div>
        {job.workMode ? (
          <span className={`badge badge-workmode badge-${job.workMode.toLowerCase()}`}>
            {job.workMode === 'Remote' ? '🏠 ' : job.workMode === 'Hybrid' ? '🔄 ' : '🏢 '}
            {job.workMode}
          </span>
        ) : job.remote ? (
          <span className="badge badge-green remote-badge">Remote ✓</span>
        ) : null}
      </div>

      <div className="job-card-meta">
        <span>📍 {job.location}</span>
        <span>💰 {job.salary}</span>
        <span>⏱ {job.experience}</span>
        {job.type && <span>📋 {job.type}</span>}
      </div>

      <DomainBadge domain={job.domain} />

      <p className="job-card-desc">{job.description?.substring(0, 150)}{job.description?.length > 150 ? '...' : ''}</p>

      <div className="job-card-skills">
        {(job.skills || []).slice(0, 5).map(s => <span key={s} className="skill-chip">{s}</span>)}
        {(job.skills || []).length > 5 && <span className="skill-chip">+{job.skills.length - 5}</span>}
      </div>

      <div className="job-card-footer">
        <span className="badge badge-purple">{job.type}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isLive ? (
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              Apply →
            </a>
          ) : (
            <>
              <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">Details</Link>
              <Link to="/upload" className="btn btn-primary btn-sm">Quick Apply</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [liveJobs, setLiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [workMode, setWorkMode] = useState(''); // Remote | Onsite | Hybrid
  const [jobType, setJobType] = useState(''); // Full-time | Part-time | Contract
  const [showLive, setShowLive] = useState(false);
  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'live'
  const [domainStats, setDomainStats] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Load local jobs
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (domain) params.append('domain', domain);
    if (remoteOnly || workMode === 'Remote') params.append('remote', 'true');
    if (workMode) params.append('workMode', workMode);
    if (jobType) params.append('type', jobType);

    setLoading(true);
    api.get(`/api/jobs?${params}`)
      .then(r => {
        setJobs(r.data.jobs || []);
        // Build domain stats from first load
        if (!domainStats.length && r.data.jobs) {
          const stats = {};
          r.data.jobs.forEach(j => { stats[j.domain] = (stats[j.domain] || 0) + 1; });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, domain, remoteOnly, workMode, jobType]);

  // Load domain stats once
  useEffect(() => {
    api.get('/api/jobs/domains').then(r => setDomainStats(r.data.domains || [])).catch(() => {});
  }, []);

  // Load live jobs
  const loadLiveJobs = useCallback(() => {
    setLiveLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    api.get(`/api/jobs/live?${params}`)
      .then(r => { setLiveJobs(r.data.liveJobs || []); setLiveLoading(false); })
      .catch(() => setLiveLoading(false));
  }, [search]);

  useEffect(() => {
    if (activeTab === 'live') loadLiveJobs();
  }, [activeTab, loadLiveJobs]);

  const displayedDomains = Object.keys(DOMAIN_CONFIG);

  return (
    <div className="all-jobs-page">
      <div className="container">

        {/* Header */}
        <div className="jobs-header animate-in">
          <div className="jobs-header-text">
            <h1>Explore Jobs Across All Industries</h1>
            <p className="jobs-subtitle">
              {jobs.length}+ opportunities across {displayedDomains.length} domains — IT, Medical, Finance, Legal, and more
            </p>
          </div>
          <Link to="/upload" className="btn btn-primary">
            🤖 AI Match My Resume
          </Link>
        </div>

        {/* Domain Tiles */}
        <div className="domain-tiles animate-in-delay-1">
          <button
            className={`domain-tile ${domain === '' ? 'active' : ''}`}
            onClick={() => setDomain('')}
          >
            <span className="domain-tile-icon">🌐</span>
            <span className="domain-tile-label">All Domains</span>
            <span className="domain-tile-count">{jobs.length + (domain ? 0 : 0)}</span>
          </button>
          {domainStats.map(d => {
            const cfg = DOMAIN_CONFIG[d.domain] || { icon: '🏢', color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' };
            return (
              <button
                key={d.domain}
                className={`domain-tile ${domain === d.domain ? 'active' : ''}`}
                onClick={() => setDomain(domain === d.domain ? '' : d.domain)}
                style={domain === d.domain ? { borderColor: cfg.color, background: cfg.bg } : {}}
              >
                <span className="domain-tile-icon">{cfg.icon}</span>
                <span className="domain-tile-label">{d.domain}</span>
                <span className="domain-tile-count">{d.count}</span>
              </button>
            );
          })}
        </div>

        {/* Tabs: Local DB vs Live */}
        <div className="jobs-tabs animate-in-delay-1">
          <button className={`jobs-tab ${activeTab === 'local' ? 'active' : ''}`} onClick={() => setActiveTab('local')}>
            📋 Job Database <span className="tab-count">{jobs.length}</span>
          </button>
          <button className={`jobs-tab ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>
            🌍 Live Jobs
            {liveJobs.length > 0 && <span className="tab-count live">{liveJobs.length}</span>}
            {activeTab !== 'live' && <span className="live-indicator" />}
          </button>
        </div>

        {/* Search & filter */}
        <div className="search-bar animate-in-delay-1">
          <input
            className="form-input search-input"
            placeholder="🔍 Search title, company, skill, or domain..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          {domain && (
            <button className="clear-filter" onClick={() => setDomain('')}>
              ✕ {domain}
            </button>
          )}
        </div>

        <div className="job-type-filters animate-in-delay-1">
          <div className="type-filter-group">
            <span className="type-filter-label">Work mode</span>
            {[
              ['', 'All'],
              ['Remote', '🏠 Remote'],
              ['Onsite', '🏢 Onsite'],
              ['Hybrid', '🔄 Hybrid'],
            ].map(([val, label]) => (
              <button
                key={val || 'all-mode'}
                className={`type-chip ${workMode === val ? 'active' : ''}`}
                onClick={() => {
                  setWorkMode(val);
                  if (val !== 'Remote') setRemoteOnly(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="type-filter-group">
            <span className="type-filter-label">Schedule</span>
            {[
              ['', 'All'],
              ['Full-time', '⏱ Full-time'],
              ['Part-time', '🕐 Part-time'],
              ['Contract', '📝 Contract'],
            ].map(([val, label]) => (
              <button
                key={val || 'all-type'}
                className={`type-chip ${jobType === val ? 'active' : ''}`}
                onClick={() => setJobType(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* LOCAL JOBS TAB */}
        {activeTab === 'local' && (
          <>
            <div className="results-meta animate-in-delay-1">
              <span>{jobs.length} jobs found{domain ? ` in ${domain}` : ''}{search ? ` for "${search}"` : ''}</span>
            </div>
            {loading ? (
              <div className="loading-grid">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state-big">
                <div className="empty-icon">🔍</div>
                <h3>No jobs found</h3>
                <p>Try adjusting your search or domain filter</p>
                <button className="btn btn-outline" onClick={() => { setSearchInput(''); setDomain(''); }}>Clear Filters</button>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
              </div>
            )}
          </>
        )}

        {/* LIVE JOBS TAB */}
        {activeTab === 'live' && (
          <div className="live-jobs-section">
            <div className="live-header">
              <div>
                <h2>🌍 Live Jobs from the Web</h2>
                <p className="live-subtitle">Real-time jobs fetched from Remotive, Arbeitnow & The Muse</p>
              </div>
              <button className="btn btn-outline" onClick={loadLiveJobs} disabled={liveLoading}>
                {liveLoading ? '⏳ Fetching...' : '🔄 Refresh'}
              </button>
            </div>

            <div className="source-badges">
              <span className="source-badge remotive">🌐 Remotive</span>
              <span className="source-badge arbeitnow">💼 Arbeitnow</span>
              <span className="source-badge muse">✨ The Muse</span>
            </div>

            {liveLoading ? (
              <div className="loading-grid">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
              </div>
            ) : liveJobs.length === 0 ? (
              <div className="empty-state-big">
                <div className="empty-icon">🌐</div>
                <h3>Click Refresh to load live jobs</h3>
                <p>We'll fetch the latest openings from across the web</p>
                <button className="btn btn-primary" onClick={loadLiveJobs}>Load Live Jobs</button>
              </div>
            ) : (
              <div className="jobs-grid">
                {liveJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
