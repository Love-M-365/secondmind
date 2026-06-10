import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  User, 
  Sparkles, 
  Target, 
  ShieldAlert, 
  Compass, 
  Zap, 
  Plus, 
  Trash2, 
  RefreshCw,
  Edit2,
  Check
} from 'lucide-react';

const TwinPage = () => {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit State
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);

  // Inputs for adding items
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');

  useEffect(() => {
    fetchTwin();
  }, []);

  const fetchTwin = async () => {
    setLoading(true);
    try {
      const response = await api.get('/twin');
      if (response.data.success && response.data.twin) {
        const data = response.data.twin;
        setTwin(data);
        setSkills(data.skills || []);
        setInterests(data.interests || []);
        setGoals(data.goals || []);
        setStrengths(data.strengths || []);
        setWeaknesses(data.weaknesses || []);
      }
    } catch (error) {
      console.error('Error fetching twin:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerRebuild = async () => {
    setRebuilding(true);
    try {
      const response = await api.post('/twin/rebuild');
      if (response.data.success && response.data.twin) {
        const data = response.data.twin;
        setTwin(data);
        setSkills(data.skills || []);
        setInterests(data.interests || []);
        setGoals(data.goals || []);
        setStrengths(data.strengths || []);
        setWeaknesses(data.weaknesses || []);
      }
    } catch (error) {
      console.error('Error rebuilding twin:', error);
    } finally {
      setRebuilding(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.post('/twin/update', {
        skills,
        interests,
        goals,
        strengths,
        weaknesses
      });

      if (response.data.success) {
        setTwin(response.data.twin);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating twin details:', error);
    }
  };

  const handleAddItem = (type) => {
    if (type === 'skill' && newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    } else if (type === 'interest' && newInterest.trim()) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    } else if (type === 'goal' && newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    } else if (type === 'strength' && newStrength.trim()) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength('');
    } else if (type === 'weakness' && newWeakness.trim()) {
      setWeaknesses([...weaknesses, newWeakness.trim()]);
      setNewWeakness('');
    }
  };

  const handleRemoveItem = (type, index) => {
    if (type === 'skill') setSkills(skills.filter((_, i) => i !== index));
    if (type === 'interest') setInterests(interests.filter((_, i) => i !== index));
    if (type === 'goal') setGoals(goals.filter((_, i) => i !== index));
    if (type === 'strength') setStrengths(strengths.filter((_, i) => i !== index));
    if (type === 'weakness') setWeaknesses(weaknesses.filter((_, i) => i !== index));
  };

  // Helper to draw a beautiful skill SVG gauge meter
  const SkillGauge = ({ skill, score = 85 }) => {
    const radius = 30;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="d-flex align-items-center gap-3 p-3 rounded bg-white-5 border border-glass">
        <svg width="70" height="70" className="gauge-svg flex-shrink-0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
          <circle cx="35" cy="35" r={radius} strokeWidth={strokeWidth} className="gauge-circle-bg" />
          <circle 
            cx="35" 
            cy="35" 
            r={radius} 
            strokeWidth={strokeWidth} 
            className="gauge-circle" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <text x="35" y="38" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(90 35 35)">
            {score}%
          </text>
        </svg>
        <div className="min-width-0">
          <div className="text-white fw-semibold text-truncate small">{skill}</div>
          <div className="text-muted text-xs" style={{ fontSize: '0.75rem' }}>Identified cognitive asset</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-secondary">
        <LoaderSpinner />
        <h4 className="mt-3 text-white">Loading Digital Twin canvas...</h4>
      </div>
    );
  }

  const emptyTwin = !twin || (skills.length === 0 && goals.length === 0 && interests.length === 0);

  return (
    <div className="container py-5">
      {/* Title Header */}
      <div className="row mb-5 align-items-center">
        <div className="col-md-8">
          <span className="text-secondary small text-uppercase tracking-wider fw-semibold">Grounded Identity Layer</span>
          <h1 className="text-white fw-bold mb-0 mt-1">Cognitive Digital Twin</h1>
          <p className="text-secondary mb-0">A structured schema reflecting your skills, professional goals, and cognitive traits.</p>
        </div>
        <div className="col-md-4 d-flex justify-content-md-end gap-2 mt-3 mt-md-0">
          {isEditing ? (
            <>
              <button onClick={() => { setIsEditing(false); fetchTwin(); }} className="btn btn-secondary-glass btn-sm">
                Cancel
              </button>
              <button onClick={handleSave} className="btn btn-primary-glow btn-sm d-flex align-items-center gap-1">
                <Check size={14} />
                <span>Save Twin</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={triggerRebuild} disabled={rebuilding} className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-2">
                <RefreshCw size={14} className={rebuilding ? 'spin' : ''} />
                <span>AI Sync & Rebuild</span>
              </button>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary-glow btn-sm d-flex align-items-center gap-2">
                <Edit2 size={14} />
                <span>Manual Override</span>
              </button>
            </>
          )}
        </div>
      </div>

      {emptyTwin && !isEditing ? (
        <div className="glass-card text-center p-5 max-w-lg mx-auto">
          <User size={48} className="text-muted mx-auto mb-3 opacity-50" />
          <h4 className="text-white mb-2">Digital Twin Empty</h4>
          <p className="text-secondary small mb-4">
            We haven't parsed enough signals to assemble your identity layer yet. Upload documents or reflections in the dashboard to kickstart calculations, or override manually.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button onClick={() => setIsEditing(true)} className="btn btn-primary-glow btn-sm">
              Override Manually
            </button>
            <button onClick={triggerRebuild} disabled={rebuilding} className="btn btn-secondary-glass btn-sm d-flex align-items-center gap-2">
              <RefreshCw size={14} className={rebuilding ? 'spin' : ''} />
              <span>AI Search Database</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          
          {/* Main Visual: Skills Gauges & Interests */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-4">
              
              {/* Skills Card */}
              <div className="glass-card">
                <h4 className="text-white mb-4 d-flex align-items-center gap-2">
                  <Zap size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Skills Inventory</span>
                </h4>
                
                {isEditing ? (
                  <div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="badge badge-glass d-flex align-items-center gap-2">
                          {skill}
                          <Trash2 size={12} className="cursor-pointer text-danger" onClick={() => handleRemoveItem('skill', idx)} />
                        </span>
                      ))}
                    </div>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)} 
                        className="form-control glass-input" 
                        placeholder="Add new skill (e.g. Python)" 
                      />
                      <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('skill')}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-sm-2 g-3">
                    {skills.map((skill, idx) => {
                      // Alternate proficiencies just for demonstration visual variety
                      const scores = [85, 90, 75, 80, 95];
                      const score = scores[idx % scores.length];
                      return (
                        <div key={idx} className="col">
                          <SkillGauge skill={skill} score={score} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Interests Card */}
              <div className="glass-card">
                <h4 className="text-white mb-4 d-flex align-items-center gap-2">
                  <Compass size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Core Interests & Research Topics</span>
                </h4>

                {isEditing ? (
                  <div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {interests.map((interest, idx) => (
                        <span key={idx} className="badge badge-glass badge-interest d-flex align-items-center gap-2">
                          {interest}
                          <Trash2 size={12} className="cursor-pointer text-danger" onClick={() => handleRemoveItem('interest', idx)} />
                        </span>
                      ))}
                    </div>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={newInterest} 
                        onChange={(e) => setNewInterest(e.target.value)} 
                        className="form-control glass-input" 
                        placeholder="Add interest area..." 
                      />
                      <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('interest')}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {interests.map((interest, idx) => (
                      <span key={idx} className="badge badge-glass badge-interest fs-6 py-2 px-3">{interest}</span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Goals, Strengths & Weaknesses */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              
              {/* Goals Card */}
              <div className="glass-card">
                <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                  <Target size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Active Roadmaps & Goals</span>
                </h4>

                {isEditing ? (
                  <div>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {goals.map((goal, idx) => (
                        <div key={idx} className="p-2 bg-white-5 rounded d-flex justify-content-between align-items-center small text-secondary">
                          <span className="text-truncate" style={{ maxWidth: '80%' }}>{goal}</span>
                          <Trash2 size={12} className="cursor-pointer text-danger" onClick={() => handleRemoveItem('goal', idx)} />
                        </div>
                      ))}
                    </div>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={newGoal} 
                        onChange={(e) => setNewGoal(e.target.value)} 
                        className="form-control glass-input py-2" 
                        placeholder="Define core milestone..." 
                      />
                      <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('goal')}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {goals.map((goal, idx) => (
                      <div key={idx} className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-2">
                        <div className="p-1 rounded-circle bg-success-glow mt-1 flex-shrink-0" style={{ width: 14, height: 14, background: 'rgba(16,185,129,0.2)' }}></div>
                        <span className="text-secondary small">{goal}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Strengths & Weaknesses */}
              <div className="glass-card">
                <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                  <ShieldAlert size={20} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Cognitive Diagnostics</span>
                </h4>

                {/* Strengths */}
                <div className="mb-4">
                  <div className="text-success small fw-bold mb-2">Strengths</div>
                  {isEditing ? (
                    <div>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {strengths.map((str, idx) => (
                          <span key={idx} className="badge badge-glass badge-strength d-flex align-items-center gap-2">
                            {str}
                            <Trash2 size={12} className="cursor-pointer text-danger" onClick={() => handleRemoveItem('strength', idx)} />
                          </span>
                        ))}
                      </div>
                      <div className="input-group mb-3">
                        <input 
                          type="text" 
                          value={newStrength} 
                          onChange={(e) => setNewStrength(e.target.value)} 
                          className="form-control glass-input py-1" 
                          placeholder="Add strength..." 
                        />
                        <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('strength')}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {strengths.map((str, idx) => (
                        <span key={idx} className="badge badge-glass badge-strength">{str}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Weaknesses */}
                <div>
                  <div className="text-danger-light small fw-bold mb-2">Areas of Development</div>
                  {isEditing ? (
                    <div>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {weaknesses.map((wk, idx) => (
                          <span key={idx} className="badge badge-glass badge-weakness d-flex align-items-center gap-2">
                            {wk}
                            <Trash2 size={12} className="cursor-pointer text-danger" onClick={() => handleRemoveItem('weakness', idx)} />
                          </span>
                        ))}
                      </div>
                      <div className="input-group">
                        <input 
                          type="text" 
                          value={newWeakness} 
                          onChange={(e) => setNewWeakness(e.target.value)} 
                          className="form-control glass-input py-1" 
                          placeholder="Add developmental area..." 
                        />
                        <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('weakness')}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {weaknesses.map((wk, idx) => (
                        <span key={idx} className="badge badge-glass badge-weakness">{wk}</span>
                      ))}
                    </div>
                  )}
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
        .text-danger-light {
          color: #f87171;
        }
        .max-w-lg {
          max-width: 500px;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

const LoaderSpinner = () => (
  <div className="spinner-border text-violet" role="status" style={{ color: 'var(--accent-primary)', width: '3rem', height: '3rem' }}>
    <span className="visually-hidden">Loading...</span>
  </div>
);

export default TwinPage;