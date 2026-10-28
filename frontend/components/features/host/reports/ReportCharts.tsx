"use client";
import { useState } from "react";
import { money } from "@/components/features/host/shared/demo";
import { monthLabel } from "@/components/features/host/reports/reports";

export const chartColours = ["#0b2545", "#c08a2e", "#2e4c6d", "#256b4a", "#a13d3d", "#75695d"];
export function TrendChart({ points, daily }: { points: { key: string; amount: number }[]; daily: boolean }) {
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const selected = points.find(point => point.key === focusedKey);
  const max = Math.max(...points.map(point => point.amount), 100);
  const ceiling = Math.ceil(max / 100000) * 100000;
  const x = (index: number) => 65 + (points.length <= 1 ? 300 : index / (points.length - 1) * 600);
  const y = (amount: number) => 220 - amount / ceiling * 170;
  const path = points.map((point, index) => (index ? "L" : "M") + x(index) + "," + y(point.amount)).join(" ");
  const label = (key: string) => daily ? key.slice(8) + " " + monthLabel(key.slice(0,7)) : monthLabel(key);
  if (!points.length) return <p className="py-20 text-center text-sm text-steel">No donation data to chart yet.</p>;
  return <div>
    <div aria-live="polite" className="mb-2 min-h-6 text-sm text-steel">{selected ? label(selected.key) + ": " + money(selected.amount) : "Hover or focus a point to inspect the amount."}</div>
    <div className="overflow-x-auto">
      <svg viewBox="0 0 700 270" className="min-w-[450px] w-full" role="group" aria-label={daily ? "Daily successful donations in Ghana cedis" : "Monthly successful donations in Ghana cedis"}>
        <defs><linearGradient id="report-trend-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#c08a2e" stopOpacity="0.22" /><stop offset="100%" stopColor="#c08a2e" stopOpacity="0.015" /></linearGradient></defs>
        {[0,1,2,3,4].map(step => <g key={step}><line x1="65" x2="665" y1={220-step*42.5} y2={220-step*42.5} stroke="#eadfce" strokeDasharray="4 5" /><text x="53" y={224-step*42.5} textAnchor="end" fill="#75695d" fontSize="11">{(ceiling / 100 * step / 4).toLocaleString("en-GH", {maximumFractionDigits:0})}</text></g>)}
        <text x="65" y="25" fill="#75695d" fontSize="11">GH₵</text>
        <path d={path + " L" + x(points.length-1) + ",220 L" + x(0) + ",220 Z"} fill="url(#report-trend-fill)" />
        <path d={path} fill="none" stroke="#c08a2e" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point,index) => <g key={point.key}>
          <circle cx={x(index)} cy={y(point.amount)} r={selected?.key === point.key ? 6 : 4} fill="white" stroke="#c08a2e" strokeWidth="2" />
          <circle cx={x(index)} cy={y(point.amount)} r="10" fill="transparent" tabIndex={0} role="img" aria-label={label(point.key) + ": " + money(point.amount)} onFocus={() => setFocusedKey(point.key)} onBlur={() => setFocusedKey(null)} onMouseEnter={() => setFocusedKey(point.key)} onMouseLeave={() => setFocusedKey(null)} onClick={() => setFocusedKey(point.key)} style={{cursor:"crosshair"}}><title>{label(point.key) + ": " + money(point.amount)}</title></circle>
          {(!daily || index === 0 || index === points.length-1 || (index+1)%7 === 0) && <text x={x(index)} y="247" textAnchor="middle" fill="#75695d" fontSize="11">{daily ? point.key.slice(8) : monthLabel(point.key).split(" ")[0].slice(0,3)}</text>}
        </g>)}
      </svg>
    </div>
    <details className="mt-2 text-xs text-steel"><summary className="cursor-pointer underline underline-offset-4">View chart data</summary><div className="mt-3 max-h-48 overflow-auto"><table className="w-full text-left"><caption className="sr-only">Donation trend values</caption><thead><tr><th scope="col" className="py-2">Period</th><th scope="col" className="py-2 text-right">Raised</th></tr></thead><tbody>{points.map(point => <tr key={point.key} className="border-t border-navy/10"><td className="py-2">{label(point.key)}</td><td className="py-2 text-right tabular-nums">{money(point.amount)}</td></tr>)}</tbody></table></div></details>
  </div>;
}

export function OutcomeChart({ outcomes }: { outcomes: {status:string;count:number}[] }) {
  const total = outcomes.reduce((sum,item) => sum+item.count,0);
  const colours = ["#0b2545", "#c08a2e", "#a13d3d"];
  const circumference = 2*Math.PI*70;
  return <div>
    <div className="relative mx-auto h-52 w-52">
      <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={outcomes.map(item => (item.status === "Paid" ? "Successful" : item.status) + ": " + item.count).join(", ")}>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#eadfce" strokeWidth="24" />
        {total > 0 && outcomes.map((item,index) => <circle key={item.status} cx="100" cy="100" r="70" fill="none" stroke={colours[index]} strokeWidth="24" strokeDasharray={(item.count/total*circumference) + " " + circumference} strokeDashoffset={-outcomes.slice(0,index).reduce((sum,previous) => sum+previous.count,0)/total*circumference} transform="rotate(-90 100 100)" />)}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-medium tabular-nums text-navy">{total}</span><span className="mt-1 text-xs text-steel">payment attempts</span></div>
    </div>
    <ul className="mt-5 space-y-3">{outcomes.map((item,index) => <li key={item.status} className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 text-steel"><span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor:colours[index]}} />{item.status === "Paid" ? "Successful" : item.status}</span><span className="font-medium tabular-nums text-navy">{item.count} <span className="ml-2 text-xs font-normal text-steel">{total ? Math.round(item.count/total*100) : 0}%</span></span></li>)}</ul>
  </div>;
}
