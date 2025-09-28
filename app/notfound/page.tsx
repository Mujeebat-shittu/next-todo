import Link from "next/link";


export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
        <p className="mt-4 text-gray-400">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Go back home
        </Link>
      </div>
    </div>
  );
}
