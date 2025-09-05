import type { Game } from "@/lib/types"


export const mockGames: Game[] = [
{
id: "1",
league: "nfl",
start: new Date(Date.now() + 3600_000).toISOString(),
venue: "MetLife Stadium",
home: { id: "nyj", name: "Jets", record: "0-0" },
away: { id: "buf", name: "Bills", record: "0-0" },
market: { spread: "NYJ -2.5", total: "45.5" },
edge: { evPct: 3.1 },
},
{
id: "2",
league: "cfb",
start: new Date(Date.now() + 7200_000).toISOString(),
venue: "Bryant–Denny Stadium",
home: { id: "bama", name: "Alabama", record: "0-0" },
away: { id: "tex", name: "Texas", record: "0-0" },
market: { spread: "BAMA -6.5", total: "54.0" },
edge: { evPct: 2.2 },
},
// add more as needed…
]