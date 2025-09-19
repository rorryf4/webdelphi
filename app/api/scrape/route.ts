import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function norm(s: unknown) {
  return String(s ?? "").trim().toUpperCase();
}

export async function GET(req: NextRequest) {
  try {
    const u = new URL(req.url);
    const league = u.searchParams.get("league") ?? "ncaaf";
    const week = u.searchParams.get("week");
    if (!week) return NextResponse.json({ detail: "missing_week" }, { status: 400 });

    const base = process.env.SCRAPER_URL;
    if (!base) return NextResponse.json({ detail: "SCRAPER_URL not set" }, { status: 500 });

    // conferences from env (CSV)
    const raw = process.env.ALLOWED_CONFERENCES ?? "";
    const allowed = raw.split(",").map(s => s.trim()).filter(Boolean);

    // Forward to scraper; include conferences=... if we have any
    const upstreamUrl = new URL(`${base}/scrape`);
    upstreamUrl.searchParams.set("league", league);
    upstreamUrl.searchParams.set("week", week);
    if (allowed.length > 0) upstreamUrl.searchParams.set("conferences", allowed.join(","));

    const r = await fetch(upstreamUrl.toString(), { cache: "no-store" });

    if (r.status === 204) return NextResponse.json({ games: [] }, { status: 200 });

    const text = await r.text();
    if (!r.ok) {
      return NextResponse.json({ detail: "upstream_error", status: r.status, body: text.slice(0, 600) }, { status: 502 });
    }

    // Parse upstream payload (array or { games: [...] })
    let games: any[] = [];
    try {
      const parsed = JSON.parse(text);
      games = Array.isArray(parsed) ? parsed : (parsed?.games ?? []);
      if (!Array.isArray(games)) games = [];
    } catch { games = []; }

    // Server-side filter by conference if we have an allow-list
    if (allowed.length > 0) {
      const allowNorm = new Set(allowed.map(norm));
      const inConf = (g: any) => {
        const fields = [
          g.home_conference, g.away_conference, g.conference, g.league,
          g.homeConference, g.awayConference, g.conferenceName
        ];
        return fields.some((v: unknown) => allowNorm.has(norm(v)));
      };
      games = games.filter(inConf);
    }

    return NextResponse.json({ games });
  } catch (e: any) {
    return NextResponse.json({ detail: "internal_error", message: e?.message ?? String(e) }, { status: 500 });
  }
}
