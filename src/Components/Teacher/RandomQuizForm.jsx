import React, { useState } from "react";
import axios from "axios";
import styles from "./QuizForm.module.css";
import { BASE_URL } from "../../../../constant";

const RandomQuizForm = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [numberOfMcqs, setNumberOfMcqs] = useState(5);
  const [timePerMcq, setTimePerMcq] = useState(1); // in minutes
  console.log("time" , timePerMcq)
  console.log("RandomQuizForm", numberOfMcqs);
  
  const handleSubmit = async (e) => {
  e.preventDefault();

  const parsedNumberOfMcqs = parseInt(numberOfMcqs);
  const parsedTimePerMcq = parseInt(timePerMcq);

  const quizData = {
    title,
    subject,
    assignedTo,
    deadline,
    numberOfMcqs: parsedNumberOfMcqs,
    duration: parsedNumberOfMcqs * parsedTimePerMcq,
  };

  console.log("Quiz Data to be sent:", quizData);

  try {
    const res = await axios.post(`${BASE_URL}/api/quizzes/random`, quizData);
    console.log("Random Quiz assigned successfully:", res.data);
    alert("Random Quiz Assigned!");
  } catch (error) {
    console.error("Submit Error:", error);
    alert("Failed to assign random quiz");
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
        type="text"
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
      />

      <input
        type="number"
        placeholder="Time per MCQ (min)"
        value={timePerMcq}
        onChange={(e) => setTimePerMcq(e.target.value)}
        required
      />

      <button type="submit">Assign Random Quiz</button>
    </form>
  );
};

export default RandomQuizForm;
