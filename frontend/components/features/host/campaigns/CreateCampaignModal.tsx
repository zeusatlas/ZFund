"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Plus, X } from "lucide-react";
import { campaignFormSchema, categories } from "@/components/features/host/campaigns/campaign-schema";
import { saveCampaign } from "@/components/features/host/campaigns/use-campaigns";
import Select from "react-select";
import { getSelectStyles } from "@/components/ui/selectStyles";

type Props = { onCreated: (name: string) => void };
const inputClass = "mt-2 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy placeholder:text-steel/60";

type CategoryOption = { value: (typeof categories)[number]; label: (typeof categories)[number] };
const categoryOptions: CategoryOption[] = categories.map((category) => ({ value: category, label: category }));

export default function CreateCampaignModal({ onCreated }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  function showModal() {
    form.current?.reset();
    setSelectedCategory(null);
    setError("");
    setToday(new Date().toISOString().slice(0, 10));
    setOpen(true);
    dialog.current?.showModal();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    setError("");
    if (!selectedCategory) {
      setError("Please select a category.");
      return;
    }
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const result = campaignFormSchema.safeParse(fields);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    const created = new Date().toISOString().slice(0, 10);
    if (result.data.closing < created) {
      setError("Choose a closing date today or later.");
      return;
    }
    submitting.current = true;
    try {
      saveCampaign({ ...result.data, id: "LOCAL-" + crypto.randomUUID(), status: "Draft", created });
      onCreated(result.data.name);
      dialog.current?.close();
    } catch {
      setError("We couldn’t save this campaign in your browser. Check that site storage is available and try again. Your details are still here.");
    } finally {
      submitting.current = false;
    }
  }

  return <>
    <button type="button" onClick={showModal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-steel">
      <Plus size={18} aria-hidden="true" />Create campaign
    </button>
    <dialog ref={dialog} aria-labelledby="create-campaign-title" aria-describedby="create-campaign-description" onClose={() => setOpen(false)} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-0 border-0 bg-stone-light p-0 text-navy shadow-xl backdrop:bg-midnight/60">
      <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6">
        <div><h2 id="create-campaign-title" className="text-2xl font-medium tracking-tight">Create a campaign</h2><p id="create-campaign-description" className="mt-2 text-sm leading-relaxed text-steel">Give your community a clear purpose and a goal to work towards.</p></div>
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close create campaign" className="shrink-0 rounded-lg p-2 text-steel hover:bg-stone"><X size={20} aria-hidden="true" /></button>
      </div>
      <form ref={form} onSubmit={submit} className="space-y-5 p-6">
        <p className="text-xs text-steel">All fields are required. Goals are in Ghana cedis (GH₵).</p>
        <div><label htmlFor="new-campaign-name" className="text-sm font-medium">Campaign name</label><input autoFocus required minLength={3} maxLength={100} id="new-campaign-name" name="name" placeholder="e.g. Books for our school library" className={inputClass} /></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="new-campaign-category" className="text-sm font-medium">Category</label>
            <div className="mt-2">
              <Select<CategoryOption>
                inputId="new-campaign-category"
                instanceId="new-campaign-category-select"
                value={selectedCategory}
                onChange={(opt) => setSelectedCategory(opt)}
                options={categoryOptions}
                placeholder="Select a category"
                isClearable
                styles={getSelectStyles<CategoryOption>({ minHeight: "42px", borderColor: "rgba(11, 37, 69, 0.2)" })}
                aria-label="Category"
              />
            </div>
            <input type="hidden" name="category" value={selectedCategory?.value ?? ""} />
          </div>
          <div><label htmlFor="new-campaign-location" className="text-sm font-medium">Location</label><input required minLength={2} maxLength={120} id="new-campaign-location" name="location" placeholder="e.g. Ho, Volta Region" className={inputClass} /></div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="new-campaign-goal" className="text-sm font-medium">Fundraising goal (GH₵)</label><input required type="number" min="1" max="100000000" step="0.01" inputMode="decimal" id="new-campaign-goal" name="goal" placeholder="25000.00" className={inputClass} /></div>
          <div><label htmlFor="new-campaign-closing" className="text-sm font-medium">Closing date</label><input required type="date" min={today} max="9999-12-31" id="new-campaign-closing" name="closing" className={inputClass} /></div>
        </div>
        <div><label htmlFor="new-campaign-description" className="text-sm font-medium">Campaign description</label><textarea required minLength={20} maxLength={2000} rows={4} id="new-campaign-description" name="description" placeholder="Who will benefit, what will the funds cover, and why does it matter?" className={inputClass + " resize-y"} /><p className="mt-1 text-xs text-steel">20–2,000 characters.</p></div>
        <p className="rounded-xl bg-gold/10 p-3 text-xs leading-relaxed text-steel">Your campaign is saved as a draft in this browser. It is not published or collecting payments yet.</p>
        {error && <p ref={errorRef} tabIndex={-1} role="alert" className="rounded-xl border border-crimson/20 bg-white p-3 text-sm text-crimson">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-navy/10 pt-5">
          <button type="button" onClick={() => dialog.current?.close()} className="rounded-xl border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone">Cancel</button>
          <button type="submit" className="rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel">Create campaign</button>
        </div>
      </form>
    </dialog>
  </>;
}
