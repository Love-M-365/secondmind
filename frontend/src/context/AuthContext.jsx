import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

// Firebase Configuration from Vite Env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let auth = null;
let firebaseInitialized = false;

if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    firebaseInitialized = true;
    console.log('Firebase Client SDK initialized.');
  } catch (error) {
    console.error('Firebase Client SDK initialization error. Mock Auth active.', error);
  }
} else {
  console.log('Firebase client config missing. Running in Mock Auth Mode.');
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(!firebaseInitialized);

  useEffect(() => {
    if (!firebaseInitialized || !auth) {
      // Mock Auth Mode check on mount
      const storedUser = localStorage.getItem('mockUser');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
      setLoading(false);
      return;
    }

    // Standard Firebase Auth State listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          
          const profile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            photoUrl: firebaseUser.photoURL || ''
          };
          
          setUser(profile);
          setToken(idToken);
          localStorage.setItem('token', idToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error syncing auth state:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!firebaseInitialized || !auth) {
      throw new Error('Firebase Auth is not configured. Use the Mock Login instead.');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    localStorage.setItem('token', idToken);
    return result.user;
  };

  const loginWithMock = (email) => {
    const mockEmail = email.trim() || 'demo@secondmind.ai';
    const mockToken = `mock_token_for_${mockEmail}`;
    
    const mockProfile = {
      uid: `mock_uid_${mockEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: mockEmail.split('@')[0].toUpperCase(),
      email: mockEmail,
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };

    setUser(mockProfile);
    setToken(mockToken);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('mockUser', JSON.stringify(mockProfile));
    setIsMockMode(true);
  };

  const logout = async () => {
    if (firebaseInitialized && auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('mockUser');
  };

  const value = {
    user,
    token,
    loading,
    isMockMode,
    loginWithGoogle,
    loginWithMock,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
