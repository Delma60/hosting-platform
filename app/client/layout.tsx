import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/session";
import { adminDb } from "@/lib/firebase/admin";
import { UserProfile } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session verification using Firebase Admin SDK
  const session = await verifySessionCookie();

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  // Fetch user profile to check status
  const userDoc = await adminDb.doc(`users/${session.uid}`).get();
  const profile = userDoc.data() as UserProfile | undefined;

  if (!profile || profile.status === "suspended") {
    redirect("/auth/login?error=suspended");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080c14" }}>
      {/* Sidebar placeholder — build out in components/layout/Sidebar.tsx */}
      <aside
        style={{
          width: 240,
          background: "#0d1321",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "24px 16px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
            padding: "0 8px",
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
            }}
          >
            🌐
          </span>
          HostForge
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { href: "/client", label: "Overview", icon: "◈" },
            { href: "/client/domains", label: "Domains", icon: "🔗" },
            { href: "/client/hosting", label: "Hosting", icon: "🖥" },
            { href: "/client/invoices", label: "Invoices", icon: "📄" },
            { href: "/client/support", label: "Support", icon: "💬" },
            { href: "/client/settings", label: "Settings", icon: "⚙" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                color: "#64748b",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 400,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "0.95rem", opacity: 0.7 }}>
                {item.icon}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Sign out form */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <form action="/api/auth/sign-out" method="POST">
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "9px 12px",
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "0.875rem",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ opacity: 0.7 }}>⏏</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px 40px", overflowY: "auto" }}>
        {children}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
}
