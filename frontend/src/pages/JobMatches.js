import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import ApplicationModal from '../components/ApplicationModal';
import './JobMatches.css';

function MatchScore({ score }) {
  const cls = score >= 70 ? 'high' : score >= 40 ? 'med' : 'low';
  return (
    <div className={`score-badge score-${cls}`}>
      <div className="score-circle">
        <svg viewBox="0 0 36 36" className="score-svg">
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none" stroke="var(--border)" strokeWidth="3" />
          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={score >= 70 ? '#43e97b' : score >= 40 ? '#ffb862' : '#6c63ff'}
            strokeWidth="3" strokeDasharray={`${score}, 100`}
            strokeLinecap="round" />
        </svg>
        <span className={`score-num ${cls}`}>{score}%</span>
      </div>
      <span className="score-label">Match</span>
    </div>
  );
}

export default function JobMatches() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('all');

  if (!state?.result) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>No analysis results found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Please upload your resume first.</p>
        <Link to="/upload" className="btn btn-primary">Upload Resume →</Link>
      </div>
    );
  }

  const { profile, matches } = state.result;
  const filtered = filter === 'all' ? matches : matches.filter(j =>
    filter === 'high' ? j.matchScore >= 70 : filter === 'remote' ? j.remote : j.category === filter
  );

  return (
    <div className="matches-page">
      <div className="container">
        {/* Profile summary */}
        <div className="profile-banner animate-in">
          <div className="profile-avatar">{profile.name?.[0]?.toUpperCase() || '?'}</div>
          <div className="profile-info">
            <h2>{profile.name || 'Candidate'}</h2>
            <div className="profile-meta">
              {profile.email && <span>📧 {profile.email}</span>}
              {profile.experienceLevel && <span className={`badge badge-${profile.experienceLevel === 'fresher' ? 'green' : 'purple'}`}>{profile.experienceLevel}</span>}
              {profile.experienceYears > 0 && <span>💼 {profile.experienceYears} yrs exp</span>}
              {profile.education && <span>🎓 {profile.education}</span>}
            </div>
            <p className="profile-summary">{profile.summary}</p>
            <div className="profile-skills">
              {profile.skills?.slice(0, 12).map(s => <span key={s} className="skill-chip">{s}</span>)}
              {profile.skills?.length > 12 && <span className="skill-chip">+{profile.skills.length - 12} more</span>}
            </div>
          </div>
          <div className="profile-stats">
            <div className="pstat"><span className="pstat-num">{matches.length}</span><span className="pstat-label">Jobs Found</span></div>
            <div className="pstat"><span className="pstat-num">{matches.filter(j => j.matchScore >= 70).length}</span><span className="pstat-label">High Matches</span></div>
            <div className="pstat"><span className="pstat-num">{profile.skills?.length || 0}</span><span className="pstat-label">Skills Found</span></div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar animate-in-delay-1">
          <div className="filter-label">Filter by:</div>
          <div className="filter-chips">
            {[['all', 'All Jobs'], ['high', '🟢 High Match (70%+)'], ['remote', '🏠 Remote'], ['frontend', 'Frontend'], ['backend', 'Backend'], ['data', 'Data/AI']].map(([val, label]) => (
              <button
                key={val}
                className={`filter-chip ${filter === val ? 'active' : ''}`}
                onClick={() => setFilter(val)}
              >{label}</button>
            ))}
          </div>
          <span className="results-count">{filtered.length} results</span>
        </div>

        {/* Job cards */}
        <div className="jobs-list">
          {filtered.length === 0 ? (
            <div className="empty-state">No jobs match this filter. <button onClick={() => setFilter('all')} className="link-text">Show all</button></div>
          ) : filtered.map((job, i) => (
            <div key={job.id} className="job-match-card card animate-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="job-match-left">
                <MatchScore score={job.matchScore} />
              </div>
              <div className="job-match-body">
                <div className="job-match-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-meta">
                      <span>🏢 {job.company}</span>
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary}</span>
                      <span>⏱ {job.experience}</span>
                      {job.remote && <span className="badge badge-green">Remote ✓</span>}
                      {!job.experienceMatch && <span className="badge badge-orange">Exp. mismatch</span>}
                    </div>
                  </div>
                  <span className="badge badge-purple">{job.type}</span>
                </div>

                <div className="match-bar-row">
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div
                      className={`progress-fill ${job.matchScore >= 70 ? 'high' : job.matchScore >= 40 ? 'med' : 'low'}`}
                      style={{ width: `${job.matchScore}%` }}
                    />
                  </div>
                </div>

                <div className="skill-groups">
                  <div>
                    <div className="skill-group-label">✅ You have ({job.matchedSkills.length})</div>
                    <div>{job.matchedSkills.map(s => <span key={s} className="skill-chip matched">{s}</span>)}</div>
                  </div>
                  {job.missingSkills.length > 0 && (
                    <div>
                      <div className="skill-group-label">📌 Missing ({job.missingSkills.length})</div>
                      <div>{job.missingSkills.map(s => <span key={s} className="skill-chip missing">{s}</span>)}</div>
                    </div>
                  )}
                </div>

                <div className="job-match-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedJob(job)}>
                    Apply Now →
                  </button>
                  <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          profile={profile}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
