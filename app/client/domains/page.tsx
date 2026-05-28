"use client";

import Link from "next/link";
import { Globe, Plus, RefreshCw, ExternalLink, Settings, MoreHorizontal, Search, Shield } from "lucide-react";
import { useState } from "react";

const DOMAINS = [
  {
    id: "1",
    name: "swiftpayng.com",
    registrar: "Namecheap",
    registered: "Mar 12, 2023",
    expiry: "Mar 12, 2026",
    autoRenew: true,
    status: "active",
    privacyProtection: true,
    nameservers: ["ns1.hostforge.ng", "ns2.hostforge.ng"],
    daysLeft: 288,
  },
  {
    id: "2",
    name: "swiftpay.ng",
    registrar: "Namecheap",
    registered: "Jan 4, 2024",
    expiry: "Jan 4, 2026",
    autoRenew: true,
    status: "active",
    privacyProtection: false,
    nameservers: ["ns1.hostforge.ng", "ns2.hostforge.ng"],
    daysLeft: 221,
  },
  {
    id: "3",
    name: "swiftpay-dev.com",
    registrar: "Namecheap",
    registered: "Jun 2, 2024",
    expiry: "Jun 2, 2025",
    autoRenew: false,
    status: "expiring",
    privacyProtection: false,
    nameservers: ["ns1.hostforge.ng", "ns2.hostforge.ng"],
    daysLeft: 7,
  },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:   { label: "Active",   color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    expiring: { label: "Expiring Soon", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    expired:  { label: "Expired",  color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  };
  const s = map[status] ?? { label: status, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: "0.72rem", fontWeight: 600, background: s.bg, color: s.color, letterSpacing: "0.03em" }}>
      {s.label}
    </span>
  );
}

export default function DomainsPage() {
  const [search, setSearch] = useState("");
  const filtered = DOMAINS.filter(d => d.name.includes(search.toLowerCase()));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .domains-table { width: 100%; border-collapse: collapse; }
        .domains-table th {
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
        .domains-table td {
          padding: 15px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          vertical-align: middle;
        }
        .domains-table tr:last-child td { border-bottom: none; }
        .domains-table tbody tr { transition: background 0.15s; }
        .domains-table tbody tr:hover { background: rgba(255,255,255,0.02); }
        .domain-name-cell {
          font-size: 0.9rem;
          font-weight: 500;
          color: #f1f5f9;
          font-family: 'DM Sans', sans-serif;
        }
        .toggle {
          position: relative;
          width: 36px; height: 20px;
          cursor: pointer;
        }
        .toggle input { display: none; }
        .toggle-track {
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background: rgba(255,255,255,0.08);
          transition: background 0.2s;
        }
        .toggle input:checked + .toggle-track { background: #f59e0b; }
        .toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 14px; height: 14px;
          background: #fff;
          border-radius: 50%;
          transition: transform 0.2s;
          pointer-events: none;
        }
        .toggle input:checked ~ .toggle-thumb { transform: translateX(16px); }
        .action-btn {
          padding: 5px 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          color: #94a3b8;
          font-size: 0.77rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .action-btn:hover { border-color: rgba(255,255,255,0.15); color: #f1f5f9; background: rgba(255,255,255,0.07); }
        .search-input {
          background: #0d1321;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 9px 14px 9px 38px;
          color: #f1f5f9;
          font-size: 0.875rem;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          width: 260px;
          transition: border-color 0.2s;
        }
        .search-input:focus { border-color: rgba(245,158,11,0.4); }
        .expiry-warn { color: #f59e0b; font-weight: 500; }
        .days-badge {
          display: inline-block;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          margin-left: 6px;
        }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 2 }}>Your Domains</h2>
          <p style={{ color: "#475569", fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{DOMAINS.length} domains registered</p>
        </div>
        <Link href="/domains" style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "#f59e0b", color: "#000", borderRadius: 9, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none", fontFamily: "'Syne', sans-serif" }}>
          <Plus size={15} /> Register Domain
        </Link>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
        <input
          type="text"
          className="search-input"
          placeholder="Search domains..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={{ background: "#0d1321", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
        <table className="domains-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Status</th>
              <th>Expiry</th>
              <th>Auto-Renew</th>
              <th>Privacy</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Globe size={14} color="#3b82f6" />
                    </div>
                    <div>
                      <div className="domain-name-cell">{d.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "#334155", fontFamily: "'DM Sans', sans-serif", marginTop: 1 }}>Registered {d.registered}</div>
                    </div>
                  </div>
                </td>
                <td><StatusBadge status={d.status} /></td>
                <td>
                  <span style={{ fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif", color: d.status === "expiring" ? "#f59e0b" : "#94a3b8" }}>
                    {d.expiry}
                    {d.status === "expiring" && (
                      <span className="days-badge" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>{d.daysLeft}d</span>
                    )}
                  </span>
                </td>
                <td>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked={d.autoRenew} />
                    <div className="toggle-track" />
                    <div className="toggle-thumb" />
                  </label>
                </td>
                <td>
                  {d.privacyProtection ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>
                      <Shield size={13} /> Protected
                    </span>
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>—</span>
                  )}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Link href={`/client/domains/${d.id}/dns`} className="action-btn">
                      <Settings size={12} /> DNS
                    </Link>
                    {d.status === "expiring" && (
                      <button className="action-btn" style={{ borderColor: "rgba(245,158,11,0.3)", color: "#f59e0b" }}>
                        <RefreshCw size={12} /> Renew
                      </button>
                    )}
                    <button className="action-btn">
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}