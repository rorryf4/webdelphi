"use client"


export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
return (
<header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur">
<div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
<button onClick={onToggleSidebar} className="md:hidden rounded-xl border border-slate-800 px-3 py-1 text-sm">
Menu
</button>
<div className="text-base font-semibold tracking-tight">Delphi Edge</div>
<div className="ml-auto text-sm text-slate-400">alpha</div>
</div>
</header>
)
}