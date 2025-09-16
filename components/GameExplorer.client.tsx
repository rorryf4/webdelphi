"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Edge = { modelSpread: number; value: number; confidence: number; pick: string };
type Game = {
  home: string;
  away: string;
  kickoff: string;
  market: { spread: number; total: number };
  narratives: string[];
  edge: Edge;
};
type Analysis = { league: string; week: number; games: Game[] };

function useAnalysis(initialLeague: string, initialWeek: number) {
  const sp = useSearchParams();
  const league = sp.get("league") ?? initialLeague;
  const week = Number(sp.get("week") ?? initialWeek);

  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setErr(null);

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    fetch(`${base}/api/analysis?league=${league}&week=${week}`, {
      cache: "no-store",
      signal: ac.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Analysis>;
      })
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setErr(String(e));
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [league, week]);

  return { data, loading, err, league, week };
}

export default function GameExplorer({
  initialLeague = "ncaaf",
  initialWeek = 2,
}: {
  initialLeague?: string;
  initialWeek?: number;
}) {
  const router = useRouter();
  const { data, loading, err, league, week } = useAnalysis(initialLeague, initialWeek);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const l = (new FormData(form).get("league") as string) || league;
    const w = Number((new FormData(form).get("week") as string) || week);
    router.push(`/?league=${encodeURIComponent(l)}&week=${encodeURIComponent(String(w))}`);
  };

  const body = useMemo(() => {
    if (loading) return <div className="text-sm opacity-70">Loading analysis…</div>;
    if (err) return <div className="text-sm text-red-400">Error: {err}</div>;
    if (!data) return null;
    if (!data.games?.length) return <div className="text-sm opacity-70">No games found.</div>;

    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.games.map((g, i) => (
          <article key={i} className="rounded-2xl shadow p-4 border">
            <div className="text-xs opacity-70">{new Date(g.kickoff).toLocaleString()}</div>
            <h2 className="text-lg font-medium mt-1">{g.away} @ {g.home}</h2>

            <div className="mt-3 text-sm space-y-1">
              <div>Market: spread <span className="font-mono">{g.market.spread}</span>, total <span className="font-mono">{g.market.total}</span></div>
              <div>Model spread: <span className="font-mono">{g.edge.modelSpread}</span></div>
              <div>Value: <span className="font-mono">{g.edge.value}</span> • Conf: <span className="font-mono">{Math.round(g.edge.confidence*100)}%</span></div>
              <div>Pick: <b>{g.edge.pick}</b></div>
            </div>

            {!!g.narratives?.length && (
              <ul className="mt-3 text-sm list-disc list-inside opacity-80">
                {g.narratives.map((n, j) => <li key={j}>{n}</li>)}
              </ul>
            )}
          </article>
        ))}
      </section>
    );
  }, [loading, err, data]);

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-baseline gap-3">
        <h1 className="text-2xl font-semibold">DelphiEdge</h1>
        <span className="text-sm opacity-70">{(data?.league ?? league).toUpperCase()} • Week {data?.week ?? week}</span>
      </header>

      <form className="flex gap-2" onSubmit={onSubmit}>
        <select name="league" defaultValue={league} className="border rounded-lg px-2 py-1">
          <option value="ncaaf">NCAAF</option>
          <option value="nfl">NFL</option>
        </select>
        <input name="week" defaultValue={String(week)} className="border rounded-lg px-2 py-1 w-20" />
        <button className="border rounded-lg px-3 py-1">Go</button>
      </form>

      {body}
    </main>
  );
}
