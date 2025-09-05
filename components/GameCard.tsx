import type { Game } from "@/lib/types"


export default function GameCard({ game }: { game: Game }) {
return (
<article className="rounded-2xl border border-slate-900 bg-slate-950 p-4 space-y-3">
<header className="flex items-center justify-between">
<div className="text-sm text-slate-300">{game.league.toUpperCase()} • {new Date(game.start).toLocaleString()}</div>
<div className="text-xs text-slate-400">{game.venue}</div>
</header>
<div className="flex items-center justify-between">
<div className="space-y-1">
<div className="text-base font-semibold">{game.away.name}</div>
<div className="text-xs text-slate-400">{game.away.record}</div>
</div>
<div className="text-slate-500">@</div>
<div className="space-y-1 text-right">
<div className="text-base font-semibold">{game.home.name}</div>
<div className="text-xs text-slate-400">{game.home.record}</div>
</div>
</div>
<footer className="flex items-center justify-between text-sm">
<div className="text-slate-300">Spread: {game.market.spread}</div>
<div className="text-slate-300">Total: {game.market.total}</div>
<div className="text-slate-300">EV: {game.edge.evPct}%</div>
</footer>
</article>
)
}