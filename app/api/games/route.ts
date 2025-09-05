import { NextResponse } from "next/server"
import { mockGames } from "@/lib/sample"


export async function GET(req: Request) {
const { searchParams } = new URL(req.url)
const q = (searchParams.get("q") || "").toLowerCase()
const league = (searchParams.get("league") || "all").toLowerCase()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").toLowerCase();

  // 👇 accept "all" as NFL so your existing UI keeps working
  const leagueParam = (searchParams.get("league") || "nfl").toLowerCase();
  const league = leagueParam === "all" ? "nfl" : leagueParam;

  // 👇 default to current year + WEEK 2 (change anytime)
  const season = Number(searchParams.get("season") || new Date().getFullYear());
  const week = Number(searchParams.get("week") || 2);

  if (league !== "nfl") return NextResponse.json({ games: [] });

  try {
    const schedule = await getNflWeekScheduleFromESPN({ season, week, seasonType: 2 });
    const oddsMap = await getNflOddsFromTheOdds(); // uses process.env.ODDS_API_KEY
    let games = mergeScheduleWithOdds({ schedule, oddsMap, season });

    if (q) {
      games = games.filter(g =>
        `${g.home.name} ${g.away.name}`.toLowerCase().includes(q)
      );
    }
    return NextResponse.json({ games });
  } catch (e: any) {
    // helpful error payload so you can see what went wrong in the browser
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}


let data = mockGames


if (league !== "all") {
data = data.filter((g) => g.league === league)
}
if (q) {
data = data.filter((g) => {
const hay = `${g.home.name} ${g.away.name} ${g.home.id} ${g.away.id}`.toLowerCase()
return hay.includes(q)
})
}


return NextResponse.json({ games: data })
}

import { NextResponse } from "next/server";

// TEMP stub to keep compile green.
// Later we replace with ESPN + Odds providers and return real games.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const season = Number(searchParams.get("season") || new Date().getFullYear());
  const week = Number(searchParams.get("week") || 2);
  const league = (searchParams.get("league") || "nfl").toLowerCase();

  return NextResponse.json({
    season, week, league,
    games: [] // fill when ready
  });
}
