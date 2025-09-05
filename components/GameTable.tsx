import type { Game } from "@/lib/types";

export function GameTable({
  games,
  onSelect,
}: {
  games: Game[];
  onSelect: (g: Game) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="text-left px-3 py-2">Game</th>
            <th className="text-left px-3 py-2">Start</th>
            <th className="text-left px-3 py-2">Market</th>
            <th className="text-left px-3 py-2">EV%</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr
              key={g.id}
              className="border-t border-slate-900 hover:bg-slate-900 cursor-pointer"
              onClick={() => onSelect(g)}
            >
              <td className="px-3 py-2">
                {g.away.name} @ {g.home.name}
              </td>
              <td className="px-3 py-2 text-slate-300">
                {new Date(g.start).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-slate-300">
                {g.market.spread} • {g.market.total}
              </td>
              <td className="px-3 py-2 font-semibold">{g.edge.evPct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
