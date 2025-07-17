// src/Components/Login.jsx
import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        return setError("Please verify your email before logging in.");
      }

      localStorage.setItem("email", user.email);
      localStorage.setItem("role", role);
      localStorage.setItem("photoURL", user.photoURL || "/default.jpg");

      alert("✅ Login successful!");
      navigate(role === "student" ? "/student-dashboard" : "/teacher-dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("❌ Login failed. Please check your email and password.");
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email.endsWith("@gmail.com")) {
        setError("Only Gmail accounts are allowed.");
        return;
      }

      localStorage.setItem("email", user.email);
      localStorage.setItem("role", role);
      localStorage.setItem("photoURL", user.photoURL || "/default.jpg");

      alert("✅ Google Sign-in successful!");
      navigate(role === "student" ? "/student-dashboard" : "/teacher-dashboard");
    } catch (err) {
      console.error("Google Sign-In Error:", err.message);
      setError("Google login failed.");
    }
  };

  // Forgot Password
  const handleResetPassword = async () => {
    if (!resetEmail) return setError("Please enter your email to reset.");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("✅ Password reset email sent. Check your inbox.");
      setShowReset(false);
      setResetEmail("");
    } catch (err) {
      console.error("Reset error:", err.message);
      setError("Failed to send reset email.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 30, fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>

      {error && (
        <div style={{ color: "red", marginBottom: 10, textAlign: "center" }}>{error}</div>
      )}

      <form onSubmit={handleLogin}>
        <label>Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: "8px", width: "100%", marginBottom: 10 }}
          required
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <button type="submit" style={{ width: "100%", padding: "12px", background: "#111", color: "#fff" }}>
          Login with Email
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          marginTop: "15px",
          fontWeight: "bold",
        }}
      >
        Sign in with Google
      </button>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>

      <p
        onClick={() => setShowReset(!showReset)}
        style={{ textAlign: "center", cursor: "pointer", color: "blue", marginTop: 10 }}
      >
        Forgot Password?
      </p>

      {showReset && (
        <div style={{ marginTop: 15 }}>
          <input
            type="email"
            placeholder="Enter email to reset"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button
            onClick={handleResetPassword}
            style={{
              width: "100%",
              padding: "10px",
              background: "#f44336",
              color: "#fff",
              border: "none",
            }}
          >
            Send Reset Link
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
