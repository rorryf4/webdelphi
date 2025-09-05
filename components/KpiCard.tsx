export default function KpiCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
return (
<div className="rounded-2xl border border-slate-900 bg-slate-950 p-4 shadow-sm">
<div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
<div className="mt-1 text-2xl font-semibold">{value}</div>
{subtext ? <div className="mt-1 text-xs text-slate-400">{subtext}</div> : null}
</div>
)
}