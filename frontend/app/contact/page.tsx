import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import LegalPage from "@/components/landing/LegalPage";
import ContactForm from "@/components/landing/ContactForm";
import { CONTACT } from "@/components/landing/contact-info";

export const metadata: Metadata = { title: "Contact us | RaiseFundz" };

const channels = [
  { icon: Phone, label: "Landline", ...CONTACT.landline },
  { icon: Phone, label: "Mobile", ...CONTACT.mobile },
  { icon: Mail, label: "Official email", ...CONTACT.email },
  { icon: MapPin, label: "Headquarters", display: CONTACT.address.display, note: CONTACT.address.note, href: undefined },
];

export default function ContactPage() {
  return (
    <LegalPage
      wide
      heroImage="/images/hero.jpg"
      eyebrow="Get in touch"
      title="Contact us"
      intro="Questions about hosting a campaign, a withdrawal, or something that isn't working? Reach the team the way that suits you."
    >
      <div className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-start">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight text-off-ink">A direct line to our team</h2>
          <p className="mt-1.5 text-[14px] text-graphite">Choose the way that works best for you.</p>
          <div className="mt-6 space-y-4">
            {channels.map(({ icon: Icon, label, display, note, href }) => (
              <div key={label} className="flex items-start gap-4 rounded-[22px] border border-ash/70 bg-white p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-parchment text-navy">
                  <Icon size={19} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-graphite">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="mt-0.5 inline-flex items-center gap-1.5 break-all text-[15px] font-bold text-off-ink hover:text-navy"
                    >
                      {display} <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <p className="mt-0.5 text-[15px] font-bold leading-snug text-off-ink">{display}</p>
                  )}
                  <p className="mt-1 text-[12px] text-graphite">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ContactForm />
      </div>
    </LegalPage>
  );
}
