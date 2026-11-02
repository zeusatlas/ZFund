"use client";

import { useMemo, useState, type FormEvent } from "react";
import Select from "react-select";
import { Loader2, Pencil, Hash, UserRound } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { getSelectStyles } from "@/components/ui/selectStyles";
import { useProjectCategoriesQuery } from "@/components/features/host/campaigns/use-campaigns";
import {
  getProjectById,
  updateProject,
  uploadProjectCoverImage,
  type BackendProject,
  type ProjectStatus,
  type UpdateProjectInput,
} from "@/lib/api/projects";
import { campaignImageSrc } from "@/lib/api/public";
import WebPortalOptions from "@/components/features/host/campaigns/WebPortalOptions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminRoot, type Fund } from "../admin-api";

type Option = { value: string; label: string };

type Props = {
  campaign: Fund;
  onClose: () => void;
  onUpdated: (campaign: BackendProject) => void;
};

const inputClass =
  "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none disabled:opacity-60";

const selectStyles = getSelectStyles<Option>({ minHeight: "42px", borderColor: "rgba(11, 37, 69, 0.2)" });

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "PUBLISHED", label: "Published (Live on USSD)" },
  { value: "APPROVED", label: "Approved" },
  { value: "SCHEDULED", label: "Upcoming / Scheduled" },
  { value: "PENDING_REVIEW", label: "Pending Review" },
  { value: "REJECTED", label: "Rejected" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "DRAFT", label: "Draft" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function AdminEditCampaignModal({ campaign, onClose, onUpdated }: Readonly<Props>) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [userCategory, setUserCategory] = useState<Option | null>(null);
  const [userStatus, setUserStatus] = useState<Option | null>(null);
  const [userWebPortal, setUserWebPortal] = useState<boolean | null>(null);
  const [userShowPublic, setUserShowPublic] = useState<boolean | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useProjectCategoriesQuery();

  const { data: projectData, isLoading: loadingDetails } = useQuery({
    queryKey: ["campaign", campaign.id, "details"],
    queryFn: () => getProjectById(campaign.id),
  });

  const categoryOptions: Option[] = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  const selectedCategory = useMemo(() => {
    if (userCategory !== null) return userCategory;
    if (projectData?.category) {
      return { value: projectData.category.id, label: projectData.category.name };
    }
    if (projectData?.categoryId && categoryOptions.length > 0) {
      return categoryOptions.find((c) => c.value === projectData.categoryId) || null;
    }
    return null;
  }, [userCategory, projectData, categoryOptions]);

  const selectedStatus = useMemo(() => {
    if (userStatus !== null) return userStatus;
    const current = projectData?.status || (campaign.status as ProjectStatus);
    return STATUS_OPTIONS.find((s) => s.value === current) || STATUS_OPTIONS[0];
  }, [userStatus, projectData?.status, campaign.status]);

  const enableWebPortal = useMemo(() => {
    if (userWebPortal !== null) return userWebPortal;
    return Boolean(projectData?.settings?.webPortalEnabled ?? campaign.settings?.webPortalEnabled);
  }, [userWebPortal, projectData?.settings?.webPortalEnabled, campaign.settings?.webPortalEnabled]);

  const showPublicTransactions = useMemo(() => {
    if (userShowPublic !== null) return userShowPublic;
    return Boolean(projectData?.settings?.showPublicTransactions ?? campaign.settings?.showPublicTransactions);
  }, [userShowPublic, projectData?.settings?.showPublicTransactions, campaign.settings?.showPublicTransactions]);

  const savedCoverImage = (projectData?.settings?.coverImage ?? campaign.settings?.coverImage) as string | undefined;
  const currentImageUrl = savedCoverImage
    ? campaignImageSrc(`/public/campaign-images/${savedCoverImage}`)
    : null;

  function fail(message: string) {
    setError(message);
    toast.error(message);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const goal = String(form.get("goal") || "").trim();
    const startDate = String(form.get("startDate") || "").trim();
    const closing = String(form.get("closing") || "").trim();
    const location = String(form.get("location") || "").trim();
    const description = String(form.get("description") || "").trim();
    const commission = String(form.get("commission") || "").trim();
    const welcomeMessageInput = String(form.get("welcomeMessage") || "").trim();
    const acceptsContributions = form.get("acceptsContributions") === "on";

    if (name.length < 2) return fail("Campaign name must be at least 2 characters.");
    if (!/^\d+(\.\d{1,2})?$/.test(goal) || Number(goal) <= 0) {
      return fail("Please enter a valid fundraising goal in GH₵ (up to 2 decimals).");
    }
    if (closing && startDate && startDate > closing) {
      return fail("Start date cannot be after closing date.");
    }
    if (commission && (Number(commission) < 0 || Number(commission) > 100)) {
      return fail("Commission must be between 0 and 100%.");
    }

    const computedWelcome =
      welcomeMessageInput ||
      (location
        ? `Welcome to ${name} (${location}). Dial 1 to contribute.`
        : `Welcome to ${name}. Dial 1 to contribute.`);

    const payload: UpdateProjectInput = {
      name,
      description: description || undefined,
      categoryId: selectedCategory?.value || undefined,
      targetAmount: Number(goal).toFixed(2),
      welcomeMessage: computedWelcome.slice(0, 120),
      startDate: startDate ? `${startDate}T00:00:00.000Z` : undefined,
      endDate: closing ? `${closing}T23:59:59.000Z` : undefined,
      commissionPercentage: commission ? Number(commission) : undefined,
      status: (selectedStatus?.value as ProjectStatus) || undefined,
      acceptsContributions,
      enableWebPortal,
      showPublicTransactions: enableWebPortal && showPublicTransactions,
    };

    setSaving(true);
    try {
      const updated = await updateProject(campaign.id, payload);
      if (enableWebPortal && coverFile) {
        // The edit is already saved, so a failed upload is reported without undoing it.
        try {
          await uploadProjectCoverImage(campaign.id, coverFile);
        } catch {
          toast.warning("Changes saved, but the image could not be uploaded. Please try again.");
        }
      }
      queryClient.invalidateQueries({ queryKey: adminRoot });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", campaign.id] });
      toast.success(`Campaign "${name}" updated successfully!`);
      onUpdated(updated);
      onClose();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiErr = err as any;
      const msg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Could not update the campaign. Please check the fields and try again.";
      fail(msg);
    } finally {
      setSaving(false);
    }
  }

  const formId = "admin-edit-campaign-form";

  const initialGoal = projectData?.targetAmount
    ? Number(projectData.targetAmount).toFixed(2)
    : campaign.targetAmount
      ? Number(campaign.targetAmount).toFixed(2)
      : "";

  const initialStartDate = projectData?.startDate ? projectData.startDate.slice(0, 10) : "";
  const initialEndDate = projectData?.endDate ? projectData.endDate.slice(0, 10) : "";
  const initialCommission =
    projectData?.commissionPercentage !== undefined
      ? String(projectData.commissionPercentage)
      : campaign.commissionPercentage !== undefined
        ? String(campaign.commissionPercentage)
        : "14";

  return (
    <Modal
      title={`Edit Campaign: ${campaign.name}`}
      eyebrow="Admin Campaign Editor"
      onClose={() => !saving && onClose()}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={saving || loadingDetails}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-steel disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Pencil size={15} />
                Save Changes
              </>
            )}
          </button>
        </div>
      }
    >
      {loadingDetails ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-steel">
          <Loader2 size={28} className="animate-spin text-navy" />
          <p className="mt-3 text-sm font-medium text-navy">Loading campaign details...</p>
        </div>
      ) : (
        <form id={formId} onSubmit={submit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-crimson/20 bg-crimson/5 p-3 text-xs text-crimson">
              {error}
            </div>
          )}

          {/* Read-only Context (Host & USSD Code) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl bg-stone-light p-3 border border-navy/10 text-xs text-steel">
            <div className="flex items-center gap-2">
              <UserRound size={15} className="text-steel shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-steel">Host</span>
                <span className="font-semibold text-navy">{campaign.hostName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash size={15} className="text-gold shrink-0" />
              <div>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-steel">USSD Dial Code</span>
                <span className="font-mono font-bold text-navy">*920*969*{campaign.eventCode}#</span>
              </div>
            </div>
          </div>

          {/* Campaign Name */}
          <div>
            <label htmlFor="edit-name" className="text-xs font-semibold text-navy block mb-1">
              Campaign Name <span className="text-crimson">*</span>
            </label>
            <input
              id="edit-name"
              name="name"
              required
              minLength={2}
              maxLength={100}
              defaultValue={projectData?.name || campaign.name}
              placeholder="e.g. Clean Water Initiative"
              className={inputClass}
              disabled={saving}
            />
          </div>

          {/* Status & Commission Row */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-status" className="text-xs font-semibold text-navy block mb-1">
                Campaign Status <span className="text-crimson">*</span>
              </label>
              <Select
                inputId="edit-status"
                value={selectedStatus}
                onChange={(opt) => setUserStatus(opt)}
                options={STATUS_OPTIONS}
                styles={selectStyles}
                isSearchable={false}
                isDisabled={saving}
              />
              <p className="mt-1 text-[11px] text-steel">
                Current: <strong className="text-navy">{campaign.status}</strong>
              </p>
            </div>

            <div>
              <label htmlFor="edit-commission" className="text-xs font-semibold text-navy flex items-center justify-between mb-1">
                <span>Commission Fee (%)</span>
                <span className="text-[11px] font-normal text-steel">Standard: 14%</span>
              </label>
              <div className="relative">
                <input
                  id="edit-commission"
                  name="commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  defaultValue={initialCommission}
                  placeholder="14"
                  className={inputClass + " pr-8 font-semibold"}
                  disabled={saving}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-steel">
                  %
                </span>
              </div>
              <p className="mt-1 text-[11px] text-steel">
                Platform fee charged on contributions.
              </p>
            </div>
          </div>

          {/* Category & Fundraising Target */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-category" className="text-xs font-semibold text-navy block mb-1">
                Category
              </label>
              <Select
                inputId="edit-category"
                value={selectedCategory}
                onChange={(opt) => setUserCategory(opt)}
                options={categoryOptions}
                placeholder={categoriesLoading ? "Loading..." : "Select category"}
                styles={selectStyles}
                isClearable
                isDisabled={saving || categoriesLoading}
              />
            </div>

            <div>
              <label htmlFor="edit-goal" className="text-xs font-semibold text-navy block mb-1">
                Fundraising Goal (GH₵) <span className="text-crimson">*</span>
              </label>
              <input
                id="edit-goal"
                name="goal"
                type="number"
                min="1"
                step="0.01"
                required
                defaultValue={initialGoal}
                placeholder="10000.00"
                className={inputClass}
                disabled={saving}
              />
            </div>
          </div>

          {/* Start Date & Closing Date */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-startDate" className="text-xs font-semibold text-navy block mb-1">
                Start Date
              </label>
              <input
                id="edit-startDate"
                name="startDate"
                type="date"
                defaultValue={initialStartDate}
                className={inputClass}
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="edit-closing" className="text-xs font-semibold text-navy block mb-1">
                Closing Date (Optional)
              </label>
              <input
                id="edit-closing"
                name="closing"
                type="date"
                defaultValue={initialEndDate}
                className={inputClass}
                disabled={saving}
              />
            </div>
          </div>

          {/* Location / Welcome Message */}
          <div>
            <label htmlFor="edit-welcomeMessage" className="text-xs font-semibold text-navy block mb-1">
              USSD Welcome Message (Max 120 chars)
            </label>
            <input
              id="edit-welcomeMessage"
              name="welcomeMessage"
              maxLength={120}
              defaultValue={projectData?.welcomeMessage || ""}
              placeholder={`Welcome to ${campaign.name}. Dial 1 to contribute.`}
              className={inputClass}
              disabled={saving}
            />
            <p className="mt-1 text-[11px] text-steel">
              Greeting displayed to contributors when dialing *920*969*{campaign.eventCode}#.
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="edit-description" className="text-xs font-semibold text-navy block mb-1">
              Description (Optional)
            </label>
            <textarea
              id="edit-description"
              name="description"
              rows={3}
              defaultValue={projectData?.description || ""}
              placeholder="Provide background information or purpose for this campaign..."
              className={inputClass}
              disabled={saving}
            />
          </div>

          {/* Accepts Contributions Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="edit-acceptsContributions"
              name="acceptsContributions"
              defaultChecked={projectData ? projectData.acceptsContributions : true}
              className="h-4 w-4 rounded accent-navy"
              disabled={saving}
            />
            <label htmlFor="edit-acceptsContributions" className="text-xs font-medium text-navy cursor-pointer">
              Accept Contributions (Open for donations via USSD and Mobile Money)
            </label>
          </div>

          {/* Web Portal Opt-In Toggle */}
          <div className="rounded-xl border border-navy/15 bg-stone-light/40 p-3.5 transition-colors hover:border-navy/30">
            <label
              htmlFor="edit-web-portal"
              className="flex items-start gap-3 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                id="edit-web-portal"
                checked={enableWebPortal}
                onChange={(e) => setUserWebPortal(e.target.checked)}
                disabled={saving}
                className="mt-0.5 h-4 w-4 rounded accent-navy focus:ring-navy"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-navy">
                    Enable Online Web Donation Portal
                  </span>
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                    +1% commission
                  </span>
                </div>
                <p className="text-[11px] text-steel leading-relaxed">
                  Attracts an additional 1% platform commission on web contributions. Gives donors a dedicated web portal to donate via Cards, Apple Pay, and Mobile Money.
                </p>
              </div>
            </label>

            {enableWebPortal && (
              <WebPortalOptions
                idPrefix="edit-campaign"
                currentImageUrl={currentImageUrl}
                file={coverFile}
                onFileChange={setCoverFile}
                showPublicTransactions={showPublicTransactions}
                onShowPublicTransactionsChange={setUserShowPublic}
                disabled={saving}
              />
            )}
          </div>
        </form>
      )}
    </Modal>
  );
}
