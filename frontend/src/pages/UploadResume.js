import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import './UploadResume.css';

const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
const ACCEPTED_EXT = '.pdf,.docx,.txt';

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, pendingResumeFile, setPendingResumeFile } = useAuth();

  const stages = [
    { p: 20, msg: '📄 Reading your resume...' },
    { p: 45, msg: '🤖 AI extracting skills & experience...' },
    { p: 70, msg: '🎯 Matching against job database...' },
    { p: 90, msg: '📊 Scoring and ranking matches...' },
    { p: 100, msg: '✅ Analysis complete!' },
  ];

  // Auto-submit if returning from login with a pending resume file
  useEffect(() => {
    if (location.state?.autoSubmit && pendingResumeFile) {
      const fileToProcess = pendingResumeFile;
      setFile(fileToProcess);
      setPendingResumeFile(null);
      // Inline submit to avoid stale closure / exhaustive-deps lint issue
      setTimeout(async () => {
        setLoading(true);
        setError('');
        setProgress(5);
        setStage('🔄 Uploading file...');
        let i = 0;
        const stagesList = [
          { p: 20, msg: '📄 Reading your resume...' },
          { p: 45, msg: '🤖 AI extracting skills & experience...' },
          { p: 70, msg: '🎯 Matching against job database...' },
          { p: 90, msg: '📊 Scoring and ranking matches...' },
          { p: 100, msg: '✅ Analysis complete!' },
        ];
        const timer = setInterval(() => {
          if (i < stagesList.length) {
            setProgress(stagesList[i].p);
            setStage(stagesList[i].msg);
            i++;
          } else { clearInterval(timer); }
        }, 600);
        try {
          const formData = new FormData();
          formData.append('resume', fileToProcess);
          const { data } = await axios.post('/api/resume/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          clearInterval(timer);
          setProgress(100);
          setStage('✅ Analysis complete!');
          setTimeout(() => {
            navigate('/matches', { state: { result: data } });
          }, 600);
        } catch (err) {
          clearInterval(timer);
          setLoading(false);
          setProgress(0);
          setStage('');
          setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
        }
      }, 300);
    }
  }, []); // eslint-disable-line



  const handleFile = (f) => {
    if (!f) return;
    if (!ACCEPTED_TYPES.includes(f.type)) { setError('Please upload a PDF, DOCX, or TXT file.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB.'); return; }
    setFile(f); setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const simulateProgress = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < stages.length) {
        setProgress(stages[i].p);
        setStage(stages[i].msg);
        i++;
      } else { clearInterval(interval); }
    }, 600);
    return interval;
  };

  const submitFile = async (fileToSubmit) => {
    setLoading(true); setError(''); setProgress(5); setStage('🔄 Uploading file...');
    const timer = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('resume', fileToSubmit);
      const { data } = await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(timer);
      setProgress(100); setStage('✅ Analysis complete!');
      setTimeout(() => {
        navigate('/matches', { state: { result: data } });
      }, 600);
    } catch (err) {
      clearInterval(timer);
      setLoading(false); setProgress(0); setStage('');
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select a resume file.'); return; }

    // Auth check: if not logged in, save file to context and redirect to login
    if (!isLoggedIn) {
      setPendingResumeFile(file);
      navigate('/login', { state: { from: { pathname: '/upload' } } });
      return;
    }

    await submitFile(file);
  };

  return (
    <div className="upload-page">
      <div className="container">
        <div className="upload-header animate-in">
          <span className="badge badge-purple">Step 1 of 4</span>
          <h1>Upload Your Resume</h1>
          <p className="upload-subtitle">
            Our AI will extract your skills and match you with the best jobs available.
            Works for freshers and experienced professionals.
          </p>
        </div>

        <div className="upload-layout">
          {/* Upload zone */}
          <div className="upload-main animate-in-delay-1">
            <div
              className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !file && inputRef.current.click()}
            >
              <input ref={inputRef} type="file" accept={ACCEPTED_EXT} onChange={e => handleFile(e.target.files[0])} hidden />
              {file ? (
                <div className="file-selected">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button className="file-remove" onClick={(e) => { e.stopPropagation(); setFile(null); }}>✕</button>
                </div>
              ) : (
                <div className="drop-placeholder">
                  <div className="drop-icon">☁️</div>
                  <h3>Drop your resume here</h3>
                  <p>or <span className="link-text">click to browse</span></p>
                  <p className="file-types">PDF, DOCX, TXT • Max 5MB</p>
                </div>
              )}
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {loading && (
              <div className="analysis-progress">
                <div className="progress-stage">{stage}</div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div
                    className={`progress-fill ${progress > 66 ? 'high' : progress > 33 ? 'med' : 'low'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="progress-pct">{progress}%</div>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg submit-btn"
              onClick={handleSubmit}
              disabled={!file || loading}
            >
              {loading ? '⏳ Analyzing...' : '🚀 Analyze & Find Jobs'}
            </button>
          </div>

          {/* Side tips */}
          <div className="upload-tips animate-in-delay-2">
            <div className="tips-card card">
              <h3>💡 Resume Tips for Better Matches</h3>
              <ul className="tips-list">
                <li>Include a clear <strong>Skills</strong> section listing technologies</li>
                <li>Mention <strong>years of experience</strong> (e.g., "3+ years in React")</li>
                <li>List your <strong>education</strong> with degree and field</li>
                <li>Include <strong>project names</strong> with technologies used</li>
                <li>Add <strong>certifications</strong> (AWS, Google, etc.)</li>
              </ul>
            </div>
            <div className="tips-card card" style={{ marginTop: '1rem' }}>
              <h3>🔒 Your Privacy</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Your resume is processed in memory and not stored permanently.
                We only extract and display skills and experience data.
              </p>
            </div>
            <div className="tips-card card" style={{ marginTop: '1rem' }}>
              <h3>📂 Supported Formats</h3>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {['PDF', 'DOCX', 'TXT'].map(f => (
                  <span key={f} className="badge badge-purple">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
