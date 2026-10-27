"use client";
import {useMemo,useSyncExternalStore} from "react";
import {availableForCampaign,exampleWithdrawals,savedWithdrawalSchema,withdrawalFormSchema,type Withdrawal} from "./withdrawals";
const key="zfund-host-withdrawals-v1";
const eventName="zfund-withdrawals-changed";
function subscribe(notify:()=>void) {
  const storage=(event:StorageEvent)=>{if(event.key===key||event.key===null)notify();};
  window.addEventListener("storage",storage);window.addEventListener(eventName,notify);
  return ()=>{window.removeEventListener("storage",storage);window.removeEventListener(eventName,notify);};
}
function snapshot(){try{return window.localStorage.getItem(key)??"[]";}catch{return "[]";}}
function parse(raw:string):Withdrawal[]{return savedWithdrawalSchema.array().parse(JSON.parse(raw));}
export function useWithdrawals(){
  const raw=useSyncExternalStore(subscribe,snapshot,()=>"[]");
  return useMemo(()=>{try{return [...parse(raw),...exampleWithdrawals];}catch{return exampleWithdrawals;}},[raw]);
}
export function requestWithdrawal(fields:Record<string,FormDataEntryValue>){
  const parsed=withdrawalFormSchema.safeParse(fields);
  if(!parsed.success)throw Error(parsed.error.issues[0].message);
  const data=parsed.data;
  let existing:Withdrawal[];
  try{existing=parse(window.localStorage.getItem(key)??"[]");}catch{throw Error("Browser storage is unavailable or could not be read. Your request has not been saved.");}
  if(data.amount>availableForCampaign(data.campaignId,[...existing,...exampleWithdrawals]))throw Error("This amount exceeds the campaign’s available funds. Reduce the amount and try again.");
  const request:Withdrawal={id:"WD-LOCAL-"+crypto.randomUUID(),campaignId:data.campaignId,amount:data.amount,status:"In review",date:new Date().toISOString().slice(0,10),method:data.method,recipient:data.recipient,institution:data.institution,destination:"•••• "+data.account.replace(/\D/g,"").slice(-4),purpose:data.purpose,note:"Request saved in this browser. No request has been sent to an administrator or payment provider."};
  try{window.localStorage.setItem(key,JSON.stringify([request,...existing]));}catch{throw Error("The request could not be saved. Check browser storage and try again.");}
  window.dispatchEvent(new Event(eventName));return request;
}
