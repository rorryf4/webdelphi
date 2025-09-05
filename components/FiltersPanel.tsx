"use client";

export type Filters = {
  league: "all" | "nfl" | "cfb";
  minEv: number;
  market: "all" | "spread" | "total" | "ml";
};

export default function FiltersPanel({
  value,
  onChange,
  onApply,
}: {
  value: Filters;
  onChange: (v: Filters) => void;
  onApply: () => void;
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <aside className="space-y-4 rounded-2xl border border-slate-900 bg-slate-950 p-4">
      <div>
        <div className="text-xs uppercase text-slate-400 mb-2">League</div>
        <div className="flex gap-2">
          {(["all", "nfl", "cfb"] as const).map((x) => (
            <button
              key={x}
              onClick={() => set("league", x)}
              className={`rounded-xl border px-3 py-1 text-xs ${
                value.league === x ? "border-slate-300" : "border-slate-800"
              }`}
            >
              {x.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs uppercase text-slate-400 mb-2">Market</div>
        <div className="flex flex-wrap gap-2">
          {(["all", "spread", "total", "ml"] as const).map((x) => (
            <button
              key={x}
              onClick={() => set("market", x)}
              className={`rounded-xl border px-3 py-1 text-xs ${
                value.market === x ? "border-slate-300" : "border-slate-800"
              }`}
            >
              {x.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs uppercase text-slate-400 mb-2 block">
          Min EV (%)
        </label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={value.minEv}
          onChange={(e) => set("minEv", Number(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-slate-300 mt-1">{value.minEv}%</div>
      </div>

      <button
        onClick={onApply}
        className="w-full rounded-xl border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900"
      >
        Apply Filters
      </button>
    </aside>
  );
}