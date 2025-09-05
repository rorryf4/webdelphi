"use client"
import Link from "next/link"


const nav = [
{ href: "/", label: "Dashboard" },
{ href: "/models", label: "Models" },
{ href: "/sources", label: "Sources" },
{ href: "/bets", label: "Bets" },
]


export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
return (
<aside
className={`border-r border-slate-900 bg-slate-950 md:static md:translate-x-0 md:opacity-100 md:visible transition-all duration-200 ${
open ? "translate-x-0" : "-translate-x-full opacity-0 invisible"
} fixed inset-y-0 left-0 w-60 z-50 md:w-60`}
>
<div className="h-14 md:hidden flex items-center justify-end px-3">
<button onClick={onClose} className="rounded-xl border border-slate-800 px-3 py-1 text-sm">Close</button>
</div>
<nav className="px-3 py-4 space-y-1">
{nav.map((n) => (
<Link key={n.href} href={n.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-900">
{n.label}
</Link>
))}
</nav>


<div className="px-3 py-4 border-t border-slate-900 space-y-3">
<p className="text-xs uppercase tracking-wide text-slate-400">Quick Filters</p>
<div className="flex flex-wrap gap-2">
{['NFL','CFB','Pros','Totals > 54','Underdogs','Prime Time'].map(t => (
<button key={t} className="rounded-full border border-slate-800 px-3 py-1 text-xs hover:bg-slate-900">{t}</button>
))}
</div>
</div>
</aside>
)
}