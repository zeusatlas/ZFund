import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import MarketingMotion from "@/components/landing/MarketingMotion";
import "@/components/landing/marketing.css";

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
    <MarketingMotion className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">Skip to content</a><Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </MarketingMotion>
  );
}
