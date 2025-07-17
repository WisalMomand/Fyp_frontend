// src/Components/Student/StudentDashboard.jsx

import React, { useEffect, useState } from "react";
import styles from "./Dishboard.module.css";
import { FaTh, FaRegFileAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../firebase"; // ✅ Firebase must be initialized here
import UserProfile from "../Common/UserProfile"; // ✅ Reusable profile component

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [studentEmail, setStudentEmail] = useState("");
  const [profilePic, setProfilePic] = useState("/default.jpg"); // ✅ default fallback
  const navigate = useNavigate();

  // 🔐 Get current user email & photo from Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email.endsWith("@gmail.com")) {
        setStudentEmail(user.email);
        setProfilePic(user.photoURL || "/default.jpg"); // ✅ Google photo or fallback
        // Save for other components if needed
        localStorage.setItem("photoURL", user.photoURL || "/default.jpg");
      } else {
        alert("Please log in with a valid Gmail account.");
        navigate("/login");
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [navigate]);

  // 📦 Fetch assigned quizzes for that student email
  useEffect(() => {
    if (studentEmail) {
      axios
        .get(`http://localhost:3000/api/assigned-quizzes/student/${studentEmail}`)
        .then((res) => {
          setQuizzes(res.data);
          console.log("📦 Quizzes received from backend:", res.data);
        })
        .catch((err) => {
          console.error("❌ Failed loading assigned quizzes", err);
          alert("Failed to load assigned quizzes.");
        });
    }
  }, [studentEmail]);

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Quiz Maker</h2>
        <nav className={styles.nav}>
          <button className={styles.navItem}>
            <FaTh className={styles.icon} /> Assigned Quizzes
          </button>
          <button className={styles.navItem} onClick={() => navigate("/results")}>
            <FaRegFileAlt className={styles.icon} /> Results
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* ✅ Student Profile Header with Dynamic Photo */}
        <UserProfile
          email={studentEmail}
          role="Student"
          image={profilePic}
        />

        {/* Quiz Section */}
        <div className={styles.quizSection}>
          {quizzes.length === 0 ? (
            <p>No quizzes assigned to you yet.</p>
          ) : (
            quizzes.map((quiz, index) => (
              <div key={quiz._id} className={styles.quizContainer}>
                <div className={styles.quizCard}>
                  <span>{quiz.title}</span>
                  <button className={styles.dropdownBtn}>▼</button>
                </div>

                {index === 0 && <hr className={styles.divider} />}

                <div className={styles.quizDetails}>
                  <span><strong>Deadline:</strong> {quiz.deadline}</span>
                  <span><strong>Time Duration:</strong> {quiz.duration} min</span>
                  <span><strong>Subject:</strong> {quiz.subject}</span>
                  <button
                    className={styles.startBtn}
                    onClick={() => navigate(`/start-quiz/${quiz._id}`)}
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;






