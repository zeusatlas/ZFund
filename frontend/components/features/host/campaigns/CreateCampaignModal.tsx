"use client";

import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";
import { Plus, X, Loader2, Sparkles, Hash } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateProjectMutation,
  useProjectCategoriesQuery,
  useProjectsQuery,
  useNextCampaignCodeQuery,
  computeNextCampaignCode,
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

export function CreateCampaignDrawer({ onCreated }: Props) {
  const form = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [eventCode, setEventCode] = useState("1001");
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const { data: backendCategories = [], isLoading: categoriesLoading } = useProjectCategoriesQuery();
  const { data: existingProjects = [] } = useProjectsQuery();
  const nextCodeQuery = useNextCampaignCodeQuery(open);
  const createMutation = useCreateProjectMutation();

  const categoryOptions: CategoryOption[] = useMemo(() => {
    return backendCategories.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [backendCategories]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!createMutation.isPending) setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, createMutation.isPending]);

  const effectiveCode =
    eventCode || nextCodeQuery.data || computeNextCampaignCode(existingProjects);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  function openDrawer() {
    form.current?.reset();
    setSelectedCategory(null);
    setError("");
    setToday(new Date().toISOString().slice(0, 10));

    // Calculate next code based on last campaign code (fallback or cached server code)
    const fallbackCode = computeNextCampaignCode(existingProjects);
    setEventCode(nextCodeQuery.data || fallbackCode);
    nextCodeQuery.refetch();
    setOpen(true);
  }

  function closeDrawer() {
    if (createMutation.isPending) return;
    setOpen(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedCategory) {
      const msg = "Please select a category from the database.";
      setError(msg);
      toast.error(msg);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    // Use the auto-generated eventCode
    const code = String(effectiveCode || formData.get("eventCode") || "").trim();
    const goal = String(formData.get("goal") || "").trim();
    const startDate = String(formData.get("startDate") || "").trim();
    const closing = String(formData.get("closing") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (name.length < 2) {
      const msg = "Campaign name must be at least 2 characters.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!/^[0-9]{4}$/.test(code)) {
      const msg = "Campaign code must be a 4-digit number (e.g. 1001).";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(goal) || Number(goal) <= 0) {
      const msg = "Please enter a valid fundraising goal in GH₵ (up to 2 decimals).";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!startDate) {
      const msg = "Start date is required.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (startDate < today) {
      const msg = "Start date must be today or a future date.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (closing && closing < today) {
      const msg = "Closing date must be today or later.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (closing && startDate > closing) {
      const msg = "Start date cannot be after closing date.";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      const computedWelcome = location
        ? `Welcome to ${name} (${location}). Dial 1 to contribute.`
        : `Welcome to ${name}. Dial 1 to contribute.`;

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
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: closing ? `${closing}T23:59:59.000Z` : undefined,
        status: "DRAFT",
      };

      await createMutation.mutateAsync(payload);
      toast.success(
        `Campaign "${name}" created in Draft. You can now configure steps and submit for admin review!`
      );
      onCreated(name);
      closeDrawer();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiErr = err as any;
      const message =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "We couldn't save this campaign to the database. Please check your connection and try again.";
      setError(message);
      toast.error(message);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-steel"
      >
        <Plus size={18} aria-hidden="true" />
        Create campaign
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
          {/* Backdrop overlay */}
          <button
            type="button"
            aria-label="Close create campaign drawer"
            onClick={closeDrawer}
            className="fixed inset-0 h-full w-full cursor-default bg-midnight/55 backdrop-blur-[1px] transition-opacity duration-300"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-campaign-title"
              aria-describedby="create-campaign-description"
              className="flex w-screen max-w-4xl flex-col bg-stone-light text-navy shadow-2xl animate-drawer border-l border-navy/10"
            >
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Host Console</span>
                    <span className="text-xs text-steel">·</span>
                    <span className="text-xs font-medium text-steel">New Campaign</span>
                  </div>
                  <h2 id="create-campaign-title" className="text-2xl font-medium tracking-tight">
                    Create a campaign
                  </h2>
                  <p id="create-campaign-description" className="mt-1 text-sm leading-relaxed text-steel">
                    Register a new fundraising campaign into the database with its dedicated campaign code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close create campaign drawer"
                  className="shrink-0 rounded-lg p-2 text-steel hover:bg-stone transition-colors"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form ref={form} onSubmit={submit} className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-5 p-6">
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

                  {/* Campaign Code (Auto-generated & Not Editable) */}
                  <div className="rounded-xl border border-navy/10 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label htmlFor="new-campaign-code" className="text-sm font-medium flex items-center gap-1.5">
                        <Hash size={16} className="text-gold" />
                        Campaign code <span className="text-crimson">*</span>
                      </label>
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-navy">
                        <Sparkles size={11} className="text-gold" />
                        Auto-generated
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <input
                        required
                        type="text"
                        readOnly
                        id="new-campaign-code"
                        name="eventCode"
                        value={effectiveCode}
                        placeholder={nextCodeQuery.isLoading ? "Loading..." : "1001"}
                        className="w-36 cursor-not-allowed select-all rounded-lg border border-navy/20 bg-stone px-3 py-2 text-sm font-mono font-semibold tracking-wider text-navy shadow-inner focus:outline-none"
                        title="Auto-generated sequential campaign code (not editable)"
                      />
                      <div className="flex items-center gap-2 rounded-lg bg-navy/5 px-3 py-2 text-xs text-steel">
                        <span>Dial string:</span>
                        <span className="font-mono font-semibold text-navy">
                          *920*969*{effectiveCode || "____"}#
                        </span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-steel">
                      Auto-assigned 4-digit code (e.g. 1001, 1002) based on the last campaign code. Dialed on MTN, Telecel, or AT anywhere in Ghana.
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

                  {/* Goal */}
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

                  {/* Start Date & Closing Date */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="new-campaign-start" className="text-sm font-medium">
                        Start date <span className="text-crimson">*</span>
                      </label>
                      <input
                        required
                        type="date"
                        min={today}
                        max="9999-12-31"
                        id="new-campaign-start"
                        name="startDate"
                        defaultValue={today}
                        className={inputClass}
                        disabled={createMutation.isPending}
                      />
                      <p className="mt-1 text-[11px] text-steel">
                        Mandatory start date. Campaign is Upcoming until this date is reached.
                      </p>
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
                      <p className="mt-1 text-[11px] text-steel">
                        Optional deadline for contributions.
                      </p>
                    </div>
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
                </div>

                {/* Drawer Footer Actions */}
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-navy/10 bg-white p-5">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    disabled={createMutation.isPending}
                    className="rounded-xl border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:opacity-50 transition-colors"
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
            </aside>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateCampaignDrawer;
