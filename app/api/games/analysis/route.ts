import { NextRequest, NextResponse } from "next/server";

const SCRAPER_URL = process.env.SCRAPER_URL ?? "http://localhost:4001";
const ANALYZER_URL = process.env.ANALYZER_URL ?? "http://localhost:4002";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const league = searchParams.get("league") ?? "ncaaf";
    const week = searchParams.get("week") ?? "2";

    const rawRes = await fetch(`${SCRAPER_URL}/scrape?league=${league}&week=${week}`, { cache: "no-store" });
    if (!rawRes.ok) return NextResponse.json({ error: "Scraper failed" }, { status: 502 });
    const raw = await rawRes.json();

    const anaRes = await fetch(`${ANALYZER_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(raw)
    });
    if (!anaRes.ok) return NextResponse.json({ error: "Analyzer failed" }, { status: 502 });
    const analysis = await anaRes.json();

    return NextResponse.json(analysis, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
