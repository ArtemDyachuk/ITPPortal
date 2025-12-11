import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Login
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8 text-center">
          Proof of Concept - No authentication required
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            disabled
          />

          <Link href="/events-map" className="block">
            Login
          </Link>

          <Link href="/" className="block text-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mt-4">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
