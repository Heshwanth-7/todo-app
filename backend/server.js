// server.js
// A simple Express backend that stores todos in a JSON file on disk.
// No database needed — great for a first project, easy to understand end-to-end.

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5050;
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(cors()); // allows the React app (different port) to call this API
app.use(express.json()); // parses incoming JSON request bodies

// --- Helper functions to read/write our "database" (a JSON file) ---

function readTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// --- Routes (this is the "API" the frontend talks to) ---

// GET /api/todos -> return all todos
app.get("/api/todos", (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST /api/todos -> create a new todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Todo text is required" });
  }

  const todos = readTodos();
  const newTodo = {
    id: Date.now().toString(), // simple unique id
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});

// PUT /api/todos/:id -> update a todo (toggle completed, or edit text)
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (typeof req.body.completed === "boolean") {
    todo.completed = req.body.completed;
  }
  if (typeof req.body.text === "string") {
    todo.text = req.body.text;
  }

  writeTodos(todos);
  res.json(todo);
});

// DELETE /api/todos/:id -> remove a todo
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  let todos = readTodos();
  const exists = todos.some((t) => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos = todos.filter((t) => t.id !== id);
  writeTodos(todos);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
