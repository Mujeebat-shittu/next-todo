// components/AddTodo.tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export default function AddTodo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const addTodo = useMutation({
    mutationFn: async (newTodo: Omit<Todo, 'id'>) => {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) throw new Error('Failed to add todo');
      return res.json(); // server returns the created todo
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [
        created,
        ...old,
      ]);
      setTitle('');
    },
  });


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo.mutate(
      { title, completed: false, userId: 1 },
      { onSuccess: () => { setTitle(''); setModalOpen(false); } }
    );
  };

  return (
    <>
      {/* Button to open modal */}
      {/* Modal JSX remains the same – just replace your axios endpoints */}

      <button
        aria-label="Open Add Todo Modal"
        type="button"
        onClick={() => modalOpen}
        className="bg-[#444] :hover-bg-gray-400 my-3 mx-auto text-white px-4 py-2 rounded flex items-center justify-center"
      >
        Add Todo
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setModalOpen(false)}
        >
          <dialog
            open
            className="bg-white dark:bg-[#444] py-8 px-6 rounded-xl shadow-lg max-w-[300px] md:max-w-md  mx-auto text-gray-900 dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new todo"
                className="border px-4 py-2 rounded w-full bg-gray-300 text-black mb-4 border-none"
              />
              <button
                type="submit"
                className="border px-4 py-2 rounded w-full bg-gray-300 text-gray-700 disabled:opacity-50"
                disabled={addTodo.isPending}
              >
                {addTodo.isPending ? "Adding..." : "Add Todo"}
              </button>
            </form>
          </dialog>
        </div>
      )}
    </>
  );
}


// "use client"

// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";



// type Todo = {
//   userId: number;
//   id: number;
//   title: string;
//   completed: boolean;
// };

// function AddTodo() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const queryClient = useQueryClient();

//   const openModal = function () {
//     setModalOpen(true);
//   };


//   const addTodo = useMutation({
//     mutationFn: (newTodo: Omit<Todo, "id">) =>
//       axios.post("https://jsonplaceholder.typicode.com/todos", newTodo),
//     onSuccess: (response) => {
//       const newTodo = {
//         ...response.data,
//         id: crypto.randomUUID(), // browser handles it
//         completed: false,
//       };


//       queryClient.setQueryData<Todo[]>(["todos"], (old = []) => [newTodo, ...old]);

//       setTitle("");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!title.trim()) return;

//     addTodo.mutate({
//       title,
//       completed: false,
//       userId: 1,
//     },
//       {
//         onSuccess: () => {
//           setTitle("");
//           setModalOpen(false);
//         },
//       }
//     );
//   };

//   return (
//     <>
//       <button
//         aria-label="Open Add Todo Modal"
//         type="button"
//         onClick={openModal}
//         className="bg-[#444] :hover-bg-gray-400 my-3 mx-auto text-white px-4 py-2 rounded flex items-center justify-center"
//       >
//         Add Todo
//       </button>

//       {modalOpen && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40"
//           onClick={() => setModalOpen(false)}
//         >
//           <dialog
//             open
//             className="bg-white dark:bg-[#444] py-8 px-6 rounded-xl shadow-lg max-w-[300px] md:max-w-md  mx-auto text-gray-900 dark:text-white"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <form onSubmit={handleSubmit} className="">
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Add a new todo"
//                 className="border px-4 py-2 rounded w-full bg-gray-300 text-black mb-4 border-none"
//               />
//               <button
//                 type="submit"
//                 className="border px-4 py-2 rounded w-full bg-gray-300 text-gray-700 disabled:opacity-50"
//                 disabled={addTodo.isPending}
//               >
//                 {addTodo.isPending ? "Adding..." : "Add Todo"}
//               </button>
//             </form>
//           </dialog>
//         </div>
//       )}
//     </>
//   );
// }
// export default AddTodo;
