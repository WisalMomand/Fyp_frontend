import React, { useState } from "react";
import styles from "./Dishboard.module.css";
import { FaPlus, FaTh, FaRegFileAlt, FaDatabase } from "react-icons/fa";
import CustomQuizForm from "./CustomQuizForm";
import RandomQuizForm from "./RandomQuizForm";
import "bootstrap/dist/css/bootstrap.min.css";

const TeacherDashboard = () => {
  const [showQuizOptions, setShowQuizOptions] = useState(false);
  const [selectedQuizType, setSelectedQuizType] = useState(""); 

  const handleQuizTypeClick = (type) => {
    setSelectedQuizType(type);
    setShowQuizOptions(false); // hide options after selection
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Quiz Maker</h2>
        <nav className={styles.nav}>
          <button
            className={styles.navItem}
            onClick={() => setShowQuizOptions(!showQuizOptions)}
          >
            <FaPlus className={styles.icon} /> Create Quiz
          </button>

          <button className={styles.navItem2}>
            <FaTh className={styles.icon} /> Assigned Quizzes
          </button>

          <button className={styles.navItem2}>
            <FaDatabase className={styles.icon} /> Question Bank
          </button>

          <button className={styles.navItem2}>
            <FaRegFileAlt className={styles.icon} /> Results
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <p className={styles.welcomeText}>Welcome Ahmad!</p>
            <span className={styles.role}>Teacher</span>
          </div>
          <img src="wisal.jpg" alt="Profile" className={styles.profilePic} />
        </header>

        {/* Quiz Type Selection */}
        {showQuizOptions && (
          <div className={styles.quizButtons}>
            <button
              className={styles.quizButton}
              onClick={() => handleQuizTypeClick("custom")}
            >
              <FaPlus className={styles.icon} /> Custom Quiz
            </button>
            <button
              className={styles.quizButton}
              onClick={() => handleQuizTypeClick("random")}
            >
              <FaPlus className={styles.icon} /> Random Quiz
            </button>
          </div>
        )}

        {/* Render Selected Quiz Form */}
        {selectedQuizType === "custom" && <CustomQuizForm />}
        {selectedQuizType === "random" && <RandomQuizForm />}
      </div>
    </div>
  );
};

export default TeacherDashboard;


