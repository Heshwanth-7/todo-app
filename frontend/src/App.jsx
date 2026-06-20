import React, { useState, useEffect } from "react";
import "./App.css";

// Backend API base URL — matches the port our Express server listens on
const API_URL = "https://todo-app-t166.onrender.com/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all todos from backend when the component first loads
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to load todos");
      const data = await res.json();
      setTodos(data);
      setError("");
    } catch (err) {
      setError("Could not connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setInputText("");
    } catch (err) {
      setError("Could not add todo. Try again.");
    }
  }

  async function toggleTodo(id, completed) {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      const updated = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError("Could not update todo. Try again.");
    }
  }

  async function deleteTodo(id) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Could not delete todo. Try again.");
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="page">
      <div className="card">
        <header className="card-header">
          <h1>Tasks</h1>
          <p className="subtitle">
            {todos.length === 0
              ? "Nothing here yet"
              : `${remaining} of ${todos.length} remaining`}
          </p>
        </header>

        <form className="add-form" onSubmit={addTodo}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add a task..."
          />
          <button type="submit">Add</button>
        </form>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="empty-state">Add your first task above.</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <label className="todo-row">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                  <span className="todo-text">{todo.text}</span>
                </label>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
