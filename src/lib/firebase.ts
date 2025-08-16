// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyChnx2t-EUz74_NNrFIRxHwZokTXAep8Ys",
  authDomain: "lexhaven-auth.firebaseapp.com",
  projectId: "lexhaven-auth",
  storageBucket: "lexhaven-auth.firebasestorage.app",
  messagingSenderId: "438846925833",
  appId: "1:438846925833:web:7841afd219b103da9b5cd8",
  measurementId: "G-088MPS7L3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

// Configure providers
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export const linkedinProvider = new OAuthProvider('microsoft.com')
linkedinProvider.setCustomParameters({
  tenant: 'organizations'
})

export default app