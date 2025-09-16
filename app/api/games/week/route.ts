import { NextResponse } from "next/server";
import { getNflWeekFromScraper } from "@/lib/clients/scraper";
import { analyzeGames } from "@/lib/clients/analyzer";
import { toUiGames } from "@/lib/normalize";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const season = Number(searchParams.get("season") || new Date().getFullYear());
    const week = Number(searchParams.get("week") || 2);
    const league = (searchParams.get("league") || "nfl").toLowerCase();
    if (league !== "nfl") return NextResponse.json({ games: [] });

    const scraped = await getNflWeekFromScraper(season, week);
    const analyzed = await analyzeGames(scraped.map(s => ({
      id: s.id, league: s.league, home: s.home.name, away: s.away.name, start: s.start, market: s.market,
    })));
    const games = toUiGames(scraped, analyzed);
    return NextResponse.json({ games });
  } catch (e:any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
