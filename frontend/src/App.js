import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "income",
  });

  // ✅ Use your Render backend URL here
  const API_BASE_URL = "https://fintrack-4-6lih.onrender.com";

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/transactions`, formData);
      setFormData({ title: "", amount: "", category: "", type: "income" });
      fetchTransactions();
    } catch (err) {
      console.error("❌ Error adding transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("❌ Error deleting transaction:", err);
    }
  };

  // Summary calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Chart data
  const pieData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Finance Breakdown",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#002366", "#800000"],
        borderColor: ["#002366", "#800000"],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: transactions.map((t) => t.title),
    datasets: [
      {
        label: "Amount",
        data: transactions.map((t) => t.amount),
        backgroundColor: transactions.map((t) =>
          t.type === "income" ? "#002366" : "#800000"
        ),
      },
    ],
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#002366",
          color: "white",
          padding: "1rem",
        }}
      >
        <h2>FinTrack</h2>

      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem", backgroundColor: "#f8f8f8" }}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1>FinTrack: A Personal Finance & Budget Manager</h1>
          <p>Track your income, expenses, and budgets easily</p>
        </header>

        {/* Summary cards */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#e0e0e0",
              color: "black",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>Total Income</h3>
            <p>${totalIncome.toFixed(2)}</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#e0e0e0",
              color: "black",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>Total Expenses</h3>
            <p>${totalExpenses.toFixed(2)}</p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "1rem",
              backgroundColor: "#e0e0e0",
              color: "black",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3>Balance</h3>
            <p>${balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Project description */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>System Overview</h3>
          <p>
            <strong>FinTrack</strong> is a full-stack personal finance dashboard
            that helps users track income, expenses, and budgets in real time.
            Users can <strong>add</strong>, <strong>view</strong>, and{" "}
            <strong>delete</strong> transactions while interactive charts
            dynamically update to show total income, expenses, and balance. The
            system integrates <strong>data-driven visualization</strong> and{" "}
            <strong>real-time updates</strong> to reflect accurate financial
            insights, simulating real-world financial dashboards.
          </p>
        </div>

        {/* Add transaction form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            type="submit"
            style={{
              backgroundColor: "#006400",
              color: "white",
              padding: "0.5rem 1rem",
            }}
          >
            Add Transaction
          </button>
        </form>

        {/* Transactions table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            marginBottom: "2rem",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#002366", color: "white" }}>
              <th style={{ padding: "0.5rem" }}>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                style={{ textAlign: "center", borderBottom: "1px solid #ccc" }}
              >
                <td>{t.title}</td>
                <td>${parseFloat(t.amount).toFixed(2)}</td>
                <td>{t.category}</td>
                <td>{t.type}</td>
                <td>
                  <button
                    onClick={() => handleDelete(t.id)}
                    style={{
                      backgroundColor: "#800000",
                      color: "white",
                      padding: "0.3rem 0.5rem",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="5">No transactions yet</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Charts */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "300px",
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Income vs Expenses</h3>
            <Pie data={pieData} />
          </div>
          <div
            style={{
              width: "500px",
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Transaction Amounts</h3>
            <Bar data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
