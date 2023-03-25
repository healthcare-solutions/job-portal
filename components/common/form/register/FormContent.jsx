import "firebase/compat/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
// const userRegistration = async (name, email, password) => {
//   try {
//     const res = await auth.createUserWithEmailAndPassword(email, password);
//     const user = res.user;
//     const db = getFirestore();
//     await addDoc(collection(db, "users"), {
//       uid: user.uid,
//       name,
//       email,
//       authProvider: "local",
//     });

//     console.log(user, "Register successfully");
//   } catch (err) {
//     alert(err.message);
//     // console.warn(err);
//   }
// };

const FormContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const validateForm = () => {
    let isValid = true;
    if (!name) {
      setNameError("Please enter your name");
      isValid = false;
    }
    if (!email) {
      setEmailError("Please enter your email address");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }
    if (!password) {
      setPasswordError("Please enter your password");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (validateForm()) {
      try {
        const res = await auth.createUserWithEmailAndPassword(email, password);
        const user = res.user;
        const db = getFirestore();
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name,
          email,
          authProvider: "local",
        });
        console.log(user, "Register successfully");
        router.push("/login");
      } catch (err) {
        alert(err.message);
        // console.warn(err);
      }
    }
  };

  return (
    <form method="post" action="add-parcel.html">
      <div className="form-group">
        <label>Your Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError("");
          }}
          required
        />
        {nameError && <div className="error">{nameError}</div>}
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          placeholder="Your Email"
          required
        />
        {emailError && <div className="error">{emailError}</div>}
      </div>
      {/* name */}

      <div className="form-group">
        <label>Password</label>
        <input
          id="password-field"
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          placeholder="Password"
        />
        {passwordError && <div className="error">{passwordError}</div>}
      </div>
      {/* password */}

      <div className="form-group">
        <button
          className="theme-btn btn-style-one"
          type="submit"
          onClick={handleSubmit}
        >
          Register
        </button>
      </div>
      {/* login */}
    </form>
  );
};

export default FormContent;
