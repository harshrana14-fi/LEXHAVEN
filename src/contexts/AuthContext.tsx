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
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, googleProvider, linkedinProvider, db } from "../lib/firebase";

interface UserProfile {
  user_type: string;
  id: string;
  email: string;
  fullName: string;
  userType: string;
  organization?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
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
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  const fetchUserProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    if (!firebaseUser?.uid) return null;

    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          email: data.email,
          fullName: data.fullName,
          userType: data.userType,
          organization: data.organization,
          provider: data.provider,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!user) return;
    
    const profile = await fetchUserProfile(user);
    if (profile) {
      setUserProfile(profile);
      setUser(prev => prev ? { ...prev, userType: profile.userType, profile } : null);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userDocRef, updateData);

      // Update local state
      const updatedProfile = { ...userProfile, ...updateData };
      setUserProfile(updatedProfile);
      setUser(prev => prev ? { ...prev, profile: updatedProfile } : null);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const profile = await fetchUserProfile(firebaseUser);
        
        if (profile) {
          const authUser: AuthUser = {
            ...firebaseUser,
            userType: profile.userType,
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

  // Save user to Firestore
  const saveUserToFirestore = async (
    firebaseUser: User,
    extraData: any = {}
  ): Promise<UserProfile> => {
    if (!firebaseUser) throw new Error("No Firebase user provided");

    const now = new Date().toISOString();
    const userData: UserProfile = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      fullName: extraData.fullName || firebaseUser.displayName || "",
      userType: extraData.userType || "student",
      organization: extraData.organization || "",
      provider: extraData.provider || "email",
      createdAt: now,
      updatedAt: now,
      user_type: ""
    };

    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, userData, { merge: true });

      // Update Firebase Auth profile if needed
      if (userData.fullName && !firebaseUser.displayName) {
        await updateProfile(firebaseUser, {
          displayName: userData.fullName,
        });
      }

      console.log("User saved to Firestore:", userData);
      return userData;
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      throw new Error(`Failed to save user: ${error}`);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const profile = await saveUserToFirestore(firebaseUser, {
        fullName: userData.fullName,
        userType: userData.userType,
        organization: userData.organization,
        provider: "email",
      });

      // Update context immediately
      const authUser: AuthUser = {
        ...firebaseUser,
        userType: profile.userType,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.userType };
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
        userType: profile.userType,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.userType };
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
        profile = await saveUserToFirestore(firebaseUser, {
          provider: "google",
          userType: "student", // Default for Google signin
          fullName: firebaseUser.displayName || "",
        });
      }

      // Update context immediately
      const authUser: AuthUser = {
        ...firebaseUser,
        userType: profile.userType,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.userType };
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
        profile = await saveUserToFirestore(firebaseUser, {
          provider: "linkedin",
          userType: "company", // Default for LinkedIn signin
          fullName: firebaseUser.displayName || "",
        });
      }

      // Update context immediately
      const authUser: AuthUser = {
        ...firebaseUser,
        userType: profile.userType,
        profile: profile
      };
      setUser(authUser);
      setUserProfile(profile);

      return { userType: profile.userType };
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
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}