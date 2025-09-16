import { NextRequest, NextResponse } from "next/server";

// Minimal GET so the route is a valid module and compiles.
export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true, results: [] });
}

// (Optional) POST handler if you call it via POST later
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: body, results: [] });
}