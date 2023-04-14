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
import { setUserData } from "../../../../features/candidate/candidateSlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';

const db = getFirestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const signInWithGoogle = async (dispatch) => {
  try {
    const res = await auth.signInWithPopup(provider);
    const user = res.user;
    const userRef = collection(db, "users");
    const result = await getDocs(query(userRef, where("uid", "==", user.uid)));
    if (result.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL,
        email: user.email,
        date: Date.now,
        authProvider: "google",
      });
    }

    dispatch(setUserData( {name: user.displayName, id: user.uid, email: user.email}))

    // open toast
    toast.success('Account Created Successfully', {
      position: "bottom-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    document.getElementById("close-button").click()
  } catch (err) {
    if (err.message.includes("found in field date in document users/")) {
      // open toast
      toast.error('Account already registered! Please try to log in', {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      // open toast
      toast.error('System is unavailable. Please try again later or contact tech support!', {
        position: "bottom-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }
};
const LoginWithSocial = () => {
  const dispatch = useDispatch();

  return (
    <div className="btn-box row">
      {/* <div className="col-lg-6 col-md-12">
        <a href="#" className="theme-btn social-btn-two facebook-btn">
          <i className="fab fa-facebook-f"></i> Log In via Facebook
        </a>
      </div> */}
      <div className="col-lg-12 col-md-24">
        <a
          href="#"
          className="theme-btn social-btn-two google-btn"
          onClick={() => signInWithGoogle(dispatch)}
        >
          <i className="fab fa-google"></i> Log In via Gmail
        </a>
      </div>
    </div>
  );
};

export default LoginWithSocial;
