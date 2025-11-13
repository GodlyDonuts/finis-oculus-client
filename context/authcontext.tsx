// app/context/authcontext.tsx

"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
// Import the real auth instance
import { auth } from '@/app/firebase/config';
import { User, onAuthStateChanged } from 'firebase/auth';
// --- NEW ---
// Import Firestore database and functions
import { db } from '@/app/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// --- NEW ---
// This interface defines the data we expect in our 'users/{uid}' document
interface UserProfile {
  email: string;
  isPremium: boolean;
  // You can add other fields here later, like 'subscriptionEndDate'
}

// --- UPDATED ---
// Update the context type to include our new data
interface AuthContextType {
  user: User | null; // The Firebase Auth user
  userProfile: UserProfile | null; // The Firestore user data
  isPremium: boolean; // A simple boolean for convenience
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // --- NEW ---
  // Add state for our Firestore user profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  // --- END NEW ---

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This is the core Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // --- UPDATED ---
      if (user) {
        // User is logged in
        setUser(user);
        
        // --- NEW LOGIC: Fetch user data from Firestore ---
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            // Document exists, get the data
            const profile = docSnap.data() as UserProfile;
            setUserProfile(profile);
            // Set the premium status. Default to 'false' if field is missing.
            setIsPremium(profile.isPremium || false);
          } else {
            // This happens if a user is authenticated but has no doc.
            // This is a good place to create the doc for the first time.
            console.warn("No user profile found in Firestore for UID:", user.uid);
            setUserProfile(null);
            setIsPremium(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setIsPremium(false);
        }
        // --- END NEW LOGIC ---

      } else {
        // User is logged out, clear all data
        setUser(null);
        setUserProfile(null);
        setIsPremium(false);
      }
      setLoading(false);
      // --- END UPDATED ---
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    // --- UPDATED ---
    // Pass the new values into the provider
    <AuthContext.Provider value={{ user, userProfile, isPremium, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // This now returns { user, userProfile, isPremium, loading }
  return context;
}