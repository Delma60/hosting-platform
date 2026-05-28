"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  ChevronDown,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { signOutUser } from "@/lib/auth";
import { clearSessionCookie } from "@/lib/session";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../mode-toggle";

// ─── Breadcrumb map ───────────────────────────────────────────────────────────

const BREADCRUMB_MAP: Record<string, string> = {
  "/client": "Overview",
  "/client/domains": "Domains",
  "/client/hosting": "Hosting",
  "/client/invoices": "Invoices",
  "/client/support": "Support",
  "/client/settings": "Settings",
};

function useBreadcrumbs(pathname: string) {
  // Split path and build crumbs
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/client" },
  ];

  let built = "";
  for (const seg of segments) {
    built += `/${seg}`;
    const label = BREADCRUMB_MAP[built];
    if (label && built !== "/client") {
      crumbs.push({ label, href: built });
    } else if (!label && built !== "/client") {
      // Dynamic segment (e.g. domain id) — show as-is
      crumbs.push({ label: seg, href: built });
    }
  }
  return crumbs;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ClientTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const crumbs = useBreadcrumbs(pathname);
  const [searchOpen, setSearchOpen] = useState(false);

  async function handleSignOut() {
    await signOutUser();
    await clearSessionCookie();
    router.push("/auth/login");
    router.refresh();
  }

  const initials = getInitials(profile?.displayName ?? user?.email ?? "?");
  const displayName = profile?.displayName?.split(" ")[0] ?? "Account";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:px-6">
      {/* Mobile sidebar trigger */}
      <div className="md:hidden">
        <MobileSidebar />
      </div>

      {/* Breadcrumb — desktop only */}
      <nav
        aria-label="Breadcrumb"
        className="hidden items-center gap-1.5 text-sm md:flex"
      >
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              {i > 0 && (
                <svg
                  className="size-3 text-muted-foreground/40"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    d="M1 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {isLast ? (
                <span className="font-medium text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Mobile: current page title */}
      <span
        className="text-sm font-semibold text-foreground md:hidden"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {crumbs[crumbs.length - 1]?.label ?? "Dashboard"}
      </span>

      <div className="flex-1" />

      {/* Search — expands on click (desktop) */}
      <div className={cn("hidden md:block transition-all", searchOpen ? "w-56" : "w-36")}>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-8 border-border bg-background pl-8 text-sm placeholder:text-muted-foreground focus-visible:ring-amber-500/30"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground hover:text-foreground"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {/* Unread dot */}
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-amber-500" />
      </Button>

      {/* Theme toggle */}
      <ModeToggle />

      {/* Vertical divider */}
      <div className="hidden h-5 w-px bg-border md:block" />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 px-2 text-muted-foreground hover:text-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-[0.65rem] font-bold text-amber-500">
              {initials}
            </span>
            <span className="hidden max-w-[100px] truncate text-sm font-medium md:inline">
              {displayName}
            </span>
            <ChevronDown className="size-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          {/* User info header */}
          <div className="flex items-center gap-2.5 px-2 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-bold text-amber-500">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {profile?.displayName ?? "Account"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <Link href="/client" className="flex items-center gap-2">
              <LayoutDashboard className="size-4 text-muted-foreground" />
              Overview
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/client/settings" className="flex items-center gap-2">
              <Settings className="size-4 text-muted-foreground" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/client/settings" className="flex items-center gap-2">
              <User className="size-4 text-muted-foreground" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}