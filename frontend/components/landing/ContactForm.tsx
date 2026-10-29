"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { SUPPORT_EMAIL } from "@/components/landing/contact-info";

const TOPICS = [
  "Hosting a campaign",
  "Donations & USSD",
  "Withdrawals & payouts",
  "Account & login",
  "Partnerships",
  "Something else",
];

const field =
  "mt-2 w-full rounded-xl border border-ash bg-white px-4 py-3 text-[14px] font-normal text-off-ink outline-none transition-colors placeholder:text-smoke focus:border-navy focus:ring-2 focus:ring-navy/10";
const label = "block text-[13px] font-semibold text-off-ink";
const required = <span className="text-crimson"> *</span>;

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").trim();
    const subject = encodeURIComponent(`${data.get("topic")} — ${data.get("name")}`);
    const body = encodeURIComponent(
      `${data.get("message")}\n\n— ${data.get("name")}\n${data.get("email")}${phone ? `\n${phone}` : ""}`,
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[28px] border border-ash/70 bg-white p-7 shadow-lg sm:p-9"
    >
      <p className="text-eyebrow text-lime-dark">Start a conversation</p>
      <h2 className="mt-2 text-[26px] font-bold tracking-tight text-off-ink">How can we help?</h2>
      <p className="mt-1.5 text-[14px] text-graphite">
        Share a few details and prepare an email to our support team.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Full name{required}
          <input name="name" required autoComplete="name" placeholder="Your full name" className={field} />
        </label>
        <label className={label}>
          Email address{required}
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
        </label>
        <label className={label}>
          Phone number <span className="font-normal text-graphite">(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="e.g. +233 24 123 4567" className={field} />
        </label>
        <label className={label}>
          What is this about?
          <select name="topic" defaultValue={TOPICS[0]} className={field}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={`${label} sm:col-span-2`}>
          Your message{required}
          <textarea
            name="message"
            required
            rows={6}
            placeholder="Tell us about your campaign or the question you need help with…"
            className={`${field} resize-y`}
          />
        </label>
      </div>

      <p className="mt-6 text-[12px] text-graphite">
        Required fields are marked *. Your email app will open so you can review and send your message.
      </p>
      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-off-ink py-4 text-[15px] font-bold text-white transition-all hover:bg-navy"
      >
        <Send size={16} /> Open email draft
      </button>
      {sent && (
        <p role="status" className="mt-3 text-[13px] text-graphite">
          If your email app didn&apos;t open, write to {SUPPORT_EMAIL}.
        </p>
      )}
    </form>
  );
}
