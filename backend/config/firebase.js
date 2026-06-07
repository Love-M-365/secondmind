import admin from 'firebase-admin';

let firebaseEnabled = false;

// Check if credentials are provided in env
if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines if passed in raw string format
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin SDK Initialized Successfully.');
    firebaseEnabled = true;
  } catch (error) {
    console.error('Firebase initialization error. Mock authentication mode will be active.', error);
  }
} else {
  console.log('Firebase credentials not complete in environment variables.');
  console.log('>>> RUNNING IN MOCK AUTHENTICATION MODE <<<');
}

export const isFirebaseEnabled = () => firebaseEnabled;
export const getAdmin = () => admin;
