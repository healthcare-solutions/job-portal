// import "firebase/compat/auth";
import { auth } from "../firebase";
import { useState } from "react";

const userRegistration = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await db.collection("users").add({
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    console.log(user, "Register successfully");
  } catch (err) {
    alert(err.message);
    // console.warn(err);
  }
};

const FormContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form method="post" action="add-parcel.html">
      <div className="form-group">
        <label>Your Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
        />
      </div>
      {/* name */}

      <div className="form-group">
        <label>Password</label>
        <input
          id="password-field"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      {/* password */}

      <div className="form-group">
        <button
          className="theme-btn btn-style-one"
          type="submit"
          onClick={() => {
            // e.preventDefault();
            userRegistration(name, email, password);
          }}
        >
          Register
        </button>
      </div>
      {/* login */}
    </form>
  );
};

export default FormContent;
