import { NextRequest, NextResponse } from "next/server";

/** GET: your existing analysis using SCRAPER_URL */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league") ?? "ncaaf";
  const week = searchParams.get("week") ?? "";

  const base = process.env.SCRAPER_URL;
  if (!base) return NextResponse.json({ error: "missing_config", detail: "SCRAPER_URL not set" }, { status: 500 });
  if (!week) return NextResponse.json({ error: "missing_week" }, { status: 400 });

  const r = await fetch(`${base}/scrape?league=${encodeURIComponent(league)}&week=${encodeURIComponent(week)}`, { cache: "no-store" });
  if (!r.ok) return NextResponse.json({ error: "upstream", status: r.status }, { status: 502 });
  if (r.status === 204) return NextResponse.json({ ok: true, week, results: [] });

  const { games = [] } = await r.json();
  const results = games.map((g: any) => {
    const home = g.home_team ?? g.homeTeam ?? g.home;
    const away = g.away_team ?? g.awayTeam ?? g.away;
    const hp = g.home_points ?? g.homeScore ?? null;
    const ap = g.away_points ?? g.awayScore ?? null;
    const diff = hp != null && ap != null ? Math.abs(hp - ap) : null;
    const closeGame = diff != null ? diff <= 7 : null;
    return {
      id: g.id ?? `${away}@${home}`,
      matchup: `${away} @ ${home}`,
      kickoff: g.start_date ?? g.startTime ?? null,
      status: g.status ?? (g.completed ? "Final" : "Scheduled"),
      score: hp != null && ap != null ? `${ap}-${hp}` : null,
      metrics: { scoreDiff: diff, closeGame },
      pick: closeGame === true ? "No Play (coin-flip)" : "Lean Favorite",
      confidence: closeGame === true ? 0.5 : 0.6,
    };
  });

  return NextResponse.json({ ok: true, league, week, count: results.length, results });
}

/** POST: proxy to your Render analyzer */
export async function POST(req: Request) {
  const base = process.env.ANALYZER_URL;
  if (!base) {
    return NextResponse.json({ ok: false, error: "missing_ANALYZER_URL" }, { status: 500 });
  }

  let body: unknown = {};
  try { body = await req.json(); } catch { body = {}; }

  const upstream = await fetch(`${base}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await upstream.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: upstream.status });
  } catch {
    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") || "text/plain" },
    });
  }
}
