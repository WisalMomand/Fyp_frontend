import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewAllStudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subject, setSubject] = useState("Database");

  const teacherId = localStorage.getItem("id"); // Get logged-in teacher ID
  const fetchResults = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/quiz-results/result/${teacherId}`
      );
      console.log("Fetched results:", response.data);
      setResults(response.data.results || []);
    } catch (err) {
      console.error("❌ Error fetching results:", err);
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [subject]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span role="img" aria-label="chart" style={styles.icon}>
          📊
        </span>
        <h2 style={styles.title}>My Subject Results (All Students)</h2>
      </div>

    
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Semester</th>
                <th style={styles.th}>Section</th>
                <th style={styles.th}>Quiz Title</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Score</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>%</th>
                <th style={styles.th}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx} style={styles.tr}>
                  <td style={styles.td}>{r.studentName}</td>
                  <td style={styles.td}>{r.studentEmail}</td>
                  <td style={styles.td}>{r.semester}</td>
                  <td style={styles.td}>{r.section}</td>
                  <td style={styles.td}>{r.quizTitle}</td>
                  <td style={styles.td}>{r.subject}</td>
                  <td style={styles.td}>{r.score}</td>
                  <td style={styles.td}>{r.totalMcqs}</td>
                  <td style={styles.td}>{r.percentage}%</td>
                  <td style={styles.td}>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="10" style={styles.noData}>
                    No results found for this subject.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
const styles = {
  container: {
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    boxSizing: "border-box", // Added for better padding handling
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap", // Added for responsive wrapping
  },
  icon: {
    fontSize: "28px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    margin: 0, // Added to prevent default margins
  },
  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap", // Added for responsive wrapping
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    minWidth: "150px", // Added to maintain minimum width
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
    minWidth: "800px", // Added minimum width for the table
  },
  th: {
    padding: "12px 16px",
    backgroundColor: "#f2f4f7",
    color: "#333",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "2px solid #e0e0e0",
    whiteSpace: "nowrap", // Prevent text wrapping in headers
  },
  td: {
    padding: "10px 16px",
    borderBottom: "1px solid #f0f0f0",
    color: "#555",
    whiteSpace: "nowrap", // Prevent text wrapping in cells
  },
  tr: {
    transition: "background 0.2s ease-in-out",
  },
  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#888",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    padding: "10px", // Added padding for better appearance
    backgroundColor: "#ffebee", // Added subtle background
    borderRadius: "6px", // Added rounded corners
    marginBottom: "15px", // Added spacing
  },
  
  // Media queries for responsiveness
  "@media (max-width: 1200px)": {
    container: {
      padding: "25px",
    },
    card: {
      padding: "15px",
    },
  },
  
  "@media (max-width: 992px)": {
    container: {
      padding: "20px",
    },
    title: {
      fontSize: "22px",
    },
    th: {
      padding: "10px 12px",
      fontSize: "14px",
    },
    td: {
      padding: "8px 12px",
      fontSize: "14px",
    },
  },
  
  "@media (max-width: 768px)": {
    container: {
      padding: "15px",
    },
    header: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "5px",
    },
    title: {
      fontSize: "20px",
    },
    filters: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "10px",
    },
    select: {
      width: "100%",
    },
    card: {
      padding: "12px",
      borderRadius: "8px",
    },
    th: {
      padding: "8px 10px",
      fontSize: "13px",
    },
    td: {
      padding: "6px 10px",
      fontSize: "13px",
    },
  },
  
  "@media (max-width: 576px)": {
    container: {
      padding: "10px",
    },
    title: {
      fontSize: "18px",
    },
    icon: {
      fontSize: "24px",
    },
    card: {
      padding: "10px",
      borderRadius: "6px",
    },
    th: {
      padding: "6px 8px",
      fontSize: "12px",
    },
    td: {
      padding: "5px 8px",
      fontSize: "12px",
    },
  }
};

export default ViewAllStudentResults;
