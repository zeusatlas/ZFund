import Image from "next/image";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import MarketingMotion from "@/components/landing/MarketingMotion";
import "@/components/landing/marketing.css";

export default function LegalPage({
  eyebrow,
  title,
  intro,
  heroImage,
  wide = false,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Optional background photo for the hero (shown under a navy overlay). */
  heroImage?: string;
  /** Use the wider content column (for page layouts rather than long-form text). */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <MarketingMotion className="flex min-h-screen flex-col">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className={`relative overflow-hidden bg-navy text-white ${heroImage ? "py-24 md:py-28" : "py-20"}`}>
          {heroImage && (
            <>
              <Image
                src={heroImage}
                alt=""
                aria-hidden="true"
                fill
                priority
                sizes="100vw"
                className="pointer-events-none select-none object-cover object-[center_20%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-navy/80" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/70 to-navy/30" />
            </>
          )}
          <div className={`relative mx-auto px-6 ${wide ? "max-w-[1100px]" : "max-w-[860px]"}`}>
            <p className="text-eyebrow text-lime">{eyebrow}</p>
            <h1 className="mt-3 text-[clamp(36px,5vw,56px)] font-bold leading-[1.05] tracking-[-1.5px]">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70">{intro}</p>
          </div>
        </section>
        <section className={wide ? "bg-parchment py-16" : "bg-white py-16"}>
          <div className={`mx-auto px-6 ${wide ? "max-w-[1100px]" : "max-w-[860px]"}`}>{children}</div>
        </section>
      </main>
      <Footer />
    </MarketingMotion>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-ash/70 py-8 first:pt-0 last:border-b-0">
      <h2 className="mb-3 text-[22px] font-bold tracking-tight text-off-ink">{heading}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-graphite [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
