// src/services/db.js
// Sve Firestore operacije

import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, getDocs, addDoc, deleteDoc, query, orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { createUserSchema } from "../lib/schemas";

// ── Korisnici ────────────────────────────────────────────

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...createUserSchema(uid, data.email, data.displayName),
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

// ── Kvizovi ──────────────────────────────────────────────

export async function getAllQuizzes() {
  const snap = await getDocs(query(collection(db, "quizzes"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getQuiz(quizId) {
  const snap = await getDoc(doc(db, "quizzes", quizId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createQuiz(data) {
  const ref = await addDoc(collection(db, "quizzes"), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateQuiz(quizId, data) {
  await updateDoc(doc(db, "quizzes", quizId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteQuiz(quizId) {
  // Prvo obriši sva pitanja iz subkolekcije
  const questionsSnap = await getDocs(
    collection(db, "quizzes", quizId, "questions")
  );
  for (const q of questionsSnap.docs) {
    await deleteDoc(doc(db, "quizzes", quizId, "questions", q.id));
  }
  // Onda obriši sam kviz
  await deleteDoc(doc(db, "quizzes", quizId));
}

// ── Pitanja ──────────────────────────────────────────────

export async function getQuestions(quizId) {
  const snap = await getDocs(
    query(collection(db, "quizzes", quizId, "questions"), orderBy("order"))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addQuestion(quizId, data) {
  const ref = await addDoc(collection(db, "quizzes", quizId, "questions"), data);
  return ref.id;
}

export async function deleteQuestion(quizId, questionId) {
  await deleteDoc(doc(db, "quizzes", quizId, "questions", questionId));
}

// ── Rezultati ────────────────────────────────────────────

export async function saveResult(data) {
  const ref = await addDoc(collection(db, "results"), {
    ...data, completedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserResults(userId) {
  const snap = await getDocs(
    query(collection(db, "results"), orderBy("completedAt", "desc"))
  );
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(r => r.userId === userId);
}