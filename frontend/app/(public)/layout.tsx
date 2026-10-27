import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

/**
 * Shared layout for all public-facing marketing pages
 * (e.g. /about, /pricing, /blog, /contact).
 *
 * The main landing page (/) lives in app/page.tsx and
 * composes Navbar + Footer directly to avoid a route conflict.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-off-ink">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
