"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
export default function RefreshData(){
  const [updated,setUpdated]=useState("Just now");
  const [showUpdated,setShowUpdated]=useState(true);
  useEffect(()=>{
    const timer=window.setTimeout(()=>setShowUpdated(false),4000);
    return ()=>window.clearTimeout(timer);
  },[]);
  function refresh(){setUpdated("Refreshing…");window.setTimeout(()=>window.location.reload(),80);}
  return <div className="flex items-center gap-3 text-xs text-steel">{showUpdated&&<span>Updated {updated}</span>}<button type="button" onClick={refresh} className="inline-flex items-center gap-1.5 rounded-lg border border-navy/15 bg-white px-2.5 py-1.5 font-medium text-navy hover:bg-stone"><RefreshCw size={13} aria-hidden="true" />Refresh</button></div>;
}
