import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const raw = process.env.ALLOWED_CONFERENCES ?? "";
  const conferences = raw.split(",").map(s => s.trim()).filter(Boolean);
  return NextResponse.json({ conferences });
}
