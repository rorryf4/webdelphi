import React from "react";
import TriggerBadge from "./TriggerBadge";

type Props = {
  team: string;
  edge_signal: number;
  score_recent: number;
  score_baseline_mean: number;
  triggers: string[];
};

export default function TeamRow({ team, edge_signal, score_recent, score_baseline_mean, triggers }: Props) {
  return (
    <div className="flex justify-between items-center p-4 border-b border-slate-800">
      <div className="font-medium">{team}</div>
      <div className="flex flex-col items-end">
        <span className={edge_signal >= 0 ? "text-emerald-400" : "text-rose-400"}>
          {edge_signal > 0 ? "+" : ""}{edge_signal.toFixed(2)}
        </span>
        <span className="text-xs text-slate-400">
          {score_recent.toFixed(1)} vs {score_baseline_mean.toFixed(1)}
        </span>
        <div className="flex flex-wrap gap-1 mt-1">
          {triggers.length ? triggers.map((t) => <TriggerBadge key={t} label={t} />) : <span className="text-xs">—</span>}
        </div>
      </div>
    </div>
  );
}
