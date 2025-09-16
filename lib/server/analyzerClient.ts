// lib/server/analyzerClient.ts
// Minimal, build-safe stub so routes importing @/lib/clients/analyzer can compile.

export type AnalyzeItem = Record<string, any>;
export type AnalyzeOutput = {
  ok: boolean;
  results: any[];
};

/**
 * Primary entry that other modules import.
 * Replace this with your real analyzer when ready.
 */
export async function analyzeGames(items: AnalyzeItem[]): Promise<AnalyzeOutput> {
  // TODO: call your real model/service here
  return { ok: true, results: [] };
}

// Optional: if you want a remote call later, keep a named export in place
export async function analyzeGamesRemote(items: AnalyzeItem[]): Promise<AnalyzeOutput> {
  return analyzeGames(items);
}