"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import {
    Search,
    Bell,
    Calendar,
    Home,
    ShoppingBag,
    Users,
    Bike,
    Settings,
    CreditCard,
    FileText,
    Calculator,
    UserCircle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useStore } from "@/lib/store"

export function AdminShell({ children }: { children: React.ReactNode }) {
    const { notifications } = useStore()
    const router = useRouter()
    const [open, setOpen] = React.useState(false)

    // Toggle Command Dialog on Ctrl+K or Cmd+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA] font-sans text-slate-900 selection:bg-[#2BD67C]/20 selection:text-[#2BD67C]">
            {/* Sidebar Component (Fixed Left) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Minimal Header */}
                <header className="flex h-20 items-center justify-between px-8 py-4 z-20">
                    {/* Search Command Trigger */}
                    <button
                        onClick={() => setOpen(true)}
                        className="group flex w-96 items-center justify-between gap-3 rounded-xl bg-white px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 transition-all hover:border-[#2BD67C]/50 hover:shadow-md active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <Search className="h-4 w-4 text-slate-400 group-hover:text-[#2BD67C] transition-colors" />
                            <span className="text-sm font-medium text-slate-400 group-hover:text-slate-600">Search orders, riders, stores...</span>
                        </div>
                        <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="hidden text-slate-500 hover:text-slate-800 md:flex">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span className="text-xs font-semibold">Today, Oct 24</span>
                        </Button>
                        <div className="h-4 w-px bg-slate-200" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full text-slate-500 hover:bg-white hover:text-[#2BD67C] hover:shadow-sm">
                                    <Bell className="h-5 w-5" />
                                    {notifications.length > 0 && (
                                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border-2 border-[#FAFAFA]" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-6 text-center text-slate-500">
                                        <Bell className="h-8 w-8 text-slate-300 mb-2" />
                                        <p className="text-sm font-medium">No new notifications</p>
                                        <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-default">
                                                <span className="font-semibold text-sm">{notification.title}</span>
                                                <span className="text-xs text-slate-500">{notification.message}</span>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto px-8 pb-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            {/* Global Command Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/orders'))}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>All Orders</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/riders/list'))}>
                            <Bike className="mr-2 h-4 w-4" />
                            <span>Delivery Partners</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/merchants/list'))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Merchants</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/finance/payouts'))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Process Payouts</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/orders/issues'))}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Issues</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => router.push('/settings/profile'))}>
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
}
