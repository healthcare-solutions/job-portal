// import { initializeApp, firebase } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import "firebase/compat/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCgZy5sg-fIgZ2gEjnBmhAPQrdjJRKsjWQ",
  authDomain: "jobportal-292e8.firebaseapp.com",
  projectId: "jobportal-292e8",
  storageBucket: "jobportal-292e8.appspot.com",
  messagingSenderId: "772938170897",
  appId: "1:772938170897:web:772b176405ad733f2227b0",
};

firebase.initializeApp(firebaseConfig);
const db = getFirestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const auth = firebase.auth();
export default firebase;
