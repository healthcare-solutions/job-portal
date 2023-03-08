import { auth } from "../firebase";
import firebase from "firebase/compat/app";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

const db = getFirestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(provider);
    const user = res.user;
    const userRef = collection(db, "users");
    const result = await getDocs(query(userRef, where("uid", "==", user.uid)));
    if (result.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        // name,
        email: user.email,
        authProvider: "google",
      });
    }
  } catch (err) {
    alert(err.message);
  }
};
const LoginWithSocial = () => {
  return (
    <div className="btn-box row">
      <div className="col-lg-6 col-md-12">
        <a href="#" className="theme-btn social-btn-two facebook-btn">
          <i className="fab fa-facebook-f"></i> Log In via Facebook
        </a>
      </div>
      <div className="col-lg-6 col-md-12">
        <a
          href="#"
          className="theme-btn social-btn-two google-btn"
          onClick={signInWithGoogle}
        >
          <i className="fab fa-google"></i> Log In via Gmail
        </a>
      </div>
    </div>
  );
};

export default LoginWithSocial;
