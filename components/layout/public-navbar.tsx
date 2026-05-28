"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { signOutUser } from "@/lib/auth";
import { clearSessionCookie } from "@/lib/session";

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/domains",  label: "Domains"  },
  { href: "/hosting",  label: "Hosting"  },
  { href: "/pricing",  label: "Pricing"  },
  { href: "/reseller", label: "Resellers" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Subtle scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  async function handleSignOut() {
    await signOutUser();
    await clearSessionCookie();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-200",
        scrolled
          ? "border-white/[0.08] bg-[#080c14]/95 backdrop-blur-xl"
          : "border-white/[0.05] bg-[#080c14]/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-6">
        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-100 no-underline"
          style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem" }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-lg shadow-amber-500/20">
            <Zap size={15} className="fill-black text-black" />
          </span>
          HostForge
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className="hidden items-center gap-7 md:flex" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors duration-150",
                  isActive(href)
                    ? "text-amber-400"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop right actions ── */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Cart */}
          <Link href="/cart" aria-label={`Cart, ${totalItems} items`}>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-400 hover:text-slate-200"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 p-0 text-[0.6rem] font-bold text-black"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Auth actions */}
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-white/5" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-300 hover:text-slate-100"
                  size="sm"
                >
                  {/* Avatar initials */}
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 text-[0.65rem] font-bold text-amber-400">
                    {getInitials(profile?.displayName ?? user.email ?? "?")}
                  </span>
                  <span className="max-w-[100px] truncate text-sm">
                    {profile?.displayName?.split(" ")[0] ?? "Account"}
                  </span>
                  <ChevronDown size={13} className="opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 border-white/10 bg-[#0d1321] text-slate-200"
              >
                <DropdownMenuItem asChild>
                  <Link href="/client" className="flex items-center gap-2">
                    <LayoutDashboard size={14} className="text-slate-400" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/client/settings" className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-400 focus:text-red-300"
                >
                  <LogOut size={14} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-slate-200">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-amber-500 font-bold text-black hover:bg-amber-400"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* ── Mobile: cart + hamburger ── */}
        <div className="flex items-center gap-1 md:hidden">
          <Link href="/cart" aria-label="Cart">
            <Button variant="ghost" size="icon" className="relative text-slate-400">
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 p-0 text-[0.6rem] font-bold text-black">
                  {totalItems > 9 ? "9+" : totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-slate-200"
                aria-label="Open navigation"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 border-l border-white/[0.06] bg-[#0b1120] p-0"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-5 py-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
                    <Zap size={15} className="fill-black text-black" />
                  </span>
                  <span
                    className="text-lg font-extrabold tracking-tight text-slate-100"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    HostForge
                  </span>
                </div>

                {/* Links */}
                <nav className="flex-1 space-y-0.5 px-3 py-4">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                        isActive(href)
                          ? "bg-amber-500/10 text-amber-400"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* Auth footer */}
                <div className="border-t border-white/[0.06] px-3 py-4">
                  {loading ? (
                    <div className="h-9 animate-pulse rounded-lg bg-white/5" />
                  ) : user ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 rounded-lg px-4 py-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 text-[0.7rem] font-bold text-amber-400">
                          {getInitials(profile?.displayName ?? user.email ?? "?")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-200">
                            {profile?.displayName ?? "Account"}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/client"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>
                      <button
                        onClick={() => { setMobileOpen(false); handleSignOut(); }}
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full border-white/10" asChild>
                        <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                          Sign in
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-amber-500 font-bold text-black hover:bg-amber-400"
                        asChild
                        style={{ fontFamily: "'Syne', sans-serif" }}
                      >
                        <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}