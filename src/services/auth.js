// src/services/auth.js
// Sve Firebase Auth operacije

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUserProfile } from "./db";

// ── Auth state observer ──────────────────────────────────
export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Registracija ─────────────────────────────────────────
export async function signUp(email, password, displayName) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  await createUserProfile(user.uid, { email, displayName });
  return user;
}

// ── Prijava ──────────────────────────────────────────────
export async function signIn(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

// ── Odjava ───────────────────────────────────────────────
export async function logOut() {
  await signOut(auth);
}

// ── Oporavak lozinke ─────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Promjena imena ───────────────────────────────────────
export async function updateDisplayName(displayName) {
  const user = auth.currentUser;
  if (!user) throw new Error("Nije prijavljen.");
  await updateProfile(user, { displayName });
}

// ── Promjena e-maila (uz re-auth) ────────────────────────
export async function changeEmail(currentPassword, newEmail) {
  const user = auth.currentUser;
  if (!user) throw new Error("Nije prijavljen.");
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updateEmail(user, newEmail);
}

// ── Promjena lozinke (uz re-auth) ────────────────────────
export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user) throw new Error("Nije prijavljen.");
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}

// ── Mapa Firebase grešaka na HR ──────────────────────────
export function authErrorMessage(code) {
  const map = {
    "auth/email-already-in-use":  "Ova e-mail adresa je već registrirana.",
    "auth/invalid-email":         "Neispravna e-mail adresa.",
    "auth/weak-password":         "Lozinka je preslaba (min. 6 znakova).",
    "auth/user-not-found":        "Ne postoji račun s ovom adresom.",
    "auth/wrong-password":        "Pogrešna lozinka.",
    "auth/invalid-credential":    "Pogrešni podaci za prijavu.",
    "auth/too-many-requests":     "Previše pokušaja. Pričekajte malo.",
    "auth/network-request-failed":"Greška mreže. Provjerite vezu.",
  };
  return map[code] ?? "Došlo je do greške. Pokušajte ponovo.";
}
