"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ChevronRight,
    ChevronsUpDown,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    Truck,
    Wallet
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigation } from "@/contexts/NavigationContext"

export function Sidebar() {
    const pathname = usePathname()
    const { activeContext, menuItems, navigateToRoot } = useNavigation()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    // Icons Map for dynamic rendering (since we store icons as components in context)
    // but context provides functional components, so we can render them directly.

    return (
        <aside
            className={cn(
                "group relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-30",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* 1. Header: Logo & Brand */}
            <div className="flex h-16 items-center border-b border-slate-100 px-4">
                <div className="flex w-full items-center gap-3 overflow-hidden">
                    <div className="relative flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                        <img
                            src="/logo-new.jpg"
                            alt="Bazuroo"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className={cn(
                        "flex flex-col opacity-100 transition-all duration-300",
                        isCollapsed && "opacity-0 w-0 hidden"
                    )}>
                        <h1 className="truncate text-base font-bold leading-none text-slate-900">Bazuroo</h1>
                        <span className="truncate text-[10px] font-medium text-slate-500 uppercase tracking-wider">Admin Panel</span>
                    </div>
                </div>

                {/* Collapse Toggle (Visible on hover or absolute positioned) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-4 top-5 z-40 h-8 w-8 rounded-full border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
            </div>

            {/* 2. Navigation Items */}
            <div className="flex-1 overflow-x-hidden overflow-y-auto py-6 px-3">
                {/* Back to Main Menu Button (Context Switcher) */}
                {activeContext !== "root" && (
                    <div className="mb-4">
                        <Button
                            variant="secondary"
                            onClick={navigateToRoot}
                            className={cn(
                                "w-full justify-start gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold border border-slate-200",
                                isCollapsed ? "px-2 justify-center" : "px-4"
                            )}
                        >
                            <PanelLeftOpen className="h-4 w-4 shrink-0" />
                            {!isCollapsed && <span>Back to Main Menu</span>}
                        </Button>
                        {!isCollapsed && <div className="my-4 h-px bg-slate-100" />}
                    </div>
                )}

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ring-offset-background transition-all hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    isActive ? "bg-slate-900 text-white hover:bg-slate-900/90 shadow-md shadow-slate-900/10" : "text-slate-600 hover:text-slate-900",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                                {!isCollapsed && (
                                    <span className="truncate animate-in fade-in duration-300">
                                        {item.title}
                                    </span>
                                )}
                                {!isCollapsed && isActive && (
                                    <div className="ml-auto h-2 w-2 rounded-full bg-[#2BD67C] animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* 3. User Profile Footer */}
            <div className="border-t border-slate-100 p-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={cn(
                                "flex w-full items-center gap-3 px-2 py-6 hover:bg-slate-100 h-auto",
                                isCollapsed ? "justify-center" : "justify-start"
                            )}
                        >
                            <Avatar className="h-9 w-9 border border-slate-200 shadow-sm shrink-0">
                                <AvatarImage src="/avatar-placeholder.png" />
                                <AvatarFallback className="bg-gradient-to-br from-[#2BD67C] to-[#25bf42] text-white">AD</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="flex flex-1 flex-col items-start text-left overflow-hidden">
                                    <span className="truncate text-sm font-semibold text-slate-900">Admin User</span>
                                    <span className="truncate text-xs text-slate-500">admin@bazuroo.com</span>
                                </div>
                            )}
                            {!isCollapsed && <ChevronsUpDown className="ml-auto h-4 w-4 text-slate-400" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 min-w-[200px]" align="end" sideOffset={10}>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Admin User</p>
                                <p className="text-xs leading-none text-muted-foreground">admin@bazuroo.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {activeContext !== 'root' && (
                            <DropdownMenuItem onClick={navigateToRoot}>
                                <PanelLeftOpen className="mr-2 h-4 w-4" />
                                <span>Return to Main Menu</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Preferences</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    )
}
