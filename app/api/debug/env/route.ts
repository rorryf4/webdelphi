import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    ANALYZER_URL: process.env.ANALYZER_URL ?? null,
    SCRAPER_URL: process.env.SCRAPER_URL ?? null,
    NODE_ENV: process.env.NODE_ENV ?? null,
  });
}
