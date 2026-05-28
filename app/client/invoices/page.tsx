"use client";

import Link from "next/link";
import { FileText, Download, CreditCard, Search, Filter } from "lucide-react";
import { useState } from "react";

const INVOICES = [
  { id: "INV-2025-00047", service: "Business Hosting — Monthly Renewal", amount: 7500, status: "unpaid", issued: "Jun 1, 2025", due: "Jun 10, 2025" },
  { id: "INV-2025-00046", service: "swiftpay.ng — Annual Renewal", amount: 3500, status: "unpaid", issued: "Jun 1, 2025", due: "Jun 15, 2025" },
  { id: "INV-2025-00044", service: "SSL Certificate — DV Wildcard", amount: 5000, status: "paid", issued: "May 1, 2025", due: "May 1, 2025" },
  { id: "INV-2025-00039", service: "Business Hosting — Monthly Renewal", amount: 7500, status: "paid", issued: "May 1, 2025", due: "May 1, 2025" },
  { id: "INV-2025-00031", service: "Starter Hosting — Monthly Renewal", amount: 2500, status: "paid", issued: "Apr 1, 2025", due: "Apr 1, 2025" },
  { id: "INV-2025-00028", service: "swiftpayng.com — Domain Registration", amount: 8500, status: "paid", issued: "Mar 12, 2025", due: "Mar 12, 2025" },
];

type Filter = "all" | "unpaid" | "paid";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    paid:    { label: "Paid",    color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    unpaid:  { label: "Unpaid",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    overdue: { label: "Overdue", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  };
  const s = map[status] ?? { label: status, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

export default function InvoicesPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = INVOICES.filter(inv => {
    const matchFilter = filter === "all" || inv.status === filter;
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) || inv.service.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalUnpaid = INVOICES.filter(i => i.status === "unpaid").reduce((s, i) => s + i.amount, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .inv-table { width: 100%; border-collapse: collapse; }
        .inv-table th {
          text-align: left;
          padding: 10px 16px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #334155;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .inv-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .inv-table tr:last-child td { border-bottom: none; }
        .inv-table tbody tr { transition: background 0.15s; cursor: pointer; }
        .inv-table tbody tr:hover { background: rgba(255,255,255,0.02); }
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
        .search-input {
          background: #0d1321;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 8px 14px 8px 36px;
          color: #f1f5f9;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          width: 220px;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: rgba(245,158,11,0.4); }
        .icon-btn {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 7px;
          color: #64748b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
        }
        .icon-btn:hover { color: #f1f5f9; border-color: rgba(255,255,255,0.14); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 2 }}>Invoices</h2>
          <p style={{ color: "#475569", fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{INVOICES.length} invoices total</p>
        </div>
        {totalUnpaid > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "#475569", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Balance Due</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#f59e0b" }}>₦{totalUnpaid.toLocaleString()}</div>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#f59e0b", color: "#000", borderRadius: 9, fontSize: "0.85rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
              <CreditCard size={14} /> Pay All
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["all", "unpaid", "paid"] as Filter[]).map(f => (
            <button key={f} className={`filter-tab ${filter === f ? "filter-tab--active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
          <input type="text" className="search-input" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#0d1321", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
        <table className="inv-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Service</th>
              <th>Issued</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#94a3b8" }}>{inv.id}</span>
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={13} color="#64748b" />
                    </div>
                    <span style={{ fontSize: "0.875rem", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>{inv.service}</span>
                  </div>
                </td>
                <td><span style={{ fontSize: "0.83rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{inv.issued}</span></td>
                <td><span style={{ fontSize: "0.83rem", color: inv.status === "unpaid" ? "#f59e0b" : "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{inv.due}</span></td>
                <td><span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9" }}>₦{inv.amount.toLocaleString()}</span></td>
                <td><StatusBadge status={inv.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {inv.status === "unpaid" && (
                      <button style={{ padding: "4px 12px", background: "#f59e0b", color: "#000", border: "none", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
                        Pay
                      </button>
                    )}
                    <button className="icon-btn" aria-label="Download invoice">
                      <Download size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px 16px", color: "#334155", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif" }}>
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}