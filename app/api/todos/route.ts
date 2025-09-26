// app/api/todos/route.ts
import { NextResponse } from 'next/server';

const EXTERNAL_URL = 'https://jsonplaceholder.typicode.com/todos';

export async function GET() {
  const res = await fetch(EXTERNAL_URL);
  if (!res.ok) {
    return NextResponse.json(
      { error: `FAILED: ${res.status} ${res.statusText}` },
      { status: 500 }
    );
  }
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const json = await req.json();
  const res = await fetch(EXTERNAL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(json),
  });

  const body = await res.json();
  return NextResponse.json(body, { status: res.status });
}

export async function PUT(req: Request) {
  const { id, ...body } = await req.json();
  const res = await fetch(`${EXTERNAL_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: Request) {
  const { id } = await req.json(); // or read from pathname if you prefer
  const res = await fetch(`${EXTERNAL_URL}/${id}`, { method: 'DELETE' });
  return NextResponse.json(
    { success: res.ok },
    { status: res.ok ? 200 : 500 }
  );
}


// // app/api/todos/route.ts
// import { NextResponse } from 'next/server';
// import axios from 'axios';

// const EXTERNAL_URL = 'https://jsonplaceholder.typicode.com/todos';


// //  * GET  /api/todos   → return the whole list
// //  * POST /api/todos   → create a new todo

// export async function GET() {
//   try {
//     const { data } = await axios.get(EXTERNAL_URL);
//     return NextResponse.json(data);
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message ?? 'Failed to fetch todos' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const todo = await req.json();          // { title, completed, userId }
//     const { data } = await axios.post(EXTERNAL_URL, todo);
//     return NextResponse.json(data, { status: 201 });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message ?? 'Failed to create todo' },
//       { status: 500 }
//     );
//   }
// }
