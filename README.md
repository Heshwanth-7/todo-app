# Tasks — Todo App (React + Express)

A small full-stack project: React frontend talks to a Node/Express backend,
which stores todos in a JSON file. No database setup needed.

## Project structure

```
todo-app/
├── backend/         Express API (port 5000)
│   ├── server.js
│   ├── data.json    <- todos get saved here automatically
│   └── package.json
└── frontend/         React app (port 5173, via Vite)
    ├── index.html
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

## How to run it

You need **Node.js** installed (v18+ recommended). Check with:
```
node -v
```
If you don't have it, install from https://nodejs.org

You'll run two terminals — one for the backend, one for the frontend.

### 1. Start the backend
```
cd todo-app/backend
npm install
npm start
```
You should see: `✅ Backend running at http://localhost:5000`

### 2. Start the frontend (in a NEW terminal)
```
cd todo-app/frontend
npm install
npm run dev
```
It will print a local URL, usually `http://localhost:5173` — open that in your browser.

### 3. Use the app
Add, check off, and delete tasks. Refresh the page — your tasks persist,
because they're saved to `backend/data.json` on disk.

## How it works (read this after you get it running)

- **Frontend (`App.jsx`)**: holds the list of todos in React state, and calls
  the backend with `fetch()` for every action (load, add, toggle, delete).
- **Backend (`server.js`)**: a REST API with 4 routes:
  - `GET /api/todos` — get all todos
  - `POST /api/todos` — add a todo
  - `PUT /api/todos/:id` — update a todo (toggle complete)
  - `DELETE /api/todos/:id` — remove a todo
- **Storage (`data.json`)**: instead of a real database, todos are saved as
  JSON in a file. This is the simplest possible persistence — once you're
  comfortable with this flow, swapping it for a real database (like
  PostgreSQL or MongoDB) without changing the frontend at all is a great
  next exercise.

## Things to try next (to deepen your understanding)

1. Add an "edit task" feature (click text to rename it).
2. Add categories/tags to todos.
3. Replace `data.json` with a real database (SQLite is the easiest first step).
4. Deploy it: frontend on Vercel/Netlify, backend on Render/Railway.
5. Add a "due date" field and sort tasks by it.

If something breaks, the most common issues are:
- Backend not running → frontend will show "Could not connect to the server"
- Wrong Node version → reinstall from nodejs.org
- Port already in use → close other apps using port 5000 or 5173
