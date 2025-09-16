import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const league = searchParams.get("league") ?? "";
  const week = searchParams.get("week") ?? "";

  const SCRAPER_URL = process.env.SCRAPER_URL;
  if (!SCRAPER_URL) {
    return NextResponse.json(
      { error: "missing_config", detail: "SCRAPER_URL not set" },
      { status: 500 }
    );
  }

  const target = `${SCRAPER_URL}/scrape?league=${encodeURIComponent(
    league
  )}&week=${encodeURIComponent(week)}`;

  try {
    const r = await fetch(target, { cache: "no-store" });
    const text = await r.text(); // handles 204 gracefully
    const contentType = r.headers.get("content-type") || "application/json";
    return new NextResponse(text || "", {
      status: r.status,
      headers: { "content-type": contentType },
    });
  } catch (err: unknown) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "proxy_failed", detail },
      { status: 502 }
    );
  }
}
