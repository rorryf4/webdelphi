// lib/normalize.ts
// @ts-nocheck

// Normalize raw scraper games into a UI-friendly shape,
// and optionally merge "analyzed" results if present.
export function toUiGames(raw: any[], analyzed?: any): any[] {
  const results = Array.isArray(analyzed)
    ? analyzed
    : Array.isArray(analyzed?.results)
    ? analyzed.results
    : [];

  // index analyzer results by a plausible game id
  const byId = new Map<string, any>();
  for (const r of results) {
    const id = r?.id ?? r?.gameId ?? r?.game_id;
    if (id != null) byId.set(String(id), r);
  }

  return (raw ?? []).map((g: any) => {
    const id =
      String(
        g.id ??
        g.gameId ??
        g.game_id ??
        `${g.away_team ?? g.away ?? ""}-${g.home_team ?? g.home ?? ""}-${g.start_date ?? g.start ?? ""}`
      );

    const extra = byId.get(id) ?? {};

    const homeName = g.home_team ?? g.homeTeam ?? g.home?.name ?? g.home ?? "Home";
    const awayName = g.away_team ?? g.awayTeam ?? g.away?.name ?? g.away ?? "Away";

    const homeScore =
      g.home_points ?? g.homeScore ?? g.home_points_total ?? g.home?.score ?? null;
    const awayScore =
      g.away_points ?? g.awayScore ?? g.away_points_total ?? g.away?.score ?? null;

    const start = g.start_date ?? g.startTime ?? g.start ?? null;
    const status = g.status ?? (g.completed ? "Final" : start ? "Scheduled" : null);

    return {
      id,
      start,
      venue: g.venue ?? g.venue_name ?? null,
      network: g.tv ?? g.network ?? null,
      status,
      home: { name: homeName, score: homeScore },
      away: { name: awayName, score: awayScore },
      edge: extra.edge ?? {},
      market: extra.market ?? {},
      _raw: g,
    };
  });
}