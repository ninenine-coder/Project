import { auth, authReady } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

export async function waitAuthReady() {
  await authReady;
  return auth.currentUser;
}

export async function signUp(email, password) {
  await authReady;
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  return user;
}

export async function signIn(email, password) {
  await authReady;
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logOut() {
  await authReady;
  await signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}
