import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Todo = {
  id: string;
  title: string;
  created_at: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*");

    if (!error && data) {
      setTodos(data as Todo[]);
    }
  }

  async function addTodo() {
    if (!title) return;

    const { error } = await supabase
      .from("todos")
      .insert([{ title }]);

    if (!error) {
      setTitle("");
      fetchTodos();
    }
  }

  return (
    <div>
      <h1>Vite + Supabase CRUD</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
}
