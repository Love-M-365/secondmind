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
  ChevronRight,
  Clock,
  ExternalLink
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
    if (r.includes('low')) return 'rgba(16, 185, 129, 0.15) text-success border border-success';
    if (r.includes('medium') || r.includes('mod')) return 'rgba(245, 158, 11, 0.15) text-warning border border-warning';
    return 'rgba(239, 68, 68, 0.15) text-danger border border-danger';
  };

  const getPhaseColor = (index) => {
    const colors = [
      { border: 'rgba(59, 130, 246, 0.3)', dot: '#3b82f6', bg: 'rgba(59, 130, 246, 0.03)' }, // Blue
      { border: 'rgba(139, 92, 246, 0.3)', dot: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.03)' }, // Violet
      { border: 'rgba(16, 185, 129, 0.3)', dot: '#10b981', bg: 'rgba(16, 185, 129, 0.03)' }  // Emerald
    ];
    return colors[index % colors.length];
  };

  const probabilityVal = result?.career?.progressionProbability 
    ? parseInt(result.career.progressionProbability) 
    : 0;

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probabilityVal / 100) * circumference;

  return (
    <div className="container py-5">
      {/* Page Header */}
      <div className="row mb-5">
        <div className="col-12">
          <span className="text-secondary small text-uppercase tracking-wider fw-semibold">Predictive Simulations</span>
          <h1 className="text-white fw-bold mb-0 mt-1">Future Simulation Engine</h1>
          <p className="text-secondary mb-0">Ground hypothetical career shifts or learning tracks in your Cognitive Twin to model milestones and gaps.</p>
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
              <span className="text-secondary small fw-semibold">Quick Templates:</span>
              <button 
                type="button" 
                onClick={() => loadExample('Transition from Full Stack to Machine Learning Engineer in 12 months')}
                className="btn btn-xs btn-secondary-glass py-1.5 px-3 text-secondary text-xs"
                disabled={loading}
              >
                ML Transition
              </button>
              <button 
                type="button" 
                onClick={() => loadExample('Learn Generative AI architectures and prompt orchestration in 3 months')}
                className="btn btn-xs btn-secondary-glass py-1.5 px-3 text-secondary text-xs"
                disabled={loading}
              >
                Generative AI
              </button>
              <button 
                type="button" 
                onClick={() => loadExample('Switch career to cloud solutions architect focusing on Kubernetes')}
                className="btn btn-xs btn-secondary-glass py-1.5 px-3 text-secondary text-xs"
                disabled={loading}
              >
                Cloud Architect
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger border-0 py-3 px-4 mb-4 bg-danger-glow text-white d-flex align-items-center gap-3">
          <AlertCircle size={20} className="text-danger" style={{ color: '#ef4444' }} />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="glass-card text-center p-5">
          <div className="pulse-loader-container mb-4">
            <div className="pulse-loader-ring"></div>
            <Loader2 size={48} className="text-violet spin position-relative" style={{ color: 'var(--accent-primary)', zIndex: 2 }} />
          </div>
          <h5 className="text-white fw-bold mb-2">Engaging Agent Architecture...</h5>
          <p className="text-secondary small mb-0 max-w-sm mx-auto">
            The **Career Agent** is validating alignment, while the **Learning Agent** synthesizes a personalized resources syllabus.
          </p>
        </div>
      )}

      {/* Simulation Results */}
      {result && (
        <div className="row g-4">
          
          {/* Left Hand Column: Learning Path */}
          <div className="col-lg-6">
            <div className="glass-card h-100 d-flex flex-column">
              <h4 className="text-white mb-4 d-flex align-items-center gap-2">
                <BookOpen size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                <span>Learning Agent Curriculum</span>
              </h4>

              {/* Skills Roadmap */}
              <div className="mb-4 p-3 rounded bg-white-5 border border-glass">
                <div className="text-white small fw-bold mb-3 d-flex align-items-center gap-2">
                  <Activity size={14} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Target Competency Roadmap</span>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {result.learning.skillRoadmap?.map((skill, idx) => (
                    <span key={idx} className="badge badge-glass badge-interest py-2 px-3 transition-all hover-scale">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="mb-4 flex-grow-1">
                <div className="text-white small fw-bold mb-3">Syllabus Milestones</div>
                <div className="d-flex flex-column gap-3">
                  {result.learning.milestones?.map((milestone, idx) => (
                    <div key={idx} className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3 transition-all hover-glow-violet">
                      <div className="p-2.5 rounded bg-white-5 text-secondary flex-shrink-0 d-flex align-items-center justify-content-center">
                        <Map size={16} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                      </div>
                      <div className="min-width-0 w-100">
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                          <span className="text-white fw-bold small">{milestone.title}</span>
                          <span className="badge badge-glass text-uppercase py-1 px-2 border-0 d-flex align-items-center gap-1" style={{ fontSize: '0.62rem', background: 'rgba(139, 92, 246, 0.12)', color: '#c084fc' }}>
                            <Clock size={10} />
                            {milestone.timeframe}
                          </span>
                        </div>
                        <p className="text-secondary small mt-1.5 mb-2.5 lh-sm">{milestone.details}</p>
                        <div className="text-muted border-top border-glass-thin pt-2 d-flex align-items-center gap-1.5" style={{ fontSize: '0.72rem' }}>
                          <Compass size={12} className="text-muted" />
                          <span><strong>Resources:</strong> {milestone.resources}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Outcomes */}
              <div className="p-3.5 rounded bg-white-5 border border-glass mt-auto">
                <div className="text-white small fw-bold mb-1">Expected Capability Output</div>
                <p className="text-secondary small mb-0 mt-1.5 lh-base">{result.learning.estimatedOutcomes}</p>
              </div>

            </div>
          </div>

          {/* Right Hand Column: Career Forecast */}
          <div className="col-lg-6">
            <div className="glass-card h-100 d-flex flex-column">
              <h4 className="text-white mb-4 d-flex align-items-center gap-2">
                <TrendingUp size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                <span>Career Agent Forecast</span>
              </h4>

              {/* Probability Meter & Success Indicator */}
              <div className="p-4 rounded bg-white-5 border border-glass mb-4 d-flex align-items-center gap-4 transition-all hover-glow-emerald">
                {/* SVG Gauge */}
                <div className="position-relative flex-shrink-0" style={{ width: '84px', height: '84px' }}>
                  <svg width="84" height="84" className="gauge-svg">
                    <circle cx="42" cy="42" r={radius} strokeWidth="6" className="gauge-circle-bg" />
                    <circle 
                      cx="42" 
                      cy="42" 
                      r={radius} 
                      strokeWidth="6" 
                      className="gauge-circle" 
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      stroke="url(#probability-gradient)"
                    />
                    <defs>
                      <linearGradient id="probability-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="position-absolute start-50 top-50 translate-middle text-white fw-bold text-center" style={{ fontSize: '0.95rem' }}>
                    {probabilityVal}%
                  </div>
                </div>
                
                <div>
                  <div className="text-white fw-bold small">Success Probability Factor</div>
                  <p className="text-secondary small mb-0 mt-1 lh-sm">Grounded in matching twin assets: {result.career.progressionProbability}</p>
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="mb-4">
                <div className="text-white small fw-bold mb-2.5">Identified Skill & Experience Gaps</div>
                <div className="d-flex flex-column gap-2">
                  {result.career.gapAnalysis?.map((gap, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-white-5 border border-glass d-flex align-items-center gap-2.5 small text-secondary transition-all hover-scale-sm">
                      <ShieldAlert size={15} className="text-danger flex-shrink-0" style={{ color: '#ef4444' }} />
                      <span className="lh-sm">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Progression Timeline */}
              <div className="flex-grow-1">
                <div className="text-white small fw-bold mb-3.5">Projected Career Phasing</div>
                <div className="timeline-container">
                  {result.career.timeline?.map((phase, idx) => {
                    const styling = getPhaseColor(idx);
                    return (
                      <div key={idx} className="timeline-item">
                        <div className="timeline-dot" style={{ background: styling.dot, boxShadow: `0 0 10px ${styling.dot}` }}></div>
                        <div className="p-3.5 rounded bg-white-5 border transition-all hover-glow" style={{ 
                          borderColor: styling.border,
                          background: styling.bg
                        }}>
                          <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                            <span className="text-white fw-bold small">{phase.phase}</span>
                            <span className={`badge ${getRiskBadgeColor(phase.riskLevel)} px-2 py-1`} style={{ fontSize: '0.65rem', borderRadius: '12px' }}>
                              {phase.riskLevel} Risk
                            </span>
                          </div>
                          <div className="text-white small mb-2">
                            <strong className="text-secondary">Proposed Target:</strong> {phase.role}
                          </div>
                          
                          <ul className="ps-3 mb-0 text-secondary small d-flex flex-column gap-1">
                            {phase.milestones?.map((m, mIdx) => (
                              <li key={mIdx} className="lh-sm">{m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      <style>{`
        .bg-white-5 {
          background: rgba(255, 255, 255, 0.04);
        }
        .btn-xs {
          font-size: 0.72rem;
          border-radius: 8px;
        }
        .text-xxs {
          font-size: 0.68rem;
        }
        .border-glass-thin {
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.04);
        }
        .hover-scale-sm {
          transition: transform 0.15s ease;
        }
        .hover-scale-sm:hover {
          transform: translateX(3px);
          background: rgba(255,255,255,0.06);
        }
        .hover-glow-violet:hover {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.12);
          border-color: rgba(139, 92, 246, 0.22) !important;
        }
        .hover-glow-emerald:hover {
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.22) !important;
        }
        .hover-glow:hover {
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.03);
          transform: translateY(-1px);
        }
        .pulse-loader-container {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulse-loader-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.15);
          animation: pulse-ring 1.8s infinite cubic-bezier(0.215, 0.610, 0.355, 1);
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FutureSimulator;