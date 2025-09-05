"use client";
import { useMemo } from "react";

export default function WeekSelector({
  season, week, onChange,
}: { season: number; week: number; onChange: (s: number, w: number) => void }) {
  const seasons = useMemo(() => {
    const y = new Date().getFullYear();
    return [y-1, y, y+1];
  }, []);
  const weeks = Array.from({ length: 18 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-900 bg-slate-950 p-3">
      <label className="text-xs text-slate-400">Season</label>
      <select
        value={season}
        onChange={(e) => onChange(Number(e.target.value), week)}
        className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-1 text-sm"
      >
        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <label className="ml-2 text-xs text-slate-400">Week</label>
      <select
        value={week}
        onChange={(e) => onChange(season, Number(e.target.value))}
        className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-1 text-sm"
      >
        {weeks.map(w => <option key={w} value={w}>Week {w}</option>)}
      </select>
    </div>
  );
}
