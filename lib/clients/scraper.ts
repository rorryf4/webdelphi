import { httpJson } from "./http";
const base = process.env.SCRAPER_URL!, tok = process.env.SCRAPER_TOKEN;
export type ScraperGame = {
  id: string; season: number; week: number; start: string; league: "nfl"|"cfb";
  venue?: string; home:{id:string;name:string;record?:string}; away:{id:string;name:string;record?:string};
  market?: { spread?: string; total?: string; mlHome?: number; mlAway?: number };
};
export async function getNflWeekFromScraper(season:number, week:number) {
  const url = `${base}/api/nfl/games?season=${season}&week=${week}`;
  return httpJson<ScraperGame[]>(url, { headers: tok ? { Authorization:`Bearer ${tok}` } : undefined });
}
