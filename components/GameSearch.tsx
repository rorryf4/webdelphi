"use client";

export default function GameSearch({
  q,
  league,
  onChangeQ,
  onChangeLeague,
  onSearch,
}: {
  q: string;
  league: string;
  onChangeQ: (v: string) => void;
  onChangeLeague: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-900 bg-slate-950 p-4 flex flex-col gap-3 md:flex-row md:items-center">
      <input
        value={q}
        onChange={(e) => onChangeQ(e.target.value)}
        placeholder="Search teams, players, matchups…"
        className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none"
      />
      <select
        value={league}
        onChange={(e) => onChangeLeague(e.target.value)}
        className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
      >
        <option value="all">All</option>
        <option value="nfl">NFL</option>
        <option value="cfb">CFB</option>
      </select>
      <button 
        onClick={onSearch} 
        className="rounded-xl border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900"
      >
        Search
      </button>
    </div>
  );
}