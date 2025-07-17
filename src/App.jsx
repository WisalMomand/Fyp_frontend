import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import TeacherDashboard from "./Components/Teacher/TeacherDashboard";
import StudentDashboard from "./Components/Student/StudentDishboard";
import McqManager from "./Components/McqManager";
import StartQuiz from "./Components/Student/StartQuiz";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ Redirect root path to Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Teacher Functional Pages */}
        <Route path="/question-bank" element={<McqManager />} />

        {/* Student Functional Pages */}
        <Route path="/start-quiz/:quizId" element={<StartQuiz />} />
      </Routes>
    </Router>
  );
};

export default App;


