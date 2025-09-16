import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const league = (searchParams.get("league") || "ncaaf").toLowerCase();
    const year   = searchParams.get("year") || String(new Date().getFullYear());
    const week   = searchParams.get("week") || "2";

    const base = process.env.SCRAPER_URL;
    if (!base) {
      return NextResponse.json({ error: "missing SCRAPER_URL" }, { status: 500 });
    }

    const url =
      `${base}/scrape?league=${encodeURIComponent(league)}` +
      `&year=${encodeURIComponent(year)}&week=${encodeURIComponent(week)}`;

    const r = await fetch(url, { cache: "no-store" });

    if (r.status === 204) return NextResponse.json({ games: [] });

    if (!r.ok) {
      const body = await r.text().catch(() => "");
      return NextResponse.json(
        { error: "upstream", status: r.status, detail: body.slice(0, 300) },
        { status: 502 }
      );
    }

    const data = await r.json();
    const games = Array.isArray(data?.games) ? data.games : (Array.isArray(data) ? data : []);
    return NextResponse.json({ games });
  } catch (e: any) {
    return NextResponse.json(
      { error: "internal", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}