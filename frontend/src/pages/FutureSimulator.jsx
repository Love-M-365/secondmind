import React, { useState } from 'react';
import api from '../services/api';
import { 
  Sparkles, 
  Map, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Compass, 
  ShieldAlert, 
  Activity, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const FutureSimulator = () => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/agents/simulate', { goal: goal.trim() });
      if (response.data.success) {
        setResult(response.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err.response?.data?.message || 'Failed to complete future simulation. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (ex) => {
    setGoal(ex);
  };

  const getRiskBadgeColor = (risk) => {
    const r = (risk || '').toLowerCase();
    if (r.includes('low')) return 'bg-success text-white';
    if (r.includes('medium')) return 'bg-warning text-dark';
    return 'bg-danger text-white';
  };

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="row mb-5">
        <div className="col-12">
          <span className="text-secondary small text-uppercase tracking-wider fw-semibold">Predictive Simulations</span>
          <h1 className="text-white fw-bold mb-0 mt-1">Future Simulation Engine</h1>
          <p className="text-secondary mb-0">Ground hypothetical career shifts or technical learning tracks in your Digital Twin schema to forecast outcomes.</p>
        </div>
      </div>

      {/* Goal Input Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="glass-card">
            <h5 className="text-white mb-3 d-flex align-items-center gap-2">
              <Sparkles size={18} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
              <span>Define Target Career or Skill Shift</span>
            </h5>
            
            <form onSubmit={handleSimulate} className="mb-3">
              <div className="input-group">
                <input 
                  type="text" 
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="form-control glass-input"
                  placeholder="E.g., Shift from React developer to AI Engineer in 1 year, Focus on Deep Learning..."
                  required
                  disabled={loading}
                />
                <button type="submit" disabled={loading || !goal.trim()} className="btn btn-primary-glow px-4 d-flex align-items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Simulating...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Simulation</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="text-secondary small">Try:</span>
              <button 
                type="button" 
                onClick={() => loadExample('Transition from Full Stack to Machine Learning Engineer in 12 months')}
                className="btn btn-xs btn-secondary-glass py-1 px-2 text-secondary"
                disabled={loading}
              >
                ML Transition
              </button>
              <button 
                type="button" 
                onClick={() => loadExample('Learn Generative AI architectures and prompt orchestration in 3 months')}
                className="btn btn-xs btn-secondary-glass py-1 px-2 text-secondary"
                disabled={loading}
              >
                Generative AI
              </button>
              <button 
                type="button" 
                onClick={() => loadExample('Switch career to cloud solutions architect focusing on Kubernetes')}
                className="btn btn-xs btn-secondary-glass py-1 px-2 text-secondary"
                disabled={loading}
              >
                Cloud Architect
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger border-0 py-3 px-4 mb-4 bg-danger-glow text-white d-flex align-items-center gap-2">
          <AlertCircle size={20} className="text-danger" style={{ color: '#ef4444' }} />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="glass-card text-center p-5">
          <Loader2 size={48} className="text-violet spin mx-auto mb-3" style={{ color: 'var(--accent-primary)', animation: 'spin 1.5s linear infinite' }} />
          <h5 className="text-white fw-bold mb-2">Engaging AI Agent Networks...</h5>
          <p className="text-secondary small mb-0 max-w-sm mx-auto">
            The **Career Agent** is inspecting gaps and timeline risks, while the **Learning Agent** creates study resource syllabi.
          </p>
        </div>
      )}

      {/* Simulation Results */}
      {result && (
        <div className="row g-4">
          
          {/* Left Hand: Learning Path */}
          <div className="col-lg-6">
            <div className="glass-card h-100">
              <h4 className="text-white mb-4 d-flex align-items-center gap-2">
                <BookOpen size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                <span>Learning Agent Curriculum</span>
              </h4>

              {/* Skills Roadmap */}
              <div className="mb-4">
                <div className="text-white small fw-bold mb-2">Technical Skill Acquisition Roadmap</div>
                <div className="d-flex flex-wrap gap-2">
                  {result.learning.skillRoadmap?.map((skill, idx) => (
                    <span key={idx} className="badge badge-glass badge-interest py-1 px-3">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="mb-4">
                <div className="text-white small fw-bold mb-3">Study Milestones</div>
                <div className="d-flex flex-column gap-3">
                  {result.learning.milestones?.map((milestone, idx) => (
                    <div key={idx} className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3">
                      <div className="p-2 rounded bg-white-5 text-secondary flex-shrink-0">
                        <Map size={16} />
                      </div>
                      <div className="min-width-0">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                          <span className="text-white fw-bold small">{milestone.title}</span>
                          <span className="badge badge-glass text-uppercase py-1 px-2 border-0" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)' }}>
                            {milestone.timeframe}
                          </span>
                        </div>
                        <p className="text-secondary small mt-1 mb-2">{milestone.details}</p>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          <strong>Resources:</strong> {milestone.resources}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Outcomes */}
              <div className="p-3 rounded bg-white-5 border border-glass">
                <div className="text-white small fw-bold mb-1">Expected Capability Output</div>
                <p className="text-secondary small mb-0 mt-1">{result.learning.estimatedOutcomes}</p>
              </div>

            </div>
          </div>

          {/* Right Hand: Career Project */}
          <div className="col-lg-6">
            <div className="glass-card h-100">
              <h4 className="text-white mb-4 d-flex align-items-center gap-2">
                <TrendingUp size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                <span>Career Agent Forecast</span>
              </h4>

              {/* Probability Meter */}
              <div className="p-3 rounded bg-white-5 border border-glass mb-4 d-flex align-items-center gap-4">
                {/* SVG Gauge */}
                <svg width="70" height="70" className="gauge-svg flex-shrink-0">
                  <circle cx="35" cy="35" r="30" strokeWidth="5" className="gauge-circle-bg" />
                  <circle 
                    cx="35" 
                    cy="35" 
                    r="30" 
                    strokeWidth="5" 
                    className="gauge-circle" 
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={2 * Math.PI * 30 - (parseInt(result.career.progressionProbability) / 100) * (2 * Math.PI * 30)}
                  />
                  <text x="35" y="38" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(90 35 35)">
                    {result.career.progressionProbability?.split('%')[0]}%
                  </text>
                </svg>
                
                <div>
                  <div className="text-white fw-bold small">Success Probability Factor</div>
                  <p className="text-secondary small mb-0 mt-1">{result.career.progressionProbability}</p>
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="mb-4">
                <div className="text-white small fw-bold mb-2">Identified Skill & Experience Gaps</div>
                <div className="d-flex flex-column gap-2">
                  {result.career.gapAnalysis?.map((gap, idx) => (
                    <div key={idx} className="p-2 rounded bg-white-5 border border-glass d-flex align-items-center gap-2 small text-secondary">
                      <ShieldAlert size={14} className="text-danger" style={{ color: '#ef4444' }} />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Progression Timeline */}
              <div>
                <div className="text-white small fw-bold mb-3">Projected Career Phasing</div>
                <div className="timeline-container">
                  {result.career.timeline?.map((phase, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot" style={{ background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }}></div>
                      <div className="p-3 rounded bg-white-5 border border-glass">
                        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                          <span className="text-white fw-bold small">{phase.phase}</span>
                          <span className={`badge ${getRiskBadgeColor(phase.riskLevel)} py-1 px-2 border-0`} style={{ fontSize: '0.65rem' }}>
                            {phase.riskLevel} Risk
                          </span>
                        </div>
                        <div className="text-white small mb-2">
                          <strong>Role:</strong> {phase.role}
                        </div>
                        <ul className="ps-3 mb-0 text-secondary small">
                          {phase.milestones?.map((m, mIdx) => (
                            <li key={mIdx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      <style>{`
        .bg-white-5 {
          background: rgba(255, 255, 255, 0.05);
        }
        .btn-xs {
          font-size: 0.75rem;
        }
        .text-xxs {
          font-size: 0.7rem;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FutureSimulator;
