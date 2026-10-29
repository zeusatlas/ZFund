"use client";

import { useEffect, useState, useMemo } from "react";
import {
  X,
  PhoneCall,
  SlidersHorizontal,
  Plus,
  Trash2,
  Copy,
  Check,
  Smartphone,
  RotateCcw,
  Sparkles,
  Loader2,
  CheckCircle2,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { type Campaign } from "@/components/features/host/shared/demo";
import {
  useProjectUssdFlowQuery,
  useConfigureProjectUssdFlowMutation,
} from "./use-ussd-flow";
import {
  type UssdFlowResponse,
  type UssdMenu,
  type UssdMenuOption,
} from "@/lib/api/ussd-flows";

export interface PurposeItem {
  id: string;
  label: string;
  subSteps: string[];
  isExpanded?: boolean;
}

export interface ConfigurableCampaign {
  id: string;
  name: string;
  eventCode?: string;
  currency?: string;
  welcomeMessage?: string;
}
export function ConfigureStepsDrawer({
  campaign,
  open,
  onClose,
}: {
  campaign: ConfigurableCampaign | null;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape key listener
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const { data: flowData, isLoading: isLoadingFlow } = useProjectUssdFlowQuery(campaign?.id);

  if (!open || !campaign) return null;

  const dialCode = campaign.eventCode ? `*920*969*${campaign.eventCode}#` : "*920*969#";

  function copyCode() {
    navigator.clipboard.writeText(dialCode);
    setCopied(true);
    toast.success(`Copied dial string ${dialCode} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="presentation">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close configuration drawer"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-midnight/55 backdrop-blur-[1px] transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="configure-steps-title"
          className="flex w-screen max-w-4xl flex-col bg-stone-light text-navy shadow-2xl animate-drawer border-l border-navy/10"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  USSD Dial Steps
                </span>
                <span className="text-xs text-steel">·</span>
                <span className="text-xs font-medium text-steel">{campaign.name}</span>
              </div>
              <h2 id="configure-steps-title" className="text-2xl font-medium tracking-tight">
                Configure donor dial steps
              </h2>
              <p className="mt-1 text-sm text-steel">
                Customize the exact menus, options, and sub-steps donors experience when dialing this campaign&apos;s code.
              </p>

              {/* Code Pill Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-navy/5 px-3 py-1.5 text-xs font-mono font-semibold text-navy border border-navy/10">
                  <PhoneCall size={13} className="text-gold" />
                  {dialCode}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1 text-xs font-medium text-steel hover:text-navy transition-colors"
                >
                  {copied ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <Check size={13} /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy size={13} /> Copy code
                    </span>
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="shrink-0 rounded-lg p-2 text-steel hover:bg-stone transition-colors"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {isLoadingFlow ? (
            <div className="flex flex-1 flex-col items-center justify-center py-20 text-center text-steel">
              <Loader2 size={32} className="animate-spin text-navy" />
              <p className="mt-3 text-sm font-medium text-navy">Loading campaign USSD flow...</p>
              <p className="mt-1 text-xs text-steel">Connecting to USSD runtime engine</p>
            </div>
          ) : (
            <ConfigureStepsForm
              key={`${campaign.id}-${flowData?.version?.id || "initial"}`}
              campaign={campaign}
              dialCode={dialCode}
              flowData={flowData}
              onClose={onClose}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

interface ConfigureStepsFormProps {
  campaign: ConfigurableCampaign;
  dialCode: string;
  flowData?: UssdFlowResponse;
  onClose: () => void;
}

function ConfigureStepsForm({
  campaign,
  dialCode,
  flowData,
  onClose,
}: ConfigureStepsFormProps) {
  const [activeTab, setActiveTab] = useState<"configure" | "simulator">("configure");

  // Step 1: Welcome & Purposes with nested sub-steps
  const [welcomePrompt, setWelcomePrompt] = useState(() => {
    const welcomeMenu = flowData?.version?.menus?.find((m: UssdMenu) => m.menuKey === "WELCOME");
    return (
      welcomeMenu?.prompt ||
      campaign.welcomeMessage ||
      `Welcome to ${campaign.name}.\nSelect your donation purpose:`
    );
  });

  const [purposes, setPurposes] = useState<PurposeItem[]>(() => {
    const welcomeMenu = flowData?.version?.menus?.find((m: UssdMenu) => m.menuKey === "WELCOME");
    if (welcomeMenu?.options && welcomeMenu.options.length > 0) {
      const validOptions = welcomeMenu.options.filter((opt: UssdMenuOption) => opt.label !== "Exit");
      if (validOptions.length > 0) {
        return validOptions.map((opt: UssdMenuOption, i: number) => {
          let subSteps: string[] = [];
          if (opt.targetMenuKey && opt.targetMenuKey.startsWith("SUB_PURPOSE_")) {
            const subMenu = flowData?.version?.menus?.find((m: UssdMenu) => m.menuKey === opt.targetMenuKey);
            if (subMenu?.options) {
              subSteps = subMenu.options
                .filter((subOpt: UssdMenuOption) => subOpt.label !== "Back")
                .map((subOpt: UssdMenuOption) => subOpt.label);
            }
          }
          return {
            id: `purpose-${i}-${Date.now()}`,
            label: opt.label,
            subSteps,
            isExpanded: subSteps.length > 0,
          };
        });
      }
    }
    return [
      { id: "p1", label: "General Support", subSteps: [], isExpanded: false },
      { id: "p2", label: "Emergency Relief", subSteps: ["Medical Aid", "Disaster Response"], isExpanded: true },
      { id: "p3", label: "Project Operations", subSteps: [], isExpanded: false },
    ];
  });

  const [newPurposeInput, setNewPurposeInput] = useState("");
  const [subStepInputs, setSubStepInputs] = useState<Record<string, string>>({});

  // Step 2: Amount Prompt
  const [amountPrompt, setAmountPrompt] = useState(() => {
    const amountMenu = flowData?.version?.menus?.find((m: UssdMenu) => m.menuKey === "AMOUNT_INPUT");
    return amountMenu?.prompt ?? `Enter Amount in ${campaign.currency || "GHS"} (e.g. 50):`;
  });

  // Step 3: Confirmation Prompt
  const [confirmPrompt, setConfirmPrompt] = useState(() => {
    const confirmMenu = flowData?.version?.menus?.find((m: UssdMenu) => m.menuKey === "CONFIRM_PAYMENT");
    const raw = confirmMenu?.prompt;
    const fallback = `Contribute ${campaign.currency || "GHS"} {amount} to {purpose}?`;
    if (!raw) return fallback;
    let cleaned = raw;
    if (campaign?.name) {
      const escaped = campaign.name.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
      cleaned = cleaned.replace(new RegExp(`to\\s+${escaped}\\?`, "gi"), "to {purpose}?");
      cleaned = cleaned.replace(new RegExp(escaped, "gi"), "{purpose}");
    }
    cleaned = cleaned.replace(/{projectName}/g, "{purpose}");
    return cleaned;
  });

  const samplePurpose = useMemo(() => {
    for (const p of purposes) {
      if (p.subSteps && p.subSteps.length > 0) {
        return p.subSteps[0];
      }
    }
    return purposes[0]?.label || "Roofing";
  }, [purposes]);

  // Step 4: OTP / PIN Prompt
  const [otpPrompt, setOtpPrompt] = useState(() => {
    const otpMenu = flowData?.version?.menus?.find((m: UssdMenu) => m.menuKey === "ENTER_PAYMENT_OTP");
    return otpMenu?.prompt ?? "Enter your Mobile Money PIN or OTP to authorize payment:";
  });

  // Simulator state: 1 (Welcome) -> 1.5 (Sub-steps if any) -> 2 (Amount) -> 3 (Confirm) -> 4 (PIN) -> 5 (Done)
  const [simStep, setSimStep] = useState<number>(1);
  const [simActivePurpose, setSimActivePurpose] = useState<PurposeItem | null>(null);
  const [simSelectedPurpose, setSimSelectedPurpose] = useState("");
  const [simAmount, setSimAmount] = useState("");
  const [simInput, setSimInput] = useState("");

  const configureMutation = useConfigureProjectUssdFlowMutation();

  function handleAddPurpose(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newPurposeInput.trim();
    if (!trimmed) return;
    if (purposes.length >= 6) {
      toast.error("USSD menus can support up to 6 custom purposes to prevent screen pagination.");
      return;
    }
    if (purposes.some((p) => p.label.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This purpose option already exists.");
      return;
    }
    setPurposes([
      ...purposes,
      { id: `p-${Date.now()}`, label: trimmed, subSteps: [], isExpanded: true },
    ]);
    setNewPurposeInput("");
  }

  function handleRemovePurpose(id: string) {
    if (purposes.length <= 1) {
      toast.error("A campaign must have at least one donation purpose option.");
      return;
    }
    setPurposes(purposes.filter((p) => p.id !== id));
  }

  function toggleExpandPurpose(id: string) {
    setPurposes(
      purposes.map((p) => (p.id === id ? { ...p, isExpanded: !p.isExpanded } : p))
    );
  }

  function handleAddSubStep(purposeId: string, e?: React.FormEvent) {
    if (e) e.preventDefault();
    const rawVal = subStepInputs[purposeId] || "";
    const trimmed = rawVal.trim();
    if (!trimmed) return;

    const target = purposes.find((p) => p.id === purposeId);
    if (!target) return;

    if (target.subSteps.length >= 5) {
      toast.error("USSD nested sub-steps can have up to 5 options per purpose.");
      return;
    }

    if (target.subSteps.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This sub-step option already exists under this purpose.");
      return;
    }

    setPurposes(
      purposes.map((p) =>
        p.id === purposeId ? { ...p, subSteps: [...p.subSteps, trimmed], isExpanded: true } : p
      )
    );
    setSubStepInputs((prev) => ({ ...prev, [purposeId]: "" }));
  }

  function handleRemoveSubStep(purposeId: string, subIndex: number) {
    setPurposes(
      purposes.map((p) =>
        p.id === purposeId
          ? { ...p, subSteps: p.subSteps.filter((_, idx) => idx !== subIndex) }
          : p
      )
    );
  }

  // Simulator step transitions
  function handleSimSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const val = simInput.trim();

    if (simStep === 1) {
      const idx = parseInt(val, 10) - 1;
      if (idx === purposes.length) {
        // Exit selected
        toast.info("Session ended by donor.");
        resetSimulator();
        return;
      }
      if (isNaN(idx) || idx < 0 || idx >= purposes.length) {
        toast.error(`Please enter a number between 1 and ${purposes.length + 1}`);
        return;
      }
      const chosen = purposes[idx];
      setSimActivePurpose(chosen);

      // Check if chosen purpose has nested sub-steps
      if (chosen.subSteps && chosen.subSteps.length > 0) {
        setSimStep(1.5);
      } else {
        setSimSelectedPurpose(chosen.label);
        setSimStep(2);
      }
      setSimInput("");
    } else if (simStep === 1.5 && simActivePurpose) {
      const subIdx = parseInt(val, 10) - 1;
      const backOption = simActivePurpose.subSteps.length;

      if (subIdx === backOption) {
        // Back selected
        setSimStep(1);
        setSimActivePurpose(null);
        setSimInput("");
        return;
      }

      if (isNaN(subIdx) || subIdx < 0 || subIdx >= simActivePurpose.subSteps.length) {
        toast.error(
          `Please enter an option between 1 and ${simActivePurpose.subSteps.length + 1}`
        );
        return;
      }

      const chosenSub = simActivePurpose.subSteps[subIdx];
      setSimSelectedPurpose(chosenSub);
      setSimInput("");
      setSimStep(2);
    } else if (simStep === 2) {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        toast.error("Please enter a valid amount (e.g. 20)");
        return;
      }
      setSimAmount(num.toFixed(2));
      setSimInput("");
      setSimStep(3);
    } else if (simStep === 3) {
      if (val === "1") {
        setSimInput("");
        setSimStep(4);
      } else {
        toast.info("Donation cancelled in simulator.");
        resetSimulator();
      }
    } else if (simStep === 4) {
      if (val.length >= 4) {
        setSimStep(5);
        setSimInput("");
      } else {
        toast.error("Please enter a 4-digit PIN or OTP code (e.g. 1234)");
      }
    }
  }

  function resetSimulator() {
    setSimStep(1);
    setSimActivePurpose(null);
    setSimSelectedPurpose("");
    setSimAmount("");
    setSimInput("");
  }

  async function handleSave() {
    if (!welcomePrompt.trim()) {
      toast.error("USSD Welcome Message is required.");
      return;
    }
    if (welcomePrompt.trim().length > 120) {
      toast.error("USSD Welcome Message cannot exceed 120 characters.");
      return;
    }
    if (purposes.length === 0) {
      toast.error("Please add at least one donation purpose option.");
      return;
    }

    try {
      await configureMutation.mutateAsync({
        projectId: campaign.id,
        input: {
          welcomePrompt: welcomePrompt.trim(),
          amountPrompt: amountPrompt.trim(),
          confirmPrompt: confirmPrompt.trim(),
          otpPrompt: otpPrompt.trim(),
          currency: campaign.currency || "GHS",
          purposes: purposes.map((p) => ({
            label: p.label.trim(),
            subSteps: p.subSteps.map((s) => s.trim()).filter((s) => s.length > 0),
          })),
        },
      });

      toast.success(
        `USSD dial steps updated and published! Dial ${dialCode} to test live routing.`
      );
      onClose();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiErr = err as any;
      const msg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Failed to update USSD dial steps.";
      toast.error(msg);
    }
  }

  return (
    <>
      {/* Navigation Tabs: Step Configuration vs Live Simulator */}
      <div className="flex border-b border-navy/10 bg-white px-6">
        <button
          type="button"
          onClick={() => setActiveTab("configure")}
          className={`flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-colors ${activeTab === "configure"
            ? "border-navy text-navy font-semibold"
            : "border-transparent text-steel hover:text-navy"
            }`}
        >
          <SlidersHorizontal size={15} />
          Step-by-step flow setup
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("simulator")}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition-colors ${activeTab === "simulator"
            ? "border-navy text-navy font-semibold"
            : "border-transparent text-steel hover:text-navy"
            }`}
        >
          <Smartphone size={15} />
          Interactive USSD simulator
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "configure" ? (
          <>
            {/* Flow Overview Callout */}
            <div className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-navy font-semibold text-xs">
                  4
                </span>
                <div>
                  <h4 className="text-sm font-medium text-navy">Dynamic USSD Flow with Sub-steps</h4>
                  <p className="mt-0.5 text-xs text-steel leading-relaxed">
                    When a donor dials <strong>{dialCode}</strong>, they are guided through:
                    <br />
                    <span className="font-semibold text-navy">1. Welcome & Purpose</span> (with optional nested sub-steps) &rarr;{" "}
                    <span className="font-semibold text-navy">2. Amount</span> &rarr;{" "}
                    <span className="font-semibold text-navy">3. Confirmation</span> &rarr;{" "}
                    <span className="font-semibold text-navy">4. Mobile Money PIN</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Welcome & Purpose Options with Nested Sub-steps */}
            <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider">
                    Step 1
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-navy">USSD Welcome Message & Donation Purposes</h3>
                  <p className="text-xs text-steel">
                    Mandatory welcome greeting and donation menu options. You can add nested sub-steps under any option.
                  </p>
                </div>
              </div>

              {/* Mandatory USSD Welcome Message */}
              <div className="rounded-xl bg-slate-50 border border-navy/10 p-4 space-y-2">
                <div className="flex justify-between items-center text-xs text-steel">
                  <label htmlFor="welcome-prompt" className="font-semibold text-navy flex items-center gap-1.5">
                    USSD Welcome Message <span className="text-crimson font-bold">*</span>
                  </label>
                  <span
                    className={
                      !welcomePrompt.trim() || welcomePrompt.length > 120
                        ? "text-crimson font-semibold"
                        : ""
                    }
                  >
                    {welcomePrompt.length}/120 chars
                  </span>
                </div>
                <textarea
                  id="welcome-prompt"
                  required
                  rows={2}
                  maxLength={120}
                  placeholder={`Welcome to ${campaign.name}.\nSelect your donation purpose:`}
                  value={welcomePrompt}
                  onChange={(e) => setWelcomePrompt(e.target.value)}
                  className="w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                <p className="text-[11px] text-steel">
                  Displayed on the donor&apos;s handset screen immediately upon dialing{" "}
                  <strong>{dialCode}</strong>. Cannot be left blank.
                </p>
              </div>

              {/* Purposes options list with sub-steps */}
              <div>
                <label className="text-xs font-semibold text-navy block mb-2">
                  Donation Purposes & Sub-step Menus
                </label>
                <div className="space-y-3">
                  {purposes.map((purpose, index) => {
                    const hasSub = purpose.subSteps && purpose.subSteps.length > 0;
                    return (
                      <div
                        key={purpose.id}
                        className="rounded-xl border border-navy/10 bg-white p-3 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                              {index + 1}
                            </span>
                            <span className="font-medium text-sm text-navy truncate">
                              {purpose.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Toggle sub-steps expansion button */}
                            <button
                              type="button"
                              onClick={() => toggleExpandPurpose(purpose.id)}
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${hasSub
                                ? "bg-gold/15 text-navy hover:bg-gold/25 font-semibold"
                                : "bg-navy/5 text-steel hover:text-navy hover:bg-navy/10"
                                }`}
                            >
                              <CornerDownRight size={12} className={hasSub ? "text-gold" : ""} />
                              <span>
                                {hasSub
                                  ? `${purpose.subSteps.length} sub-step${purpose.subSteps.length > 1 ? "s" : ""
                                  }`
                                  : "+ Sub-steps"}
                              </span>
                              {purpose.isExpanded ? (
                                <ChevronUp size={12} />
                              ) : (
                                <ChevronDown size={12} />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemovePurpose(purpose.id)}
                              disabled={purposes.length <= 1}
                              className="text-steel hover:text-crimson disabled:opacity-30 transition-colors p-1"
                              title="Delete purpose"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Nested Sub-steps expandable container */}
                        {purpose.isExpanded && (
                          <div className="ml-2 pl-4 border-l-2 border-navy/15 pt-1 space-y-2.5 bg-stone-light/60 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-medium text-steel">
                                Nested sub-choices for <strong>{purpose.label}</strong>:
                              </p>
                              <span className="text-[10px] text-steel">
                                {purpose.subSteps.length}/5 max
                              </span>
                            </div>

                            {purpose.subSteps.length > 0 ? (
                              <div className="space-y-1.5">
                                {purpose.subSteps.map((sub, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="flex items-center justify-between gap-2 rounded-md bg-white border border-navy/10 px-2.5 py-1 text-xs text-navy"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="font-mono text-[10px] text-steel">
                                        {index + 1}.{sIdx + 1}
                                      </span>
                                      <span className="truncate">{sub}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveSubStep(purpose.id, sIdx)}
                                      className="text-steel hover:text-crimson transition-colors p-0.5"
                                      title="Remove sub-step"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))}

                                {/* Back option indicator */}
                                <div className="flex items-center gap-2 rounded-md border border-dashed border-navy/15 px-2.5 py-1 text-[11px] text-steel bg-white/40">
                                  <span className="font-mono text-[10px] text-navy font-bold">
                                    {index + 1}.{purpose.subSteps.length + 1}
                                  </span>
                                  <span>Back to main menu (Auto-generated)</span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-steel italic">
                                No sub-steps configured yet. Selecting this purpose in Step 1 will proceed directly to the amount prompt.
                              </p>
                            )}

                            {/* Add sub-step inline form */}
                            <div className="flex gap-2 pt-1">
                              <input
                                type="text"
                                maxLength={40}
                                placeholder="Add a sub-step (e.g. Medical Aid)"
                                value={subStepInputs[purpose.id] || ""}
                                onChange={(e) =>
                                  setSubStepInputs({
                                    ...subStepInputs,
                                    [purpose.id]: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSubStep(purpose.id);
                                  }
                                }}
                                className="flex-1 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddSubStep(purpose.id)}
                                disabled={
                                  !(subStepInputs[purpose.id] || "").trim() ||
                                  purpose.subSteps.length >= 5
                                }
                                className="inline-flex items-center gap-1 rounded-lg bg-navy/90 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-navy disabled:opacity-40 transition-colors"
                              >
                                <Plus size={12} />
                                Add sub-step
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Exit indicator */}
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-navy/15 px-3 py-2 text-xs text-steel bg-white/50">
                    <span className="font-mono font-bold text-navy">{purposes.length + 1}.</span>
                    <span>Exit (Auto-generated system option)</span>
                  </div>
                </div>

                {/* Add purpose input */}
                <form onSubmit={handleAddPurpose} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="Add a new main purpose (e.g. Welfare Fund)"
                    value={newPurposeInput}
                    onChange={(e) => setNewPurposeInput(e.target.value)}
                    className="flex-1 rounded-xl border border-navy/20 bg-white px-3 py-2 text-xs text-navy placeholder:text-steel/60 focus:border-navy focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!newPurposeInput.trim() || purposes.length >= 6}
                    className="inline-flex items-center gap-1 rounded-xl bg-navy px-3 py-2 text-xs font-medium text-white hover:bg-steel disabled:opacity-40 transition-colors"
                  >
                    <Plus size={14} />
                    Add Option
                  </button>
                </form>
              </div>
            </section>

            {/* Step 2: Amount Prompt */}
            <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider">
                  Step 2
                </span>
                <h3 className="mt-1 text-base font-semibold text-navy">Amount Input Screen</h3>
                <p className="text-xs text-steel">
                  Prompts donor to enter their chosen contribution amount.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-steel mb-1">
                  <label htmlFor="amount-prompt" className="font-medium text-navy">
                    Prompt Text <span className="text-crimson">*</span>
                  </label>
                  <span>{amountPrompt.length}/120 chars</span>
                </div>
                <input
                  id="amount-prompt"
                  type="text"
                  maxLength={120}
                  value={amountPrompt}
                  onChange={(e) => setAmountPrompt(e.target.value)}
                  className="w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none"
                />
                <p className="mt-1.5 text-[11px] text-steel">
                  Limits: Minimum 1.00 {campaign.currency || "GHS"} · Maximum 50,000.00 {campaign.currency || "GHS"}
                </p>
              </div>
            </section>

            {/* Step 3: Confirmation Screen */}
            <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider">
                  Step 3
                </span>
                <h3 className="mt-1 text-base font-semibold text-navy">Confirmation Screen</h3>
                <p className="text-xs text-steel">
                  Asks donor to review and confirm the selected amount before Mobile Money initiation.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-steel mb-1">
                  <label htmlFor="confirm-prompt" className="font-medium text-navy">
                    Confirmation Prompt <span className="text-crimson">*</span>
                  </label>
                  <span>{confirmPrompt.length}/120 chars</span>
                </div>
                <input
                  id="confirm-prompt"
                  type="text"
                  maxLength={120}
                  value={confirmPrompt}
                  onChange={(e) => setConfirmPrompt(e.target.value)}
                  className="w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-steel">
                  Tip: Use <code className="bg-stone px-1 rounded text-navy">&#123;amount&#125;</code> for the donation amount and <code className="bg-stone px-1 rounded text-navy">&#123;purpose&#125;</code> to dynamically bind the selected step or sub-step (e.g. &quot;{samplePurpose}&quot;).
                </p>

                {/* Dynamic Preview Card */}
                <div className="mt-3 rounded-xl border border-navy/10 bg-slate-50 p-3 text-xs">
                  <span className="font-semibold text-steel block mb-1">
                    Live Handset Preview:
                  </span>
                  <div className="rounded-lg border border-emerald-900/20 bg-[#0b1713] p-2.5 font-mono text-emerald-300">
                    {confirmPrompt
                      .replace(/{amount}/g, "50.00")
                      .replace(/{purpose}/g, samplePurpose)
                      .replace(/{subStep}/g, samplePurpose)
                      .replace(/{target}/g, samplePurpose)
                      .replace(/{step}/g, samplePurpose)
                      .replace(/{projectName}/g, samplePurpose)
                      .replace(/{currency}/g, campaign.currency || "GHS")}
                  </div>
                  <p className="mt-1.5 text-[11px] text-steel">
                    When the donor selects <strong>&quot;{samplePurpose}&quot;</strong>, it dynamically replaces <code>&#123;purpose&#125;</code> on their phone screen.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 4: OTP / PIN Payment Push */}
            <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm space-y-4">
              <div>
                <span className="inline-block rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy uppercase tracking-wider">
                  Step 4
                </span>
                <h3 className="mt-1 text-base font-semibold text-navy">Payment Authorization Prompt</h3>
                <p className="text-xs text-steel">
                  Final prompt instructing the donor to authorize the payment on their handset.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-steel mb-1">
                  <label htmlFor="otp-prompt" className="font-medium text-navy">
                    Authorization Prompt <span className="text-crimson">*</span>
                  </label>
                  <span>{otpPrompt.length}/120 chars</span>
                </div>
                <input
                  id="otp-prompt"
                  type="text"
                  maxLength={120}
                  value={otpPrompt}
                  onChange={(e) => setOtpPrompt(e.target.value)}
                  className="w-full rounded-xl border border-navy/20 bg-white px-3 py-2 text-sm text-navy focus:border-navy focus:outline-none"
                />
              </div>
            </section>
          </>
        ) : (
          /* Interactive USSD Mobile Phone Simulator with Sub-steps support */
          <div className="flex flex-col items-center justify-center space-y-5 py-4">
            <div className="text-center max-w-md">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-navy mb-2">
                <Sparkles size={13} className="text-gold" />
                Interactive Handset Simulator
              </div>
              <h3 className="text-lg font-semibold text-navy">Test your USSD Donor Flow</h3>
              <p className="text-xs text-steel mt-1">
                See exactly how a donor on MTN, Telecel, or AT experiences your flow (including nested sub-steps) when dialing{" "}
                <strong>{dialCode}</strong>.
              </p>
            </div>

            {/* Mobile Phone Mockup */}
            <div className="w-full max-w-[340px] rounded-[36px] bg-[#111827] p-4 shadow-2xl border-4 border-navy/30">
              {/* Phone Speaker & Camera */}
              <div className="mx-auto mb-3 h-3 w-16 rounded-full bg-navy/60" />

              {/* USSD Dialog Screen */}
              <div className="min-h-[310px] rounded-2xl bg-[#0b1713] p-4 text-[#86efac] font-mono shadow-inner border border-emerald-900/60 flex flex-col justify-between">
                <div>
                  {/* USSD Network Header */}
                  <div className="flex items-center justify-between border-b border-emerald-900/50 pb-2 mb-3 text-[11px] text-emerald-400/80">
                    <span>USSD: {dialCode}</span>
                    <span>MTN MoMo</span>
                  </div>

                  {/* Step 1: Main Welcome & Purpose Menu */}
                  {simStep === 1 && (
                    <div className="space-y-2 text-xs">
                      <p className="whitespace-pre-line leading-relaxed font-semibold">
                        {welcomePrompt || `Welcome to ${campaign.name}.\nSelect purpose:`}
                      </p>
                      <div className="space-y-1 pt-1 text-emerald-300">
                        {purposes.map((p, i) => (
                          <p key={p.id}>
                            {i + 1}. {p.label}
                            {p.subSteps && p.subSteps.length > 0 && " >"}
                          </p>
                        ))}
                        <p className="text-emerald-500">{purposes.length + 1}. Exit</p>
                      </div>
                    </div>
                  )}

                  {/* Step 1.5: Nested Sub-step Menu */}
                  {simStep === 1.5 && simActivePurpose && (
                    <div className="space-y-2 text-xs">
                      <p className="leading-relaxed font-semibold text-emerald-300">
                        Select {simActivePurpose.label}:
                      </p>
                      <div className="space-y-1 pt-1 text-emerald-300">
                        {simActivePurpose.subSteps.map((sub, sIdx) => (
                          <p key={sIdx}>
                            {sIdx + 1}. {sub}
                          </p>
                        ))}
                        <p className="text-emerald-500">
                          {simActivePurpose.subSteps.length + 1}. Back
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Amount Prompt */}
                  {simStep === 2 && (
                    <div className="space-y-3 text-xs">
                      <p className="text-emerald-400 font-semibold truncate">
                        Purpose: {simSelectedPurpose}
                      </p>
                      <p className="leading-relaxed font-semibold">
                        {amountPrompt || `Enter Amount in ${campaign.currency || "GHS"}:`}
                      </p>
                    </div>
                  )}

                  {/* Step 3: Confirmation Prompt */}
                  {simStep === 3 && (
                    <div className="space-y-3 text-xs">
                      <p className="leading-relaxed font-semibold">
                        {confirmPrompt
                          .replace(/{amount}/g, simAmount || "0.00")
                          .replace(/{purpose}/g, simSelectedPurpose || campaign.name)
                          .replace(/{subStep}/g, simSelectedPurpose || campaign.name)
                          .replace(/{target}/g, simSelectedPurpose || campaign.name)
                          .replace(/{step}/g, simSelectedPurpose || campaign.name)
                          .replace(/{projectName}/g, simSelectedPurpose || campaign.name)
                          .replace(/{currency}/g, campaign.currency || "GHS")}
                      </p>
                      <div className="space-y-1 text-emerald-300">
                        <p>1. Confirm & Pay</p>
                        <p>2. Cancel</p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: PIN/OTP Authorization */}
                  {simStep === 4 && (
                    <div className="space-y-3 text-xs">
                      <p className="leading-relaxed font-semibold">
                        {otpPrompt || "Enter Mobile Money PIN or OTP to authorize payment:"}
                      </p>
                      <p className="text-[10px] text-emerald-400/80">
                        (Enter any 4 digits to simulate approval)
                      </p>
                    </div>
                  )}

                  {/* Step 5: Authorization Success */}
                  {simStep === 5 && (
                    <div className="py-6 text-center space-y-3 text-xs text-emerald-300">
                      <CheckCircle2 size={36} className="mx-auto text-emerald-400" />
                      <p className="font-semibold text-emerald-200">Payment Authorized!</p>
                      <p className="text-[11px] text-emerald-400/90 leading-relaxed">
                        Thank you for contributing {simAmount} {campaign.currency || "GHS"} to{" "}
                        {campaign.name} for {simSelectedPurpose}.
                      </p>
                    </div>
                  )}
                </div>

                {/* USSD Input Form inside phone screen */}
                {simStep < 5 ? (
                  <form onSubmit={handleSimSend} className="pt-3 border-t border-emerald-900/50 mt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder={simStep === 2 ? "e.g. 50" : "Option"}
                        value={simInput}
                        onChange={(e) => setSimInput(e.target.value)}
                        className="w-full rounded bg-emerald-950/60 px-2 py-1.5 text-xs text-emerald-200 placeholder:text-emerald-800 border border-emerald-800/60 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={resetSimulator}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded bg-emerald-800/80 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    <RotateCcw size={13} />
                    Dial Again ({dialCode})
                  </button>
                )}
              </div>

              {/* Reset button under simulator */}
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={resetSimulator}
                  className="inline-flex items-center gap-1 text-[11px] text-steel hover:text-white transition-colors"
                >
                  <RotateCcw size={11} />
                  Restart sequence
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Drawer Footer */}
      <div className="flex items-center justify-between border-t border-navy/10 bg-white p-5">
        <button
          type="button"
          onClick={onClose}
          disabled={configureMutation.isPending}
          className="rounded-xl border border-navy/20 bg-white px-5 py-2.5 text-sm font-medium hover:bg-stone disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={configureMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-steel disabled:opacity-50 transition-colors"
        >
          {configureMutation.isPending && (
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          )}
          {configureMutation.isPending ? "Publishing steps…" : "Save & Publish steps"}
        </button>
      </div>
    </>
  );
}
