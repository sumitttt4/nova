"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Store,
    Bike,
    CreditCard,
    Wallet,
    AlertCircle,
    Settings,
    Building2,
    Search,
    Calendar,
    ChevronDown,
    LogOut,
    User,
    Users as UsersIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

const navigation = [
    {
        group: "",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Orders", href: "/orders", icon: ShoppingBag },
        ]
    },
    {
        group: "PEOPLE & STORES",
        items: [
            { name: "Users", href: "/users", icon: Users },
            { name: "Merchants", href: "/merchants", icon: Building2 },
            { name: "Stores", href: "/stores", icon: Store },
            { name: "Riders", href: "/riders", icon: Bike },
        ]
    },
    {
        group: "FINANCE",
        items: [
            { name: "Payments", href: "/payments", icon: CreditCard },
            { name: "Payouts", href: "/payouts", icon: Wallet },
        ]
    },
    {
        group: "SUPPORT",
        items: [
            { name: "Help & Support", href: "/support", icon: AlertCircle },
            { name: "Settings", href: "/settings", icon: Settings },
        ]
    }
]

export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-full bg-muted/20">
            {/* Sidebar */}
            <aside className="flex w-64 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center px-6 gap-3 border-b">
                    <Image src="/logo.jpg" alt="Bazuroo Logo" width={28} height={28} className="rounded-md" />
                    <span className="text-lg font-bold tracking-tight text-foreground">Bazuroo</span>
                </div>
                <nav className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-6">
                        {navigation.map((group, index) => (
                            <div key={index} className={cn(index > 0 && "pt-6")}>
                                {group.group && (
                                    <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground tracking-wider">
                                        {group.group}
                                    </h4>
                                )}
                                <ul className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = pathname.startsWith(item.href)
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                                        isActive
                                                            ? "bg-primary/10 text-primary font-medium shadow-sm"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex h-14 items-center justify-between border-b bg-background px-6 shadow-sm z-10">
                    <div className="w-80">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-9 bg-muted/50 border-none focus-visible:ring-1"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <ModeToggle />

                        <Button variant="ghost" className="gap-2 text-muted-foreground font-normal h-9">
                            <Calendar className="h-4 w-4" />
                            <span>Select dates</span>
                        </Button>

                        <div className="h-6 w-px bg-border mx-2" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 h-10 rounded-full hover:bg-muted">
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start text-xs mr-1">
                                        <span className="font-medium">Admin</span>
                                        <span className="text-muted-foreground">admin@bazuroo.in</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <UsersIcon className="mr-2 h-4 w-4" />
                                    <span>Team settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => console.log("TODO: logout")}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
