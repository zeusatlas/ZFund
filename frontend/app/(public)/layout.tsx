import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import MarketingMotion from "@/components/landing/MarketingMotion";
import "@/components/landing/marketing.css";

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
    <MarketingMotion className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">Skip to content</a><Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </MarketingMotion>
  );
}
