import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Brain, 
  Sparkles, 
  LogIn, 
  ChevronRight, 
  Terminal, 
  Database, 
  Cpu, 
  Lock, 
  Search, 
  BookOpen, 
  ArrowRight,
  Shield,
  Layers,
  ArrowUpRight
} from 'lucide-react';

import logoImg from '../assets/secondbrainlogo.png';

/* ─── Neural Net Connection Mesh Background ─── */
const InteractiveCanvasMesh = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.6,
      o: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create glowing points
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;

        // Bounce borders
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 139, 250, ${d.o})`;
        ctx.fill();
      });

      // Draw connection lines
      dots.forEach((a, i) => {
        dots.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65,
      }}
    />
  );
};

/* ─── Custom Floating Capsule Pill ─── */
const CapabilityCard = ({ icon: Icon, title, description, colorClass }) => (
  <div className="glass-card h-100 text-start d-flex flex-column gap-3 p-4 capability-card">
    <div className={`p-3 rounded-3 d-inline-flex align-self-start ${colorClass}`} style={{ background: 'rgba(255,255,255,0.03)' }}>
      <Icon size={22} />
    </div>
    <div>
      <h5 className="text-white fw-bold mb-2">{title}</h5>
      <p className="text-secondary small mb-0 lh-base">{description}</p>
    </div>
  </div>
);

/* ─── Main Component ─── */
const AuthPage = () => {
  const { loginWithGoogle, isMockMode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Firebase authentication failed. Please make sure Google credentials are correct.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-layout min-vh-100 d-flex flex-column" style={{ overflowX: 'hidden', position: 'relative' }}>
      <InteractiveCanvasMesh />

      {/* Floating neon mesh background lights */}
      <div className="neon-glow neon-glow-1"></div>
      <div className="neon-glow neon-glow-2"></div>

      {/* ─── Navigation Header ─── */}
      <header className="w-100 border-bottom border-glass py-3 sticky-top" style={{ background: 'rgba(8, 7, 13, 0.7)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 text-white fw-bold fs-5">
            <img src={logoImg} alt="SecondMind Logo" style={{ height: '32px', width: 'auto' }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SecondMind</span>
          </div>
          
          <div className="d-flex align-items-center gap-4">
            <a href="#features-section" onClick={(e) => { e.preventDefault(); scrollToFeatures(); }} className="text-secondary small text-decoration-none hover-text-white d-none d-md-inline-block transition-all">
              Features
            </a>
            <a href="#architecture-section" className="text-secondary small text-decoration-none hover-text-white d-none d-md-inline-block transition-all">
              Architecture
            </a>
            <button 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="btn btn-secondary-glass btn-sm px-3 d-flex align-items-center gap-2"
            >
              <LogIn size={14} />
              <span>Launch App</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="container py-5 mt-4 mt-lg-5 relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center text-center">
          <div className="col-lg-10">
            {/* Big Center Top Logo */}
            <div className=" animate-fade-in d-flex justify-content-center">
              <img 
                src={logoImg} 
                alt="SecondMind Logo" 
                style={{ 
                  height: '300px', 
                  width: 'auto', 
                  filter: 'drop-shadow(0 0 25px rgba(139, 92, 246, 0.45))'
                }} 
              />
            </div>

            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white-5 border border-glass mb-4 animate-fade-in">
              <Sparkles size={14} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-secondary small fw-semibold">Next-Gen Cognitive Memory Infrastructure</span>
            </div>
            
            <h1 className="display-3 fw-extrabold text-white mb-4 animate-slide-up" style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.04em', lineHeight: '1.08' }}>
              Your digital twin that <br />
              <span className="gradient-text">remembers everything.</span>
            </h1>
            
            <p className="text-secondary fs-5 mb-5 max-w-lg mx-auto animate-slide-up delay-1">
              SecondMind is a persistent, long-term memory layer that parses your documents, indexes cognitive assets, predicts career progressions, and exposes user profiles as an interactive MCP server.
            </p>

            {error && (
              <div className="alert alert-danger border-0 small text-start py-2 px-3 mb-4 bg-danger-glow mx-auto max-w-sm" style={{ color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 align-items-center animate-slide-up delay-2">
              <button 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="btn btn-primary-glow px-4 py-3 fs-6 d-flex align-items-center gap-2 shadow-lg hover-scale"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Get Started with Google</span>
                  </>
                )}
              </button>
              <button onClick={scrollToFeatures} className="btn btn-secondary-glass px-4 py-3 fs-6 d-flex align-items-center gap-2">
                <span>Explore Features</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Floating preview mockup to wow user */}
        <div className="row justify-content-center mt-5 pt-3 animate-slide-up delay-3">
          <div className="col-lg-9">
            <div className="glass-card p-2 border-glass bg-glass-deep" style={{ borderRadius: '20px' }}>
              <div className="bg-dark rounded-3 p-4 text-start" style={{ background: '#07060b !important', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom border-glass pb-3 mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span className="dot dot-red"></span>
                    <span className="dot dot-yellow"></span>
                    <span className="dot dot-green"></span>
                    <span className="text-secondary small ms-2 font-monospace">twin.json</span>
                  </div>
                  <span className="badge badge-glass border-0 bg-transparent text-secondary d-flex align-items-center gap-1">
                    <Database size={12} /> Live Sync
                  </span>
                </div>
                <div className="row g-3">
                  <div className="col-md-7">
                    <div className="text-white small fw-bold mb-2">Primary Cognitive Stack</div>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge badge-glass badge-skill py-1 px-3">React / Next.js</span>
                      <span className="badge badge-glass badge-skill py-1 px-3">Node.js / Express</span>
                      <span className="badge badge-glass badge-skill py-1 px-3">Google Generative AI</span>
                      <span className="badge badge-glass badge-skill py-1 px-3">MongoDB Vector Search</span>
                      <span className="badge badge-glass badge-skill py-1 px-3">Model Context Protocol</span>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="text-white small fw-bold mb-2">Weekly Goal focus</div>
                    <div className="d-flex flex-column gap-2 text-secondary small">
                      <div className="d-flex align-items-center gap-2">
                        <span className="indicator-dot bg-success"></span>
                        <span>Complete vector retrieval indexing pipeline.</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="indicator-dot bg-violet"></span>
                        <span>Deploy Express gateway container to Cloud Run.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Key Features Section ─── */}
      <section id="features-section" className="container py-5 my-5 border-top border-glass relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5">
          <span className="text-violet small text-uppercase tracking-wider fw-bold">Platform Capabilities</span>
          <h2 className="text-white display-5 fw-bold mt-2">Engineered for cognitive persistence.</h2>
          <p className="text-secondary max-w-sm mx-auto">Discover the building blocks that make SecondMind a comprehensive digital extension.</p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-md-6 col-lg-3">
            <CapabilityCard 
              icon={Database} 
              title="Knowledge Ingest" 
              description="Ingest resumes, books, schedules, and developer notes. Auto-summarizes texts and logs parsed records safely." 
              colorClass="text-violet"
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <CapabilityCard 
              icon={Brain} 
              title="Digital Twin" 
              description="Extracts skills, core research domains, active goals, strengths, and dev areas dynamically based on your database." 
              colorClass="text-blue"
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <CapabilityCard 
              icon={Search} 
              title="Memory Explorer" 
              description="Ask the Memory Agent questions. Retrieve grounded answers indexed directly to source document excerpts." 
              colorClass="text-emerald"
            />
          </div>
          <div className="col-md-6 col-lg-3">
            <CapabilityCard 
              icon={Sparkles} 
              title="Future Simulator" 
              description="Hypothesize learning curves or target transitions. Forecast probabilities, syllabi roadmaps, and timeline risks." 
              colorClass="text-amber"
            />
          </div>
        </div>
      </section>

      {/* ─── Coordinated Agent Architecture ─── */}
      <section id="architecture-section" className="container py-5 my-5 border-top border-glass relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center g-5">
          <div className="col-lg-6 text-start">
            <span className="text-violet small text-uppercase tracking-wider fw-bold">System Architecture</span>
            <h2 className="text-white display-5 fw-bold mt-2">Coordinated Agent Network</h2>
            <p className="text-secondary fs-5 my-4">
              SecondMind operates via a coordinated network of specialized cognitive agents powered by Google Gemini, querying a secure database sandbox.
            </p>

            <div className="d-flex flex-column gap-3 mt-4">
              <div className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3">
                <div className="p-2 rounded bg-white-5 text-secondary flex-shrink-0">
                  <Cpu size={18} />
                </div>
                <div>
                  <h6 className="text-white fw-bold mb-1">Planning Agent</h6>
                  <p className="text-secondary small mb-0">Formulates Weekly Focus lists and suggests schedules based on database updates.</p>
                </div>
              </div>
              <div className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3">
                <div className="p-2 rounded bg-white-5 text-secondary flex-shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <h6 className="text-white fw-bold mb-1">Career & Learning Agents</h6>
                  <p className="text-secondary small mb-0">Analyzes gaps in technical skillsets, plans study guides, and tracks career timelines.</p>
                </div>
              </div>
              <div className="p-3 rounded bg-white-5 border border-glass d-flex align-items-start gap-3">
                <div className="p-2 rounded bg-white-5 text-secondary flex-shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <h6 className="text-white fw-bold mb-1">Model Context Protocol (MCP)</h6>
                  <p className="text-secondary small mb-0">Exposes your database collections as tools for local IDE clients like Claude Desktop or Cursor.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="glass-card p-4">
              <h5 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <Terminal size={18} className="text-violet" />
                <span>MongoDB MCP Configuration</span>
              </h5>
              <p className="text-secondary small mb-3">
                Add this block to your local IDE client config (e.g. Cursor or Claude Desktop) to connect external agents to your memory bank:
              </p>
              <pre className="p-3 rounded text-secondary font-monospace text-xs text-start mb-0" style={{ background: '#050309', border: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem', overflowX: 'auto' }}>
{`{
  "mcpServers": {
    "secondmind-mcp": {
      "command": "node",
      "args": [
        "C:/.../backend/scripts/mcp-server.js"
      ],
      "env": {
        "MONGO_URI": "mongodb+srv://..."
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="w-100 border-top border-glass py-5 mt-auto" style={{ background: 'rgba(5, 4, 8, 0.95)' }}>
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
          <div className="d-flex align-items-center gap-2 text-white fw-bold small">
            <Brain size={16} className="text-violet" style={{ color: 'var(--accent-primary)' }} />
            <span>SecondMind AI © {new Date().getFullYear()}</span>
          </div>
          <div className="d-flex align-items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-secondary small text-decoration-none hover-text-white d-flex align-items-center gap-1">
              <span>GitHub Repository</span>
              <ArrowUpRight size={12} />
            </a>
            <span className="text-muted small">Built with React, Gemini, and MongoDB Atlas</span>
          </div>
        </div>
      </footer>

      {/* Scoped CSS styling for advanced landing page aesthetics */}
      <style>{`
        .landing-layout {
          background: radial-gradient(circle at 10% 0%, #150e26 0%, #08070d 50%, #030205 100%);
        }
        .neon-glow {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.12;
        }
        .neon-glow-1 {
          top: -200px;
          left: -100px;
          background: var(--accent-primary);
        }
        .neon-glow-2 {
          bottom: -150px;
          right: -100px;
          background: var(--accent-secondary);
        }
        .gradient-text {
          background: linear-gradient(135deg, #c084fc 20%, #6366f1 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .max-w-lg {
          max-width: 650px;
        }
        .max-w-sm {
          max-width: 480px;
        }
        .max-w-md {
          max-width: 420px;
        }
        .hover-scale {
          transition: var(--transition-smooth);
        }
        .hover-scale:hover {
          transform: translateY(-2px) scale(1.02);
        }
        .dot {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          margin-right: 4px;
        }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #eab308; }
        .dot-green { background: #22c55e; }
        .bg-glass-deep {
          background: rgba(14, 12, 24, 0.82) !important;
          box-shadow: 0 24px 60px 0 rgba(0, 0, 0, 0.6) !important;
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
        .capability-card {
          transition: var(--transition-smooth);
        }
        .capability-card:hover {
          border-color: rgba(139, 92, 246, 0.3) !important;
          transform: translateY(-5px);
        }
        .text-violet { color: #c084fc; }
        .text-blue { color: #93c5fd; }
        .text-emerald { color: #a7f3d0; }
        .text-amber { color: #fde047; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.45s; }
      `}</style>
    </div>
  );
};

export default AuthPage;