import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, User, Database, Sparkles, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg sticky-top border-bottom" style={{
      background: 'rgba(8, 7, 13, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottomColor: 'var(--border-glass) !important',
      zIndex: 1000
    }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold fs-4" to="/">
          <div className="p-2 rounded bg-gradient d-flex align-items-center justify-content-center" style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
          }}>
            <Brain size={20} className="text-white" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>SecondMind</span>
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          style={{ filter: 'invert(1)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-1 mt-2 mt-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 py-2 rounded d-flex align-items-center gap-2 transition-all ${
                  isActive('/') ? 'text-white bg-white-5' : 'text-secondary'
                }`} 
                to="/"
                style={{ background: isActive('/') ? 'rgba(255,255,255,0.05)' : 'transparent' }}
              >
                <Database size={16} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 py-2 rounded d-flex align-items-center gap-2 transition-all ${
                  isActive('/twin') ? 'text-white bg-white-5' : 'text-secondary'
                }`} 
                to="/twin"
                style={{ background: isActive('/twin') ? 'rgba(255,255,255,0.05)' : 'transparent' }}
              >
                <User size={16} />
                <span>Digital Twin</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 py-2 rounded d-flex align-items-center gap-2 transition-all ${
                  isActive('/memories') ? 'text-white bg-white-5' : 'text-secondary'
                }`} 
                to="/memories"
                style={{ background: isActive('/memories') ? 'rgba(255,255,255,0.05)' : 'transparent' }}
              >
                <Brain size={16} />
                <span>Memory Explorer</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 py-2 rounded d-flex align-items-center gap-2 transition-all ${
                  isActive('/simulator') ? 'text-white bg-white-5' : 'text-secondary'
                }`} 
                to="/simulator"
                style={{ background: isActive('/simulator') ? 'rgba(255,255,255,0.05)' : 'transparent' }}
              >
                <Sparkles size={16} />
                <span>Future Simulator</span>
              </Link>
            </li>
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 border-top pt-3 pt-lg-0 border-lg-0">
              <div className="d-flex align-items-center gap-2">
                {user.photoUrl ? (
                  <img 
                    src={user.photoUrl} 
                    alt={user.name} 
                    className="rounded-circle border border-2 border-secondary"
                    width="36" 
                    height="36"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white font-weight-bold" style={{ width: 36, height: 36 }}>
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="d-none d-xl-block">
                  <div className="text-white fw-semibold lh-sm" style={{ fontSize: '0.9rem' }}>{user.name}</div>
                  <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-secondary-glass p-2 d-flex align-items-center justify-content-center border-0 bg-transparent text-secondary hover-text-danger" 
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Styles for Navbar Hover and transitions */}
      <style>{`
        .nav-link:hover {
          color: var(--text-primary) !important;
          background: rgba(255, 255, 255, 0.03);
        }
        .hover-text-danger:hover {
          color: #ef4444 !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
