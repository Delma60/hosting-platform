import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/session";
import { adminDb } from "@/lib/firebase/admin";
import { UserProfile } from "@/lib/auth";
import { DesktopSidebar, MobileSidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySessionCookie();

  if (!session) {
    redirect("/auth/login?callbackUrl=/client");
  }

  const userDoc = await adminDb.doc(`users/${session.uid}`).get();
  const profile = userDoc.data() as UserProfile | undefined;

  if (!profile || profile.status === "suspended") {
    redirect("/auth/login?error=suspended");
  }

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div className="flex min-h-screen bg-[#080c14] text-slate-100">
        {/* Desktop sidebar — sticky, not part of scroll */}
        <DesktopSidebar />

        {/* Right side: topbar + main */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* ── Topbar (mobile only) ────────────────────────────────── */}
          <header className="flex md:hidden items-center gap-3 border-b border-white/[0.06] bg-[#0b1120] px-4 py-3 sticky top-0 z-20">
            <MobileSidebar />
            <span
              className="text-[1rem] font-extrabold tracking-tight text-slate-100"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              HostForge
            </span>
          </header>

          {/* ── Page content ────────────────────────────────────────── */}
          <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}