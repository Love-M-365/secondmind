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
  ArrowRight
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
    <div className="container py-5">
      {/* Greeting Header */}
      <div className="row mb-5">
        <div className="col-10">
          <span className="text-secondary small text-uppercase tracking-wider fw-semibold">Digital Twin Command Center</span>
          <h1 className="text-white fw-bold mb-0 mt-1">Hello, {user?.name || 'User'}</h1>
          <p className="text-secondary mb-0">Your SecondMind platform is synced and processing signals in real time.</p>
        </div>
        <div className="col-2 d-flex align-items-center justify-content-end">
          <button 
            onClick={triggerForceRebuild} 
            disabled={rebuildingTwin || memories.length === 0}
            className="btn btn-secondary-glass d-flex align-items-center gap-2"
            title="Force Digital Twin analysis to update skills/goals"
          >
            <RefreshCw size={16} className={rebuildingTwin ? 'spin' : ''} />
            <span className="d-none d-md-inline">Rebuild Twin</span>
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Knowledge uploads & Ingestion */}
        <div className="col-lg-6">
          <div className="d-flex flex-column gap-4">
            
            {/* Upload Zone */}
            <div className="glass-card">
              <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                <FileText size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                <span>Ingest Knowledge</span>
              </h4>
              <UploadDropzone onUploadSuccess={handleUploadSuccess} />
            </div>

            {/* Manual Note Ingestion */}
            <div className="glass-card">
              <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                <Plus size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                <span>Add Note or Goal</span>
              </h4>
              <form onSubmit={handleAddNote}>
                <div className="mb-3">
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="form-control glass-input w-100" 
                    rows="3"
                    placeholder="E.g., Today I set a goal to master Vector Search in MongoDB. I finished reading the docs on Atlas Search Index setup..."
                    required
                  ></textarea>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setNoteSourceType('note')}
                      className={`btn btn-sm ${noteSourceType === 'note' ? 'btn-primary-glow' : 'btn-secondary-glass border-0'}`}
                    >
                      Reflection Note
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNoteSourceType('goal')}
                      className={`btn btn-sm ${noteSourceType === 'goal' ? 'btn-primary-glow' : 'btn-secondary-glass border-0'}`}
                    >
                      Goal Setting
                    </button>
                  </div>
                  <button 
                    type="submit" 
                    disabled={addingNote || !noteContent.trim()}
                    className="btn btn-primary-glow btn-sm d-flex align-items-center gap-2"
                  >
                    {addingNote ? 'Saving...' : 'Add to Memory'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Recent Memories Feed */}
            <div className="glass-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="text-white mb-0 d-flex align-items-center gap-2">
                  <Brain size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Recent Memories</span>
                </h4>
                <Link to="/memories" className="text-secondary small d-flex align-items-center gap-1 hover-text-violet">
                  <span>View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loadingMemories ? (
                <div className="text-center py-4 text-secondary">Loading memories...</div>
              ) : memories.length === 0 ? (
                <div className="text-center py-4 text-secondary bg-white-3 rounded">
                  <AlertCircle size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="small mb-0">No memories stored. Upload files above to begin.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {memories.map((m) => (
                    <div key={m._id} className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3">
                      <div className="p-2 rounded bg-white-5 text-secondary">
                        <FileText size={16} />
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="badge badge-glass text-uppercase py-1 px-2" style={{ fontSize: '0.65rem' }}>
                            {m.sourceType}
                          </span>
                          <span className="text-muted text-xs d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                            <Clock size={12} />
                            {new Date(m.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-secondary small mb-0 text-truncate-2">
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
            <div className="glass-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="text-white mb-0 d-flex align-items-center gap-2">
                  <User size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Digital Twin Snapshot</span>
                </h4>
                <Link to="/twin" className="text-secondary small d-flex align-items-center gap-1 hover-text-violet">
                  <span>Explore Canvas</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {loadingTwin ? (
                <div className="text-center py-4 text-secondary">Loading digital twin...</div>
              ) : !twin || (twin.skills.length === 0 && twin.goals.length === 0) ? (
                <div className="text-center py-4 text-secondary bg-white-3 rounded">
                  <AlertCircle size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="small mb-2">Digital Twin not yet initialized.</p>
                  <p className="x-small text-muted mb-0">Upload documents or notes to allow the AI to extract your skills, goals, strengths, and weaknesses.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {twin.skills.length > 0 && (
                    <div>
                      <div className="text-white small fw-bold mb-2">Identified Skills</div>
                      <div className="d-flex flex-wrap gap-2">
                        {twin.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="badge badge-glass badge-skill">{skill}</span>
                        ))}
                        {twin.skills.length > 5 && (
                          <span className="badge badge-glass border-0 bg-transparent text-secondary">+{twin.skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {twin.goals.length > 0 && (
                    <div>
                      <div className="text-white small fw-bold mb-2">Current Goals</div>
                      <div className="d-flex flex-column gap-2">
                        {twin.goals.slice(0, 3).map((goal, idx) => (
                          <div key={idx} className="d-flex align-items-center gap-2 text-secondary small">
                            <span className="w-4 h-4 rounded-circle bg-success d-inline-block" style={{ width: 6, height: 6 }}></span>
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
            <div className="glass-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="text-white mb-0 d-flex align-items-center gap-2">
                  <Calendar size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Planning Agent Weekly Focus</span>
                </h4>
                <button onClick={fetchWeeklyPlan} disabled={loadingPlan || memories.length === 0} className="btn btn-sm btn-secondary-glass py-1 px-2 border-0 bg-transparent text-secondary">
                  <RefreshCw size={14} className={loadingPlan ? 'spin' : ''} />
                </button>
              </div>

              {loadingPlan ? (
                <div className="text-center py-4 text-secondary">Synthesizing schedules...</div>
              ) : !weeklyPlan ? (
                <div className="text-center py-4 text-secondary bg-white-3 rounded">
                  <AlertCircle size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="small mb-0">No weekly plan generated. Add goals to let the planning agent compile your week.</p>
                </div>
              ) : (
                <div>
                  <div className="p-3 rounded bg-white-5 border border-glass mb-3">
                    <span className="text-muted small">This Week's Focus:</span>
                    <p className="text-white fw-semibold mb-0 mt-1">{weeklyPlan.weeklyFocus}</p>
                  </div>

                  <div className="text-white small fw-bold mb-2">Suggested Agenda</div>
                  <div className="d-flex flex-column gap-2 max-height-300" style={{ overflowY: 'auto' }}>
                    {weeklyPlan.schedule?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="p-2 rounded bg-white-3 border-left-violet border-glass small d-flex flex-column gap-1">
                        <div className="d-flex justify-content-between">
                          <span className="text-white fw-bold">{item.day}</span>
                        </div>
                        {item.tasks?.map((task, tIdx) => (
                          <div key={tIdx} className="text-secondary text-xs">
                            <strong>{task.time}</strong>: {task.activity}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {weeklyPlan.actionItems?.length > 0 && (
                    <div className="mt-3">
                      <div className="text-white small fw-bold mb-2">Immediate Steps</div>
                      <ul className="ps-3 mb-0 text-secondary small">
                        {weeklyPlan.actionItems.slice(0, 3).map((action, idx) => (
                          <li key={idx} className="mb-1">{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Simulation Link */}
            <div className="glass-card text-center d-flex flex-column align-items-center justify-content-center py-4 bg-gradient-violet">
              <Sparkles size={28} className="text-white mb-2" />
              <h5 className="text-white fw-bold mb-1">Simulate Career Outcomes</h5>
              <p className="text-secondary small mb-3 max-w-sm">Test hypothetical career moves or focus shifts, and view full roadmaps.</p>
              <Link to="/simulator" className="btn btn-primary-glow btn-sm py-2 px-4">
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
          border-left: 3px solid var(--accent-primary);
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
      `}</style>
    </div>
  );
};

export default Dashboard;
