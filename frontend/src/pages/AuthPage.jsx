import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Sparkles, LogIn, ChevronRight, Terminal } from 'lucide-react';

const AuthPage = () => {
  const { loginWithGoogle, loginWithMock, isMockMode } = useAuth();
  const [mockEmail, setMockEmail] = useState('demo@secondmind.ai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Firebase login failed. Please try Mock Login below.');
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (e) => {
    e.preventDefault();
    if (!mockEmail.includes('@') || !mockEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      loginWithMock(mockEmail);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="row w-100 justify-content-center align-items-center">
        {/* Left Side: Branding / Copy */}
        <div className="col-lg-6 d-none d-lg-block pe-5 text-start">
          <div className="d-flex align-items-center gap-2 text-white fw-bold fs-3 mb-4">
            <div className="p-2 rounded bg-gradient" style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
            }}>
              <Brain size={28} className="text-white" />
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SecondMind</span>
          </div>
          <h1 className="display-4 fw-extrabold text-white mb-3" style={{ lineHeight: '1.15' }}>
            An AI that remembers, <br />
            <span style={{
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>understands, and evolves</span> <br />
            alongside you.
          </h1>
          <p className="text-secondary fs-5 mb-4 max-w-md">
            SecondMind is a production-ready personal memory layer. It ingests your documents, learns your skills, tracks your goals, and acts as a persistent digital twin.
          </p>

          <div className="d-flex flex-column gap-3 mt-4">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 rounded bg-white-5 text-secondary">
                <Sparkles size={16} />
              </div>
              <span className="text-secondary small">Continuous knowledge ingestion and text extraction</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 rounded bg-white-5 text-secondary">
                <Terminal size={16} />
              </div>
              <span className="text-secondary small">Fully simulated agent network for career and plan optimization</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="col-md-8 col-lg-5 col-xl-4">
          <div className="glass-card text-center relative border-glass" style={{ overflow: 'hidden' }}>
            <div className="p-2 rounded bg-gradient d-inline-flex mb-3 d-lg-none" style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
            }}>
              <Brain size={24} className="text-white" />
            </div>
            
            <h3 className="text-white mb-1 fw-bold">Welcome to SecondMind</h3>
            <p className="text-secondary small mb-4">Initialize your cognitive digital twin</p>

            {error && (
              <div className="alert alert-danger border-0 small text-start py-2 px-3 mb-3 bg-danger-glow" style={{ color: '#fca5a5' }}>
                {error}
              </div>
            )}

            {/* Standard Google Login (Active if Firebase is initialized) */}
            {!isMockMode ? (
              <button 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="btn btn-primary-glow w-100 d-flex align-items-center justify-content-center gap-2 mb-4 py-3"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Sign In with Google</span>
                  </>
                )}
              </button>
            ) : (
              <div className="alert alert-warning border-0 small text-start py-2 px-3 mb-4 bg-warning-glow text-warning-light">
                Firebase is not configured. Redirected to developer offline sandbox.
              </div>
            )}

            {/* Divider */}
            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1 border-secondary" style={{ opacity: 0.15 }} />
              <span className="px-3 text-muted small text-uppercase">Developer Sandbox</span>
              <hr className="flex-grow-1 border-secondary" style={{ opacity: 0.15 }} />
            </div>

            {/* Mock Login Bypass */}
            <form onSubmit={handleMockLogin} className="text-start">
              <div className="mb-3">
                <label className="form-label text-secondary small fw-medium">Simulated Account Email</label>
                <input 
                  type="email" 
                  value={mockEmail}
                  onChange={(e) => setMockEmail(e.target.value)}
                  className="form-control glass-input w-100" 
                  placeholder="demo@secondmind.ai" 
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-secondary-glass w-100 d-flex align-items-center justify-content-center gap-2 py-3"
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <>
                    <span>Launch Sandbox Environment</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <style>{`
        .bg-warning-glow {
          background: rgba(245, 158, 11, 0.08);
        }
        .text-warning-light {
          color: #fde047;
        }
        .max-w-md {
          max-width: 450px;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
