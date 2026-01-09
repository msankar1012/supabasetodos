import { useEffect, useState } from "react"
import { supabase } from "./supabase"

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) setTodos(data)
  }

  // CREATE
  async function addTodo() {
    if (!title) return
    await supabase.from("todos").insert({ title })
    setTitle("")
    fetchTodos()
  }

  // UPDATE
  async function updateTodo(id) {
    const newTitle = prompt("New title:")
    if (!newTitle) return

    await supabase
      .from("todos")
      .update({ title: newTitle })
      .eq("id", id)

    fetchTodos()
  }

  // DELETE
  async function deleteTodo(id) {
    await supabase.from("todos").delete().eq("id", id)
    fetchTodos()
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Supabase CRUD App</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => updateTodo(todo.id)}>✏️</button>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
