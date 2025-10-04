#Todo App
Converson of a React Todo app with features including an API using Tanstack Query, Axios, and pagination to a Next.js project

##Features
- View, add, update, and delete todos (the change disappears after refreshing the page)
- Pagination (10 todos per page)
- Accessible and mobile-friendly layout

  
##Tech Stack
- Next.js
- TypeSccript
- React Router is swapped for App Router in Next.js
- Axios is replaced with the manual fetch method.
- JSONPlaceholder API (https://jsonplaceholder.typicode.com/)
  
##Challenges
- I couldn't get axios to work with Next.js, so i reverted to using the manual fetch method to fetch the todos from the API. I'm not sure if the issue is with Next.js configuration or me (as this is my first time using it)
Updating the todo list to display changes since the API only returns the same to-do even after updating. I had to directly pass the result inside the function but the changes only appear when the page is not getting refreshed. As soon as the page gets refreshed, it gets updated to display the same data from the API over and over

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

