import { NextRequest, NextResponse } from "next/server";

/** GET: analysis via SCRAPER_URL with robust error handling */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const league = url.searchParams.get("league") ?? "ncaaf";
    const week = url.searchParams.get("week");
    if (!week) return NextResponse.json({ error: "missing_week" }, { status: 400 });

    const base = process.env.SCRAPER_URL;
    if (!base) return NextResponse.json({ error: "missing_config", detail: "SCRAPER_URL not set" }, { status: 500 });

    const upstream = await fetch(`${base}/scrape?league=${encodeURIComponent(league)}&week=${encodeURIComponent(week)}`, { cache: "no-store" });

    if (upstream.status === 204) {
      return NextResponse.json({ ok: true, league, week, count: 0, results: [] });
    }

    const text = await upstream.text();

    if (!upstream.ok) {
      // surface upstream error body to help debug
      return NextResponse.json({ error: "upstream", status: upstream.status, body: text.slice(0, 500) }, { status: 502 });
    }

    // Try to parse as { games: [...] } or as [...] directly
    let games: any[] = [];
    try {
      const parsed = JSON.parse(text);
      games = Array.isArray(parsed) ? parsed : (parsed?.games ?? []);
      if (!Array.isArray(games)) games = [];
    } catch {
      games = [];
    }

    const results = games.map((g: any) => {
      const home = g.home_team ?? g.homeTeam ?? g.home ?? g.homeName ?? "Home";
      const away = g.away_team ?? g.awayTeam ?? g.away ?? g.awayName ?? "Away";
      const hp = g.home_points ?? g.homeScore ?? g.home_points_total ?? null;
      const ap = g.away_points ?? g.awayScore ?? g.away_points_total ?? null;
      const diff = (hp != null && ap != null) ? Math.abs(Number(hp) - Number(ap)) : null;
      const closeGame = diff != null ? diff <= 7 : null;
      return {
        id: g.id ?? g.game_id ?? `${away}@${home}`,
        matchup: `${away} @ ${home}`,
        kickoff: g.start_date ?? g.startTime ?? g.kickoff ?? null,
        status: g.status ?? (g.completed ? "Final" : g.in_progress ? "In-Progress" : "Scheduled"),
        score: (hp != null && ap != null) ? `${ap}-${hp}` : null,
        metrics: { scoreDiff: diff, closeGame },
        pick: closeGame === true ? "No Play (coin-flip)" : "Lean Favorite",
        confidence: closeGame === true ? 0.5 : 0.6
      };
    });

    return NextResponse.json({ ok: true, league, week, count: results.length, results });
  } catch (e: any) {
    console.error("[/api/analyze][GET] error", e);
    return NextResponse.json({ error: "internal", message: e?.message ?? String(e) }, { status: 500 });
  }
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
