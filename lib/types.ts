export type TeamRef = { id: string; name: string; record?: string }
export type Market = { spread: string; total: string }
export type Edge = { evPct: number }
export type Game = {
id: string
league: "nfl" | "cfb"
start: string // ISO datetime
venue: string
home: TeamRef
away: TeamRef
market: Market
edge: Edge
}