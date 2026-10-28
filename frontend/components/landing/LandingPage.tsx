import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import MarketingMotion from "@/components/landing/MarketingMotion";
import LandingHero from "@/components/landing/LandingHero";
import LandingOverview from "@/components/landing/LandingOverview";
import LandingTrust from "@/components/landing/LandingTrust";
import LandingStepsAndFAQ from "@/components/landing/LandingStepsAndFAQ";
import "@/components/landing/marketing.css";

export default function LandingPage() {
  return (
    <MarketingMotion className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <LandingHero />
        <LandingOverview />
        <LandingStepsAndFAQ />
        <LandingTrust />
      </main>
      <Footer />
    </MarketingMotion>
  );
}
