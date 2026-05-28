"use client";

import Link from "next/link";
import { MessageCircle, Plus, Search, Clock, CheckCircle, AlertCircle, Circle } from "lucide-react";
import { useState } from "react";

const TICKETS = [
  {
    id: "TKT-0014",
    subject: "cPanel login not working after password reset",
    department: "technical",
    priority: "high",
    status: "open",
    created: "Jun 3, 2025",
    updated: "10 minutes ago",
    messages: 3,
  },
  {
    id: "TKT-0013",
    subject: "Request to upgrade from Starter to Business hosting",
    department: "billing",
    priority: "medium",
    status: "in_progress",
    created: "May 30, 2025",
    updated: "2 hours ago",
    messages: 6,
  },
  {
    id: "TKT-0012",
    subject: "SSL certificate not installing on swiftpay.ng",
    department: "technical",
    priority: "high",
    status: "resolved",
    created: "May 25, 2025",
    updated: "May 27, 2025",
    messages: 8,
  },
  {
    id: "TKT-0011",
    subject: "Invoice INV-2025-00031 — payment confirmation",
    department: "billing",
    priority: "low",
    status: "closed",
    created: "Apr 5, 2025",
    updated: "Apr 5, 2025",
    messages: 2,
  },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: typeof Circle }> = {
  open:        { label: "Open",        color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   icon: AlertCircle },
  in_progress: { label: "In Progress", color: "#3b82f6", bg: "rgba(59,130,246,0.1)",   icon: Clock },
  resolved:    { label: "Resolved",    color: "#10b981", bg: "rgba(16,185,129,0.1)",   icon: CheckCircle },
  closed:      { label: "Closed",      color: "#475569", bg: "rgba(71,85,105,0.1)",    icon: Circle },
};

const PRIORITY_MAP: Record<string, { color: string; bg: string }> = {
  low:      { color: "#64748b", bg: "rgba(100,116,139,0.1)" },
  medium:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  high:     { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  critical: { color: "#dc2626", bg: "rgba(220,38,38,0.15)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status];
  if (!s) return null;
  const Icon = s.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600, background: s.bg, color: s.color }}>
      <Icon size={10} /> {s.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITY_MAP[priority] ?? PRIORITY_MAP.low;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: "0.7rem", fontWeight: 600, background: p.bg, color: p.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {priority}
    </span>
  );
}

export default function SupportPage() {
  const [filter, setFilter] = useState("all");
  const filtered = TICKETS.filter(t => filter === "all" || t.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .ticket-row {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }
        .ticket-row:last-child { border-bottom: none; }
        .ticket-row:hover { background: rgba(255,255,255,0.02); }
        .filter-tab {
          padding: 6px 14px;
          border-radius: 7px;
          font-size: 0.82rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s;
          background: none;
        }
        .filter-tab--active {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.1);
          color: #f1f5f9;
        }
        .filter-tab:not(.filter-tab--active) { color: #475569; }
        .filter-tab:not(.filter-tab--active):hover { color: #94a3b8; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 2 }}>Support Tickets</h2>
          <p style={{ color: "#475569", fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {TICKETS.filter(t => t.status === "open" || t.status === "in_progress").length} active tickets
          </p>
        </div>
        <Link href="/client/support/new" style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#f59e0b", color: "#000", borderRadius: 9, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", fontFamily: "'Syne', sans-serif" }}>
          <Plus size={15} /> New Ticket
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[
          { key: "all", label: "All" },
          { key: "open", label: "Open" },
          { key: "in_progress", label: "In Progress" },
          { key: "resolved", label: "Resolved" },
          { key: "closed", label: "Closed" },
        ].map(f => (
          <button key={f.key} className={`filter-tab ${filter === f.key ? "filter-tab--active" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <div style={{ background: "#0d1321", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
        {filtered.map(t => (
          <Link key={t.id} href={`/client/support/${t.id}`} className="ticket-row">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#475569" }}>{t.id}</span>
                <StatusBadge status={t.status} />
                <PriorityBadge priority={t.priority} />
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: "0.7rem", color: "#475569", background: "rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                  {t.department}
                </span>
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{t.subject}</div>
              <div style={{ fontSize: "0.75rem", color: "#334155", fontFamily: "'DM Sans', sans-serif" }}>
                Opened {t.created} · Updated {t.updated}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                <MessageCircle size={12} /> {t.messages}
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 16px", color: "#334155", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif" }}>
            No tickets found.
          </div>
        )}
      </div>
    </>
  );
}