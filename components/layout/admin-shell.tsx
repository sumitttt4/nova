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
    UserCircle,
    Menu,
    Store
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DialogTitle } from "@/components/ui/dialog"
import { useMockData } from "@/contexts/MockDataContext"
import { Badge } from "@/components/ui/badge"
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
    const { merchants, riders, users } = useMockData()
    const router = useRouter()
    const [isSearchOpen, setIsSearchOpen] = React.useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    // Toggle Command Dialog on Ctrl+K or Cmd+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsSearchOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setIsSearchOpen(false)
        command()
    }, [])

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA] font-sans text-slate-900 selection:bg-[#2BD67C]/20 selection:text-[#2BD67C]">
            {/* Sidebar Component (Fixed Left) - Desktop Only */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Minimal Header */}
                <header className="flex h-16 md:h-20 items-center justify-between px-4 md:px-8 py-4 z-20">

                    {/* Mobile Sidebar Trigger */}
                    <div className="lg:hidden flex items-center gap-4">
                        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-[280px]">
                                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                                <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        {/* Mobile Search Icon */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="flex items-center justify-center h-10 w-10 rounded-full bg-white shadow-sm border border-gray-100"
                        >
                            <Search className="h-4 w-4 text-slate-500" />
                        </button>
                    </div>

                    {/* Search Command Trigger - Desktop */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex group w-96 items-center justify-between gap-3 rounded-xl bg-white px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 transition-all hover:border-[#2BD67C]/50 hover:shadow-md active:scale-[0.98]"
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
                        <div className="hidden md:block h-4 w-px bg-slate-200" />

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
                <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>

            {/* Global Command Dialog */}
            <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTitle className="sr-only">Command Menu</DialogTitle>
                <CommandInput placeholder="Search metrics, people, stores, or actions..." />
                <CommandList>
                    <CommandEmpty className="py-6 text-center text-sm">
                        <p className="text-slate-500 mb-4">No results found.</p>
                        <Button
                            className="bg-[#2BD67C] hover:bg-[#2BD67C]/90 text-black font-semibold h-9 px-4 rounded-lg shadow-sm"
                            onClick={() => runCommand(() => router.push('/stores/new'))}
                        >
                            <span className="mr-2">+</span> Add New Store
                        </Button>
                    </CommandEmpty>

                    {/* DASHBOARD METRICS */}
                    <CommandGroup heading="Dashboard Metrics">
                        <CommandItem
                            value="pending orders live active queue processing"
                            onSelect={() => runCommand(() => router.push('/orders'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <ShoppingBag className="mr-2 h-4 w-4 text-amber-500" />
                                    <span>Pending Orders</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Orders</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="revenue today earnings income money sales daily"
                            onSelect={() => runCommand(() => router.push('/finance'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                                    <span>Revenue Today</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Finance</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="total payment received revenue income money earnings"
                            onSelect={() => runCommand(() => router.push('/finance'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                                    <span>Total Payment Received</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Finance</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="cod cash delivery riders pending collection"
                            onSelect={() => runCommand(() => router.push('/riders'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <Bike className="mr-2 h-4 w-4 text-orange-500" />
                                    <span>COD with Riders</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Riders</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="active riders delivery partners online available"
                            onSelect={() => runCommand(() => router.push('/riders/list'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <Bike className="mr-2 h-4 w-4 text-blue-500" />
                                    <span>Active Riders</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Riders</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="active stores merchants shops live open"
                            onSelect={() => runCommand(() => router.push('/stores'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <Store className="mr-2 h-4 w-4 text-purple-500" />
                                    <span>Active Stores</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Stores</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="delivered orders completed success done"
                            onSelect={() => runCommand(() => router.push('/orders'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <ShoppingBag className="mr-2 h-4 w-4 text-green-500" />
                                    <span>Delivered Orders</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Orders</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="cancelled orders failed rejected refund"
                            onSelect={() => runCommand(() => router.push('/orders'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <ShoppingBag className="mr-2 h-4 w-4 text-red-500" />
                                    <span>Cancelled Orders</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Orders</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="total users customers registered accounts"
                            onSelect={() => runCommand(() => router.push('/users'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <Users className="mr-2 h-4 w-4 text-indigo-500" />
                                    <span>Total Users</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Users</span>
                            </div>
                        </CommandItem>
                        <CommandItem
                            value="payouts settlements disbursements transfer merchant payment"
                            onSelect={() => runCommand(() => router.push('/finance/payouts'))}
                        >
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4 text-teal-500" />
                                    <span>Payouts</span>
                                </div>
                                <span className="text-xs text-slate-400">→ Finance</span>
                            </div>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator />

                    {/* PEOPLE: Users + Riders */}
                    <CommandGroup heading="People">
                        {users.slice(0, 3).map(user => (
                            <CommandItem key={user.id} value={`${user.name} user customer`} onSelect={() => runCommand(() => router.push(`/users/${user.id}`))}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <UserCircle className="mr-2 h-4 w-4 text-slate-500" />
                                        <span>{user.name}</span>
                                    </div>
                                    {user.status === 'banned' ? (
                                        <Badge variant="outline" className="bg-[#FBC02D]/10 text-[#FBC02D] border-[#FBC02D]/20 text-[10px] h-5 px-1.5">
                                            Banned
                                        </Badge>
                                    ) : user.status === 'warned' ? (
                                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] h-5 px-1.5">
                                            Warned
                                        </Badge>
                                    ) : (
                                        <span className="text-[10px] text-slate-400">{user.status}</span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                        {riders.slice(0, 3).map(rider => (
                            <CommandItem key={rider.id} value={`${rider.name} rider delivery partner`} onSelect={() => runCommand(() => router.push(`/riders/${rider.id}`))}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <Bike className="mr-2 h-4 w-4 text-slate-500" />
                                        <span>{rider.name}</span>
                                    </div>
                                    {rider.status === 'blocked' ? (
                                        <Badge variant="outline" className="bg-[#FBC02D]/10 text-[#FBC02D] border-[#FBC02D]/20 text-[10px] h-5 px-1.5">
                                            Banned
                                        </Badge>
                                    ) : (
                                        <span className="text-[10px] text-slate-400">{rider.status}</span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />

                    {/* STORES: Merchants */}
                    <CommandGroup heading="Stores">
                        {merchants.slice(0, 5).map(merchant => (
                            <CommandItem key={merchant.id} value={`${merchant.storeName} store merchant shop`} onSelect={() => runCommand(() => router.push(`/merchants/${merchant.id}`))}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <Store className="mr-2 h-4 w-4 text-slate-500" />
                                        <span>{merchant.storeName}</span>
                                    </div>
                                    {merchant.flags.blocked ? (
                                        <Badge variant="outline" className="bg-[#FBC02D]/10 text-[#FBC02D] border-[#FBC02D]/20 text-[10px] h-5 px-1.5">
                                            Blocked
                                        </Badge>
                                    ) : (
                                        <span className="text-[10px] text-slate-400">{merchant.status}</span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandSeparator />

                    {/* SYSTEM ACTIONS */}
                    <CommandGroup heading="System Actions">
                        <CommandItem value="dashboard home overview main" onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            <Home className="mr-2 h-4 w-4" />
                            <span>Go to Dashboard</span>
                        </CommandItem>
                        <CommandItem value="orders purchases transactions all" onSelect={() => runCommand(() => router.push('/orders'))}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>View All Orders</span>
                        </CommandItem>
                        <CommandItem value="process payouts settlements pay merchants" onSelect={() => runCommand(() => router.push('/finance/payouts'))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Process Payouts</span>
                        </CommandItem>
                        <CommandItem value="add new store create merchant" onSelect={() => runCommand(() => router.push('/stores/new'))}>
                            <Store className="mr-2 h-4 w-4" />
                            <span>Add New Store</span>
                        </CommandItem>
                        <CommandItem value="settings config configuration preferences" onSelect={() => runCommand(() => router.push('/settings'))}>
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
