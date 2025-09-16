import type { Game } from "@/lib/types";
import type { ScraperGame } from "@/lib/clients/scraper";
import type { AnalyzeOutput } from "@/lib/clients/analyzer";

export function toUiGames(raw: ScraperGame[], analyzed?: AnalyzeOutput): Game[] {
  const byId = new Map(analyzed?.map(a => [a.id, a]) ?? []);
  return raw.map<Game>(g => {
    const a = byId.get(g.id);
    return {
      id: g.id, league: g.league, start: g.start, venue: g.venue ?? "",
      home: { id: g.home.id, name: g.home.name, record: g.home.record },
      away: { id: g.away.id, name: g.away.name, record: g.away.record },
      market: { spread: g.market?.spread ?? "", total: g.market?.total ?? "" },
      edge: { evPct: a?.edge.evPct ?? 0 },
    };
  });
}
