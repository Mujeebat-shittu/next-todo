// components/TodoList.tsx
'use client';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Pagination from './layout';
import AddTodo from './add-todo';
import { Edit, Trash, LoaderCircle } from "lucide-react";
import "../globals.css"
import Link from "next/link";


type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export function TodoList({ initialTodos }: { initialTodos: Todo[] }) {

  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');

  // Mutations – now point to our own /api/todos route
    const updateTodo = useMutation({
    mutationFn: async (updatedTodo: Todo) => {
      // Send the patch to our own API route
      const res = await fetch(`/api/todos/${updatedTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      if (!res.ok) throw new Error('Failed to update todo');
      return res.json();   // the updated todo object
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.map(t => (t.id === updated.id ? { ...t, ...updated } : t))
      );
    },
  });

   const deleteTodo = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete todo');
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) =>
        old.filter(t => t.id !== id)
      );
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm('Delete this todo?')) return;
    deleteTodo.mutate(id);
  };

  // “Data” – we hydrate from server but keep the same logic for filtering/pager
  // const [todos] = useState(initialTodos); // We keep it stable; you could also add a `useQuery` with `initialData: initialTodos`
   const {
    data: todos = initialTodos ?? [],      // use server‑rendered data as fallback
    isLoading,
    isError,
    error,
  } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch('/api/todos');           // ← our own API route
      if (!res.ok) throw new Error('Failed to fetch todos');
      return res.json(); // returns Todo[] automatically
    },
    // optional cache/optimistic settings:
    staleTime: 30_000,      // 30s cache
  });

  /* ── loading / error UI ── */
  if (isLoading)
    return (
      <p className="h-screen flex items-center justify-center text-xl font-bold">
        Loading todos <LoaderCircle /> 
      </p>
    );

  if (isError)
    return (
      <p className="h-screen flex items-center justify-center text-xl font-bold">
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </p>
    );

  const filteredTodos = todos.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && t.completed) ||
      (filterStatus === 'pending' && !t.completed);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const startIndex = (currentPage - 1) * todosPerPage;
  const currentTodos = filteredTodos.slice(startIndex, startIndex + todosPerPage);


  // Render UI (unchanged from your snippet)
  return (
    <div className="todo-container">
         <h1 className="text-2xl font-bold mb-4">Todo List</h1>

         <div className="flex gap-2 mb-4">
           <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "completed" | "pending")}
            className="border px-4 py-2 rounded"
            aria-label="Filter Todos"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <AddTodo />

        <ul className="space-y-2 max-w-xl mx-auto">
          {currentTodos.map((todo) => (
            <li key={todo.id} className="border p-2 rounded">
              {editingId === todo.id ? (
                <div className="flex justify-between items-center gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateTodo.mutate({ ...todo, title: editTitle });
                        setEditingId(null);
                      } else if (e.key === "Escape") {
                        setEditingId(null); // Cancel editing
                      }
                    }}
                    className="border px-2 py-1 rounded w-full"
                  />

                  <button
                    disabled={updateTodo.isPending}
                    onClick={() => {
                      updateTodo.mutate({ ...todo, title: editTitle });
                      setEditingId(null);
                    }}
                    className="text-green-600 text-sm disabled:opacity-50"
                  >
                    {updateTodo.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <a
                      href={`/todo-detail/${todo.id}`}
                      // href='./todo-detail'
                      className="font-medium hover:underline block"
                    >
                      {todo.title}
                    </a>
                    <span
                      className={
                        todo.completed
                          ? "text-green-600 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {todo.completed ? "Completed" : "Pending..."}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={!!todo.completed}
                      aria-label="Toggle Todo Completion"
                      onChange={() =>
                        updateTodo.mutate({
                          ...todo,
                          completed: !todo.completed,
                        })
                      }
                    />

                    <Edit
                      onClick={() => {
                        setEditingId(todo.id);
                        setEditTitle(todo.title);
                      }}
                      className="text-blue-500 cursor-pointer w-5 h-5 hover:text-blue-700"
                      size={18}
                      aria-label="Edit Todo"
                    />

                    <Trash
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-700"
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
  );
}


// "use client"

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { useState } from "react";
// import Pagination from "./layout";
// import AddTodo from "../components/add-todo";
// import { Edit, Trash, LoaderCircle } from "lucide-react";


// type Todo = {
//   userId: number;
//   id: number;
//   title: string;
//   completed: boolean;
// };


// function Todos() {
//   const queryClient = useQueryClient();
//   const [currentPage, setCurrentPage] = useState(1);
//   const todosPerPage = 10;

//   const startIndex = (currentPage - 1) * todosPerPage;
//   const endIndex = startIndex + todosPerPage;
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editTitle, setEditTitle] = useState("");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all"); // all | completed | pending



//   const updateTodo = useMutation({
//     mutationFn: (updatedTodo: Todo) =>
//       axios.put<Todo>(
//         `https://jsonplaceholder.typicode.com/todos/${updatedTodo.id}`,
//         updatedTodo
//       ),
//     onSuccess: (response) => {
//       const updated = response.data;

//       queryClient.setQueryData<Todo[]>(["todos"], (oldTodos = []) =>
//         oldTodos.map((todo: Todo) =>
//           todo.id === updated.id ? { ...todo, ...updated } : todo
//         )
//       );
//     },
//   });

//   const deleteTodo = useMutation<void, Error, number>({
//     mutationFn: (id: number) =>
//       axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`),
//     onSuccess: (_, id) => {
//       queryClient.setQueryData<Todo[]>(["todos"], (old = []) =>
//         old.filter((todo) => todo.id !== id)
//       );
//     },
//   });

//   const handleDelete = (id: number) => {
//     const confirmDelete = confirm("Delete this todo?");
//     if (!confirmDelete) return;

//     deleteTodo.mutate(id);
//   };

//   if (isLoading) return <p className="h-screen flex items-center justify-center text-xl font-bold">
//     Loading todos &nbsp;<LoaderCircle /> </p>;
//   if (isError && error instanceof Error) return <p className="h-screen flex items-center justify-center text-xl font-bold">
//     Error: {error.message}</p>;



//   const filteredTodos = todos.filter((todo) => {
//     const matchesSearch = todo.title
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     const matchesFilter =
//       filterStatus === "all"
//         ? true
//         : filterStatus === "completed"
//           ? todo.completed
//           : !todo.completed;

//     return matchesSearch && matchesFilter;
//   });

//   const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
//   const currentTodos = filteredTodos.slice(startIndex, endIndex);

//   return (
//     <>
//       <div className="todo-container">
//         <h1 className="text-2xl font-bold mb-4">Todo List</h1>

//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             placeholder="Search todos..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="border px-4 py-2 rounded w-full"
//           />

//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="border px-4 py-2 rounded"
//             aria-label="Filter Todos"
//           >
//             <option value="all">All</option>
//             <option value="completed">Completed</option>
//             <option value="pending">Pending</option>
//           </select>
//         </div>

//         <AddTodo />

//         <ul className="space-y-2 max-w-xl mx-auto">
//           {currentTodos.map((todo) => (
//             <li key={todo.id} className="border p-2 rounded">
//               {editingId === todo.id ? (
//                 <div className="flex justify-between items-center gap-2">
//                   <input
//                     type="text"
//                     value={editTitle}
//                     onChange={(e) => setEditTitle(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         updateTodo.mutate({ ...todo, title: editTitle });
//                         setEditingId(null);
//                       } else if (e.key === "Escape") {
//                         setEditingId(null); // Cancel editing
//                       }
//                     }}
//                     className="border px-2 py-1 rounded w-full"
//                   />

//                   <button
//                     disabled={updateTodo.isPending}
//                     onClick={() => {
//                       updateTodo.mutate({ ...todo, title: editTitle });
//                       setEditingId(null);
//                     }}
//                     className="text-green-600 text-sm disabled:opacity-50"
//                   >
//                     {updateTodo.isPending ? "Saving..." : "Save"}
//                   </button>
//                   <button
//                     onClick={() => setEditingId(null)}
//                     className="text-gray-500 text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <a
//                       href={`/todos/${todo.id}`}
//                       className="font-medium hover:underline block"
//                     >
//                       {todo.title}
//                     </a>
//                     <span
//                       className={
//                         todo.completed
//                           ? "text-green-600 text-sm"
//                           : "text-red-400 text-sm"
//                       }
//                     >
//                       {todo.completed ? "Completed" : "Pending..."}
//                     </span>
//                   </div>

//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="checkbox"
//                       checked={!!todo.completed}
//                       aria-label="Toggle Todo Completion"
//                       onChange={() =>
//                         updateTodo.mutate({
//                           ...todo,
//                           completed: !todo.completed,
//                         })
//                       }
//                     />

//                     <Edit
//                       onClick={() => {
//                         setEditingId(todo.id);
//                         setEditTitle(todo.title);
//                       }}
//                       className="text-blue-500 cursor-pointer w-5 h-5 hover:text-blue-700"
//                       size={18}
//                       aria-label="Edit Todo"
//                     />

//                     <Trash
//                       onClick={() => handleDelete(todo.id)}
//                       className="text-red-500 w-5 h-5 cursor-pointer hover:text-red-700"
//                     />
//                   </div>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>

//         <Pagination
//           totalPages={totalPages}
//           currentPage={currentPage}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </>
//   );
// }

// export default Todos;
// // Note: This code uses the JSONPlaceholder API for demonstration purposes.

// //  JSONPlaceholder Todo API
// // https://jsonplaceholder.typicode.com/
