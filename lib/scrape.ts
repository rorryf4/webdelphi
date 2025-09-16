// app/lib/scrape.ts
export type Game = Record<string, any>;

export async function fetchGames(league: string, week: string) {
  const url = `/api/scrape?league=${encodeURIComponent(league)}&week=${encodeURIComponent(week)}`;
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 204) return []; // no games
  if (!res.ok) {
    let detail = "";
    try { const j = await res.json(); detail = j?.detail || ""; } catch {}
    throw new Error(detail || `Proxy error ${res.status}`);
  }

  const data = await res.json();
  // scraper returns { ok, league, year, week, count, games }
  if (Array.isArray(data?.games)) return data.games as Game[];
  return [];
}
