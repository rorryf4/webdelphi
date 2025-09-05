"use client";
import type { Game } from "@/lib/types";

export default function GameDetailsDrawer({
  game,
  onClose,
}: {
  game: Game | null;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-[420px] z-50 transition-transform duration-200 ${
        game ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full border-l border-slate-900 bg-slate-950 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Details</h3>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 px-3 py-1 text-sm"
          >
            Close
          </button>
        </div>
        {game ? (
          <div className="space-y-3">
            <div className="text-sm text-slate-300">
              {game.away.name} @ {game.home.name}
            </div>
            <div className="text-xs text-slate-400">
              {new Date(game.start).toLocaleString()} • {game.venue}
            </div>
            <div className="rounded-xl border border-slate-900 p-3">
              <div className="text-xs uppercase text-slate-400 mb-2">
                Model Snapshot
              </div>
              <ul className="text-sm space-y-1">
                <li>
                  EV: <b>{game.edge.evPct}%</b>
                </li>
                <li>Spread: {game.market.spread}</li>
                <li>Total: {game.market.total}</li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
