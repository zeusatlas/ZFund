import { z } from "zod";
import { campaignTotals, hostStats } from "@/components/features/host/shared/demo";
export const withdrawalStatuses = ["In review", "Processing", "Paid", "Rejected"] as const;
export type Withdrawal = { id: string; campaignId: string; amount: number; status: typeof withdrawalStatuses[number]; date: string; method: "Mobile money" | "Bank transfer"; recipient: string; institution: string; destination: string; purpose: string; note: string };
export const exampleWithdrawals: Withdrawal[] = [
  { id:"WD-005", campaignId:"ZF-004", amount:250000, status:"In review", date:"2026-10-26", method:"Mobile money",recipient:"Akosua Mensah",institution:"Mobile money wallet",destination:"•••• 0345",purpose:"Medical support for an association member.",note:"Awaiting administrator review." },
  { id:"WD-004", campaignId:"ZF-005", amount:100000, status:"Processing", date:"2026-10-25", method:"Bank transfer",recipient:"School library committee",institution:"Bank account",destination:"•••• 0891",purpose:"First order of books and reading materials.",note:"Approved in this example. Payout confirmation is pending." },
  { id:"WD-003", campaignId:"ZF-006", amount:50000, status:"Rejected", date:"2026-10-24", method:"Mobile money",recipient:"Community water committee",institution:"Mobile money wallet",destination:"•••• 0202",purpose:"Site inspection costs.",note:"Recipient details did not match the supporting documents. No funds were deducted." },
  { id:"WD-002", campaignId:"ZF-003", amount:600000, status:"Paid", date:"2026-09-30", method:"Bank transfer",recipient:"School essentials committee",institution:"Bank account",destination:"•••• 0712",purpose:"Exercise books and school bags.",note:"Payout completed." },
  { id:"WD-001", campaignId:"ZF-002", amount:500000, status:"Paid", date:"2026-08-20", method:"Mobile money",recipient:"Community food committee",institution:"Mobile money wallet",destination:"•••• 0456",purpose:"Food packages for the community drive.",note:"Payout completed." },
];
export const withdrawalFormSchema=z.object({
  campaignId:z.string().min(1,"Choose a campaign."),
  amount:z.string().regex(/^\d+(\.\d{1,2})?$/,"Enter an amount with up to two decimal places.").transform(value=>Math.round(Number(value)*100)).pipe(z.number().int().min(100,"Request at least GH₵ 1.").max(10000000000)),
  method:z.enum(["Mobile money","Bank transfer"]),
  recipient:z.string().trim().min(3,"Enter the recipient’s name.").max(100),
  institution:z.string().trim().min(2,"Enter the network or bank name.").max(100),
  account:z.string().trim().min(1,"Enter the destination number."),
  purpose:z.string().trim().min(10,"Describe how the funds will be used in at least 10 characters.").max(500),
}).superRefine((data,context)=>{
  const number=data.account.replace(/[\s-]/g,"");
  const valid=data.method==="Mobile money" ? /^(0\d{9}|\+233\d{9})$/.test(number) : /^\d{6,24}$/.test(number);
  if(!valid) context.addIssue({code:"custom",path:["account"],message:data.method==="Mobile money" ? "Enter a 10-digit Ghana mobile number, or +233 followed by 9 digits." : "Enter a bank account number containing 6–24 digits."});
});
export const savedWithdrawalSchema=z.object({id:z.string().startsWith("WD-LOCAL-"),campaignId:z.string(),amount:z.number().int().positive(),status:z.literal("In review"),date:z.iso.date(),method:z.enum(["Mobile money","Bank transfer"]),recipient:z.string().max(100),institution:z.string().max(100),destination:z.string().regex(/^•••• \d{4}$/),purpose:z.string().max(500),note:z.string()});
export function isReserved(item: Withdrawal) { return item.status==="In review" || item.status==="Processing"; }
export function availableForCampaign(id:string,items:Withdrawal[]) {
  return Math.max(0,campaignTotals(id).raised-items.filter(item=>item.campaignId===id&&(item.status==="Paid"||isReserved(item))).reduce((sum,item)=>sum+item.amount,0));
}
export function withdrawalBalances(items:Withdrawal[]) {
  const paid=items.filter(item=>item.status==="Paid").reduce((sum,item)=>sum+item.amount,0);
  const reserved=items.filter(isReserved).reduce((sum,item)=>sum+item.amount,0);
  return {raised:hostStats.raised,paid,reserved,available:Math.max(0,hostStats.raised-paid-reserved)};
}
