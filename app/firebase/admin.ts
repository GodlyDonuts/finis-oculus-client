// app/firebase/admin.ts

import admin from 'firebase-admin';

// Check if the app is already initialized
if (!admin.apps.length) {
  try {
    // Initialize the app with service account credentials
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

// Export the admin-safe firestore instance
const db = admin.firestore();
export { db };