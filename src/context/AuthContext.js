'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, googleProvider } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await setDoc(doc(db, 'users', result.user.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
      freeEditsUsed: 0,
      totalEditsAvailable: 0,
      resumesChecked: 0,
      payments: [],
    });
    return result;
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const docRef = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        name: result.user.displayName,
        email: result.user.email,
        createdAt: serverTimestamp(),
        freeEditsUsed: 0,
        totalEditsAvailable: 0,
        resumesChecked: 0,
        payments: [],
      });
    }
    return result;
  };

  const logout = async () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, signup, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
