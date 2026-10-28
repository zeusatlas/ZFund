"use client";

import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";
import { X, Loader2, Hash, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  useUpdateProjectMutation,
  useProjectCategoriesQuery,
} from "@/components/features/host/campaigns/use-campaigns";
import type { UpdateProjectInput } from "@/lib/api/projects";
import type { Campaign } from "@/components/features/host/shared/demo";
import Select from "react-select";
import { getSelectStyles } from "@/components/ui/selectStyles";

type Props = {
  campaign: Campaign | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (name: string) => void;
};

const inputClass =
  "mt-2 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";

interface CategoryOption {
  value: string;
  label: string;
}

export function EditCampaignDrawer({ campaign, open, onClose, onUpdated }: Props) {
  const form = useRef<HTMLFormElement>(null);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [userSelectedCategory, setUserSelectedCategory] = useState<CategoryOption | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const { data: backendCategories = [], isLoading: categoriesLoading } = useProjectCategoriesQuery();
  const updateMutation = useUpdateProjectMutation();

  const categoryOptions: CategoryOption[] = useMemo(() => {
    return backendCategories.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [backendCategories]);

  const matchedCategory = useMemo(() => {
    if (!campaign) return null;
    const matched = categoryOptions.find(
      (opt) => opt.label.toLowerCase() === campaign.category?.toLowerCase()
    );
    if (matched) return matched;
    if (categoryOptions.length > 0 && campaign.category) {
      return { value: campaign.category, label: campaign.category };
    }
    return null;
  }, [campaign, categoryOptions]);

  const selectedCategory = userSelectedCategory !== null ? userSelectedCategory : matchedCategory;

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
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  if (!open || !campaign) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!campaign) return;
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const goal = String(formData.get("goal") || "").trim();
    const closing = String(formData.get("closing") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const welcomeMessage = String(formData.get("welcomeMessage") || "").trim();

    if (name.length < 2) {
      const msg = "Campaign name must be at least 2 characters.";
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
    if (closing && closing < today) {
      const msg = "Closing date must be today or later.";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      const computedWelcome =
        welcomeMessage ||
        (location
          ? `Welcome to ${name} (${location}). Dial 1 to contribute.`
          : `Welcome to ${name}. Dial 1 to contribute.`);

      const payload: UpdateProjectInput = {
        name,
        targetAmount: Number(goal).toFixed(2),
        welcomeMessage: computedWelcome.slice(0, 120),
        description: description || undefined,
        categoryId: selectedCategory?.value || undefined,
        endDate: closing ? `${closing}T23:59:59.000Z` : undefined,
      };

      await updateMutation.mutateAsync({ id: campaign.id, input: payload });
      toast.success(`Campaign "${name}" updated successfully!`);
      onUpdated(name);
      onClose();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiErr = err as any;
      const message =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "We couldn't save changes to this campaign. Please check your connection and try again.";
      setError(message);
      toast.error(message);
    }
  }

  const initialGoalInCedis = campaign.goal ? (campaign.goal / 100).toFixed(2) : "";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
      {/* Backdrop overlay */}
      <button
        type="button"
        aria-label="Close edit campaign drawer"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-midnight/55 backdrop-blur-[1px] transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-campaign-title"
          aria-describedby="edit-campaign-description"
          className="flex w-screen max-w-xl flex-col bg-stone-light text-navy shadow-2xl animate-drawer border-l border-navy/10"
        >
          {/* Drawer Header */}
          <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Host Console</span>
                <span className="text-xs text-steel">·</span>
                <span className="inline-flex items-center gap-1 rounded bg-stone px-2 py-0.5 text-xs font-medium text-navy">
                  <Pencil size={11} /> Edit Draft
                </span>
              </div>
              <h2 id="edit-campaign-title" className="text-2xl font-medium tracking-tight">
                Edit campaign
              </h2>
              <p id="edit-campaign-description" className="mt-1 text-sm leading-relaxed text-steel">
                Modify draft campaign details before publishing to the USSD network.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close edit campaign drawer"
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
                <label htmlFor="edit-campaign-name" className="text-sm font-medium">
                  Campaign name <span className="text-crimson">*</span>
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  id="edit-campaign-name"
                  name="name"
                  defaultValue={campaign.name}
                  placeholder="e.g. Asankrangwa Community Water Project"
                  className={inputClass}
                  disabled={updateMutation.isPending}
                />
              </div>

              {/* Campaign Code (Auto-generated & Not Editable) */}
              <div className="rounded-xl border border-navy/10 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="edit-campaign-code" className="text-sm font-medium flex items-center gap-1.5">
                    <Hash size={16} className="text-gold" />
                    Campaign code
                  </label>
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy/5 px-2.5 py-0.5 text-[11px] font-semibold text-navy">
                    Assigned code
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    id="edit-campaign-code"
                    value={campaign.eventCode || "—"}
                    className="w-36 cursor-not-allowed select-all rounded-lg border border-navy/20 bg-stone px-3 py-2 text-sm font-mono font-semibold tracking-wider text-navy shadow-inner focus:outline-none"
                    title="Assigned campaign code (cannot be changed)"
                  />
                  {campaign.eventCode && (
                    <div className="flex items-center gap-2 rounded-lg bg-navy/5 px-3 py-2 text-xs text-steel">
                      <span>Dial string:</span>
                      <span className="font-mono font-semibold text-navy">
                        *920*969*{campaign.eventCode}#
                      </span>
                    </div>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-steel">
                  Permanent 4-digit code tied to this campaign on Ghana&apos;s mobile money network.
                </p>
              </div>

              {/* Category & Location */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-campaign-category" className="text-sm font-medium">
                    Category
                  </label>
                  <div className="mt-2">
                    <Select<CategoryOption>
                      inputId="edit-campaign-category"
                      instanceId="edit-campaign-category-select"
                      value={selectedCategory}
                      onChange={(opt) => setUserSelectedCategory(opt)}
                      options={categoryOptions}
                      placeholder={categoriesLoading ? "Loading categories..." : "Select a category"}
                      isClearable
                      isLoading={categoriesLoading}
                      styles={getSelectStyles<CategoryOption>({
                        minHeight: "42px",
                        borderColor: "rgba(11, 37, 69, 0.2)",
                      })}
                      aria-label="Category"
                      isDisabled={updateMutation.isPending}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-campaign-location" className="text-sm font-medium">
                    Town / City & Region
                  </label>
                  <input
                    maxLength={120}
                    id="edit-campaign-location"
                    name="location"
                    defaultValue={campaign.location || ""}
                    placeholder="e.g. Ho, Volta Region"
                    className={inputClass}
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>

              {/* Goal & Closing Date */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-campaign-goal" className="text-sm font-medium">
                    Fundraising goal (GH₵) <span className="text-crimson">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="100000000"
                    step="0.01"
                    inputMode="decimal"
                    id="edit-campaign-goal"
                    name="goal"
                    defaultValue={initialGoalInCedis}
                    placeholder="25000.00"
                    className={inputClass}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <div>
                  <label htmlFor="edit-campaign-closing" className="text-sm font-medium">
                    Closing date (Optional)
                  </label>
                  <input
                    type="date"
                    min={today}
                    max="9999-12-31"
                    id="edit-campaign-closing"
                    name="closing"
                    defaultValue={campaign.closing ? campaign.closing.slice(0, 10) : ""}
                    className={inputClass}
                    disabled={updateMutation.isPending}
                  />
                </div>
              </div>

              {/* USSD Welcome Prompt */}
              <div>
                <label htmlFor="edit-campaign-welcome" className="text-sm font-medium">
                  USSD Welcome Message (Optional)
                </label>
                <input
                  maxLength={120}
                  id="edit-campaign-welcome"
                  name="welcomeMessage"
                  defaultValue={campaign.location ? `Welcome to ${campaign.name}. Dial 1 to donate.` : ""}
                  placeholder="e.g. Welcome to Ho Borehole Fund. Dial 1 to donate."
                  className={inputClass}
                  disabled={updateMutation.isPending}
                />
                <p className="mt-1 text-xs text-steel">
                  Displayed on handset upon dialing the campaign code (max 120 chars).
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="edit-campaign-description" className="text-sm font-medium">
                  Campaign description
                </label>
                <textarea
                  maxLength={2000}
                  rows={3}
                  id="edit-campaign-description"
                  name="description"
                  defaultValue={campaign.description}
                  placeholder="Who will benefit, what will the funds cover, and why does this campaign matter?"
                  className={inputClass + " resize-y"}
                  disabled={updateMutation.isPending}
                />
                <p className="mt-1 text-xs text-steel">Up to 2,000 characters.</p>
              </div>

              {/* Status info */}
              <p className="rounded-xl bg-gold/10 p-3 text-xs leading-relaxed text-steel">
                Changes will be saved to the database. This campaign is currently in <strong>Draft</strong> status and has not yet been published to live dialers.
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
                onClick={onClose}
                disabled={updateMutation.isPending}
                className="rounded-xl border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:opacity-50 transition-colors"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving changes...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}

export default EditCampaignDrawer;

