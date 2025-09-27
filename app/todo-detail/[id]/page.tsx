export default async function TodoDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  // Use built-in fetch (works in Next.js server components, no deps)
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch todo");
  }
  const todo = await res.json();

  return (
    <div className="p-4 flex justify-center items-center flex-col h-screen text-center">
      <h1 className="text-3xl font-bold mb-2">Todo Detail</h1>
      <p><strong>ID:</strong> {todo.id}</p>
      <p><strong>Title:</strong> {todo.title}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={todo.completed ? "text-green-600" : "text-red-400"}>
          {todo.completed ? "Completed" : "Pending..."}
        </span>
      </p>
    </div>
  );
}
