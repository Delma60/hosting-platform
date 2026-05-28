import { redirect } from "next/navigation";
import { verifySessionCookie } from "@/lib/session";
import { adminDb } from "@/lib/firebase/admin";
import { UserProfile } from "@/lib/auth";
import { DesktopSidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { ClientTopbar } from "@/components/layout/client-nav-bar";

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

      <div className="flex min-h-screen text-slate-100">
        {/* Desktop sidebar — sticky, not part of scroll */}
        <DesktopSidebar />

        {/* Right side: topbar + main */}
        <div className="flex flex-1 flex-col min-w-0">
         

          {/* ── Page content ────────────────────────────────────────── */}
          <section className="">
            <ClientTopbar />
            <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
              {children}
            </main>
          </section>
        </div>
      </div>
    </>
  );
}
