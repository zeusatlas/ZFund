"use client";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {ArrowUpRight,X} from "lucide-react";
import {money,type Campaign} from "../_data/demo";
import {availableForCampaign,type Withdrawal} from "../_data/withdrawals";
import {requestWithdrawal} from "../_data/use-withdrawals";
const field="mt-2 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 text-sm text-navy";
export default function WithdrawalRequest({campaigns,withdrawals,onRequested}:{campaigns:Campaign[];withdrawals:Withdrawal[];onRequested:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null),form=useRef<HTMLFormElement>(null),busy=useRef(false),errorRef=useRef<HTMLParagraphElement>(null);
  const [open,setOpen]=useState(false),[error,setError]=useState(""),[campaignId,setCampaignId]=useState(""),[method,setMethod]=useState("Mobile money");
  const eligible=campaigns.filter(campaign=>availableForCampaign(campaign.id,withdrawals)>=100);
  const available=availableForCampaign(campaignId,withdrawals);
  useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";return ()=>{document.body.style.overflow=previous;};},[open]);
  useEffect(()=>{if(error)errorRef.current?.focus();},[error]);
  function show(){form.current?.reset();setError("");setCampaignId(eligible[0]?.id??"");setMethod("Mobile money");setOpen(true);dialog.current?.showModal();}
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(busy.current)return;busy.current=true;setError("");try{requestWithdrawal(Object.fromEntries(new FormData(event.currentTarget)));onRequested();dialog.current?.close();}catch(failure){setError(failure instanceof Error?failure.message:"Could not save your request. Please try again.");}finally{busy.current=false;}}
  return <><button type="button" onClick={show} disabled={!eligible.length} className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel disabled:cursor-not-allowed disabled:opacity-40">Request withdrawal<ArrowUpRight size={17} aria-hidden="true" /></button>
    <dialog ref={dialog} onClose={()=>setOpen(false)} aria-labelledby="withdrawal-title" aria-describedby="withdrawal-description" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border-0 bg-stone-light p-0 text-navy shadow-xl backdrop:bg-midnight/60">
      <div className="flex items-start justify-between gap-4 border-b border-navy/10 bg-white p-6"><div><h2 id="withdrawal-title" className="text-2xl font-medium tracking-tight">Request a withdrawal</h2><p id="withdrawal-description" className="mt-2 text-sm text-steel">Choose a campaign and tell us where the funds should go.</p></div><button type="button" onClick={()=>dialog.current?.close()} aria-label="Close withdrawal request" className="rounded-lg p-2 hover:bg-stone"><X size={20} aria-hidden="true" /></button></div>
      <form ref={form} onSubmit={submit} className="space-y-5 p-6">
        <p className="rounded-xl bg-gold/10 p-3 text-xs leading-relaxed text-steel">Use recipient details to save a local request. No money is moved, and only the last four destination digits are saved.</p>
        <div><label htmlFor="withdraw-campaign" className="text-sm font-medium">Campaign</label><select autoFocus required id="withdraw-campaign" name="campaignId" value={campaignId} onChange={event=>setCampaignId(event.target.value)} className={field}>{eligible.map(campaign=><option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select><p className="mt-2 text-xs text-steel">Available to request: <strong>{money(available)}</strong></p></div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="withdraw-amount" className="text-sm font-medium">Amount (GH₵)</label><input required id="withdraw-amount" name="amount" type="number" min="1" max={available/100} step="0.01" inputMode="decimal" placeholder="500.00" className={field} /></div><div><label htmlFor="withdraw-method" className="text-sm font-medium">Payout method</label><select id="withdraw-method" name="method" value={method} onChange={event=>setMethod(event.target.value)} className={field}><option>Mobile money</option><option>Bank transfer</option></select></div></div>
        <div><label htmlFor="withdraw-recipient" className="text-sm font-medium">Recipient / account name</label><input required id="withdraw-recipient" name="recipient" minLength={3} maxLength={100} placeholder="e.g. Community project committee" className={field} /></div>
        <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="withdraw-institution" className="text-sm font-medium">{method==="Mobile money"?"Mobile money network":"Bank name"}</label><input required id="withdraw-institution" name="institution" minLength={2} maxLength={100} className={field} /></div><div><label htmlFor="withdraw-account" className="text-sm font-medium">{method==="Mobile money"?"Mobile money number":"Account number"}</label><input key={method} required id="withdraw-account" name="account" type="tel" maxLength={30} autoComplete="off" placeholder={method==="Mobile money"?"024 000 0000":"Account number"} className={field} /></div></div>
        <div><label htmlFor="withdraw-purpose" className="text-sm font-medium">What will the funds cover?</label><textarea required id="withdraw-purpose" name="purpose" minLength={10} maxLength={500} rows={3} placeholder="Describe the project expenses this withdrawal will pay for." className={field+" resize-y"} /></div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-steel"><input required type="checkbox" className="mt-1 accent-navy" />I have checked the amount and recipient details. I understand this request is saved locally.</label>
        {error&&<p ref={errorRef} tabIndex={-1} role="alert" className="rounded-xl border border-crimson/20 bg-white p-3 text-sm text-crimson">{error}</p>}
        <div className="flex flex-wrap justify-end gap-3 border-t border-navy/10 pt-5"><button type="button" onClick={()=>dialog.current?.close()} className="rounded-xl border border-navy/20 bg-white px-5 py-3 text-sm font-medium hover:bg-stone">Cancel</button><button type="submit" className="rounded-xl bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-steel">Submit request</button></div>
      </form>
    </dialog>
  </>;
}
