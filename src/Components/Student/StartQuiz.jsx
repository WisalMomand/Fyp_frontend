// src/Components/Student/StartQuiz.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./StartQuiz.module.css";
import generateQuizPDF from "../../generateQuizPDF";

const StartQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/assigned-quizzes/${quizId}`);
        const quizData = res.data;
        setQuiz(quizData);
        setTimeLeft((quizData?.duration || 0) * 60);
      } catch (error) {
        setErrorMsg("Error fetching quiz. Please try again later.");
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Auto submit when timer runs out
  useEffect(() => {
    if (!quiz || submitted) return;
    if (!timeLeft) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, submitted]);

  const handleOptionChange = (mcqId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [mcqId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    setErrorMsg("");

    const studentEmail = localStorage.getItem("email");
    if (!studentEmail) {
      setErrorMsg("❌ No student email found in localStorage.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/quiz-results", {
        quizId,
        studentEmail,
        answers,
      });

      alert("✅ Quiz submitted successfully!");
    } catch (err) {
      console.error("❌ Submit failed", err);
      setErrorMsg("❌ Submit failed. Please try again.");
    }
  };

  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;
  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className={styles.container}>
      <h3>{quiz.title}</h3>
      <p>
        <strong>Time Left:</strong> {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, '0')}
      </p>

      {(quiz.mcqs && quiz.mcqs.length > 0) ? quiz.mcqs.map((mcq, idx) => (
        <div key={mcq._id} className={styles.questionCard}>
          <p><strong>{idx + 1}. {mcq.question}</strong></p>
          {mcq.options && mcq.options.map((opt, i) => (
            <label key={i} className={styles.option}>
              <input
                type="radio"
                name={mcq._id}
                value={opt}
                checked={answers[mcq._id] === opt}
                onChange={() => handleOptionChange(mcq._id, opt)}
                disabled={submitted}
              />
              {opt}
            </label>
          ))}
        </div>
      )) : <p>No questions found for this quiz.</p>}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={submitted}
      >
        {submitted ? "Submitted" : "Submit"}
      </button>
      {/* ✅ Show PDF button after submission */}
      {submitted && (
        <button
          className={styles.submitBtn}
          onClick={() => generateQuizPDF(quiz, answers, localStorage.getItem("email"))}
        >
          Download PDF Report
        </button>
           )}
    </div>
  );
};

export default StartQuiz;
