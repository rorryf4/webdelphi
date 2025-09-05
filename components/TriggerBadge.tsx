import React from "react";

export default function TriggerBadge({ label }: { label: string }) {
  return (
    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}
