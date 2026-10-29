"use client";

import { useState, type FormEvent, type FormEventHandler } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { api, type ApiError } from "@/lib/api/client";
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
const fieldInvalid = "border-crimson focus:border-crimson focus:ring-crimson/15";
const label = "block text-[13px] font-semibold text-off-ink";
const MIN_MESSAGE_LENGTH = 10;
const required = <span className="text-crimson"> *</span>;

type Errors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

/** Mirrors the API's validation so people get instant feedback; the API re-checks everything. */
function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address";
  if (phone && !/^[+\d\s()-]+$/.test(phone)) errors.phone = "Phone number may only contain digits, spaces, + ( ) -";
  if (message.length < MIN_MESSAGE_LENGTH) errors.message = `Please tell us a little more (at least ${MIN_MESSAGE_LENGTH} characters)`;
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} role="alert" className="block text-[12px] font-medium text-crimson">
      {message}
    </span>
  );
}

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [messageLength, setMessageLength] = useState(0);

  // Clear a field's error as soon as the person edits it.
  const clearError: FormEventHandler<HTMLFormElement> = (event) => {
    const target = event.target as HTMLInputElement;
    const name = target.name as keyof Errors;
    if (name === "message") setMessageLength(target.value.trim().length);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    setErrors({});

    setSending(true);
    api
      .post("/contact", {
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        topic: data.get("topic"),
        message: data.get("message"),
        website: data.get("website"), // honeypot, left empty by real visitors
      })
      .then(() => {
        form.reset();
        setMessageLength(0);
        toast.success("Message sent", { description: "Thank you, we'll be in touch soon." });
      })
      .catch((error: ApiError) => {
        // Validation problems from the API belong next to their fields, not in a toast.
        const fieldErrors: Errors = {};
        for (const [fieldName, messages] of Object.entries(error.errors ?? {})) {
          if (["name", "email", "phone", "message"].includes(fieldName) && messages[0]) {
            fieldErrors[fieldName as keyof Errors] = messages[0];
          }
        }
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          return;
        }
        toast.error(error.message || "Something went wrong sending your message.", {
          description: `You can also write to ${SUPPORT_EMAIL}.`,
        });
      })
      .finally(() => setSending(false));
  }

  return (
    <form
      onSubmit={onSubmit}
      onInput={clearError}
      noValidate
      className="rounded-[28px] border border-ash/70 bg-white p-7 shadow-xs sm:p-9"
    >
      <p className="text-eyebrow text-lime-dark">Start a conversation</p>
      <h2 className="mt-2 text-[26px] font-bold tracking-tight text-off-ink">How can we help?</h2>
      <p className="mt-1.5 text-[14px] text-graphite">
        Share a few details and our support team will get back to you.
      </p>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Full name{required}
          <input
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "err-name" : undefined}
            className={`${field} ${errors.name ? fieldInvalid : ""}`}
          />
          <FieldError id="err-name" message={errors.name} />
        </label>
        <label className={label}>
          Email address{required}
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "err-email" : undefined}
            className={`${field} ${errors.email ? fieldInvalid : ""}`}
          />
          <FieldError id="err-email" message={errors.email} />
        </label>
        <label className={label}>
          Phone number <span className="font-normal text-graphite">(optional)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. +233 24 123 4567"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "err-phone" : undefined}
            className={`${field} ${errors.phone ? fieldInvalid : ""}`}
          />
          <FieldError id="err-phone" message={errors.phone} />
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
            rows={6}
            minLength={MIN_MESSAGE_LENGTH}
            placeholder="Tell us about your campaign or the question you need help with…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "err-message" : undefined}
            className={`${field} resize-y ${errors.message ? fieldInvalid : ""}`}
          />
          <span className="mt-1.5 flex items-start justify-between gap-3">
            {errors.message ? (
              <FieldError id="err-message" message={errors.message} />
            ) : (
              <span className="text-[12px] font-normal text-graphite">
                Minimum {MIN_MESSAGE_LENGTH} characters
              </span>
            )}
            <span
              className={`shrink-0 text-[12px] font-normal tabular-nums ${
                messageLength >= MIN_MESSAGE_LENGTH ? "text-success" : "text-graphite"
              }`}
            >
              {messageLength}/{MIN_MESSAGE_LENGTH}+
            </span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-4 flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-off-ink py-4 text-[15px] font-bold text-white transition-all hover:bg-navy disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send size={16} /> Submit
          </>
        )}
      </button>
    </form>
  );
}
