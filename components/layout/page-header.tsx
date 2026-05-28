import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle / description */
  description?: string;
  /** Slot for primary and secondary action buttons */
  actions?: React.ReactNode;
  /** Slot for tab navigation rendered below the header */
  tabs?: React.ReactNode;
  className?: string;
}

/**
 * Consistent page header used across all /client/* dashboard pages.
 *
 * Usage:
 * ```tsx
 * <PageHeader
 *   title="Domains"
 *   description="3 domains registered · 1 expiring soon"
 *   actions={
 *     <>
 *       <Button variant="outline" size="sm"><RefreshCw /> Refresh</Button>
 *       <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400">
 *         <Plus /> Register Domain
 *       </Button>
 *     </>
 *   }
 * />
 * ```
 */
export function PageHeader({
  title,
  description,
  actions,
  tabs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border bg-card", className)}>
      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 md:px-8">
        <div className="min-w-0">
          <h1
            className="text-xl font-extrabold tracking-tight text-foreground"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Tabs row — rendered flush to the bottom border */}
      {tabs && (
        <div className="px-5 md:px-8">{tabs}</div>
      )}
    </div>
  );
}