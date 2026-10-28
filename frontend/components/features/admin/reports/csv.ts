type Cell = string | number;

const escape = (cell: Cell) => {
  const text = String(cell);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Sections are separated by a blank row so the file opens cleanly in Excel. */
export function downloadCsv(filename: string, sections: { title: string; rows: Cell[][] }[]) {
  const body = sections
    .map(({ title, rows }) => [[title], ...rows].map((row) => row.map(escape).join(",")).join("\n"))
    .join("\n\n");
  const url = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}
