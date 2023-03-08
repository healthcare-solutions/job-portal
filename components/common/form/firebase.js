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
    apiKey: "AIzaSyCgZy5sg-fIgZ2gEjnBmhAPQrdjJRKsjWQ",
    authDomain: "jobportal-292e8.firebaseapp.com",
    projectId: "jobportal-292e8",
    storageBucket: "jobportal-292e8.appspot.com",
    messagingSenderId: "772938170897",
    appId: "1:772938170897:web:772b176405ad733f2227b0"
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
