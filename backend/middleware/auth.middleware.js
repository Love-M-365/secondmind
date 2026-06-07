import { getAdmin, isFirebaseEnabled } from '../config/firebase.js';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      let decodedToken;
      
      // Check if we verify with Firebase or Mock
      if (isFirebaseEnabled() && !token.startsWith('mock_token_for_')) {
        const admin = getAdmin();
        decodedToken = await admin.auth().verifyIdToken(token);
      } else {
        // Mock Auth Mode Bypass
        // Token looks like: mock_token_for_john@example.com
        const email = token.startsWith('mock_token_for_')
          ? token.split('mock_token_for_')[1]
          : 'demo@secondmind.ai';
          
        decodedToken = {
          uid: `mock_uid_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
          name: email.split('@')[0].toUpperCase(),
          email: email,
          picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        };
      }

      // Sync/Get user in local database
      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!user) {
        try {
          user = await User.create({
            firebaseUid: decodedToken.uid,
            name: decodedToken.name || decodedToken.email.split('@')[0],
            email: decodedToken.email,
            photoUrl: decodedToken.picture || ''
          });
          console.log(`Synced new user created in MongoDB: ${user.email}`);
        } catch (createError) {
          if (createError.code === 11000) {
            // If a concurrent request created the user in the meantime, retrieve that user record
            user = await User.findOne({ firebaseUid: decodedToken.uid });
            if (!user) throw createError;
          } else {
            throw createError;
          }
        }
      }

      // Attach user object to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
