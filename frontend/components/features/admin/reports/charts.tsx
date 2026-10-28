"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";

const INK = "#0b2545"; // navy: the single data hue
const GRID = "#e4e8ee";
const MUTED = "#5a6a82";

export type TrendPoint = { key: string; label: string; amount: number };

/** Rounds up to a "nice" axis ceiling, e.g. 83,200 -> 90,000. */
function niceCeiling(max: number) {
  if (max <= 0) return 100;
  const magnitude = 10 ** (Math.floor(Math.log10(max)));
  return Math.ceil(max / magnitude) * magnitude;
}

type Pt = [number, number];

/** Monotone cubic curve through the points: smooth, but never dips below or overshoots the data. */
function smoothPath(pts: Pt[]) {
  if (pts.length < 3) return pts.map(([px, py], i) => `${i ? "L" : "M"}${px},${py}`).join(" ");
  const n = pts.length;
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const slope = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
  const m = [slope[0]];
  for (let i = 1; i < n - 1; i++) m.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
  m.push(slope[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / slope[i], b = m[i + 1] / slope[i], h = Math.hypot(a, b);
    if (h > 3) { m[i] = (3 * a * slope[i]) / h; m[i + 1] = (3 * b * slope[i]) / h; }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const w = dx[i] / 3;
    d += ` C${pts[i][0] + w},${pts[i][1] + m[i] * w} ${pts[i + 1][0] - w},${pts[i + 1][1] - m[i + 1] * w} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

/** Line + soft area over time, with a hover crosshair and tooltip. */
export function TrendChart({ points, everyNth }: { points: TrendPoint[]; everyNth: number }) {
  const [active, setActive] = useState<number | null>(null);
  const W = 720, H = 260, L = 56, R = 16, T = 16, B = 32;
  const max = Math.max(...points.map((p) => p.amount), 0);
  const ceiling = niceCeiling(max);
  const x = (i: number) => L + (points.length <= 1 ? 0 : (i / (points.length - 1)) * (W - L - R));
  const y = (v: number) => T + (1 - v / ceiling) * (H - T - B);
  const line = smoothPath(points.map((p, i): Pt => [x(i), y(p.amount)]));
  const current = active === null ? null : points[active];

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label={`Funds generated over time, peaking at ${formatMoney(max)}`}
          onMouseLeave={() => setActive(null)}
          onMouseMove={(e) => {
            const box = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - box.left) / box.width) * W;
            const i = Math.round(((px - L) / (W - L - R)) * (points.length - 1));
            setActive(Math.min(points.length - 1, Math.max(0, i)));
          }}
        >
          {[0, 1, 2, 3, 4].map((s) => {
            const v = (ceiling / 4) * s;
            return (
              <g key={s}>
                <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={GRID} strokeWidth="1" />
                <text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill={MUTED}>
                  {v >= 1000 ? `${Math.round(v / 1000)}k` : v}
                </text>
              </g>
            );
          })}
          <defs>
            <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={INK} stopOpacity="0.18" />
              <stop offset="100%" stopColor={INK} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill="url(#trend-fill)" />
          <path d={line} fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {active === null && points.length > 0 && (
            <circle cx={x(points.length - 1)} cy={y(points[points.length - 1].amount)} r="4" fill={INK} stroke="white" strokeWidth="2" />
          )}
          {points.map((p, i) =>
            i % everyNth === 0 ? (
              <text key={p.key} x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill={MUTED}>
                {p.label}
              </text>
            ) : null,
          )}
          {current && active !== null && (
            <g>
              <line x1={x(active)} x2={x(active)} y1={T} y2={H - B} stroke={MUTED} strokeDasharray="3 3" />
              <circle cx={x(active)} cy={y(current.amount)} r="5" fill={INK} stroke="white" strokeWidth="2" />
            </g>
          )}
        </svg>
        {current && active !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-midnight px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{ left: `${(x(active) / W) * 100}%` }}
          >
            <span className="text-white/70">{current.label}</span> · {formatMoney(current.amount)}
          </div>
        )}
      </div>
      <details className="mt-3 text-xs text-steel">
        <summary className="cursor-pointer underline underline-offset-4">View as table</summary>
        <div className="mt-2 max-h-48 overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-1.5 font-medium">Period</th>
                <th className="py-1.5 text-right font-medium">Funds generated</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.key} className="border-t border-navy/10">
                  <td className="py-1.5">{p.label}</td>
                  <td className="py-1.5 text-right tabular-nums">{formatMoney(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export type BarRow = { label: string; value: number; display: string; color?: string; hint?: string };

/** Horizontal bars with the value written at the end of each bar (no legend needed). */
export function BarList({ rows, empty }: { rows: BarRow[]; empty: string }) {
  const max = Math.max(...rows.map((r) => r.value), 0);
  if (!rows.length || max === 0) return <p className="py-10 text-center text-sm text-steel">{empty}</p>;
  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-ink" title={row.label}>
              {row.label}
            </span>
            <span className="shrink-0 font-medium tabular-nums text-navy">{row.display}</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-navy/[0.06]">
            <div
              className="h-full rounded-l-full rounded-r-[4px]"
              style={{ width: `${Math.max((row.value / max) * 100, 1.5)}%`, backgroundColor: row.color ?? INK }}
            />
          </div>
          {row.hint && <p className="mt-1 text-xs text-steel">{row.hint}</p>}
        </li>
      ))}
    </ul>
  );
}
