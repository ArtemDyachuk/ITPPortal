import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Welcome to ITP Portal
        </h1>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
