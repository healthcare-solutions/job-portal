import Link from "next/link";
import LoginWithSocial from "./LoginWithSocial";
import { auth } from "../firebase";
import { useState } from "react";

const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    const userId = userCredential.user.uid;
    localStorage.setItem("userId", userId);
    console.log(`User ID ${userId} stored in local storage.`);

    console.log(email, "login successfully");
  } catch (err) {
    alert(err.message);
  }
};

const resetPassword = async (email) => {
    if(email){
      try {
        await auth.sendPasswordResetEmail(email);
        alert('Password reset link has been sent to your email id. Please check your inbox.')
      } catch (err) {
        alert(err.message);
      }
    } else {
        alert('Please fill your email address in above form before click Forgot Password button')
    }
};

const FormContent = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  return (
    <div className="form-inner">
      <h3>Login to Immense Career</h3>

      {/* <!--Login Form--> */}
      <form method="post">
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="immense-career-email"
            placeholder="Your Email Address"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="immense-career-password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {/* password */}

        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input type="checkbox" name="remember-me" id="remember" />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label>
            </div>
            <a
              // href="#"
              className="pwd"
              onClick={() => {
                resetPassword(loginEmail);
              }}
            >
              Forgot password?
            </a>
          </div>
        </div>
        {/* forgot password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
            onClick={(e) => {
              e.preventDefault();
              signInWithEmailAndPassword(loginEmail, loginPassword);
            }}
          >
            Log In
          </button>
        </div>
        {/* login */}
      </form>
      {/* End form */}

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="call-modal signup"
            data-bs-dismiss="modal"
            data-bs-target="#registerModal"
            data-bs-toggle="modal"
          >
            Signup
          </Link>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent;
