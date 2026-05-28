import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase/client";

export type UserRole = "customer" | "reseller" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  company?: string;
  role: UserRole;
  resellerId?: string | null;
  status: "active" | "suspended";
  emailVerified: boolean;
  createdAt: unknown; // Firestore Timestamp
  updatedAt?: unknown;
}

// ─── Registration ─────────────────────────────────────────────────────────────

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  // Update Firebase Auth profile
  await updateProfile(user, { displayName });

  // Send email verification
  await sendEmailVerification(user);

  // Create Firestore user document
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    role: "customer",
    resellerId: null,
    status: "active",
    emailVerified: false,
    createdAt: serverTimestamp(),
  } satisfies Omit<UserProfile, "emailVerified"> & { emailVerified: boolean });

  return user;
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const { user } = await signInWithPopup(auth, provider);

  // Upsert user document (Google users may be new or returning)
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      role: "customer",
      resellerId: null,
      status: "active",
      emailVerified: true,
      createdAt: serverTimestamp(),
    });
  }

  return user;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// ─── Firestore User Helpers ───────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const profile = await getUserProfile(uid);
  return profile?.role ?? null;
}

// ─── Session Cookie (server actions) ─────────────────────────────────────────

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}