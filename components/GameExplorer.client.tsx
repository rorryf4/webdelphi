"use client";
import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import GameSearch from "./GameSearch";
import KpiCard from "./KpiCard";

type Game = {
  id: string;
  league: "nfl" | "cfb";
  start: string;
  venue: string;
  home: { id: string; name: string; record?: string };
  away: { id: string; name: string; record?: string };
  market: { spread: string; total: string };
  edge: { evPct: number };
};

const params = new URLSearchParams({
  q,
  league,           // "all" is fine now; route maps it to "nfl"
  season: String(new Date().getFullYear()),
  week: "2",
});
const res = await fetch(`/api/games?${params.toString()}`, { cache: "no-store" });


export default function GameExplorer() {
  const [q, setQ] = useState("");
  const [league, setLeague] = useState("all");
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchGames() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ q, league });
      const res = await fetch(`/api/games?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGames(data.games);
    } catch (e: any) {
      setError(e.message ?? "Failed to load games");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-8">
      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Models Online" value={3} subtext="narrative • stats • sim" />
        <KpiCard label="Tracked Games" value={games.length} subtext="current query" />
        <KpiCard label="Edges Detected" value={12} subtext="> 3% EV" />
        <KpiCard label="Last Sync" value={loading ? "loading…" : "now"} subtext="/api/games" />
      </section>

      {/* Search / controls */}
      <section>
        <GameSearch
          q={q}
          league={league}
          onChangeQ={setQ}
          onChangeLeague={setLeague}
          onSearch={fetchGames}
        />
        {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
      </section>

      {/* Game list */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading && games.length === 0 ? (
          <div className="text-slate-400 text-sm">Loading…</div>
        ) : games.length === 0 ? (
          <div className="text-slate-400 text-sm">No games found. Try a different query.</div>
        ) : (
          games.map((g) => <GameCard key={g.id} game={g} />)
        )}
      </section>
    </div>
  );
}