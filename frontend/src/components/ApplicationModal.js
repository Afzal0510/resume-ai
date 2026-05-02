import React, { useState } from 'react';
import axios from 'axios';
import './ApplicationModal.css';

export default function ApplicationModal({ job, profile, onClose }) {
  const [form, setForm] = useState({
    name: profile?.name !== 'Candidate' ? profile?.name || '' : '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    currentRole: profile?.jobTitles?.[0] || '',
    experience: profile?.experienceYears?.toString() || '0',
    coverLetter: '',
    portfolio: '',
    noticePeriod: '30 days',
    expectedSalary: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(err => ({ ...err, [field]: '' }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      await axios.post('/api/applications/apply', { jobId: job.id, jobTitle: job.title, company: job.company, ...form });
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err.response?.data?.errors?.[0]?.msg || 'Submission failed. Please try again.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Apply for {job.title}</h2>
            <p className="modal-subtitle">{job.company} • {job.location} • {job.salary}</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h3>Application Submitted!</h3>
            <p>Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been received. They'll contact you at {form.email}.</p>
            <button className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <div className="modal-body">
            <div className="match-reminder">
              <span className={`match-dot ${job.matchScore >= 70 ? 'high' : job.matchScore >= 40 ? 'med' : 'low'}`} />
              <span>{job.matchScore}% match • {job.matchedSkills.length} of your skills apply to this role</span>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange('name')} placeholder="Your full name" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className={`form-input ${errors.email ? 'error' : ''}`} value={form.email} onChange={handleChange('email')} placeholder="you@email.com" type="email" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={handleChange('phone')} placeholder="+91 98765 43210" />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Current Role</label>
                <input className="form-input" value={form.currentRole} onChange={handleChange('currentRole')} placeholder="e.g. Software Engineer" />
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <select className="form-select" value={form.experience} onChange={handleChange('experience')}>
                  <option value="0">Fresher (0 years)</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'year' : 'years'}</option>)}
                  <option value="11">10+ years</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notice Period</label>
                <select className="form-select" value={form.noticePeriod} onChange={handleChange('noticePeriod')}>
                  <option>Immediately</option>
                  <option>15 days</option>
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expected Salary (LPA)</label>
                <input className="form-input" value={form.expectedSalary} onChange={handleChange('expectedSalary')} placeholder="e.g. 8 LPA" />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio / LinkedIn / GitHub</label>
                <input className="form-input" value={form.portfolio} onChange={handleChange('portfolio')} placeholder="https://..." />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cover Letter (Optional)</label>
              <textarea
                className="form-textarea"
                value={form.coverLetter}
                onChange={handleChange('coverLetter')}
                placeholder={`Hi, I'm excited to apply for ${job.title} at ${job.company}. My experience in ${job.matchedSkills.slice(0,3).join(', ')} aligns well with your requirements...`}
              />
            </div>

            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? '⏳ Submitting...' : '📬 Submit Application'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
