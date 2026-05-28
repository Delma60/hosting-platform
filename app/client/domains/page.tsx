"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  RefreshCw,
  Settings2,
  MoreHorizontal,
  Search,
  Shield,
  ShieldOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  XCircle,
  ArrowUpDown,
  Copy,
  Check,
} from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
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
  tld: string;
  registrar: string;
  registered: string;
  expiry: string;
  autoRenew: boolean;
  status: "active" | "expiring" | "expired" | "suspended";
  privacyProtection: boolean;
  nameservers: string[];
  daysLeft: number;
}

type SortKey = "name" | "expiry" | "status";
type SortDir = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysLeft(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function deriveStatus(daysLeft: number, rawStatus?: string): Domain["status"] {
  if (rawStatus === "suspended") return "suspended";
  if (rawStatus === "expired" || daysLeft <= 0) return "expired";
  if (daysLeft <= 30) return "expiring";
  return "active";
}

function splitDomain(name: string): { sld: string; tld: string } {
  const dot = name.indexOf(".");
  if (dot === -1) return { sld: name, tld: "" };
  return { sld: name.slice(0, dot), tld: name.slice(dot) };
}

function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className:
      "gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  expiring: {
    label: "Expiring",
    icon: AlertTriangle,
    className: "gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  expired: {
    label: "Expired",
    icon: XCircle,
    className:
      "gap-1.5 border-destructive/30 bg-destructive/10 text-destructive",
  },
  suspended: {
    label: "Suspended",
    icon: Clock,
    className:
      "gap-1.5 border-destructive/30 bg-destructive/10 text-destructive",
  },
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Domain["status"] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <Badge variant="outline" className={cfg.className}>
      <Icon className="size-3" />
      {cfg.label}
    </Badge>
  );
}

function DaysLeftPill({
  daysLeft,
  status,
}: {
  daysLeft: number;
  status: Domain["status"];
}) {
  if (status === "active" && daysLeft > 60) return null;
  if (daysLeft <= 0)
    return (
      <span className="text-xs font-medium text-destructive">Expired</span>
    );
  return (
    <span
      className={`text-xs font-medium tabular-nums ${
        daysLeft <= 7
          ? "text-red-400"
          : daysLeft <= 30
            ? "text-amber-400"
            : "text-slate-500"
      }`}
    >
      {daysLeft}d left
    </span>
  );
}

function AutoRenewToggle({
  enabled,
  domainId,
  loading,
  onChange,
}: {
  enabled: boolean;
  domainId: string;
  loading: boolean;
  onChange: (id: string, val: boolean) => void;
}) {
  if (loading) {
    return <Loader2 className="size-4 animate-spin text-muted-foreground" />;
  }
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(domainId, !enabled)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        enabled ? "bg-amber-500" : "bg-input"
      }`}
    >
      <span
        className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
      <span className="sr-only">
        {enabled ? "Disable" : "Enable"} auto-renew
      </span>
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100 hover:text-foreground"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-9 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-md" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-7 w-16 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Skeleton className="mb-2 h-3 w-16" />
      <Skeleton className="h-7 w-10" />
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={6}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted">
            <Globe className="size-6 text-muted-foreground" />
          </div>
          <p className="mb-1 text-sm font-semibold text-foreground">
            {filtered
              ? "No domains match your search"
              : "No domains registered yet"}
          </p>
          <p className="mb-6 text-xs text-muted-foreground">
            {filtered
              ? "Try a different search term or clear the filter."
              : "Register your first domain to get started."}
          </p>
          {!filtered && (
            <Link href="/domains">
              <Button
                size="sm"
                className="bg-amber-500 font-bold text-black hover:bg-amber-400"
              >
                <Plus className="mr-1.5 size-3.5" />
                Register a Domain
              </Button>
            </Link>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Sort button ──────────────────────────────────────────────────────────────

function SortableHead({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <button
      className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest transition-colors ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      onClick={() => onSort(sortKey)}
    >
      {label}
      <ArrowUpDown
        className={`size-3 transition-opacity ${active ? "opacity-100" : "opacity-40"}`}
      />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DomainsPage() {
  const { user } = useAuth();

  const [domains, setDomains] = useState<Domain[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("expiry");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // ──

  const fetchDomains = useCallback(async () => {
    console.log({ user });
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "services"),
        where("userId", "==", user.uid),
        where("type", "==", "domain"),
      );
      const snap = await getDocs(q);
      const docs: Domain[] = snap.docs.map((d) => {
        const data = d.data();
        const expiryRaw: string =
          data.expiryDate?.toDate?.()?.toISOString() ?? data.expiry ?? "";
        const registeredRaw: string =
          data.createdAt?.toDate?.()?.toISOString() ?? data.registered ?? "";
        const daysLeft = expiryRaw ? getDaysLeft(expiryRaw) : 9999;
        const name: string = data.domain ?? data.name ?? "—";
        const { sld, tld } = splitDomain(name);
        return {
          id: d.id,
          name,
          tld,
          registrar: data.meta?.registrar ?? "Namecheap",
          registered: registeredRaw ? formatDate(registeredRaw) : "—",
          expiry: expiryRaw ? formatDate(expiryRaw) : "—",
          autoRenew: data.autoRenew ?? false,
          status: deriveStatus(daysLeft, data.status),
          privacyProtection: data.meta?.privacyProtection ?? false,
          nameservers: data.meta?.nameservers ?? [],
          daysLeft,
        };
      });
      console.log(snap);
      setDomains(docs);
    } catch (err) {
      console.error(err);
      setError("Failed to load domains?. Please refresh or try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // ── Auto-renew toggle ──────────────────────────────────────────────────────

  async function handleAutoRenewToggle(domainId: string, value: boolean) {
    setTogglingId(domainId);
    try {
      await updateDoc(doc(db, "services", domainId), { autoRenew: value });
      setDomains((prev) =>
        prev?.map((d) => (d.id === domainId ? { ...d, autoRenew: value } : d)),
      );
    } catch {
      // In production: show a toast notification
    } finally {
      setTogglingId(null);
    }
  }

  // ── Sort handler ───────────────────────────────────────────────────────────

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const filtered = domains
    ?.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "expiry") cmp = a.daysLeft - b.daysLeft;
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const activeCount = domains?.filter((d) => d.status === "active").length;
  const expiringCount = domains?.filter((d) => d.status === "expiring").length;
  const expiredCount = domains?.filter((d) => d.status === "expired").length;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1
              className="text-xl font-extrabold tracking-tight text-foreground"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Domains
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {loading
                ? "Loading your domains…"
                : `${domains?.length} domain${domains?.length !== 1 ? "s" : ""} registered`}
            </p>
          </div>
          <Link href="/domains">
            <Button
              className="shrink-0 bg-amber-500 font-bold text-black hover:bg-amber-400"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <Plus className="mr-1.5 size-4" />
              Register Domain
            </Button>
          </Link>
        </div>

        {/* ── Stat cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              {[
                {
                  label: "Total",
                  value: domains?.length,
                  valueClass: "text-foreground",
                },
                {
                  label: "Active",
                  value: activeCount,
                  valueClass: "text-emerald-400",
                },
                {
                  label: "Expiring",
                  value: expiringCount,
                  valueClass:
                    (expiringCount || 0) > 0
                      ? "text-amber-400"
                      : "text-muted-foreground",
                },
                {
                  label: "Expired",
                  value: expiredCount,
                  valueClass:
                    (expiredCount || 0) > 0
                      ? "text-destructive"
                      : "text-muted-foreground",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </p>
                  <p
                    className={`mt-1 text-2xl font-extrabold tracking-tight ${s.valueClass}`}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Expiring banner ──────────────────────────────────────────────── */}
        {!loading && (expiringCount || 0) > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p className="flex-1 text-sm text-amber-300">
              <span className="font-semibold">
                {expiringCount} domain{expiringCount !== 1 ? "s" : ""}
              </span>{" "}
              {expiringCount !== 1 ? "are" : "is"} expiring within 30 days.
              Renew now to avoid interruption.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
              onClick={() => setSortKey("expiry")}
            >
              Sort by expiry
            </Button>
          </div>
        )}

        {/* ── Error banner ─────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3">
            <XCircle className="size-4 shrink-0 text-destructive" />
            <p className="flex-1 text-sm text-destructive">{error}</p>
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={fetchDomains}
            >
              <RefreshCw className="mr-1.5 size-3.5" />
              Retry
            </Button>
          </div>
        )}

        {/* ── Table card ───────────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Search bar */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by domain name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <XCircle className="size-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <SortableHead
                    label="Domain"
                    sortKey="name"
                    current={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHead
                    label="Status"
                    sortKey="status"
                    current={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHead
                    label="Expiry"
                    sortKey="expiry"
                    current={sortKey}
                    dir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Auto-Renew
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Privacy
                </TableHead>
                <TableHead className="text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : filtered?.length === 0 ? (
                <EmptyState filtered={!!search} />
              ) : (
                filtered?.map((domain) => {
                  const { sld, tld } = splitDomain(domain?.name);
                  return (
                    <TableRow key={domain?.id} className="group/row">
                      {/* Domain name */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                            <Globe className="size-4 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center">
                              <span className="text-sm font-semibold text-foreground">
                                {sld}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {tld}
                              </span>
                              <CopyButton text={domain?.name} />
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              via {domain?.registrar} · reg.{" "}
                              {domain?.registered}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={domain?.status} />
                      </TableCell>

                      {/* Expiry */}
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`text-sm tabular-nums ${
                              domain?.status === "expiring"
                                ? "font-semibold text-amber-400"
                                : domain?.status === "expired"
                                  ? "font-semibold text-destructive"
                                  : "text-foreground"
                            }`}
                          >
                            {domain?.expiry}
                          </span>
                          <DaysLeftPill
                            daysLeft={domain?.daysLeft}
                            status={domain?.status}
                          />
                        </div>
                      </TableCell>

                      {/* Auto-renew */}
                      <TableCell>
                        <AutoRenewToggle
                          enabled={domain?.autoRenew}
                          domainId={domain?.id}
                          loading={togglingId === domain?.id}
                          onChange={handleAutoRenewToggle}
                        />
                      </TableCell>

                      {/* Privacy */}
                      <TableCell>
                        {domain?.privacyProtection ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                                <Shield className="size-3" />
                                Protected
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              WHOIS privacy is enabled
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="inline-flex w-fit cursor-default items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
                                <ShieldOff className="size-3" />
                                Off
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              WHOIS privacy is disabled. Your contact info may
                              be public.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* DNS button — always visible */}
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                              >
                                <Link
                                  href={`/client/domains/${domain?.id}/dns`}
                                >
                                  <Settings2 className="mr-1 size-3" />
                                  DNS
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Manage DNS records</TooltipContent>
                          </Tooltip>

                          {/* Renew CTA — only when expiring / expired */}
                          {(domain?.status === "expiring" ||
                            domain?.status === "expired") && (
                            <Tooltip>
                              <TooltipTrigger>
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

                          {/* More menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="inline-flex size-7 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label="More options"
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuItem>
                                <Link
                                  href={`/client/domains/${domain?.id}/dns`}
                                  className="flex items-center gap-2"
                                >
                                  <Settings2 className="size-4" />
                                  Manage DNS
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <ExternalLink className="size-4" />
                                View WHOIS
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                {domain?.privacyProtection ? (
                                  <>
                                    <ShieldOff className="size-4" />
                                    Disable Privacy
                                  </>
                                ) : (
                                  <>
                                    <Shield className="size-4" />
                                    Enable Privacy
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2">
                                <RefreshCw className="size-4" />
                                Transfer Out
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                className="flex items-center gap-2"
                              >
                                Cancel Domain
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Table footer */}
          {!loading && filtered?.length > 0 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filtered?.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {domains?.length}
                </span>{" "}
                domain{domains?.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={fetchDomains}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <RefreshCw className="size-3" />
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
