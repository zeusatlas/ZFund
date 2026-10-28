import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import LandingHero from "@/components/landing/LandingHero";
import LandingOverview from "@/components/landing/LandingOverview";
import LandingTrust from "@/components/landing/LandingTrust";

export default function LandingPage() {
  return (
    <div className="bg-white text-off-ink">
      <Navbar />
      <LandingHero />
      <LandingOverview />
      <LandingTrust />
      <Footer />
    </div>
  );
}
