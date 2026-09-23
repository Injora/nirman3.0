"use client";

import { useMemo, useState } from "react";
import type { Registration } from "@/lib/supabase/types";

export default function AdminTable({ registrations }: { registrations: Registration[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registrations.filter((r) => {
      const matchesQuery =
        !q ||
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.student_id.toLowerCase().includes(q) ||
        r.registration_code.toLowerCase().includes(q) ||
        r.branch.toLowerCase().includes(q);
      const matchesStatus = status === "all" || r.registration_status === status;
      return matchesQuery && matchesStatus;
    });
  }, [registrations, query, status]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, student ID, branch, code…"
          className="flex-1 border-2 border-paper bg-void px-4 py-3 font-mono text-sm text-paper placeholder:text-paper/30 outline-none focus:border-volt"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border-2 border-paper bg-void px-4 py-3 font-mono text-xs uppercase tracking-widest text-paper outline-none focus:border-volt"
        >
          <option value="all">All statuses</option>
          <option value="registered">Registered</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
        Showing {filtered.length} of {registrations.length}
      </p>

      <div className="mt-6 overflow-x-auto border-2 border-paper/20">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-paper/20 bg-void-soft">
              {["Name", "Email", "Student ID", "Phone", "Branch", "Year", "Registered", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-paper/10 hover:bg-void-soft/60">
                <td className="px-4 py-3 text-sm font-medium">{r.full_name}</td>
                <td className="px-4 py-3 text-sm text-paper/70">{r.email}</td>
                <td className="px-4 py-3 font-mono text-xs text-paper/70">{r.student_id}</td>
                <td className="px-4 py-3 font-mono text-xs text-paper/70">{r.phone_number}</td>
                <td className="px-4 py-3 text-sm text-paper/70">{r.branch}</td>
                <td className="px-4 py-3 text-sm text-paper/70">{r.year}</td>
                <td className="px-4 py-3 font-mono text-xs text-paper/50">
                  {new Date(r.created_at).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <span className="border border-volt px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-volt">
                    {r.registration_status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-paper/40">
                  No registrations match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
