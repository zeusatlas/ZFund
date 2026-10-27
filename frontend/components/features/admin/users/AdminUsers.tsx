"use client";

import { Check, ChevronLeft, ChevronRight, MoreHorizontal, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AddHostModal } from "../dashboard/AddHostModal";
import { hostAccounts, type HostAccount } from "../dashboard/data";
import UserStats from "./UserStats";

function StatusBadge({ status }: { status: HostAccount["status"] }) {
  const styles = {
    Active: "bg-[#e9f4ef] text-[#287754]",
    Pending: "bg-[#fff4dc] text-[#a26c12]",
    Suspended: "bg-[#fbeaea] text-[#a13d3d]",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function AdminUsers() {
  const [hosts, setHosts] = useState(hostAccounts);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [showAddHost, setShowAddHost] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const filteredHosts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return hosts.filter((host) => {
      const matchesSearch =
        !query ||
        host.name.toLowerCase().includes(query) ||
        host.phone.toLowerCase().includes(query);
      const matchesStatus = status === "All statuses" || host.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [hosts, search, status]);
  const pageCount = Math.max(1, Math.ceil(filteredHosts.length / pageSize));
  const visibleHosts = filteredHosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function addHost(host: HostAccount) {
    setHosts((current) => [host, ...current]);
    setShowAddHost(false);
    setNotice(`${host.name} has been invited as a pending host.`);
  }

  function updateHostStatus(host: HostAccount, nextStatus: HostAccount["status"]) {
    setHosts((current) =>
      current.map((item) =>
        item.id === host.id ? { ...item, status: nextStatus } : item,
      ),
    );
    setOpenMenuId(null);
    setNotice(
      nextStatus === "Active"
        ? `${host.name} now has active access.`
        : `${host.name} has been suspended.`,
    );
  }

  function resendInvitation(host: HostAccount) {
    setOpenMenuId(null);
    setNotice(`A new invitation was prepared for ${host.phone}.`);
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy md:text-3xl">
            Host accounts
          </h1>
          <p className="mt-2 text-sm text-steel">
            Manage the users who are allowed to generate funds.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddHost(true)}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white transition hover:bg-steel"
        >
          <UserPlus size={17} />
          Add host
        </button>
      </section>

      <UserStats hosts={hosts} />

      <section className="overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        {notice && (
          <div className="flex items-center justify-between gap-3 border-b border-[#cfe6d9] bg-[#f1faf4] px-4 py-3 text-sm text-[#287754] md:px-5">
            <span className="flex items-center gap-2">
              <Check size={16} />
              {notice}
            </span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-xs font-medium underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="flex flex-col gap-3 border-b border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search hosts"
              aria-label="Search host accounts"
              className="w-full rounded-lg border border-navy/15 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gold"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by status"
            className="rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm text-steel outline-none focus:border-gold"
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-stone-light text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-5 py-3 font-medium">Host</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Funds issued</th>
                <th className="px-4 py-3 font-medium">Last active</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10">
              {visibleHosts.map((host) => (
                <tr key={host.id} className="text-sm">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-medium text-white">
                        {host.initials}
                      </span>
                      <div>
                        <Link href={`/dashboard/admin/users/${host.id}`} className="font-medium text-ink hover:text-gold">
                          {host.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-steel">{host.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={host.status} /></td>
                  <td className="px-4 py-4 font-medium text-ink">{host.fundsIssued}</td>
                  <td className="px-4 py-4 text-xs text-steel">{host.lastActive}</td>
                  <td className="relative px-5 py-4 text-right">
                    <button
                      type="button"
                      aria-label={`More actions for ${host.name}`}
                      aria-expanded={openMenuId === host.id}
                      onClick={() => setOpenMenuId((current) => current === host.id ? null : host.id)}
                      className="rounded-md p-1.5 text-steel hover:bg-stone"
                    >
                      <MoreHorizontal size={17} />
                    </button>
                    {openMenuId === host.id && (
                      <div className="absolute right-5 top-12 z-10 w-44 rounded-lg border border-navy/10 bg-white py-1 text-left shadow-lg">
                        {host.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => updateHostStatus(host, "Active")}
                            className="block w-full px-3 py-2 text-xs text-ink hover:bg-stone"
                          >
                            Approve host
                          </button>
                        )}
                        {host.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => resendInvitation(host)}
                            className="block w-full px-3 py-2 text-xs text-ink hover:bg-stone"
                          >
                            Resend invitation
                          </button>
                        )}
                        {host.status === "Active" && (
                          <button
                            type="button"
                            onClick={() => updateHostStatus(host, "Suspended")}
                            className="block w-full px-3 py-2 text-xs text-crimson hover:bg-stone"
                          >
                            Suspend access
                          </button>
                        )}
                        {host.status === "Suspended" && (
                          <button
                            type="button"
                            onClick={() => updateHostStatus(host, "Active")}
                            className="block w-full px-3 py-2 text-xs text-ink hover:bg-stone"
                          >
                            Reactivate access
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHosts.length === 0 && (
          <p className="p-8 text-center text-sm text-steel">No host accounts found.</p>
        )}

        {filteredHosts.length > 0 && (
          <div className="flex items-center justify-between border-t border-navy/10 px-4 py-3 md:px-5">
            <p className="text-xs text-steel">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredHosts.length)} of {filteredHosts.length} hosts
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex items-center gap-1 rounded-md border border-navy/15 px-2.5 py-1.5 text-xs font-medium text-steel hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="text-xs font-medium text-navy">{currentPage} / {pageCount}</span>
              <button
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                className="inline-flex items-center gap-1 rounded-md border border-navy/15 px-2.5 py-1.5 text-xs font-medium text-steel hover:bg-stone disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {showAddHost && (
        <AddHostModal onClose={() => setShowAddHost(false)} onAdd={addHost} />
      )}
    </div>
  );
}
