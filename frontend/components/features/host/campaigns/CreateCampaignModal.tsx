"use client";

import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";
import { Plus, X, PhoneCall, Loader2, Sparkles } from "lucide-react";
import {
  useCreateProjectMutation,
  useProjectCategoriesQuery,
} from "@/components/features/host/campaigns/use-campaigns";
import type { CreateProjectInput } from "@/lib/api/projects";
import Select from "react-select";
import { getSelectStyles } from "@/components/ui/selectStyles";

type Props = { onCreated: (name: string) => void };
const inputClass =
  "mt-2 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

interface CategoryOption {
  value: string;
  label: string;
}

function generateRandomCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function CreateCampaignModal({ onCreated }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [eventCode, setEventCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const { data: backendCategories = [], isLoading: categoriesLoading } = useProjectCategoriesQuery();
  const createMutation = useCreateProjectMutation();

  const categoryOptions: CategoryOption[] = useMemo(() => {
    return backendCategories.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [backendCategories]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  function showModal() {
    form.current?.reset();
    setSelectedCategory(null);
    setError("");
    setEventCode(generateRandomCode());
    setToday(new Date().toISOString().slice(0, 10));
    setOpen(true);
    dialog.current?.showModal();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedCategory) {
      setError("Please select a category from the database.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const code = String(formData.get("eventCode") || "").trim();
    const goal = String(formData.get("goal") || "").trim();
    const closing = String(formData.get("closing") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const welcomeMessage = String(formData.get("welcomeMessage") || "").trim();

    if (name.length < 2) {
      setError("Campaign name must be at least 2 characters.");
      return;
    }
    if (!/^[0-9]{3,10}$/.test(code)) {
      setError("USSD event code must be between 3 and 10 digits (e.g. 1042).");
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(goal) || Number(goal) <= 0) {
      setError("Please enter a valid fundraising goal in GH₵ (up to 2 decimals).");
      return;
    }
    if (closing && closing < today) {
      setError("Closing date must be today or later.");
      return;
    }

    try {
      const computedWelcome =
        welcomeMessage ||
        (location
          ? `Welcome to ${name} (${location}). Dial 1 to contribute.`
          : `Welcome to ${name}. Dial 1 to contribute.`);

      const payload: CreateProjectInput = {
        name,
        eventCode: code,
        currency: "GHS",
        targetAmount: Number(goal).toFixed(2),
        minAmount: "1.00",
        maxAmount: "50000.00",
        acceptsContributions: true,
        welcomeMessage: computedWelcome.slice(0, 120),
        description: description || undefined,
        categoryId: selectedCategory.value,
        endDate: closing ? `${closing}T23:59:59.000Z` : undefined,
      };

      await createMutation.mutateAsync(payload);
      onCreated(name);
      dialog.current?.close();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiErr = err as any;
      const message =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "We couldn't save this campaign to the database. Please check your connection and try again.";
      setError(message);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={showModal}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-steel"
      >
        <Plus size={18} aria-hidden="true" />
        Create campaign
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="create-campaign-title"
        aria-describedby="create-campaign-description"
        onClose={() => setOpen(false)}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border-0 bg-stone-light p-0 text-navy shadow-2xl backdrop:bg-midnight/60"
      >
        <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6">
          <div>
            <h2 id="create-campaign-title" className="text-2xl font-medium tracking-tight">
              Create a campaign
            </h2>
            <p id="create-campaign-description" className="mt-1 text-sm leading-relaxed text-steel">
              Register a new fundraising campaign into the database with its dedicated USSD shortcode.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close create campaign"
            className="shrink-0 rounded-lg p-2 text-steel hover:bg-stone"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form ref={form} onSubmit={submit} className="space-y-5 p-6">
          {/* Campaign Name */}
          <div>
            <label htmlFor="new-campaign-name" className="text-sm font-medium">
              Campaign name <span className="text-crimson">*</span>
            </label>
            <input
              autoFocus
              required
              minLength={2}
              maxLength={100}
              id="new-campaign-name"
              name="name"
              placeholder="e.g. Asankrangwa Community Water Project"
              className={inputClass}
              disabled={createMutation.isPending}
            />
          </div>

          {/* USSD Shortcode Generator / Input */}
          <div className="rounded-xl border border-navy/10 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="new-campaign-code" className="text-sm font-medium flex items-center gap-1.5">
                <PhoneCall size={16} className="text-gold" />
                USSD Event Code (Shortcode) <span className="text-crimson">*</span>
              </label>
              <button
                type="button"
                onClick={() => setEventCode(generateRandomCode())}
                className="inline-flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors"
                title="Generate another code"
                disabled={createMutation.isPending}
              >
                <Sparkles size={13} />
                Generate new code
              </button>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <input
                required
                type="text"
                pattern="^[0-9]{3,10}$"
                id="new-campaign-code"
                name="eventCode"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 1042"
                maxLength={10}
                minLength={3}
                className="w-36 rounded-lg border border-navy/20 bg-stone-light px-3 py-2 text-sm font-mono font-medium text-navy tracking-wider"
                disabled={createMutation.isPending}
              />
              <div className="flex items-center gap-2 rounded-lg bg-navy/5 px-3 py-2 text-xs text-steel">
                <span>Dial string:</span>
                <span className="font-mono font-semibold text-navy">
                  *920*969*{eventCode || "____"}#
                </span>
              </div>
            </div>
            <p className="mt-1.5 text-xs text-steel">
              Unique number dialed on MTN, Telecel, or AT anywhere in Ghana. Saved to the database.
            </p>
          </div>

          {/* Category & Location */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="new-campaign-category" className="text-sm font-medium">
                Category <span className="text-crimson">*</span>
              </label>
              <div className="mt-2">
                <Select<CategoryOption>
                  inputId="new-campaign-category"
                  instanceId="new-campaign-category-select"
                  value={selectedCategory}
                  onChange={(opt) => setSelectedCategory(opt)}
                  options={categoryOptions}
                  placeholder={categoriesLoading ? "Loading database categories..." : "Select a category"}
                  isClearable
                  isLoading={categoriesLoading}
                  styles={getSelectStyles<CategoryOption>({
                    minHeight: "42px",
                    borderColor: "rgba(11, 37, 69, 0.2)",
                  })}
                  aria-label="Category"
                  isDisabled={createMutation.isPending}
                />
              </div>
              <input type="hidden" name="category" value={selectedCategory?.value ?? ""} />
            </div>

            <div>
              <label htmlFor="new-campaign-location" className="text-sm font-medium">
                Town / City & Region
              </label>
              <input
                maxLength={120}
                id="new-campaign-location"
                name="location"
                placeholder="e.g. Ho, Volta Region"
                className={inputClass}
                disabled={createMutation.isPending}
              />
            </div>
          </div>

          {/* Goal & Closing Date */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="new-campaign-goal" className="text-sm font-medium">
                Fundraising goal (GH₵) <span className="text-crimson">*</span>
              </label>
              <input
                required
                type="number"
                min="1"
                max="100000000"
                step="0.01"
                inputMode="decimal"
                id="new-campaign-goal"
                name="goal"
                placeholder="25000.00"
                className={inputClass}
                disabled={createMutation.isPending}
              />
            </div>
            <div>
              <label htmlFor="new-campaign-closing" className="text-sm font-medium">
                Closing date (Optional)
              </label>
              <input
                type="date"
                min={today}
                max="9999-12-31"
                id="new-campaign-closing"
                name="closing"
                className={inputClass}
                disabled={createMutation.isPending}
              />
            </div>
          </div>

          {/* USSD Welcome Prompt */}
          <div>
            <label htmlFor="new-campaign-welcome" className="text-sm font-medium">
              USSD Welcome Message (Optional)
            </label>
            <input
              maxLength={120}
              id="new-campaign-welcome"
              name="welcomeMessage"
              placeholder="e.g. Welcome to Ho Borehole Fund. Dial 1 to donate."
              className={inputClass}
              disabled={createMutation.isPending}
            />
            <p className="mt-1 text-xs text-steel">
              Displayed on donor&apos;s handset upon dialing the shortcode (max 120 chars).
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="new-campaign-description" className="text-sm font-medium">
              Campaign description
            </label>
            <textarea
              maxLength={2000}
              rows={3}
              id="new-campaign-description"
              name="description"
              placeholder="Who will benefit, what will the funds cover, and why does this campaign matter?"
              className={inputClass + " resize-y"}
              disabled={createMutation.isPending}
            />
            <p className="mt-1 text-xs text-steel">Up to 2,000 characters.</p>
          </div>

          {/* Status info */}
          <p className="rounded-xl bg-gold/10 p-3 text-xs leading-relaxed text-steel">
            New campaigns are saved directly to PostgreSQL as Draft projects with payment methods configured.
          </p>

          {/* Error Message */}
          {error && (
            <p
              ref={errorRef}
              tabIndex={-1}
              role="alert"
              className="rounded-xl border border-crimson/20 bg-white p-3 text-sm text-crimson"
            >
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-navy/10 pt-5">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              disabled={createMutation.isPending}
              className="rounded-xl border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving to database...
                </>
              ) : (
                "Create campaign"
              )}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
