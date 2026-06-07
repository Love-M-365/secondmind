import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import TwinPage from './pages/TwinPage';
import MemoryExplorer from './pages/MemoryExplorer';
import FutureSimulator from './pages/FutureSimulator';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="mt-3 text-secondary">Synchronizing Mind State...</h5>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar />
      <div className="flex-grow-1">{children}</div>
    </>
  );
};

// Auth Route wrapper (redirects to home if already logged in)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-height-viewport" style={{ minHeight: '100vh' }}>
          <Routes>
            {/* Auth Route */}
            <Route 
              path="/login" 
              element={
                <AuthRoute>
                  <AuthPage />
                </AuthRoute>
              } 
            />

            {/* Application Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/twin" 
              element={
                <ProtectedRoute>
                  <TwinPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/memories" 
              element={
                <ProtectedRoute>
                  <MemoryExplorer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/simulator" 
              element={
                <ProtectedRoute>
                  <FutureSimulator />
                </ProtectedRoute>
              } 
            />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
