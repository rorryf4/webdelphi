'use client';
import { useEffect, useState } from 'react';

type Game = {
  id?: number | string;
  home_team?: string;
  away_team?: string;
  start_date?: string; // ISO
  venue?: string | null;
  [k: string]: any;
};

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [week, setWeek] = useState('2');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const toLocal = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : 'TBD';

  const byKick = (a: Game, b: Game) =>
    new Date(a.start_date || 0).getTime() - new Date(b.start_date || 0).getTime();

  async function load(w: string) {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`/api/analysis?league=ncaaf&year=2025&week=${w}`, { cache: 'no-store' });
      const json = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(json));
      setGames((json.games || []) as Game[]);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(week); }, []); // initial load

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">NCAAF — Week {week}</h1>

      <div className="flex gap-2 items-center">
        <label className="text-sm">Week</label>
        <select
          className="border rounded px-2 py-1"
          value={week}
          onChange={(e) => { const w = e.target.value; setWeek(w); load(w); }}
        >
          {Array.from({ length: 15 }, (_, i) => String(i + 1)).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div className="text-sm opacity-70">Showing {games.length} games</div>

      {loading && <div>Loading…</div>}
      {err && <pre className="text-red-600">{err}</pre>}

      {!loading && !err && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {games.slice().sort(byKick).map((g, i) => (
            <div key={(g.id ?? i).toString()} className="rounded-2xl border p-4 shadow-sm">
              <div className="font-medium">{g.away_team} @ {g.home_team}</div>
              <div className="text-sm opacity-70">{toLocal(g.start_date)}</div>
              {g.venue && <div className="text-sm">{g.venue}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
