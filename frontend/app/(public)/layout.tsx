import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

/**
 * Shared layout for all public-facing marketing pages.
 *
 * The landing page lives at /home, so the navbar and footer are
 * rendered once here for every public route.
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
