"use client"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import { useState } from "react"


export default function LayoutShell({ children }: { children: React.ReactNode }) {
const [open, setOpen] = useState(false)
return (
<div className="min-h-dvh grid grid-rows-[auto_1fr]">
<Header onToggleSidebar={() => setOpen((s) => !s)} />
<div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
<Sidebar open={open} onClose={() => setOpen(false)} />
<main className="border-l border-slate-900">{children}</main>
</div>
</div>
)
}