// src/Components/Register.jsx
import React, { useState } from "react";
import styles from "./Register.module.css";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("❌ Passwords do not match.");
    }

    if (!formData.role) {
      return setError("❌ Please select a role.");
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // ✅ Send email verification with redirect URL
      await sendEmailVerification(auth.currentUser, {
        url: "http://localhost:5173/login", // Change this for production
      });

      // 📤 Save user to backend (optional)
      await axios.post("http://localhost:3000/api/register", {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      alert("✅ Registered! A verification link has been sent to your email.");
      navigate("/login");
    } catch (err) {
      console.error("🔥 Registration error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("❌ Email already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("❌ Invalid email.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          Register to <br />
          <span className={styles.highlight}>Generate Quiz</span>
        </h2>
        <p>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>Login</Link>
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p style={{ color: "green" }}>Registering...</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.input}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Register as</label>
            <select
              className={styles.input}
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
