import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import type { ReactNode } from "react";

export function PageIntro({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return <section className="page-intro"><Link href="/" className="kicker underline underline-offset-4">ZFund</Link><span className="kicker"> / {label}</span><h1>{title}</h1><p>{children}</p></section>;
}
export function PageSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="page-section"><h2>{title}</h2>{children}</section>;
}
export function PageCTA({ title, href, label }: { title: string; href: string; label: string }) {
  return <section className="wrap closing"><h2>{title}</h2><Link href={href} className="pill pill-dark mt-8">{label}<ArrowRight size={16} /></Link></section>;
}
export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  return <div className="faq">{items.map(({ question, answer }) => <details key={question}><summary>{question}<Plus size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>;
}
