import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./QuizForm.module.css";
import { BASE_URL } from "../../../../constant";

const RandomQuizForm = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [numberOfMcqs, setNumberOfMcqs] = useState(5);
  const [timePerMcq, setTimePerMcq] = useState(1);
  const [semester, setSemester] = useState("");
  const [section, setSection] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const oldSubjects = [
    // "Operating System",
    // "Networking",
    // "Software Engineering",
    // "Database",
    // "Artificial Intelligence",
    // "Data Structure",
    // "Web Development",
  ];

  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const sections = ["A", "B", "C", "D"];

  // Fetch subjects from DB + combine with static
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/subjects`);
        const fetchedSubjects = res.data.map((s) => s.name);
        const combined = [...new Set([...oldSubjects, ...fetchedSubjects])];
        setSubjects(combined);
      } catch (err) {
        console.error("❌ Error fetching subjects:", err);
        setSubjects(oldSubjects);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedNum = parseInt(numberOfMcqs);
    const parsedTime = parseInt(timePerMcq);
    const duration = parsedNum * parsedTime;

    if (!title || !subject || !deadline || !semester || !section || parsedNum <= 0 || parsedTime <= 0) {
      alert("🚫 Please fill all fields correctly.");
      setIsSubmitting(false);
      return;
    }

    const teacherid = localStorage.getItem("id");
    if (!teacherid) {
      alert("🚫 Teacher ID not found in localStorage.");
      setIsSubmitting(false);
      return;
    }

    const quizData = {
      title,
      subject,
      type: "random",
      numberOfMcqs: parsedNum,
      duration,
      deadline,
      semester,
      section,
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/quizzes/random/${teacherid}`, quizData);
      alert("✅ Random Quiz Assigned Successfully!");
      console.log("✅ Quiz Saved:", res.data);

      // Reset form
      setTitle("");
      setSubject("");
      setDeadline("");
      setNumberOfMcqs(5);
      setTimePerMcq(1);
      setSemester("");
      setSection("");
    } catch (error) {
      console.error("❌ Error assigning random quiz:", error);
      alert("❌ Failed to assign random quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Create Random Quiz</h3>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
        <option value="">-- Select Subject --</option>
        {subjects.map((subj) => (
          <option key={subj} value={subj}>{subj}</option>
        ))}
      </select>

      <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
        <option value="">-- Select Semester --</option>
        {semesters.map((sem) => (
          <option key={sem} value={sem}>{sem}</option>
        ))}
      </select>

      <select value={section} onChange={(e) => setSection(e.target.value)} required>
        <option value="">-- Select Section --</option>
        {sections.map((sec) => (
          <option key={sec} value={sec}>{sec}</option>
        ))}
      </select>

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Number of MCQs"
        value={numberOfMcqs}
        onChange={(e) => setNumberOfMcqs(e.target.value)}
        required
        min={1}
      />

      <input
        type="number"
        placeholder="Time per MCQ (minutes)"
        value={timePerMcq}
        onChange={(e) => setTimePerMcq(e.target.value)}
        required
        min={1}
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Assigning..." : "Assign Random Quiz"}
      </button>
    </form>
  );
};

export default RandomQuizForm;
