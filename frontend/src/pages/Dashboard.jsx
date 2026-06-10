import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import UploadDropzone from '../components/UploadDropzone';
import { 
  Brain, 
  Sparkles, 
  Calendar, 
  Plus, 
  RefreshCw, 
  FileText, 
  User, 
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [twin, setTwin] = useState(null);
  const [memories, setMemories] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loadingTwin, setLoadingTwin] = useState(true);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [rebuildingTwin, setRebuildingTwin] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteSourceType, setNoteSourceType] = useState('note');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    fetchTwin();
    fetchMemories();
    fetchWeeklyPlan();
  }, []);

  const fetchTwin = async () => {
    try {
      const response = await api.get('/twin');
      if (response.data.success) {
        setTwin(response.data.twin);
      }
    } catch (error) {
      console.error('Error fetching twin snapshot:', error);
    } finally {
      setLoadingTwin(false);
    }
  };

  const fetchMemories = async () => {
    try {
      const response = await api.get('/memories');
      if (response.data.success) {
        setMemories(response.data.memories.slice(0, 5)); // show top 5
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoadingMemories(false);
    }
  };

  const fetchWeeklyPlan = async () => {
    setLoadingPlan(true);
    try {
      const response = await api.get('/agents/weekly-plan');
      if (response.data.success) {
        setWeeklyPlan(response.data.plan);
      }
    } catch (error) {
      console.error('Error generating/fetching weekly plan:', error);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleUploadSuccess = (newMemory) => {
    // Refresh dashboard feeds
    fetchMemories();
    // Rebuild twin snapshot in background or refresh state
    setTimeout(() => {
      fetchTwin();
      fetchWeeklyPlan();
    }, 2000);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setAddingNote(true);
    try {
      const response = await api.post('/memories/note', {
        content: noteContent,
        sourceType: noteSourceType
      });

      if (response.data.success) {
        setNoteContent('');
        fetchMemories();
        // Give time for background rebuild
        setTimeout(() => {
          fetchTwin();
          fetchWeeklyPlan();
        }, 2500);
      }
    } catch (error) {
      console.error('Error adding custom note:', error);
    } finally {
      setAddingNote(false);
    }
  };

  const triggerForceRebuild = async () => {
    setRebuildingTwin(true);
    try {
      const response = await api.post('/twin/rebuild');
      if (response.data.success) {
        setTwin(response.data.twin);
        fetchWeeklyPlan(); // Update planning context
      }
    } catch (error) {
      console.error('Error rebuilding twin:', error);
    } finally {
      setRebuildingTwin(false);
    }
  };

  return (
    <div className="container py-5 dashboard-container animate-fade-in">
      {/* Greeting Header */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-9 text-start">
          <span className="text-violet small text-uppercase tracking-wider fw-bold">Command Center</span>
          <h1 className="text-white display-5 fw-extrabold mb-1 mt-1 font-space">Hello, {user?.name || 'User'}</h1>
          <p className="text-secondary mb-0">Your SecondMind system is active, indexing memories, and sync'd in real-time.</p>
        </div>
        <div className="col-md-3 d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
          <button 
            onClick={triggerForceRebuild} 
            disabled={rebuildingTwin || memories.length === 0}
            className="btn btn-secondary-glass d-flex align-items-center gap-2 hover-scale"
            title="Force Digital Twin analysis to update skills/goals"
          >
            <RefreshCw size={15} className={rebuildingTwin ? 'spin' : ''} />
            <span>AI Rebuild Twin</span>
          </button>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-md-3">
          <div className="glass-card stat-card-custom p-4 d-flex align-items-center gap-3">
            <div className="stat-icon-wrap bg-violet-glow text-violet">
              <Brain size={20} />
            </div>
            <div>
              <div className="text-white fw-bold fs-4">{memories.length > 0 ? `${memories.length}+` : '0'}</div>
              <div className="text-secondary small">Stored Memories</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="glass-card stat-card-custom p-4 d-flex align-items-center gap-3">
            <div className="stat-icon-wrap bg-blue-glow text-blue">
              <User size={20} />
            </div>
            <div>
              <div className="text-white fw-bold fs-4">{twin?.skills?.length || 0}</div>
              <div className="text-secondary small">Mapped Skills</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="glass-card stat-card-custom p-4 d-flex align-items-center gap-3">
            <div className="stat-icon-wrap bg-emerald-glow text-emerald">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-white fw-bold fs-4">{twin?.goals?.length || 0}</div>
              <div className="text-secondary small">Active Roadmaps</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="glass-card stat-card-custom p-4 d-flex align-items-center gap-3">
            <div className="stat-icon-wrap bg-amber-glow text-amber">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-white fw-bold fs-4">{weeklyPlan ? 'Sync\'d' : 'Standby'}</div>
              <div className="text-secondary small">Scheduler Status</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Knowledge uploads & Ingestion */}
        <div className="col-lg-6">
          <div className="d-flex flex-column gap-4">
            
            {/* Upload Zone */}
            <div className="glass-card panel-container">
              <h5 className="text-white mb-4 d-flex align-items-center gap-2 border-bottom border-glass pb-3">
                <FileText size={18} className="text-violet" />
                <span>Ingest Knowledge Sources</span>
              </h5>
              <UploadDropzone onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* Manual Note Ingestion */}
            <div className="glass-card panel-container">
              <h5 className="text-white mb-4 d-flex align-items-center gap-2 border-bottom border-glass pb-3">
                <Plus size={18} className="text-violet" />
                <span>Add Quick Reflection or Target</span>
              </h5>
              <form onSubmit={handleAddNote}>
                <div className="mb-3">
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="form-control glass-input w-100 font-sans" 
                    rows="3"
                    placeholder="E.g., Today I finalized the auth middleware to protect APIs, using Firebase Admin SDK and standard JSON token parsing..."
                    required
                  ></textarea>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setNoteSourceType('note')}
                      className={`btn btn-xs py-2 px-3 border-0 transition-all ${noteSourceType === 'note' ? 'btn-active-pill' : 'btn-inactive-pill'}`}
                    >
                      Reflection Note
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNoteSourceType('goal')}
                      className={`btn btn-xs py-2 px-3 border-0 transition-all ${noteSourceType === 'goal' ? 'btn-active-pill' : 'btn-inactive-pill'}`}
                    >
                      Target Goal
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    disabled={addingNote || !noteContent.trim()}
                    className="btn btn-primary-glow btn-sm py-2 px-3 d-flex align-items-center gap-2"
                  >
                    {addingNote ? 'Saving...' : 'Add to Memory'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Recent Memories Feed */}
            <div className="glass-card panel-container">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-glass pb-3">
                <h5 className="text-white mb-0 d-flex align-items-center gap-2">
                  <Brain size={18} className="text-violet" />
                  <span>Recent Knowledge Log</span>
                </h5>
                <Link to="/memories" className="text-secondary small d-flex align-items-center gap-1 hover-text-violet text-decoration-none transition-all">
                  <span>View Full Corpus</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loadingMemories ? (
                <div className="text-center py-4 text-secondary">Loading memories...</div>
              ) : memories.length === 0 ? (
                <div className="text-center py-5 text-secondary bg-white-3 rounded-3 border border-glass">
                  <AlertCircle size={24} className="mx-auto mb-2 text-muted" />
                  <p className="small mb-0">No memories stored. Ingest files or notes to begin.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {memories.map((m) => (
                    <div key={m._id} className="p-3 rounded-3 bg-white-5 border border-glass d-flex align-items-start gap-3 hover-glow-card transition-all">
                      <div className="p-2 rounded bg-white-5 text-secondary">
                        <FileText size={16} />
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className={`badge py-1 px-2 border-0 uppercase ${
                            m.sourceType === 'goal' ? 'badge-goal' : 'badge-glass'
                          }`} style={{ fontSize: '0.62rem' }}>
                            {m.sourceType}
                          </span>
                          <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.72rem' }}>
                            <Clock size={11} />
                            {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-secondary small mb-0 text-truncate-2 lh-base">
                          {m.summary || m.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Digital Twin snapshot & Planning */}
        <div className="col-lg-6">
          <div className="d-flex flex-column gap-4">
            
            {/* Digital Twin Snapshot */}
            <div className="glass-card panel-container">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-glass pb-3">
                <h5 className="text-white mb-0 d-flex align-items-center gap-2">
                  <User size={18} className="text-violet" />
                  <span>Cognitive Digital Twin Snapshot</span>
                </h5>
                <Link to="/twin" className="text-secondary small d-flex align-items-center gap-1 hover-text-violet text-decoration-none transition-all">
                  <span>Explore Canvas</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loadingTwin ? (
                <div className="text-center py-4 text-secondary">Loading digital twin...</div>
              ) : !twin || (twin.skills.length === 0 && twin.goals.length === 0) ? (
                <div className="text-center py-5 text-secondary bg-white-3 rounded-3 border border-glass">
                  <AlertCircle size={24} className="mx-auto mb-2 text-muted" />
                  <p className="small mb-2 fw-semibold">Digital Twin not yet initialized.</p>
                  <p className="x-small text-muted mb-0 px-4">Upload documents or notes to allow the AI to extract your skills, goals, strengths, and weaknesses.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {twin.skills.length > 0 && (
                    <div>
                      <div className="text-white small fw-bold mb-2 font-space uppercase tracking-wider text-muted-custom">Identified Skills</div>
                      <div className="d-flex flex-wrap gap-2">
                        {twin.skills.slice(0, 6).map((skill, idx) => (
                          <span key={idx} className="badge badge-glass badge-skill">{skill}</span>
                        ))}
                        {twin.skills.length > 6 && (
                          <span className="badge badge-glass border-0 bg-transparent text-secondary">+{twin.skills.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {twin.goals.length > 0 && (
                    <div>
                      <div className="text-white small fw-bold mb-2 font-space uppercase tracking-wider text-muted-custom">Current Goals</div>
                      <div className="d-flex flex-column gap-2">
                        {twin.goals.slice(0, 3).map((goal, idx) => (
                          <div key={idx} className="p-3 rounded-3 bg-white-5 border border-glass d-flex align-items-start gap-2 small text-secondary">
                            <span className="indicator-dot bg-success mt-1"></span>
                            <span>{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Weekly Schedule Plan Panel */}
            <div className="glass-card panel-container">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-glass pb-3">
                <h5 className="text-white mb-0 d-flex align-items-center gap-2">
                  <Calendar size={18} className="text-violet" />
                  <span>Planning Agent Weekly Agenda</span>
                </h5>
                <button onClick={fetchWeeklyPlan} disabled={loadingPlan || memories.length === 0} className="btn btn-sm btn-secondary-glass py-1 px-2 border-0 bg-transparent text-secondary hover-text-violet">
                  <RefreshCw size={14} className={loadingPlan ? 'spin' : ''} />
                </button>
              </div>

              {loadingPlan ? (
                <div className="text-center py-4 text-secondary">Synthesizing schedules...</div>
              ) : !weeklyPlan ? (
                <div className="text-center py-5 text-secondary bg-white-3 rounded-3 border border-glass">
                  <AlertCircle size={24} className="mx-auto mb-2 text-muted" />
                  <p className="small mb-0">No weekly plan generated. Add goals to let the planning agent compile your week.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-3 bg-white-5 border border-glass mb-1">
                    <span className="text-muted small text-uppercase tracking-wider fw-semibold" style={{ fontSize: '0.68rem' }}>This Week's Focus</span>
                    <p className="text-white fw-bold mb-0 mt-1">{weeklyPlan.weeklyFocus}</p>
                  </div>

                  <div className="text-white small fw-bold font-space uppercase tracking-wider text-muted-custom">Suggested Agenda</div>
                  <div className="d-flex flex-column gap-2 max-height-300" style={{ overflowY: 'auto' }}>
                    {weeklyPlan.schedule?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="p-3 rounded-3 bg-white-5 border-left-violet border border-glass small d-flex flex-column gap-1">
                        <div className="d-flex justify-content-between">
                          <span className="text-white fw-bold">{item.day}</span>
                        </div>
                        {item.tasks?.map((task, tIdx) => (
                          <div key={tIdx} className="text-secondary small mt-1">
                            <strong className="text-violet">{task.time}</strong> — {task.activity}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {weeklyPlan.actionItems?.length > 0 && (
                    <div className="mt-2">
                      <div className="text-white small fw-bold mb-2 font-space uppercase tracking-wider text-muted-custom">Immediate Steps</div>
                      <div className="d-flex flex-column gap-2">
                        {weeklyPlan.actionItems.slice(0, 3).map((action, idx) => (
                          <div key={idx} className="p-2 rounded bg-white-3 border border-glass d-flex align-items-center gap-2 small text-secondary">
                            <ChevronRight size={14} className="text-violet" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Simulation Link */}
            <div className="glass-card text-center d-flex flex-column align-items-center justify-content-center py-4 bg-gradient-violet border-glass relative panel-container" style={{ overflow: 'hidden' }}>
              <div className="glow-bubble"></div>
              <Sparkles size={28} className="text-violet mb-2" style={{ color: 'var(--accent-primary)' }} />
              <h5 className="text-white fw-bold mb-1 font-space">Simulate Career Outcomes</h5>
              <p className="text-secondary small mb-3 max-w-sm">Test hypothetical career moves or focus shifts, and view full roadmaps.</p>
              <Link to="/simulator" className="btn btn-primary-glow btn-sm py-2 px-4 hover-scale">
                Open Future Simulator
              </Link>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        .bg-white-3 {
          background: rgba(255, 255, 255, 0.03);
        }
        .bg-gradient-violet {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.05));
          border-color: rgba(139, 92, 246, 0.25);
        }
        .border-left-violet {
          border-left: 3px solid var(--accent-primary) !important;
        }
        .max-w-sm {
          max-width: 350px;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .max-height-300 {
          max-height: 250px;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        
        /* Premium Polish CSS */
        .font-space {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .text-muted-custom {
          color: rgba(255,255,255,0.4) !important;
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          font-weight: 700;
        }
        .stat-card-custom {
          transition: var(--transition-smooth);
        }
        .stat-card-custom:hover {
          border-color: rgba(139, 92, 246, 0.25) !important;
          box-shadow: 0 10px 30px rgba(139,92,246,0.08) !important;
          transform: translateY(-2px);
        }
        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bg-violet-glow {
          background: rgba(139, 92, 246, 0.12);
        }
        .bg-blue-glow {
          background: rgba(59, 130, 246, 0.12);
        }
        .bg-emerald-glow {
          background: rgba(16, 185, 129, 0.12);
        }
        .bg-amber-glow {
          background: rgba(245, 158, 11, 0.12);
        }
        .text-blue { color: #93c5fd; }
        .text-emerald { color: #a7f3d0; }
        .text-amber { color: #fde047; }
        
        .panel-container {
          transition: var(--transition-smooth);
        }
        .panel-container:hover {
          border-color: rgba(255,255,255,0.1) !important;
        }
        .btn-active-pill {
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.4) !important;
          color: #c084fc;
          border-radius: 100px;
          font-weight: 600;
        }
        .btn-inactive-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-glass) !important;
          color: var(--text-secondary);
          border-radius: 100px;
        }
        .btn-inactive-pill:hover {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-primary);
        }
        .hover-glow-card:hover {
          border-color: rgba(139, 92, 246, 0.2) !important;
          background: rgba(255,255,255,0.05) !important;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.04);
        }
        .hover-scale {
          transition: var(--transition-smooth);
        }
        .hover-scale:hover {
          transform: translateY(-1px);
        }
        .hover-text-violet:hover {
          color: #c084fc !important;
        }
        .indicator-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .bg-success { background: #10b981 !important; box-shadow: 0 0 6px #10b981; }
        .bg-violet { background: #8b5cf6 !important; box-shadow: 0 0 6px #8b5cf6; }
        
        .glow-bubble {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: var(--accent-primary);
          filter: blur(60px);
          opacity: 0.15;
          top: -50px;
          right: -50px;
          pointer-events: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;