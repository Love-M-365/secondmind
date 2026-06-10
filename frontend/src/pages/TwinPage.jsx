import React, { useState, useEffect, useRef } from 'react';
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
  Check,
  Brain,
  Cpu,
  Award
} from 'lucide-react';

// Live interactive Canvas-based Cognitive Twin Core Projection (Optimized Larger Sizing)
const TwinCanvas = ({ skills = [], interests = [], goals = [] }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Handle high DPI screens
    const resizeCanvas = () => {
      const rect = containerRef.current ? containerRef.current.getBoundingClientRect() : { width: 500, height: 460 };
      const width = rect.width || 500;
      const height = 460;
      
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Prepare satellite nodes
    const items = [];
    
    // Ring 1: Skills (violet accent)
    skills.forEach((skill, idx) => {
      items.push({
        name: skill,
        type: 'Skill',
        color: '#8b5cf6',
        glow: 'rgba(139, 92, 246, 0.35)',
        ring: 90,
        speed: 0.003 * (idx % 2 === 0 ? 1 : -1),
        angle: (idx * (2 * Math.PI)) / (skills.length || 1),
        radius: 7
      });
    });

    // Ring 2: Interests (blue accent)
    interests.forEach((interest, idx) => {
      items.push({
        name: interest,
        type: 'Interest',
        color: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.35)',
        ring: 145,
        speed: 0.0018 * (idx % 2 === 0 ? 1 : -1),
        angle: (idx * (2 * Math.PI)) / (interests.length || 1) + 0.5,
        radius: 8
      });
    });

    // Ring 3: Goals (emerald accent)
    goals.forEach((goal, idx) => {
      items.push({
        name: goal,
        type: 'Goal',
        color: '#10b981',
        glow: 'rgba(16, 185, 129, 0.35)',
        ring: 200,
        speed: 0.001 * (idx % 2 === 0 ? 1 : -1),
        angle: (idx * (2 * Math.PI)) / (goals.length || 1) + 1.0,
        radius: 9
      });
    });

    let mouseX = 0;
    let mouseY = 0;
    let isMouseIn = false;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseIn = true;
    };

    const handleMouseLeave = () => {
      isMouseIn = false;
      setHoveredLabel(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Particle flow ticks
    let tick = 0;

    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw background glow rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      
      const ringRadii = [90, 145, 200];
      ringRadii.forEach(r => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.stroke();
      });

      tick += 1;
      let hoveredItem = null;

      // Draw connecting lines & dots
      items.forEach(item => {
        item.angle += item.speed;
        const x = cx + item.ring * Math.cos(item.angle);
        const y = cy + item.ring * Math.sin(item.angle);

        // Draw line from center
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw flow particle along the line
        const flowPercent = ((tick * Math.abs(item.speed) * 8) % 100) / 100;
        const px = cx + (x - cx) * flowPercent;
        const py = cy + (y - cy) * flowPercent;
        
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, 2 * Math.PI);
        ctx.fillStyle = item.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = item.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw satellite nodes
      items.forEach(item => {
        const x = cx + item.ring * Math.cos(item.angle);
        const y = cy + item.ring * Math.sin(item.angle);

        // Check hover
        let isHovered = false;
        if (isMouseIn) {
          const dx = mouseX - x;
          const dy = mouseY - y;
          if (dx * dx + dy * dy < (item.radius + 10) * (item.radius + 10)) {
            isHovered = true;
            hoveredItem = item;
          }
        }

        // Glow outer ring
        ctx.beginPath();
        ctx.arc(x, y, item.radius + (isHovered ? 9 : 5), 0, 2 * Math.PI);
        ctx.fillStyle = item.glow;
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(x, y, item.radius - 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        
        // Ring border
        ctx.beginPath();
        ctx.arc(x, y, item.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      // Draw central identity core
      const corePulse = 24 + Math.sin(tick * 0.04) * 4;
      const coreGlow = ctx.createRadialGradient(cx, cy, 4, cx, cy, corePulse);
      coreGlow.addColorStop(0, 'rgba(139, 92, 246, 0.45)');
      coreGlow.addColorStop(1, 'rgba(139, 92, 246, 0)');
      
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse, 0, 2 * Math.PI);
      ctx.fillStyle = coreGlow;
      ctx.fill();

      // Inner Core Circle
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, 2 * Math.PI);
      ctx.fillStyle = '#8b5cf6';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      // Core details label
      ctx.font = 'bold 10px Space Grotesk';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('YOU', cx, cy + 3.5);

      // Tooltip/Label triggering
      if (hoveredItem) {
        setHoveredLabel({
          name: hoveredItem.name,
          type: hoveredItem.type,
          x: cx + hoveredItem.ring * Math.cos(hoveredItem.angle),
          y: cy + hoveredItem.ring * Math.sin(hoveredItem.angle) - 15
        });
      } else if (isMouseIn && Math.hypot(mouseX - cx, mouseY - cy) < 20) {
        setHoveredLabel({
          name: "Cognitive Identity Core",
          type: "Identity Core",
          x: cx,
          y: cy - 25
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [skills, interests, goals]);

  return (
    <div ref={containerRef} className="w-100 position-relative" style={{ minHeight: '460px' }}>
      <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />
      {hoveredLabel && (
        <div 
          className="position-absolute p-2 text-center"
          style={{
            left: `${hoveredLabel.x}px`,
            top: `${hoveredLabel.y}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 10,
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(11, 9, 19, 0.95)',
            backdropFilter: 'blur(8px)',
            minWidth: '130px'
          }}
        >
          <div className="text-muted fw-semibold mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {hoveredLabel.type}
          </div>
          <div className="text-white small fw-bold">{hoveredLabel.name}</div>
        </div>
      )}
    </div>
  );
};

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

  // Helper to draw a beautiful skill SVG gauge meter (Optimized Larger Sizing)
  const SkillGauge = ({ skill, score = 85 }) => {
    const radius = 34; // increased from 28
    const strokeWidth = 6; // increased from 5
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="d-flex align-items-center gap-3 p-3 rounded bg-white-5 border border-glass h-100 transition-all hover-glow-violet">
        <svg width="78" height="78" className="gauge-svg flex-shrink-0">
          <defs>
            <linearGradient id={`gradient-${skill.replace(/\s+/g, '-')}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--accent-secondary)" />
            </linearGradient>
          </defs>
          <circle cx="39" cy="39" r={radius} strokeWidth={strokeWidth} className="gauge-circle-bg" />
          <circle 
            cx="39" 
            cy="39" 
            r={radius} 
            strokeWidth={strokeWidth} 
            className="gauge-circle" 
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke={`url(#gradient-${skill.replace(/\s+/g, '-')})`}
          />
          <text x="39" y="43" fill="white" fontSize="13" fontWeight="700" textAnchor="middle" transform="rotate(90 39 39)">
            {score}%
          </text>
        </svg>
        <div className="min-width-0">
          <div className="text-white fw-semibold text-truncate small">{skill}</div>
          <div className="text-muted text-xs mt-0.5" style={{ fontSize: '0.75rem' }}>Identified cognitive asset</div>
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
              <button onClick={handleSave} className="btn btn-primary-glow btn-sm d-flex align-items-center gap-2">
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
          
          {/* Left Column: Visual Projection & Cognitive Diagnostics */}
          <div className="col-lg-5">
            <div className="d-flex flex-column gap-4">
              
              {/* Cognitive Schema Projection (Canvas Card) */}
              <div className="glass-card overflow-hidden">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="text-white mb-0 d-flex align-items-center gap-2">
                    <Cpu size={18} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                    <span>Schema Projection</span>
                  </h5>
                  <span className="badge badge-glass border-0 text-uppercase tracking-wider px-2 py-1" style={{ fontSize: '0.6rem', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                    Identity Live Sync
                  </span>
                </div>
                <p className="text-muted small mb-0">Hover nodes to view mapped cognitive relations</p>
                <div className="d-flex align-items-center justify-content-center">
                  <TwinCanvas skills={skills} interests={interests} goals={goals} />
                </div>
              </div>

              {/* Cognitive Diagnostics (Strengths / Weaknesses) */}
              <div className="glass-card">
                <h5 className="text-white mb-4 d-flex align-items-center gap-2">
                  <ShieldAlert size={18} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Cognitive Diagnostics</span>
                </h5>

                {/* Strengths */}
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="text-success small fw-bold text-uppercase tracking-wider">Validated Strengths</div>
                    <span className="text-muted text-xxs">{strengths.length} Mapped</span>
                  </div>
                  
                  {isEditing ? (
                    <div>
                      <div className="d-flex flex-column gap-2 mb-3">
                        {strengths.map((str, idx) => (
                          <span key={idx} className="badge badge-glass badge-strength d-flex align-items-center justify-content-between gap-3 text-start" style={{ whiteSpace: 'normal', borderRadius: '10px' }}>
                            <span style={{ fontSize: '0.8rem' }}>{str}</span>
                            <Trash2 size={13} className="cursor-pointer text-danger-light flex-shrink-0" onClick={() => handleRemoveItem('strength', idx)} />
                          </span>
                        ))}
                      </div>
                      <div className="input-group mb-3">
                        <input 
                          type="text" 
                          value={newStrength} 
                          onChange={(e) => setNewStrength(e.target.value)} 
                          className="form-control glass-input py-1 text-sm" 
                          placeholder="Add validated strength..." 
                        />
                        <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('strength')}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2.5">
                      {strengths.length === 0 ? (
                        <span className="text-muted small">No strengths analyzed yet.</span>
                      ) : (
                        strengths.map((str, idx) => (
                          <div key={idx} className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3 transition-all hover-scale-sm hover-glow-emerald" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                            <div className="p-1 rounded-circle bg-success-glow mt-1 flex-shrink-0" style={{ width: 10, height: 10, background: 'rgba(16,185,129,0.35)', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }}></div>
                            <span className="text-secondary small text-start lh-sm" style={{ fontSize: '0.85rem' }}>{str}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Weaknesses */}
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="text-danger-light small fw-bold text-uppercase tracking-wider">Areas of Development</div>
                    <span className="text-muted text-xxs">{weaknesses.length} Mapped</span>
                  </div>
                  
                  {isEditing ? (
                    <div>
                      <div className="d-flex flex-column gap-2 mb-3">
                        {weaknesses.map((wk, idx) => (
                          <span key={idx} className="badge badge-glass badge-weakness d-flex align-items-center justify-content-between gap-3 text-start" style={{ whiteSpace: 'normal', borderRadius: '10px' }}>
                            <span style={{ fontSize: '0.8rem' }}>{wk}</span>
                            <Trash2 size={13} className="cursor-pointer text-danger-light flex-shrink-0" onClick={() => handleRemoveItem('weakness', idx)} />
                          </span>
                        ))}
                      </div>
                      <div className="input-group">
                        <input 
                          type="text" 
                          value={newWeakness} 
                          onChange={(e) => setNewWeakness(e.target.value)} 
                          className="form-control glass-input py-1 text-sm" 
                          placeholder="Add development area..." 
                        />
                        <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('weakness')}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2.5">
                      {weaknesses.length === 0 ? (
                        <span className="text-muted small">No development areas analyzed yet.</span>
                      ) : (
                        weaknesses.map((wk, idx) => (
                          <div key={idx} className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3 transition-all hover-scale-sm hover-glow-danger" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                            <div className="p-1 rounded-circle bg-danger-glow mt-1 flex-shrink-0" style={{ width: 10, height: 10, background: 'rgba(239,68,68,0.35)', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}></div>
                            <span className="text-secondary small text-start lh-sm" style={{ fontSize: '0.85rem' }}>{wk}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: Skills, Interests & Active Roadmaps */}
          <div className="col-lg-7">
            <div className="d-flex flex-column gap-4">
              
              {/* Skills Card */}
              <div className="glass-card">
                <h5 className="text-white mb-4 d-flex align-items-center gap-2">
                  <Zap size={18} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Skills & Proficiencies</span>
                </h5>
                
                {isEditing ? (
                  <div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="badge badge-glass d-flex align-items-center gap-2">
                          {skill}
                          <Trash2 size={12} className="cursor-pointer text-danger-light" onClick={() => handleRemoveItem('skill', idx)} />
                        </span>
                      ))}
                    </div>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)} 
                        className="form-control glass-input" 
                        placeholder="Add new skill (e.g. Python, UX Design)" 
                      />
                      <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('skill')}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-sm-2 g-3">
                    {skills.length === 0 ? (
                      <div className="col-12 py-3 text-center text-muted small">
                        No skills parsed. Manual Override to add your primary toolsets.
                      </div>
                    ) : (
                      skills.map((skill, idx) => {
                        // Alternate proficiencies just for demonstration visual variety
                        const scores = [85, 90, 75, 80, 95];
                        const score = scores[idx % scores.length];
                        return (
                          <div key={idx} className="col">
                            <SkillGauge skill={skill} score={score} />
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Interests Card */}
              <div className="glass-card">
                <h5 className="text-white mb-4 d-flex align-items-center gap-2">
                  <Compass size={18} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Research Interests & Knowledge Domains</span>
                </h5>

                {isEditing ? (
                  <div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {interests.map((interest, idx) => (
                        <span key={idx} className="badge badge-glass badge-interest d-flex align-items-center gap-2">
                          {interest}
                          <Trash2 size={12} className="cursor-pointer text-danger-light" onClick={() => handleRemoveItem('interest', idx)} />
                        </span>
                      ))}
                    </div>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={newInterest} 
                        onChange={(e) => setNewInterest(e.target.value)} 
                        className="form-control glass-input" 
                        placeholder="Add interest domain..." 
                      />
                      <button type="button" className="btn btn-primary-glow border-0" onClick={() => handleAddItem('interest')}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {interests.length === 0 ? (
                      <span className="text-muted small">No interest domains parsed. Add topics that you study or research.</span>
                    ) : (
                      interests.map((interest, idx) => (
                        <span key={idx} className="badge badge-glass badge-interest fs-6 py-2.5 px-3.5 transition-all hover-scale">
                          {interest}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Active Roadmaps & Goals */}
              <div className="glass-card">
                <h5 className="text-white mb-4 d-flex align-items-center gap-2">
                  <Target size={18} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
                  <span>Active Roadmaps & Target Goals</span>
                </h5>

                {isEditing ? (
                  <div>
                    <div className="d-flex flex-column gap-2 mb-3">
                      {goals.map((goal, idx) => (
                        <div key={idx} className="p-2 bg-white-5 rounded d-flex justify-content-between align-items-center small text-secondary">
                          <span className="text-truncate" style={{ maxWidth: '80%' }}>{goal}</span>
                          <Trash2 size={12} className="cursor-pointer text-danger-light" onClick={() => handleRemoveItem('goal', idx)} />
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
                    {goals.length === 0 ? (
                      <span className="text-muted small">No target goals established. Setup a future milestone to run timeline simulations.</span>
                    ) : (
                      goals.map((goal, idx) => (
                        <div key={idx} className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3 transition-all hover-glow-emerald">
                          <div className="p-1 rounded-circle bg-success-glow mt-1 flex-shrink-0" style={{ width: 12, height: 12, background: 'rgba(16,185,129,0.3)', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}></div>
                          <span className="text-secondary small fw-medium">{goal}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}
      
      <style>{`
        .bg-white-5 {
          background: rgba(255, 255, 255, 0.04);
        }
        .text-danger-light {
          color: #f87171;
        }
        .text-xxs {
          font-size: 0.68rem;
        }
        .max-w-lg {
          max-width: 500px;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .hover-glow-violet:hover {
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.25) !important;
        }
        .hover-glow-emerald:hover {
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.25) !important;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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