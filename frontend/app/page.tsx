import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-stone">
      <h1 className="text-3xl font-semibold text-navy">ZFund</h1>
      <Link
        href="/dashboard"
        className="rounded-md bg-navy px-5 py-2.5 font-medium text-stone transition-colors hover:bg-steel"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
