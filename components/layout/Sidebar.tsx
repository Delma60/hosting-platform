// Responsive Sidebar component using shadcn/ui and lucide-react icons
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Server,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/client", label: "Overview", icon: LayoutDashboard },
  { href: "/client/domains", label: "Domains", icon: Globe },
  { href: "/client/hosting", label: "Hosting", icon: Server },
  { href: "/client/invoices", label: "Invoices", icon: FileText },
  { href: "/client/support", label: "Support", icon: MessageCircle },
  { href: "/client/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <span className="sr-only">Toggle sidebar</span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </Button>
      </div>
      {/* Sidebar */}
      <aside
        className={`fixed z-30 top-0 left-0 h-full w-60 bg-[#0d1321] border-r border-white/10 p-6 flex flex-col transition-transform duration-200 md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} md:w-60`}
      >
        <div className="flex items-center gap-2 font-extrabold text-lg text-slate-100 mb-8 px-2">
          <span className="w-7 h-7 rounded bg-amber-500 flex items-center justify-center text-sm">
            🌐
          </span>
          HostForge
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} className="opacity-80" />
                {item.label}
              </a>
            );
          })}
        </nav>
        <form
          action="/api/auth/sign-out"
          method="POST"
          className="mt-auto pt-6 border-t border-white/10"
        >
          <Button
            variant="ghost"
            type="submit"
            className="w-full flex items-center gap-3 justify-start text-slate-400 hover:text-white"
          >
            <LogOut size={18} className="opacity-80" /> Sign out
          </Button>
        </form>
      </aside>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}
    </>
  );
}
