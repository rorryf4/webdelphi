"use client";
import { useEffect, useState } from "react";
import { useQueryState } from "@/lib/useQueryState";
import WeekSelector from "@/components/WeekSelector";
import GameTable from "@/components/GameTable";
import GameDetailsDrawer from "@/components/GameDetailsDrawer";
import type { Game } from "@/lib/types";

export default function EdgeDashboard() {
  // URL-backed season/week; defaults to current year, week 2
  const [qs, setQs] = useQueryState<{ season: string; week: string; league: string }>({
    season: String(new Date().getFullYear()),
    week: "2",
    league: "all", // keeps your existing behavior
  });

  const season = Number(qs.season);
  const week = Number(qs.week);
  const league = qs.league;

  const [games, setGames] = useState<Game[]>([]);
  const [selected, setSelected] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    // STILL calling your stable mock endpoint so nothing breaks.
    // Later, switch to: `/api/games/week?league=nfl&season=${season}&week=${week}`
    const res = await fetch(`/api/games?league=${encodeURIComponent(league)}&q=`, { cache: "no-store" });
    const data = await res.json();
    setGames(data.games ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [season, week, league]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-3">
        <WeekSelector
          season={season}
          week={week}
          onChange={(s, w) => setQs({ season: String(s), week: String(w) })}
        />
        <div className="text-sm text-slate-400">{loading ? "Loading…" : `${games.length} games`}</div>
        <GameTable games={games} onSelect={setSelected} />
      </div>
      <GameDetailsDrawer game={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

