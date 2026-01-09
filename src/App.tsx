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
    const { data, error } = await supabase.from("todos").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setTodos(data as Todo[]);
  }

  async function addTodo() {
    if (!title) return;
    const { error } = await supabase.from("todos").insert([{ title }]);
    if (!error) {
      setTitle("");
      fetchTodos();
    }
  }

  async function updateTodo(id: string) {
    const newTitle = prompt("Update todo:");
    if (!newTitle) return;
    const { error } = await supabase.from("todos").update({ title: newTitle }).eq("id", id);
    if (!error) fetchTodos();
  }

  async function deleteTodo(id: string) {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) fetchTodos();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Vite + Supabase CRUD</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo" />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title} 
            <button onClick={() => updateTodo(todo.id)}>✏️</button>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
