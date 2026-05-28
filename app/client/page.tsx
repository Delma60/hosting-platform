"use client";

import Link from "next/link";
import {
  Globe,
  Server,
  FileText,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Shield,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Active Services", value: "7", icon: CheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  { label: "Domains", value: "3", icon: Globe, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
  { label: "Unpaid Invoices", value: "2", icon: FileText, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  { label: "Open Tickets", value: "1", icon: MessageCircle, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)" },
];

const DOMAINS = [
  { name: "swiftpayng.com", status: "active", expiry: "Mar 12, 2026", autoRenew: true },
  { name: "swiftpay.ng", status: "active", expiry: "Jan 4, 2026", autoRenew: true },
  { name: "swiftpay-dev.com", status: "expiring", expiry: "Jun 2, 2025", autoRenew: false },
];

const HOSTING = [
  { name: "Business Hosting", domain: "swiftpayng.com", disk: 68, bandwidth: 34, status: "active" },
  { name: "Starter Hosting", domain: "swiftpay-dev.com", disk: 22, bandwidth: 8, status: "active" },
];

const INVOICES = [
  { id: "INV-2025-00047", service: "Business Hosting — Renewal", amount: "₦7,500", status: "unpaid", due: "Jun 10, 2025" },
  { id: "INV-2025-00046", service: "swiftpay.ng — Renewal", amount: "₦3,500", status: "unpaid", due: "Jun 15, 2025" },
  { id: "INV-2025-00044", service: "SSL Certificate", amount: "₦5,000", status: "paid", due: "May 1, 2025" },
];

const ACTIVITY = [
  { icon: Shield, label: "SSL certificate renewed for swiftpayng.com", time: "2 hours ago", color: "#10b981" },
  { icon: FileText, label: "Invoice INV-2025-00046 generated", time: "1 day ago", color: "#f59e0b" },
  { icon: Globe, label: "DNS record updated for swiftpayng.com", time: "3 days ago", color: "#3b82f6" },
  { icon: MessageCircle, label: "Support ticket #0012 resolved", time: "5 days ago", color: "#8b5cf6" },
  { icon: RefreshCw, label: "Auto-renewal enabled for swiftpay.ng", time: "1 week ago", color: "#64748b" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:   { label: "Active",   color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    expiring: { label: "Expiring", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    suspended:{ label: "Suspended",color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    paid:     { label: "Paid",     color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    unpaid:   { label: "Unpaid",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    overdue:  { label: "Overdue",  color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  };
  const s = map[status] ?? { label: status, color: "#64748b", bg: "rgba(100,116,139,0.1)" };
  return (
    <span style={{
      padding: "3px 9px",
      borderRadius: 100,
      fontSize: "0.72rem",
      fontWeight: 600,
      letterSpacing: "0.04em",
      background: s.bg,
      color: s.color,
      textTransform: "uppercase",
    }}>
      {s.label}
    </span>
  );
}

function UsageBar({ value, color }: { value: number; color: string }) {
  const c = value > 80 ? "#ef4444" : value > 60 ? "#f59e0b" : color;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: c, borderRadius: 2, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: "0.75rem", color: "#64748b", minWidth: 28, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "#0d1321",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14,
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardHeader({ title, href, count }: { title: string; href: string; count?: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 20px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#f1f5f9", letterSpacing: "-0.01em" }}>{title}</span>
        {count !== undefined && (
          <span style={{ padding: "2px 7px", background: "rgba(255,255,255,0.06)", borderRadius: 100, fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}>{count}</span>
        )}
      </div>
      <Link href={href} style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", fontSize: "0.78rem", textDecoration: "none", fontWeight: 500 }}>
        View all <ArrowRight size={12} />
      </Link>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClientOverviewPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .dashboard-grid--3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #0d1321;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.12); }
        .stat-icon {
          width: 36px; height: 36px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.78rem;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          margin-top: 2px;
        }
        .table-row {
          display: flex;
          align-items: center;
          padding: 13px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          gap: 12px;
          transition: background 0.15s;
        }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        .domain-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .domain-expiry {
          font-size: 0.78rem;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .invoice-id {
          font-size: 0.78rem;
          color: #64748b;
          font-family: 'DM Sans', monospace;
          flex-shrink: 0;
        }
        .invoice-service {
          flex: 1;
          font-size: 0.865rem;
          color: #cbd5e1;
          font-family: 'DM Sans', sans-serif;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .invoice-amount {
          font-size: 0.875rem;
          font-weight: 600;
          color: #f1f5f9;
          font-family: 'Syne', sans-serif;
          flex-shrink: 0;
          margin-right: 10px;
        }
        .pay-btn {
          padding: 5px 12px;
          background: #f59e0b;
          color: #000;
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          text-decoration: none;
          flex-shrink: 0;
        }
        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .activity-text {
          font-size: 0.84rem;
          color: #94a3b8;
          font-family: 'DM Sans', sans-serif;
          line-height: 1.4;
          flex: 1;
        }
        .activity-time {
          font-size: 0.72rem;
          color: #334155;
          font-family: 'DM Sans', sans-serif;
          flex-shrink: 0;
          margin-top: 3px;
        }
        .hosting-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
        }
        .hosting-domain {
          font-size: 0.75rem;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          margin-top: 2px;
        }
        .alert-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: rgba(245,158,11,0.07);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 12px;
          margin-bottom: 24px;
        }
        .quick-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
        }
        .quick-action {
          flex: 1;
          padding: 14px 16px;
          background: #0d1321;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #94a3b8;
          font-size: 0.84rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: all 0.15s;
          cursor: pointer;
        }
        .quick-action:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          color: #f1f5f9;
        }
        .quick-action-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        @media (max-width: 1100px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 4 }}>
          Good morning, Chidinma 👋
        </h2>
        <p style={{ color: "#475569", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
          Here's what's happening with your services today.
        </p>
      </div>

      {/* Alert banner */}
      <div className="alert-banner">
        <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: "0.84rem", color: "#fcd34d", fontFamily: "'DM Sans', sans-serif" }}>
          <strong>swiftpay-dev.com</strong> expires in 7 days and auto-renew is off.
        </span>
        <Link href="/client/domains" style={{ padding: "5px 12px", background: "#f59e0b", color: "#000", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", fontFamily: "'Syne', sans-serif", flexShrink: 0 }}>
          Renew now
        </Link>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <Icon size={16} color={s.color} />
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        {[
          { label: "Register Domain", icon: Globe, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", href: "/domains" },
          { label: "Upgrade Hosting", icon: Server, color: "#10b981", bg: "rgba(16,185,129,0.1)", href: "/client/hosting" },
          { label: "Pay Invoice", icon: FileText, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", href: "/client/invoices" },
          { label: "Open Ticket", icon: MessageCircle, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", href: "/client/support" },
        ].map((a, i) => {
          const Icon = a.icon;
          return (
            <Link key={i} href={a.href} className="quick-action">
              <div className="quick-action-icon" style={{ background: a.bg }}>
                <Icon size={15} color={a.color} />
              </div>
              {a.label}
            </Link>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="dashboard-grid" style={{ marginBottom: 16 }}>
        {/* Domains */}
        <Card>
          <CardHeader title="Domains" href="/client/domains" count={DOMAINS.length} />
          {DOMAINS.map((d, i) => (
            <div key={i} className="table-row">
              <Globe size={14} color="#475569" style={{ flexShrink: 0 }} />
              <span className="domain-name">{d.name}</span>
              <span className="domain-expiry">Exp {d.expiry}</span>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader title="Recent Invoices" href="/client/invoices" count={INVOICES.length} />
          {INVOICES.map((inv, i) => (
            <div key={i} className="table-row">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="invoice-service">{inv.service}</div>
                <div className="invoice-id">{inv.id} · Due {inv.due}</div>
              </div>
              <span className="invoice-amount">{inv.amount}</span>
              {inv.status === "unpaid" ? (
                <Link href={`/client/invoices`} className="pay-btn">Pay</Link>
              ) : (
                <StatusBadge status={inv.status} />
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="dashboard-grid">
        {/* Hosting */}
        <Card>
          <CardHeader title="Hosting Accounts" href="/client/hosting" count={HOSTING.length} />
          {HOSTING.map((h, i) => (
            <div key={i} className="table-row" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="hosting-name">{h.name}</div>
                  <div className="hosting-domain">{h.domain}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Link href="/client/hosting" style={{ padding: "4px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, fontSize: "0.73rem", color: "#94a3b8", textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
                    cPanel
                  </Link>
                  <StatusBadge status={h.status} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#334155", marginBottom: 5, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Disk</div>
                  <UsageBar value={h.disk} color="#3b82f6" />
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#334155", marginBottom: 5, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Bandwidth</div>
                  <UsageBar value={h.bandwidth} color="#10b981" />
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader title="Recent Activity" href="/client" />
          {ACTIVITY.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: `${a.color}15` }}>
                  <Icon size={13} color={a.color} />
                </div>
                <span className="activity-text">{a.label}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            );
          })}
        </Card>
      </div>
    </>
  );
}