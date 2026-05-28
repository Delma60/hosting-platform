"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  Plus,
  RefreshCw,
  Settings,
  MoreHorizontal,
  Search,
  Shield,
  ShieldOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Domain {
  id: string;
  name: string;
  registrar: string;
  registered: string;
  expiry: string;
  autoRenew: boolean;
  status: "active" | "expiring" | "expired" | "suspended";
  privacyProtection: boolean;
  nameservers: string[];
  daysLeft: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysLeft(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function deriveStatus(
  daysLeft: number,
  rawStatus?: string
): Domain["status"] {
  if (rawStatus === "suspended") return "suspended";
  if (rawStatus === "expired" || daysLeft <= 0) return "expired";
  if (daysLeft <= 30) return "expiring";
  return "active";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Domain["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2 }
> = {
  active:    { label: "Active",        variant: "secondary",   icon: CheckCircle2 },
  expiring:  { label: "Expiring Soon", variant: "outline",     icon: AlertTriangle },
  expired:   { label: "Expired",       variant: "destructive", icon: Clock },
  suspended: { label: "Suspended",     variant: "destructive", icon: Clock },
};

function DomainStatusBadge({ status }: { status: Domain["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge
      variant={cfg.variant}
      className={
        status === "active"
          ? "gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : status === "expiring"
          ? "gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400"
          : "gap-1.5"
      }
    >
      <Icon className="size-3" />
      {cfg.label}
    </Badge>
  );
}

function AutoRenewToggle({
  enabled,
  domainId,
  onChange,
}: {
  enabled: boolean;
  domainId: string;
  onChange: (id: string, val: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(domainId, !enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        enabled ? "bg-amber-500" : "bg-input"
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function DomainRowSkeleton() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Globe className="size-6 text-muted-foreground" />
      </div>
      <p className="mb-1 text-sm font-medium text-foreground">
        {filtered ? "No domains match your search" : "No domains yet"}
      </p>
      <p className="mb-6 text-xs text-muted-foreground">
        {filtered
          ? "Try a different search term."
          : "Register your first domain to get started."}
      </p>
      {!filtered && (
        <Button asChild size="sm" className="bg-amber-500 font-bold text-black hover:bg-amber-400">
          <Link href="/domains">
            <Plus className="mr-1.5 size-3.5" />
            Register Domain
          </Link>
        </Button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DomainsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ── Fetch from Firestore ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    async function fetchDomains() {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, "services"),
          where("userId", "==", user!.uid),
          where("type", "==", "domain")
        );
        const snap = await getDocs(q);
        const docs: Domain[] = snap.docs.map((doc) => {
          const d = doc.data();
          const expiryStr: string =
            d.expiryDate?.toDate?.()?.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) ?? d.expiry ?? "—";
          const daysLeft = d.expiryDate
            ? getDaysLeft(d.expiryDate.toDate().toISOString())
            : 999;
          return {
            id: doc.id,
            name: d.domain ?? d.name ?? "—",
            registrar: d.meta?.registrar ?? "Namecheap",
            registered: d.createdAt?.toDate?.()?.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) ?? "—",
            expiry: expiryStr,
            autoRenew: d.autoRenew ?? false,
            status: deriveStatus(daysLeft, d.status),
            privacyProtection: d.meta?.privacyProtection ?? false,
            nameservers: d.meta?.nameservers ?? [],
            daysLeft,
          };
        });
        setDomains(docs);
      } catch (err) {
        console.error(err);
        setError("Failed to load domains. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDomains();
  }, [user]);

  // ── Auto-renew toggle ──────────────────────────────────────────────────────
  async function handleAutoRenewToggle(domainId: string, value: boolean) {
    setTogglingId(domainId);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "services", domainId), { autoRenew: value });
      setDomains((prev) =>
        prev.map((d) => (d.id === domainId ? { ...d, autoRenew: value } : d))
      );
    } catch {
      // silently revert — in production you'd show a toast
    } finally {
      setTogglingId(null);
    }
  }

  // ── Derived state ──────────────────────────────────────────────────────────
  const filtered = domains.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const expiringCount = domains.filter((d) => d.status === "expiring").length;
  const activeCount = domains.filter((d) => d.status === "active").length;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              Your Domains
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {loading
                ? "Loading domains…"
                : `${domains.length} domain${domains.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 bg-amber-500 font-bold text-black hover:bg-amber-400"
          >
            <Link href="/domains">
              <Plus className="mr-1.5 size-4" />
              Register Domain
            </Link>
          </Button>
        </div>

        {/* ── Alert banner for expiring domains ── */}
        {!loading && expiringCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p className="flex-1 text-sm text-amber-300">
              <span className="font-semibold">
                {expiringCount} domain{expiringCount !== 1 ? "s" : ""}
              </span>{" "}
              {expiringCount !== 1 ? "are" : "is"} expiring soon. Renew now to
              avoid interruption.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
            >
              View expiring
            </Button>
          </div>
        )}

        {/* ── Stats row ── */}
        {!loading && domains.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
            {[
              {
                label: "Total",
                value: domains.length,
                color: "text-foreground",
              },
              {
                label: "Active",
                value: activeCount,
                color: "text-emerald-400",
              },
              {
                label: "Expiring",
                value: expiringCount,
                color: expiringCount > 0 ? "text-amber-400" : "text-muted-foreground",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
                <p className={`mt-1 text-2xl font-extrabold tracking-tight ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Search + table card ── */}
        <div className="rounded-xl border border-border bg-card">

          {/* Search bar */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search domains…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 border-b border-border bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[260px]">Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Auto-Renew</TableHead>
                <TableHead>Privacy</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <DomainRowSkeleton key={i} />
                ))
              ) : filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState filtered={!!search} />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((domain) => (
                  <TableRow key={domain.id} className="group">

                    {/* Domain name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                          <Globe className="size-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {domain.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Reg. {domain.registered}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <DomainStatusBadge status={domain.status} />
                    </TableCell>

                    {/* Expiry */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${
                            domain.status === "expiring"
                              ? "font-medium text-amber-400"
                              : domain.status === "expired"
                              ? "font-medium text-destructive"
                              : "text-foreground"
                          }`}
                        >
                          {domain.expiry}
                        </span>
                        {domain.daysLeft > 0 && domain.daysLeft <= 60 && (
                          <span className="text-xs text-amber-400/80">
                            {domain.daysLeft}d remaining
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Auto-renew */}
                    <TableCell>
                      {togglingId === domain.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <AutoRenewToggle
                          enabled={domain.autoRenew}
                          domainId={domain.id}
                          onChange={handleAutoRenewToggle}
                        />
                      )}
                    </TableCell>

                    {/* Privacy */}
                    <TableCell>
                      {domain.privacyProtection ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex w-fit items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                              <Shield className="size-3" />
                              Protected
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>WHOIS privacy is active</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                              <ShieldOff className="size-3" />
                              Off
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>WHOIS privacy is disabled</TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                        {/* DNS */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2.5 text-xs"
                              asChild
                            >
                              <Link href={`/client/domains/${domain.id}/dns`}>
                                <Settings className="mr-1 size-3" />
                                DNS
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Manage DNS records</TooltipContent>
                        </Tooltip>

                        {/* Renew — shown when expiring */}
                        {(domain.status === "expiring" ||
                          domain.status === "expired") && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                className="h-7 bg-amber-500 px-2.5 text-xs font-bold text-black hover:bg-amber-400"
                              >
                                <RefreshCw className="mr-1 size-3" />
                                Renew
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Renew this domain</TooltipContent>
                          </Tooltip>
                        )}

                        {/* More */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href={`/client/domains/${domain.id}/dns`}>
                                <Settings className="mr-2 size-4" />
                                Manage DNS
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 size-4" />
                              View WHOIS
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 size-4" />
                              {domain.privacyProtection
                                ? "Disable Privacy"
                                : "Enable Privacy"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 size-4" />
                              Transfer Domain
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              Cancel Domain
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="border-t border-border px-4 py-2.5">
              <p className="text-xs text-muted-foreground">
                {filtered.length} of {domains.length} domain
                {domains.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}