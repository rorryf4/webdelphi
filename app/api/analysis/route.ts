import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const league = url.searchParams.get("league") ?? "ncaaf";
  const year   = url.searchParams.get("year")   ?? "2025";
  const week   = url.searchParams.get("week")   ?? "2";

  const base = process.env.SCRAPER_URL;
  if (!base) return NextResponse.json({ error: "missing SCRAPER_URL" }, { status: 500 });

  const r = await fetch(`${base}/scrape?league=${league}&year=${year}&week=${week}`, { cache: "no-store" });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    return NextResponse.json({ error: "scraper_bad_status", status: r.status, body }, { status: 502 });
  }
  const data = await r.json();
  return NextResponse.json(data);
}
