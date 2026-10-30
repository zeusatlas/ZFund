"use client";

import { useCallback, useMemo, useRef, useState, type FormEvent } from "react";
import Select from "react-select";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import { getSelectStyles } from "@/components/ui/selectStyles";
import { useProjectCategoriesQuery } from "@/components/features/host/campaigns/use-campaigns";
import {
  SpecialCodeField,
  type CodeStatus,
} from "@/components/features/host/campaigns/SpecialCodeField";
import type { ConfigurableCampaign } from "@/components/features/host/campaigns/ConfigureStepsDrawer";
import { useCreateCampaignForHost, useHosts } from "../admin-api";

type Option = { value: string; label: string };

type Props = {
  onClose: () => void;
  /** Called once the campaign exists; `configureSteps` is true for "Create & configure steps". */
  onCreated: (campaign: ConfigurableCampaign, configureSteps: boolean) => void;
};

const inputClass =
  "w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none disabled:opacity-60";

const selectStyles = getSelectStyles<Option>({ minHeight: "42px", borderColor: "rgba(11, 37, 69, 0.2)" });

export default function AdminCreateCampaignModal({ onClose, onCreated }: Readonly<Props>) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [host, setHost] = useState<Option | null>(null);
  const [category, setCategory] = useState<Option | null>(null);
  const [code, setCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<CodeStatus>("idle");
  const handleCodeStatus = useCallback((status: CodeStatus) => setCodeStatus(status), []);
  const [error, setError] = useState("");
  /** Which submit button was pressed: "Create & configure steps" or plain "Create campaign". */
  const configureAfterCreate = useRef(false);

  const { data: hostsPage, isPending: hostsLoading } = useHosts({ page: 1, limit: 100 });
  const { data: categories = [], isLoading: categoriesLoading } = useProjectCategoriesQuery();
  const createMutation = useCreateCampaignForHost();

  const hostOptions: Option[] = useMemo(
    () =>
      (hostsPage?.items ?? []).map((h) => ({
        value: h.id,
        label: `${h.firstName} ${h.lastName}`.trim() + ` (${h.email})`,
      })),
    [hostsPage],
  );
  const categoryOptions: Option[] = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories],
  );

  function fail(message: string) {
    setError(message);
    toast.error(message);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const configureSteps = configureAfterCreate.current;
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const goal = String(form.get("goal") || "").trim();
    const startDate = String(form.get("startDate") || "").trim();
    const closing = String(form.get("closing") || "").trim();
    const location = String(form.get("location") || "").trim();
    const description = String(form.get("description") || "").trim();
    const commission = String(form.get("commission") || "").trim();

    if (!host) return fail("Select the host this campaign belongs to.");
    if (name.length < 2) return fail("Campaign name must be at least 2 characters.");
    if (!category) return fail("Please select a category.");
    if (!/^\d+(\.\d{1,2})?$/.test(goal) || Number(goal) <= 0) {
      return fail("Please enter a valid fundraising goal in GH₵ (up to 2 decimals).");
    }
    if (!startDate) return fail("Start date is required.");
    if (closing && startDate > closing) return fail("Start date cannot be after closing date.");
    if (code && codeStatus !== "available") {
      return fail(
        codeStatus === "taken"
          ? `Code ${code} is already taken. Choose another or clear the field to auto-generate one.`
          : "Please wait for the code check to finish, with a code of 2 to 4 digits.",
      );
    }
    if (commission && (Number(commission) < 0 || Number(commission) > 100)) {
      return fail("Commission must be between 0 and 100.");
    }

    const welcomeMessage = (
      location
        ? `Welcome to ${name} (${location}). Dial 1 to contribute.`
        : `Welcome to ${name}. Dial 1 to contribute.`
    ).slice(0, 120);

    try {
      const project = await createMutation.mutateAsync({
        hostId: host.value,
        name,
        description: description || undefined,
        categoryId: category.value,
        eventCode: code || undefined,
        targetAmount: Number(goal).toFixed(2),
        welcomeMessage,
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: closing ? `${closing}T23:59:59.000Z` : undefined,
        commissionPercentage: commission ? Number(commission) : undefined,
      });
      onCreated(
        {
          id: project.id,
          name: project.name,
          eventCode: project.eventCode,
          currency: project.currency,
          welcomeMessage: project.welcomeMessage,
        },
        configureSteps,
      );
    } catch {
      // The mutation toasts the error; keep the form open so nothing typed is lost.
    }
  }

  const busy = createMutation.isPending;
  const formId = "admin-create-campaign-form";

  return (
    <Modal
      title="Create campaign for a host"
      eyebrow="Admin"
      onClose={() => !busy && onClose()}
      footer={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium hover:bg-stone disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form={formId}
            disabled={busy}
            onClick={() => {
              configureAfterCreate.current = true;
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-navy/20 bg-white px-4 py-2 text-sm font-medium text-navy hover:bg-stone disabled:opacity-50"
          >
            <SlidersHorizontal size={14} />
            Create &amp; configure steps
          </button>
          <button
            type="submit"
            form={formId}
            disabled={busy}
            onClick={() => {
              configureAfterCreate.current = false;
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-steel disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create campaign"
            )}
          </button>
        </div>
      }
    >
      <form
        id={formId}
        onSubmit={submit}
        className="space-y-4"
      >
        <div>
          <label htmlFor="admin-campaign-host" className="text-sm font-medium">
            Host <span className="text-crimson">*</span>
          </label>
          <div className="mt-2">
            <Select<Option>
              inputId="admin-campaign-host"
              instanceId="admin-campaign-host-select"
              value={host}
              onChange={setHost}
              options={hostOptions}
              isLoading={hostsLoading}
              isDisabled={busy}
              placeholder={hostsLoading ? "Loading hosts..." : "Select a host"}
              styles={selectStyles}
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-campaign-name" className="text-sm font-medium">
            Campaign name <span className="text-crimson">*</span>
          </label>
          <input
            id="admin-campaign-name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            disabled={busy}
            placeholder="e.g. Asankrangwa Community Water Project"
            className={`${inputClass} mt-2`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-campaign-category" className="text-sm font-medium">
              Category <span className="text-crimson">*</span>
            </label>
            <div className="mt-2">
              <Select<Option>
                inputId="admin-campaign-category"
                instanceId="admin-campaign-category-select"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                isLoading={categoriesLoading}
                isDisabled={busy}
                placeholder="Select a category"
                styles={selectStyles}
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-campaign-location" className="text-sm font-medium">
              Town / City &amp; Region
            </label>
            <input
              id="admin-campaign-location"
              name="location"
              maxLength={80}
              disabled={busy}
              placeholder="e.g. Ho, Volta Region"
              className={`${inputClass} mt-2`}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-campaign-goal" className="text-sm font-medium">
              Fundraising goal (GH₵) <span className="text-crimson">*</span>
            </label>
            <input
              id="admin-campaign-goal"
              name="goal"
              required
              type="number"
              min="1"
              step="0.01"
              inputMode="decimal"
              disabled={busy}
              placeholder="25000.00"
              className={`${inputClass} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="admin-campaign-commission" className="text-sm font-medium">
              Commission (%)
            </label>
            <input
              id="admin-campaign-commission"
              name="commission"
              type="number"
              min="0"
              max="100"
              step="0.1"
              disabled={busy}
              placeholder="14"
              className={`${inputClass} mt-2`}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="admin-campaign-start" className="text-sm font-medium">
              Start date <span className="text-crimson">*</span>
            </label>
            <input
              id="admin-campaign-start"
              name="startDate"
              required
              type="date"
              min={today}
              defaultValue={today}
              disabled={busy}
              className={`${inputClass} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="admin-campaign-closing" className="text-sm font-medium">
              Closing date (optional)
            </label>
            <input
              id="admin-campaign-closing"
              name="closing"
              type="date"
              min={today}
              disabled={busy}
              className={`${inputClass} mt-2`}
            />
          </div>
        </div>

        <div className="rounded-xl border border-navy/10 bg-stone-light p-4">
          <SpecialCodeField
            id="admin-campaign-code"
            label="Campaign code (optional)"
            value={code}
            onChange={setCode}
            onStatusChange={handleCodeStatus}
            disabled={busy}
            hint="Leave blank to auto-generate the next 4-digit code, or enter a special 2 to 4 digit code."
          />
        </div>

        <div>
          <label htmlFor="admin-campaign-description" className="text-sm font-medium">
            Campaign description
          </label>
          <textarea
            id="admin-campaign-description"
            name="description"
            rows={3}
            maxLength={2000}
            disabled={busy}
            className={`${inputClass} mt-2 resize-y`}
          />
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-crimson/20 bg-white p-3 text-sm text-crimson">
            {error}
          </p>
        )}
        <p className="text-xs text-steel">
          The campaign belongs to the selected host and goes live straight away (or when its start date
          arrives), so you can configure its steps right after creating it.
        </p>
      </form>
    </Modal>
  );
}
