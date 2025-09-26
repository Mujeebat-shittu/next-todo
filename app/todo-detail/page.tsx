"use client";

import { useParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function TodoDetail() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todo", id],
    queryFn: async () => {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p className='h-screen flex items-center justify-center text-xl font-bold'>
    Loading todo detail...</p>;
  if (isError) return <p className='h-screen flex items-center justify-center text-xl font-bold'>{error.message}</p>;


  return (
    <div className="p-4 flex justify-center items-center flex-col h-screen text-center">
      <h1 className="text-3xl font-bold mb-2">Todo Detail</h1>
      <p><strong>ID:</strong> {data.id}</p>
      <p><strong>Title:</strong> {data.title}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={data.completed ? "text-green-600" : "text-red-400"}>
          {data.completed ? "Completed" : "Pending..."}
        </span>
      </p>
    </div>
  );
}