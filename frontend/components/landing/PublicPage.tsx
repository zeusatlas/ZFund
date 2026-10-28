import Link from "next/link";
import type { ReactNode } from "react";

export function PageIntro({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:py-28">
        <Link href="/home" className="mb-10 inline-block text-sm text-graphite underline underline-offset-4">RaiseFundz / {label}</Link>
        <h1 className="max-w-4xl text-[clamp(40px,6vw,76px)] font-medium leading-[1.02] tracking-[-0.035em]">{title}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-graphite">{children}</p>
      </div>
    </section>
  );
}

export function PageSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-24">
      <h2 className="mb-10 max-w-2xl text-3xl font-medium leading-tight tracking-tight md:text-4xl">{title}</h2>
      {children}
    </section>
  );
}

export function PageCTA({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <section className="bg-lime">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-xl text-3xl font-medium tracking-tight md:text-4xl">{title}</h2>
        <Link href={href} className="shrink-0 rounded-full border border-off-ink px-6 py-3 font-medium transition-colors hover:bg-off-ink hover:text-white">{label}</Link>
      </div>
    </section>
  );
}

export function FAQ({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="max-w-3xl divide-y divide-ash border-y border-ash">
      {items.map(({ question, answer }) => (
        <details key={question} className="group py-6">
          <summary className="cursor-pointer text-lg font-medium">{question}</summary>
          <p className="mt-4 max-w-2xl leading-relaxed text-graphite">{answer}</p>
        </details>
      ))}
    </div>
  );
}
