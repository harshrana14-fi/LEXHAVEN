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

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  organization?: string;
  provider: string;
  created_at: string;
}

interface AuthUser extends User {
  userType?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ userType: string }>;
  signIn: (email: string, password: string) => Promise<{ userType: string }>;
  signInWithGoogle: () => Promise<{ userType: string }>;
  signInWithLinkedIn: () => Promise<{ userType: string }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user profile from Supabase
  const fetchUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    if (!firebaseUser?.uid) return null;

    try {
      const supabaseAuthed = await getSupabaseWithAuth();
      const { data, error } = await supabaseAuthed
        .from("users")
        .select("*")
        .eq("id", firebaseUser.uid)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error.message);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  // 🔹 Refresh user profile (useful for updating context after profile changes)
  const refreshUserProfile = async () => {
    if (!user) return;
    
    const profile = await fetchUserProfile(user);
    if (profile) {
      setUserProfile(profile);
      // Update user object with userType for backward compatibility
      setUser(prev => prev ? { ...prev, userType: profile.user_type, profile } : null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Supabase
        const profile = await fetchUserProfile(firebaseUser);
        
        if (profile) {
          const authUser: AuthUser = {
            ...firebaseUser,
            userType: profile.user_type,
            profile: profile
          };
          setUser(authUser);
          setUserProfile(profile);
        } else {
          // If no profile found, set user without profile (might be a new social login)
          setUser(firebaseUser as AuthUser);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 🔹 Save user to Supabase
  const saveUserToSupabase = async (
    firebaseUser: User,
    extraData: any = {}
  ): Promise<UserProfile> => {
    if (!firebaseUser) throw new Error("No Firebase user provided");

    const supabaseAuthed = await getSupabaseWithAuth();

    const userData = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      full_name: extraData.fullName || firebaseUser.displayName || '',
      user_type: extraData.userType || "student",
      organization: extraData.organization || null,
      provider: extraData.provider || "email",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAuthed
      .from("users")
      .upsert(userData, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Error saving user to Supabase:", error.message);
      throw new Error(`Failed to save user: ${error.message}`);
    }

    console.log("User saved/updated in Supabase:", data);
    return data as UserProfile;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const profile = await saveUserToSupabase(firebaseUser, {
        fullName: userData.fullName,
        userType: userData.userType,
        organization: userData.organization,
        provider: "email",
      });

      // Update context immediately
      const authUser: AuthUser = {
        ...firebaseUser,
        userType: profile.user_type,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.user_type };
    } catch (error) {
      console.error("SignUp error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile to get user type
      const profile = await fetchUserProfile(firebaseUser);
      
      if (!profile) {
        throw new Error("User profile not found. Please contact support.");
      }

      // Update context immediately
      const authUser: AuthUser = {
        ...firebaseUser,
        userType: profile.user_type,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.user_type };
    } catch (err: any) {
      console.error("Login failed:", err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
      
      // Check if user already exists
      let profile = await fetchUserProfile(firebaseUser);
      
      if (!profile) {
        // New user - create profile with default student type
        profile = await saveUserToSupabase(firebaseUser, {
          provider: "google",
          userType: "student", // Default for Google signin
        });
      }

      // Update context immediately
      const authUser: AuthUser = {
        ...firebaseUser,
        userType: profile.user_type,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.user_type };
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, linkedinProvider);
      
      // Check if user already exists
      let profile = await fetchUserProfile(firebaseUser);
      
      if (!profile) {
        // New user - create profile with default company type
        profile = await saveUserToSupabase(firebaseUser, {
          provider: "linkedin",
          userType: "company", // Default for LinkedIn signin
        });
      }

      // Update context immediately
      const authUser: AuthUser = {
        ...firebaseUser,
        userType: profile.user_type,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.user_type };
    } catch (error) {
      console.error("LinkedIn sign-in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithLinkedIn,
    signOut,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}