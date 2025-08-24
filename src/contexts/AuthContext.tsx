// contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, linkedinProvider } from "../lib/firebase";
import { getSupabaseWithAuth, supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔹 Save user to Supabase
  const saveUserToSupabase = async (
    firebaseUser: User,
    extraData: any = {}
  ) => {
    if (!firebaseUser) return;

    const supabaseAuthed = await getSupabaseWithAuth();

    const { data, error } = await supabaseAuthed.from("users").upsert(
      {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        full_name: extraData.fullName || firebaseUser.displayName,
        user_type: extraData.userType || "student",
        organization: extraData.organization || null,
        provider: extraData.provider || "email",
        created_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    // ensures no duplicate rows

    if (error) {
      console.error("Error saving user to Supabase:", error.message);
    } else {
      console.log("User saved/updated in Supabase:", data);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await saveUserToSupabase(user, {
      fullName: userData.fullName,
      userType: userData.userType,
      organization: userData.organization,
      provider: "email",
    });
  };

  const signIn = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    console.error("Login failed:", err.message);
    throw err;
  }
};

  const signInWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await saveUserToSupabase(user, {
      provider: "google",
      userType: "student",
    });
  };

  const signInWithLinkedIn = async () => {
    const { user } = await signInWithPopup(auth, linkedinProvider);
    await saveUserToSupabase(user, {
      provider: "linkedin",
      userType: "company",
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
