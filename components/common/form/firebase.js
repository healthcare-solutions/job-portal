// import { initializeApp, firebase } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import "firebase/compat/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBGrnv8V0dyFoYBRO1Mvp2rz4B40joy0do",

  authDomain: "auth-jobportal.firebaseapp.com",

  projectId: "auth-jobportal",

  storageBucket: "auth-jobportal.appspot.com",

  messagingSenderId: "10944169620",

  appId: "1:10944169620:web:cfb2703e0694225f18d681",
};

firebase.initializeApp(firebaseConfig);
const db = getFirestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const auth = firebase.auth();
export default firebase;

// Sign-in with Email/Password
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    alert(err.message);
  }
};

// Google Sign-in
export const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(provider);
    const user = res.user;
    const userRef = collection(db, "users");
    const result = await getDocs(query(userRef, where("uid", "==", user.uid)));
    if (result.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    alert(err.message);
  }
};

export const resetPassword = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (err) {
    alert(err.message);
  }
};
