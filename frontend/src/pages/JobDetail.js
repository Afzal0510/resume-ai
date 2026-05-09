import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import ApplicationModal from '../components/ApplicationModal';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api.get(`/api/jobs/${id}`).then(r => setJob(r.data)).catch(() => setJob(null));
  }, [id]);

  if (!job) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }} />
      <p style={{ color: 'var(--text-muted)' }}>Loading job details...</p>
    </div>
  );

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container">
        <Link to="/jobs" className="btn btn-outline btn-sm" style={{ marginBottom: '2rem', display: 'inline-flex' }}>← Back to Jobs</Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div className="card animate-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{job.title}</h1>
                  <div style={{ color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>🏢 {job.company}</span>
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                    <span>⏱ {job.experience}</span>
                    {job.remote && <span className="badge badge-green">Remote ✓</span>}
                  </div>
                </div>
                <span className="badge badge-purple">{job.type}</span>
              </div>
              <div className="divider" />
              <h3 style={{ marginBottom: '0.75rem' }}>About the Role</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{job.description}</p>
              <h3 style={{ marginBottom: '0.75rem' }}>Requirements</h3>
              <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
              <div className="divider" />
              <h3 style={{ marginBottom: '0.75rem' }}>Required Skills</h3>
              <div>{job.skills.map(s => <span key={s} className="skill-chip">{s}</span>)}</div>
            </div>
          </div>
          <div className="animate-in-delay-1" style={{ position: 'sticky', top: '90px' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.25rem' }}>Apply for this Job</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                For the best match, upload your resume to let our AI auto-fill your application.
              </p>
              <Link to="/upload" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
                🤖 Upload Resume & Auto-Match
              </Link>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setApplying(true)}>
                📝 Apply Manually
              </button>
            </div>
          </div>
        </div>
      </div>
      {applying && <ApplicationModal job={job} profile={{}} onClose={() => setApplying(false)} />}
    </div>
  );
}
