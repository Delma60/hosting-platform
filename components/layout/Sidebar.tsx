"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Server,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/client",          label: "Overview",  icon: LayoutDashboard },
  { href: "/client/domains",  label: "Domains",   icon: Globe },
  { href: "/client/hosting",  label: "Hosting",   icon: Server },
  { href: "/client/invoices", label: "Invoices",  icon: FileText },
  { href: "/client/support",  label: "Support",   icon: MessageCircle },
  { href: "/client/settings", label: "Settings",  icon: Settings },
];

// ─── Shared sidebar content ───────────────────────────────────────────────────

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-5 border-b border-white/[0.06]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-base shadow-lg shadow-amber-500/20">
          <Zap size={15} className="text-black fill-black" />
        </span>
        <span
          className="text-[1.05rem] font-extrabold tracking-tight text-slate-100"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          HostForge
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-widest text-slate-600">
          Navigation
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/client"
              ? pathname === "/client"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-amber-500/10 text-amber-400 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.2)]"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
              )}
            >
              <Icon
                size={17}
                className={cn(
                  "shrink-0 transition-colors",
                  active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              {label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-2 py-3">
        <form action="/api/auth/sign-out" method="POST">
          <button
            type="submit"
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-150 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut
              size={17}
              className="shrink-0 transition-colors group-hover:text-red-400"
            />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Desktop sidebar ──────────────────────────────────────────────────────────

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex h-screen w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0b1120] sticky top-0">
      <SidebarContent />
    </aside>
  );
}

// ─── Mobile sidebar (Sheet drawer) ───────────────────────────────────────────

export function MobileSidebar() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-400 hover:text-slate-200"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[220px] border-r border-white/[0.06] bg-[#0b1120] p-0 [&>button]:hidden"
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/10 hover:text-slate-300"
          aria-label="Close navigation"
        >
          <X size={15} />
        </button>

        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

// ─── Combined export ──────────────────────────────────────────────────────────

export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}