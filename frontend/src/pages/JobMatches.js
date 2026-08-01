import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ApplicationModal from '../components/ApplicationModal';
import './JobMatches.css';

const LOCATION_ALIASES = {
  bombay: 'mumbai',
  bengaluru: 'bangalore',
  bangalore: 'bangalore',
  gurgaon: 'gurugram',
  gurugram: 'gurugram',
  'new delhi': 'delhi',
  'navi mumbai': 'navi mumbai',
};

function normalizeLocation(value = '') {
  const cleaned = value.toLowerCase().trim();
  return LOCATION_ALIASES[cleaned] || cleaned;
}

function jobMatchesLocation(job, locationQuery) {
  if (!locationQuery) return true;
  const q = normalizeLocation(locationQuery);
  const jobLoc = normalizeLocation(job.location || '');
  if (!jobLoc) return false;
  // "mumbai" should also match "Navi Mumbai"
  return jobLoc.includes(q) || q.includes(jobLoc);
}

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

function getDisplayValue(value, fallback = 'Not Available') {
  if (value === null || value === undefined || value === '') return fallback;
  if (Array.isArray(value)) return value.length ? value.join(', ') : fallback;
  return String(value);
}

function getExperienceLabel(years) {
  if (years === null || years === undefined || Number.isNaN(Number(years))) return 'Not Available';
  const value = Number(years);
  return `${value} ${value === 1 ? 'year' : 'years'} experience`;
}

export default function JobMatches() {
  const { state } = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('all');
  const [locationQuery, setLocationQuery] = useState('');
  const [includeRemote, setIncludeRemote] = useState(true);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [storedAnalysis, setStoredAnalysis] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.sessionStorage.getItem('resumeAnalysisResult');
      if (saved) {
        setStoredAnalysis(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Could not read stored analysis result:', err);
    }
  }, []);

  const resultData = state?.result ? state.result : (storedAnalysis?.result || null);
  const profile = resultData?.profile || null;
  const matches = resultData?.matches || [];
  const resumeUrl = resultData?.resumeUrl || resultData?.resumePath || profile?.resumeUrl;
  const resumeFileName = resultData?.resumeFileName;
  const profileName = getDisplayValue(
    profile?.fullName || profile?.name || profile?.candidateName || profile?.title || 'Candidate',
    'Candidate'
  );
  const profileTitle = profile?.jobTitle || profile?.jobTitles?.[0] || profile?.role || 'Professional';
  const profileSkills = profile?.skills?.length ? profile.skills : [];


  useEffect(() => {
    if (!state?.uploadedFile) {
      setPreviewUrl(storedAnalysis?.previewUrl || '');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(state.uploadedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [state?.uploadedFile, storedAnalysis?.previewUrl]);

  const availableLocations = useMemo(() => {
    const locs = [...new Set(matches.map(j => j.location).filter(Boolean))];
    return locs.sort((a, b) => a.localeCompare(b));
  }, [matches]);

  if (!resultData) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>No analysis results found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Please upload your resume first.</p>
        <Link to="/upload" className="btn btn-primary">Upload Resume →</Link>
      </div>
    );
  }

  // Domains that use the `domain` field for filtering
  const DOMAIN_FILTERS = ['Medical', 'Healthcare', 'Finance', 'Sales', 'Marketing', 'Manufacturing', 'Education', 'Legal', 'Government', 'Hospitality', 'Logistics', 'HR'];

  const filtered = matches.filter(j => {
    const workMode = (j.workMode || (j.remote ? 'Remote' : 'Onsite')).toLowerCase();
    const jobType = (j.type || 'Full-time').toLowerCase();

    // Category / domain / work-type filters
    let passesFilter = true;
    if (filter === 'high') passesFilter = j.matchScore >= 70;
    else if (filter === 'remote' || filter === 'work:remote') passesFilter = workMode === 'remote' || j.remote;
    else if (filter === 'work:onsite') passesFilter = workMode === 'onsite';
    else if (filter === 'work:hybrid') passesFilter = workMode === 'hybrid';
    else if (filter === 'type:full-time') passesFilter = jobType === 'full-time';
    else if (filter === 'type:part-time') passesFilter = jobType === 'part-time';
    else if (filter === 'type:contract') passesFilter = jobType === 'contract';
    else if (filter === 'my-domain') {
      passesFilter = j.isDomainMatch || (profile.domain && j.domain && j.domain.toLowerCase().includes(profile.domain.toLowerCase().split('/')[0]));
    } else if (filter === 'matched-skills') passesFilter = j.matchedSkills && j.matchedSkills.length > 0;
    else if (DOMAIN_FILTERS.includes(filter)) passesFilter = j.domain === filter;
    else if (filter !== 'all') passesFilter = j.category === filter;

    if (!passesFilter) return false;

    // Location search (on already resume-matched jobs)
    if (!locationQuery.trim()) return true;
    const isRemoteJob = workMode === 'remote' || j.remote || /remote/i.test(j.location || '');
    if (includeRemote && isRemoteJob) return true;
    return jobMatchesLocation(j, locationQuery);
  });

  const locationTrimmed = locationQuery.trim();
  const locationResultCount = locationTrimmed
    ? matches.filter(j => {
        const isRemoteJob = j.remote || /remote/i.test(j.location || '');
        return (includeRemote && isRemoteJob) || jobMatchesLocation(j, locationTrimmed);
      }).length
    : matches.length;

  const handleViewResume = () => {
    if (previewUrl || resumeUrl || resumeFileName) {
      setResumePreviewOpen(true);
    }
  };

  return (
    <div className="matches-page">
      <div className="container">
        {/* Profile summary */}
        <div className="profile-banner animate-in">
          <div className="profile-card-main">
            <div className="profile-photo-wrap">
              {profile?.photo ? (
                <img src={profile.photo} alt={profileName} className="profile-photo" />
              ) : (
                <div className="profile-avatar large">{profileName?.[0]?.toUpperCase() || '?'}</div>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-header-row">
                <div>
                  <h2>{profileName}</h2>
                  <p className="profile-role">{getDisplayValue(profileTitle, 'Job title not available')}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleViewResume}
                >
                  View Resume
                </button>
              </div>
              <div className="profile-meta">
                <span>📧 {getDisplayValue(profile?.email, 'Not Available')}</span>
                <span>📱 {getDisplayValue(profile?.phone, 'Not Available')}</span>
                <span>📍 {getDisplayValue(profile?.location, 'Not Available')}</span>
                {profile?.experienceLevel && <span className={`badge badge-${profile.experienceLevel === 'fresher' ? 'green' : 'purple'}`}>{profile.experienceLevel}</span>}
              </div>
              <p className="profile-summary">{getDisplayValue(profile?.summary, 'Summary not available')}</p>
              <div className="profile-skills">
                {profileSkills.length > 0 ? (
                  <>
                    {profileSkills.slice(0, 12).map(s => <span key={s} className="skill-chip">{s}</span>)}
                    {profileSkills.length > 12 && <span className="skill-chip">+{profileSkills.length - 12} more</span>}
                  </>
                ) : (
                  <span className="skill-chip muted">Not Available</span>
                )}
              </div>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-card">
              <span className="detail-label">Experience</span>
              <span className="detail-value">{getExperienceLabel(profile?.experienceYears)}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Email</span>
              <span className="detail-value">{getDisplayValue(profile?.email, 'Not Available')}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{getDisplayValue(profile?.phone, 'Not Available')}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Location</span>
              <span className="detail-value">{getDisplayValue(profile?.location, 'Not Available')}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">LinkedIn</span>
              {profile?.linkedin ? (
                <a className="detail-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a>
              ) : (
                <span className="detail-value">Not Available</span>
              )}
            </div>
            <div className="detail-card">
              <span className="detail-label">GitHub</span>
              {profile?.github ? (
                <a className="detail-link" href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github}</a>
              ) : (
                <span className="detail-value">Not Available</span>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="pstat"><span className="pstat-num">{matches.length}</span><span className="pstat-label">Matching Jobs</span></div>
            <div className="pstat"><span className="pstat-num">{matches.filter(j => j.matchScore >= 70).length}</span><span className="pstat-label">High Matches</span></div>
            <div className="pstat"><span className="pstat-num">{profileSkills.length}</span><span className="pstat-label">Skills Found</span></div>
            {profile?.domain && <div className="pstat"><span className="pstat-num" style={{fontSize:'1rem'}}>{profile.domain}</span><span className="pstat-label">Domain</span></div>}
          </div>
        </div>

        {/* Location search for matched jobs */}
        <div className="location-search-bar animate-in-delay-1">
          <div className="location-search-header">
            <h3>Search jobs by location</h3>
            <p>Check if any of your resume-matched jobs are available in a city (e.g. Mumbai)</p>
          </div>
          <div className="location-search-row">
            <input
              className="form-input location-search-input"
              type="search"
              placeholder="📍 Search location — Mumbai, Bangalore, Pune..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              aria-label="Search matched jobs by location"
            />
            {locationQuery && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setLocationQuery('')}
              >
                Clear
              </button>
            )}
            <label className="remote-include-toggle">
              <input
                type="checkbox"
                checked={includeRemote}
                onChange={(e) => setIncludeRemote(e.target.checked)}
              />
              <span>Include remote</span>
            </label>
          </div>
          {availableLocations.length > 0 && (
            <div className="location-quick-chips">
              {availableLocations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className={`filter-chip ${normalizeLocation(locationQuery) === normalizeLocation(loc) ? 'active' : ''}`}
                  onClick={() => setLocationQuery(loc)}
                >
                  📍 {loc}
                </button>
              ))}
            </div>
          )}
          {locationTrimmed && (
            <div className={`location-status ${locationResultCount > 0 ? 'has-jobs' : 'no-jobs'}`}>
              {locationResultCount > 0
                ? `Yes — ${locationResultCount} matched job${locationResultCount === 1 ? '' : 's'} for your resume in “${locationTrimmed}”${includeRemote ? ' (including remote)' : ''}.`
                : `No matched jobs for your resume in “${locationTrimmed}”. Try another city or clear the location search.`}
            </div>
          )}
        </div>

        {/* Work type filters */}
        <div className="filter-bar work-type-bar animate-in-delay-1">
          <div className="filter-label">Job type:</div>
          <div className="filter-chips">
            {[
              ['all', '🎯 All Types'],
              ['work:remote', '🏠 Remote'],
              ['work:onsite', '🏢 Onsite'],
              ['work:hybrid', '🔄 Hybrid'],
              ['type:full-time', '⏱ Full-time'],
              ['type:part-time', '🕐 Part-time'],
              ['type:contract', '📝 Contract'],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`filter-chip ${filter === val ? 'active' : ''}`}
                onClick={() => setFilter(val)}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar animate-in-delay-1">
          <div className="filter-label">Filter:</div>
          <div className="filter-chips">
            {[
              ['all', '🎯 All Matched Jobs'],
              ...(profile.domain ? [['my-domain', `✨ My Domain (${profile.domain})`]] : []),
              ['matched-skills', '✅ Skills Overlap'],
              ['high', '🟢 High Match (70%+)'],
              // IT Categories
              ['frontend', '💻 Frontend'],
              ['backend', '⚙️ Backend'],
              ['fullstack', '🔀 Full Stack'],
              ['data', '📊 Data/AI'],
              ['devops', '☁️ DevOps'],
              ['mobile', '📱 Mobile'],
              ['cybersecurity', '🔒 Security'],
              ['cloud', '☁️ Cloud'],
              // Industry domains
              ['Medical', '🏥 Medical'],
              ['Healthcare', '💊 Healthcare'],
              ['Finance', '💰 Finance'],
              ['Sales', '🤝 Sales'],
              ['Marketing', '📢 Marketing'],
              ['Manufacturing', '🏭 Mfg'],
              ['Education', '📚 Education'],
              ['Legal', '⚖️ Legal'],
              ['Government', '🏛️ Govt'],
              ['Hospitality', '🏨 Hospitality'],
              ['Logistics', '🚚 Logistics'],
              ['HR', '👥 HR'],
            ].map(([val, label]) => (
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
            <div className="empty-state">
              {locationTrimmed
                ? <>No resume-matched jobs in <strong>{locationTrimmed}</strong>. <button onClick={() => setLocationQuery('')} className="link-text">Clear location</button></>
                : <>No jobs match this filter. <button onClick={() => setFilter('all')} className="link-text">Show all</button></>}
            </div>
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
                      <span className="badge badge-purple">{job.type || 'Full-time'}</span>
                      <span className={`badge badge-workmode badge-${(job.workMode || (job.remote ? 'Remote' : 'Onsite')).toLowerCase()}`}>
                        {(job.workMode || (job.remote ? 'Remote' : 'Onsite')) === 'Remote' && '🏠 '}
                        {(job.workMode || (job.remote ? 'Remote' : 'Onsite')) === 'Hybrid' && '🔄 '}
                        {(job.workMode || (job.remote ? 'Remote' : 'Onsite')) === 'Onsite' && '🏢 '}
                        {job.workMode || (job.remote ? 'Remote' : 'Onsite')}
                      </span>
                      {!job.experienceMatch && <span className="badge badge-orange">Exp. mismatch</span>}
                      {job.domain && <span className="badge badge-domain">{job.domainIcon || '🏢'} {job.domain}</span>}
                    </div>
                  </div>
                  <span className="badge badge-purple">{job.type || 'Full-time'}</span>
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

      {resumePreviewOpen && (
        <div className="resume-modal-backdrop" onClick={() => setResumePreviewOpen(false)}>
          <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal-header">
              <h3>Resume Preview</h3>
              <button type="button" className="resume-modal-close" onClick={() => setResumePreviewOpen(false)}>
                ×
              </button>
            </div>
            {(state?.uploadedFile?.type === 'application/pdf' || (resumeUrl || '').toLowerCase().endsWith('.pdf') || (previewUrl || '').toLowerCase().includes('.pdf')) ? (
              <iframe
                src={previewUrl || resumeUrl}
                title="Resume Preview"
                className="resume-preview-frame"
              />
            ) : (
              <div className="resume-preview-fallback">
                <p>This file type cannot be previewed inline, but you can still open it directly.</p>
                <a href={resumeUrl || `${window.location.origin}/uploads/${resumeFileName || ''}`} target="_blank" rel="noreferrer">Open resume</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
