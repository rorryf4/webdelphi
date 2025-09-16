// lib/server/analyzerClient.ts
// Runs only on the server (can read process.env safely)
import "server-only";

export type AnalyzeInput = Array<{
  id: string;
  league: "nfl" | "cfb";
  home: string;
  away: string;
  start: string;
  market?: { spread?: string; total?: string; mlHome?: number; mlAway?: number };
}>;

export type AnalyzeOutput = Array<{
  id: string;
  edge: { evPct: number; kellyPct: number; confidence: "low" | "med" | "high" };
  reasons?: string[];
  model?: { spread?: number; total?: number };
}>;

const BASE = process.env.ANALYZER_URL!;
const TOK  = process.env.ANALYZER_TOKEN;

export async function analyzeGamesRemote(items: Analyze
