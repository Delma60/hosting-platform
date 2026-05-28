"use client";

import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Globe,
  Server,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/client", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/client/domains", label: "Domains", icon: Globe },
  { href: "/client/hosting", label: "Hosting", icon: Server },
  { href: "/client/invoices", label: "Invoices", icon: FileText },
  { href: "/client/support", label: "Support", icon: MessageCircle },
  { href: "/client/settings", label: "Settings", icon: Settings },
];

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-orb">🌐</span>
        <span className="logo-text">HostForge</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${active ? "nav-item--active" : ""}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {active && <ChevronRight size={12} className="nav-chevron" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-upgrade">
        <div className="upgrade-icon">
          <Zap size={14} />
        </div>
        <div>
          <div className="upgrade-title">Business Plan</div>
          <div className="upgrade-sub">Upgrade for more</div>
        </div>
        <Link href="/pricing" className="upgrade-btn">↑</Link>
      </div>

      <form action="/api/auth/sign-out" method="POST" className="sidebar-signout">
        <button type="submit" className="signout-btn">
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </form>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sidebar {
          width: 232px;
          min-height: 100vh;
          background: #080d18;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          padding: 0;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 8px;
        }
        .logo-orb {
          width: 28px; height: 28px;
          background: #f59e0b;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.05rem;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }
        .sidebar-nav {
          flex: 1;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .nav-label {
          font-size: 0.67rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #334155;
          padding: 8px 8px 6px;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          color: #475569;
          text-decoration: none;
          font-size: 0.865rem;
          font-weight: 400;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          position: relative;
        }
        .nav-item:hover {
          color: #94a3b8;
          background: rgba(255,255,255,0.04);
        }
        .nav-item--active {
          color: #f1f5f9;
          background: rgba(255,255,255,0.07);
          font-weight: 500;
        }
        .nav-chevron {
          margin-left: auto;
          color: #f59e0b;
        }
        .sidebar-upgrade {
          margin: 0 12px 8px;
          background: rgba(245,158,11,0.07);
          border: 1px solid rgba(245,158,11,0.15);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .upgrade-icon {
          width: 28px; height: 28px;
          background: rgba(245,158,11,0.15);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: #f59e0b;
          flex-shrink: 0;
        }
        .upgrade-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
          font-family: 'DM Sans', sans-serif;
        }
        .upgrade-sub {
          font-size: 0.7rem;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
        }
        .upgrade-btn {
          margin-left: auto;
          width: 24px; height: 24px;
          background: #f59e0b;
          color: #000;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          flex-shrink: 0;
        }
        .sidebar-signout {
          padding: 8px 12px 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin-top: 4px;
        }
        .signout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 10px;
          background: none;
          border: none;
          border-radius: 8px;
          color: #334155;
          font-size: 0.865rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }
        .signout-btn:hover {
          color: #ef4444;
          background: rgba(239,68,68,0.06);
        }
      `}</style>
    </aside>
  );
}

function TopBar({ pathname }: { pathname: string }) {
  const titles: Record<string, string> = {
    "/client": "Overview",
    "/client/domains": "Domains",
    "/client/hosting": "Hosting",
    "/client/invoices": "Invoices",
    "/client/support": "Support",
    "/client/settings": "Settings",
  };
  const key = Object.keys(titles)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k)) ?? "/client";
  const title = titles[key] ?? "Dashboard";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <button className="topbar-icon-btn" aria-label="Notifications">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>
        <div className="topbar-avatar">CO</div>
      </div>
      <style>{`
        .topbar {
          height: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          background: #080d18;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .topbar-title {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .topbar-icon-btn {
          width: 34px; height: 34px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          transition: all 0.15s;
        }
        .topbar-icon-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.07); }
        .notif-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 6px; height: 6px;
          background: #f59e0b;
          border-radius: 50%;
          border: 1.5px solid #080d18;
        }
        .topbar-avatar {
          width: 34px; height: 34px;
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          color: #f59e0b;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
        }
      `}</style>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: In production, re-add server-side auth check here:
  // const session = await verifySessionCookie();
  // if (!session) redirect("/auth/login?callbackUrl=/client");

  return (
    <ClientLayout>{children}</ClientLayout>
  );
}

function ClientLayout({ children }: { children: React.ReactNode }) {
  "use client";
  const pathname = usePathname();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080d18", fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar pathname={pathname} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar pathname={pathname} />
        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}