import React from "react";
import { AlertTriangle } from "lucide-react";
import type { PlaceholderCategory } from "@/content/types";

export interface PlaceholderBadgeProps {
  id?: number | string;
  label?: string;
  status?: string;
  category?: PlaceholderCategory;
  notes?: string;
  forceShow?: boolean;
  inline?: boolean;
  className?: string;
}

export function PlaceholderBadge({
  id,
  label = "Placeholder",
  status,
  notes,
  forceShow = false,
  inline = true,
  className = "",
}: PlaceholderBadgeProps) {
  // Gated to development mode: hide in production unless explicitly forced
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!isDevelopment && !forceShow) {
    return null;
  }

  const tooltip = notes
    ? `[#${id || "?"}] ${status ? status + ": " : ""}${notes}`
    : `Item #${id || "?"}: ${label}`;

  return (
    <span
      role="status"
      title={tooltip}
      className={`${
        inline ? "inline-flex" : "flex"
      } items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 rounded-[2px] select-none ${className}`}
    >
      <AlertTriangle className="w-2.5 h-2.5 shrink-0 text-amber-600" aria-hidden="true" />
      <span>{label}</span>
      {id && <span className="opacity-60 text-[9px]">#{id}</span>}
    </span>
  );
}

export default PlaceholderBadge;
