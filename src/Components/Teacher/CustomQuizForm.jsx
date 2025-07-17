import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./QuizForm.module.css";
import { BASE_URL } from "../../../../constant";

const CustomQuizForm = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [numberOfMcqs, setNumberOfMcqs] = useState(5);
  const [timePerMcq, setTimePerMcq] = useState(1);
  const [selectedMcqs, setSelectedMcqs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMcqs = async () => {
      if (!subject || !numberOfMcqs) return;

      try {
        const res = await axios.get(`${BASE_URL}/api/mcqs/subject/${subject}`);
        const allMcqs = res.data.mcqs || [];
        const firstNMcqs = allMcqs.slice(0, parseInt(numberOfMcqs));
        setSelectedMcqs(firstNMcqs.map((mcq) => mcq._id));
      } catch (error) {
        console.error("Error fetching MCQs:", error);
        alert("Failed to fetch MCQs for selected subject.");
      }
    };

    fetchMcqs();
  }, [subject, numberOfMcqs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedNum = parseInt(numberOfMcqs);
    const parsedTime = parseInt(timePerMcq);
    const duration = parsedNum * parsedTime; // ✅ Define duration here

    if (parsedNum <= 0 || parsedTime <= 0) {
      alert("Number of MCQs and Time per MCQ must be greater than 0");
      setIsSubmitting(false);
      return;
    }

    if (!assignedTo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Invalid email address");
      setIsSubmitting(false);
      return;
    }

    if (selectedMcqs.length !== parsedNum) {
      alert(`Only ${selectedMcqs.length} MCQs found. Please reduce question count or add more MCQs to this subject.`);
      setIsSubmitting(false);
      return;
    }

    const quizData = {
      title,
      subject,
      type: "custom",
      numberOfMcqs: parsedNum,
      duration,
      deadline,
      assignedTo,
      mcqs: selectedMcqs, // ✅ Use selectedMcqs instead of undefined `questionIds`
    };

    try {
      const res = await axios.post(`${BASE_URL}/api/quizzes/custom`, quizData);
      console.log("✅ Custom Quiz Assigned:", res.data);
      alert("✅ Custom Quiz Assigned Successfully!");

      // Reset form
      setTitle("");
      setSubject("");
      setAssignedTo("");
      setDeadline("");
      setNumberOfMcqs(5);
      setTimePerMcq(1);
      setSelectedMcqs([]);
    } catch (error) {
      console.error("❌ Error assigning custom quiz:", error);
      alert("❌ Failed to assign custom quiz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>Create Custom Quiz (First N MCQs)</h3>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
        <option value="">Select Subject</option>
        <option value="Operating System">Operating System</option>
        <option value="Networking">Networking</option>
        <option value="Software Engineering">Software Engineering</option>
        <option value="Database">Database</option>
        <option value="Artificial Intelligence">Artificial Intelligence</option>
        <option value="Data Structures">Data Structures</option>
        <option value="Web Development">Web Development</option>
      </select>

      <input
        type="email"
        placeholder="Student Email"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        required
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Number of Questions"
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
        {isSubmitting ? "Assigning..." : "Assign Custom Quiz"}
      </button>
    </form>
  );
};

export default CustomQuizForm;



