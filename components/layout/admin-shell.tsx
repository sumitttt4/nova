"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Search, Bell, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-[#FAFAFA] font-sans text-slate-900 selection:bg-[#2BD67C]/20 selection:text-[#2BD67C]">
            {/* Sidebar Component (Fixed Left) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Minimal Header */}
                <header className="flex h-20 items-center justify-between px-8 py-4 z-20">
                    <div className="flex w-96 items-center gap-3 rounded-xl bg-white px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 transition-all focus-within:border-[#2BD67C]/50 focus-within:ring-2 focus-within:ring-[#2BD67C]/10">
                        <Search className="h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Type to search..."
                            className="h-auto border-0 bg-transparent p-0 text-sm placeholder:text-slate-400 focus-visible:ring-0"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="hidden text-slate-500 hover:text-slate-800 md:flex">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span className="text-xs font-semibold">Today, Oct 24</span>
                        </Button>
                        <div className="h-4 w-px bg-slate-200" />
                        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full text-slate-500 hover:bg-white hover:text-[#2BD67C] hover:shadow-sm">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-[#FAFAFA]" />
                        </Button>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto px-8 pb-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
