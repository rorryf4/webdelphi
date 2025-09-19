"use client";

import React from "react";

type AnyRec = Record<string, any>;

// ---------- helpers ----------
const norm = (s: unknown) => String(s ?? "").trim().replace(/\s+/g, " ").toUpperCase();
const gameKey = (g: AnyRec) => {
  const away = g.away_team ?? g.awayTeam ?? g.away ?? "Away";
  const home = g.home_team ?? g.homeTeam ?? g.home ?? "Home";
  return `${norm(away)}@${norm(home)}`;
};

async function fetchGames(league: string, week: string) {
  const url = `/api/scrape?league=${encodeURIComponent(league)}&week=${encodeURIComponent(week)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 204) return [];
  if (!res.ok) {
    let detail = "";
    try { const j = await res.json(); detail = (j as AnyRec)?.detail || ""; } catch {}
    throw new Error(detail || `Proxy error ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray((data as AnyRec)?.games) ? (data as AnyRec).games : [];
}

async function fetchCurrentWeek(league: string) {
  try {
    const r = await fetch(`/api/games/week?league=${encodeURIComponent(league)}`, { cache: "no-store" });
    if (!r.ok) return null;
    const j = (await r.json()) as AnyRec;
    const wk = j?.week ?? j?.data?.week ?? j?.result?.week ?? null;
    return wk ? String(wk) : null;
  } catch {
    return null;
  }
}

const fmtDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
};

const statusFromGame = (g: AnyRec) => {
  if (g.status) return String(g.status);
  if (g.completed) return "Final";
  if (g.start_date || g.startTime) return "Scheduled";
  return "";
};

const scoreLine = (g: AnyRec) => {
  const hp = g.home_points ?? g.homeScore ?? g.home_points_total ?? null;
  const ap = g.away_points ?? g.awayScore ?? g.away_points_total ?? null;
  if (hp == null || ap == null) return "";
  return `${ap} - ${hp}`;
};

// ---------- page ----------
export default function GamesPage() {
  const [league, setLeague] = React.useState("ncaaf");
  const [week, setWeek] = React.useState<string>("");
  const [limit, setLimit] = React.useState<number>(50);
  const [games, setGames] = React.useState<AnyRec[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [analysis, setAnalysis] = React.useState<AnyRec[] | null>(null);
  const [anLoading, setAnLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const wk = await fetchCurrentWeek(league);
      setWeek(wk ?? "1");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    if (!league || !week) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGames(league, week);
      (data as AnyRec[]).sort((a, b) => {
        const da = Date.parse(a.start_date ?? a.startTime ?? "") || 0;
        const db = Date.parse(b.start_date ?? b.startTime ?? "") || 0;
        return da - db;
      });
      setGames(data);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { if (week) load(); /* eslint-disable-next-line */ }, [league, week]);

  async function runAnalysis() {
    setError(null);
    setAnalysis(null);
    setAnLoading(true);
    try {
      const res = await fetch(
        `/api/analyze?league=${encodeURIComponent(league)}&week=${encodeURIComponent(week)}&limit=${encodeURIComponent(String(limit))}`,
        { cache: "no-store" }
      );
      if (res.status === 404) {
        setError("Analysis endpoint not configured yet.");
        return;
      }
      if (!res.ok) {
        let detail = "";
        try { const j = await res.json(); detail = (j as AnyRec)?.detail || (j as AnyRec)?.message || ""; } catch {}
        throw new Error(detail || `Analyze failed ${res.status}`);
      }
      const j = await res.json();
      const arr: AnyRec[] = (j as AnyRec)?.results || [];
      setAnalysis(limit > 0 ? arr.slice(0, limit) : arr);
    } catch (e: any) {
      setError(e?.message || "Analyze failed");
    } finally {
      setAnLoading(false);
    }
  }

  // Map analysis results by matchup for inline display
  const analysisMap = React.useMemo(() => {
    const m = new Map<string, AnyRec>();
    (analysis ?? []).forEach((r) => {
      if (r?.matchup && typeof r.matchup === "string" && r.matchup.includes("@")) {
        const [away, home] = r.matchup.split("@");
        m.set(`${norm(away)}@${norm(home)}`, r);
      } else if (typeof r?.id === "string") {
        m.set(norm(r.id), r);
      }
    });
    return m;
  }, [analysis]);

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col">
          <label className="text-sm text-gray-500">League</label>
          <select className="border rounded px-2 py-1" value={league} onChange={(e) => setLeague(e.target.value)}>
            <option value="ncaaf">NCAAF</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Week</label>
          <input
            className="border rounded px-2 py-1 w-24"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            placeholder="e.g., 1"
            inputMode="numeric"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-500">Limit (analysis)</label>
          <input
            className="border rounded px-2 py-1 w-24"
            value={String(limit)}
            onChange={(e) => setLimit(Number(e.target.value || 0))}
            inputMode="numeric"
          />
        </div>

        <button onClick={load} disabled={loading || !week} className="border rounded px-3 py-1 hover:bg-gray-50 disabled:opacity-50">
          {loading ? "Loading..." : "Refresh"}
        </button>

        <button onClick={runAnalysis} disabled={anLoading || !week} className="border rounded px-3 py-1 hover:bg-gray-50 disabled:opacity-50">
          {anLoading ? "Analyzing..." : "Analyze"}
        </button>
      </header>

      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 px-3 py-2 rounded">Error: {error}</div>
      )}

      {!error && !loading && games.length === 0 && (
        <div className="text-gray-600">No games for week {week}.</div>
      )}

      {games.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border border-gray-200 rounded">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-2 border-b">Kickoff</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Matchup</th>
                <th className="p-2 border-b">Score</th>
                <th className="p-2 border-b">Pick</th>
                <th className="p-2 border-b">Conf.</th>
                <th className="p-2 border-b">Venue</th>
                <th className="p-2 border-b">Network</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g, i) => {
                const away = g.away_team ?? g.awayTeam ?? g.away ?? "Away";
                const home = g.home_team ?? g.homeTeam ?? g.home ?? "Home";
                const k = gameKey(g);
                const a = analysisMap.get(k);
                return (
                  <tr key={i} className="even:bg-gray-50/40">
                    <td className="p-2 border-b">{fmtDate(g.start_date ?? g.startTime)}</td>
                    <td className="p-2 border-b">{statusFromGame(g)}</td>
                    <td className="p-2 border-b">{away} @ {home}</td>
                    <td className="p-2 border-b">{scoreLine(g)}</td>
                    <td className="p-2 border-b">{a?.pick ?? "-"}</td>
                    <td className="p-2 border-b">{a?.confidence != null ? (a.confidence as number).toFixed(2) : "-"}</td>
                    <td className="p-2 border-b">{g.venue ?? ""}</td>
                    <td className="p-2 border-b">{g.tv ?? g.network ?? ""}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {analysis && (
        <div className="border rounded p-3">
          <h2 className="font-semibold mb-2">Analysis</h2>
          {analysis.length === 0 ? (
            <div className="text-gray-600">No analysis results.</div>
          ) : (
            <ul className="space-y-2">
              {analysis.map((r: AnyRec, i: number) => (
                <li key={i} className="border p-2 rounded">
                  <div className="font-medium">{r.matchup ?? r.id ?? `Game ${i + 1}`}</div>
                  <div className="text-sm">
                    Pick: {r.pick ?? "-"} (conf {Math.round(((r.confidence ?? 0) as number) * 100)}%)
                  </div>
                  {r.metrics?.scoreDiff != null && (
                    <div className="text-xs text-gray-600">Score diff: {String(r.metrics.scoreDiff)}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}