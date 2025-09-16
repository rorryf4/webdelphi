// lib/analyzer.ts
export type Game = { start_date?: string; [k: string]: any };

export function analyzeGamesLocal(games: Game[]) {
  return games.map(g => {
    const earlyKick = g.start_date ? new Date(g.start_date).getUTCHours() < 18 : false;
    return { ...g, flags: { earlyKick } };
  });
}
