"use client";

import Link from "next/link";
import { Server, ExternalLink, ArrowUpCircle, HardDrive, Wifi, Database } from "lucide-react";

const HOSTING = [
  {
    id: "1",
    name: "Business Hosting",
    plan: "Business",
    domain: "swiftpayng.com",
    server: "ng-web-01.hostforge.ng",
    cPanelUrl: "https://ng-web-01.hostforge.ng:2083",
    ip: "41.58.62.144",
    status: "active",
    disk: { used: 34, total: 50, unit: "GB" },
    bandwidth: { used: 17, total: 500, unit: "GB" },
    inodes: { used: 48200, total: 200000 },
    databases: 4,
    emails: 12,
    domains: 3,
    expiry: "Jul 1, 2025",
  },
  {
    id: "2",
    name: "Starter Hosting",
    plan: "Starter",
    domain: "swiftpay-dev.com",
    server: "ng-web-02.hostforge.ng",
    cPanelUrl: "https://ng-web-02.hostforge.ng:2083",
    ip: "41.58.62.145",
    status: "active",
    disk: { used: 2.2, total: 10, unit: "GB" },
    bandwidth: { used: 0.8, total: 100, unit: "GB" },
    inodes: { used: 8100, total: 50000 },
    databases: 1,
    emails: 3,
    domains: 1,
    expiry: "Jun 2, 2025",
  },
];

function UsageBar({ used, total, color }: { used: number; total: number; color: string }) {
  const pct = Math.round((used / total) * 100);
  const c = pct > 85 ? "#ef4444" : pct > 65 ? "#f59e0b" : color;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>{used} / {total}</span>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: c, fontFamily: "'DM Sans', sans-serif" }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: c, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

export default function HostingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .hosting-card {
          background: #0d1321;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 16px;
          transition: border-color 0.2s;
        }
        .hosting-card:hover { border-color: rgba(255,255,255,0.12); }
        .stat-mini {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 0;
        }
        .stat-mini-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }
        .stat-mini-value {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #f1f5f9;
        }
        .stat-mini-label {
          font-size: 0.7rem;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s;
          border: none;
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 2 }}>Hosting Accounts</h2>
          <p style={{ color: "#475569", fontSize: "0.84rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>{HOSTING.length} active accounts</p>
        </div>
        <Link href="/hosting" style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", borderRadius: 9, fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
          Add Hosting
        </Link>
      </div>

      {HOSTING.map(h => (
        <div key={h.id} className="hosting-card">
          {/* Card header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Server size={18} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#f1f5f9", letterSpacing: "-0.01em" }}>{h.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: "0.78rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>{h.domain}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#334155" }} />
                  <span style={{ fontSize: "0.78rem", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>IP: {h.ip}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: "0.68rem", fontWeight: 600, background: "rgba(16,185,129,0.1)", color: "#10b981" }}>Active</span>
                  <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: "0.68rem", fontWeight: 600, background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>{h.plan}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={h.cPanelUrl} target="_blank" rel="noreferrer" className="action-btn" style={{ background: "#f59e0b", color: "#000", fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
                <ExternalLink size={13} /> cPanel
              </a>
              <button className="action-btn" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#94a3b8" }}>
                <ArrowUpCircle size={13} /> Upgrade
              </button>
            </div>
          </div>

          {/* Usage */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                <HardDrive size={11} style={{ verticalAlign: -1, marginRight: 5 }} />Disk ({h.disk.unit})
              </div>
              <UsageBar used={h.disk.used} total={h.disk.total} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                <Wifi size={11} style={{ verticalAlign: -1, marginRight: 5 }} />Bandwidth ({h.bandwidth.unit})
              </div>
              <UsageBar used={h.bandwidth.used} total={h.bandwidth.total} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
                <Database size={11} style={{ verticalAlign: -1, marginRight: 5 }} />Inodes
              </div>
              <UsageBar used={h.inodes.used} total={h.inodes.total} color="#8b5cf6" />
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "none" }}>
            {[
              { label: "Databases", value: h.databases, icon: Database, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
              { label: "Email Accounts", value: h.emails, icon: null, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
              { label: "Addon Domains", value: h.domains, icon: null, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
              { label: "Renews", value: h.expiry, icon: null, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", isDate: true },
            ].map((s, i) => (
              <div key={i} className="stat-mini" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ fontSize: "0.68rem", color: "#334155", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</div>
                <div style={{ fontFamily: s.isDate ? "'DM Sans', sans-serif" : "'Syne', sans-serif", fontWeight: s.isDate ? 500 : 700, fontSize: s.isDate ? "0.85rem" : "1.25rem", color: s.isDate ? "#94a3b8" : "#f1f5f9" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}