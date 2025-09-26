// app/todo/page.tsx
import { TodoList } from "../components/todo-list"; // client component

export default async function Page() {
  // --- Fetch the raw todo list on the *server* --------------------------------
  const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
    next: { revalidate: 60 }, // optional: cache for 60s
  });

  if (!res.ok) {
    throw new Error('Failed to load todos');
  }

  const todos = await res.json(); // plain JavaScript array (no types needed here)

  // Pass the data to the client component for hydration
  return <TodoList initialTodos={todos} />;
}
