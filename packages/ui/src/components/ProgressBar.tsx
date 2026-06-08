import React from "react";

export interface ProgressBarProps {
  value: number;
  max?: number;
  colorClass?: string;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  colorClass = "bg-blue-500",
  className = "",
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={["flex items-center gap-2", className].join(" ")}>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={["h-full rounded-full transition-all", colorClass].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 tabular-nums w-8 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
