import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const league = u.searchParams.get("league") ?? "ncaaf";
  const week = u.searchParams.get("week");
  const base = process.env.SCRAPER_URL;
  if (!base) return NextResponse.json({ error: "missing_config", detail: "SCRAPER_URL not set" }, { status: 500 });
  if (!week) return NextResponse.json({ error: "missing_week" }, { status: 400 });

  const r = await fetch(`${base}/scrape?league=${encodeURIComponent(league)}&week=${encodeURIComponent(week)}`, { cache: "no-store" });
  const text = await r.text();
  return NextResponse.json({ ok: r.ok, status: r.status, sample: text.slice(0, 800) });
}
