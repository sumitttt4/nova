"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Store,
    Users,
    Bike,
    Wallet,
    BarChart3,
    Settings,
    HelpCircle,
    FileText,
    CheckCircle2,
    ShieldAlert,
    History,
    FileCheck,
    Calculator,
    Landmark,
    MessageSquare
} from "lucide-react"

// --- Types ---
export type SidebarState = "root" | "stores" | "users" | "riders" | "merchants" | "finance" | "orders"

type NavItem = {
    title: string
    href: string
    icon: React.ElementType
    badge?: string | number // Optional badge count
}

type SidebarConfig = {
    title: string
    items: NavItem[]
}

// --- Menu Configuration ---
import sidebarData from "@/config/sidebar.json"

// --- Icon Mapping ---
const IconMap: Record<string, React.ElementType> = {
    LayoutDashboard,
    Store,
    Users,
    Bike,
    Wallet,
    BarChart3,
    Settings,
    HelpCircle,
    FileText,
    CheckCircle2,
    ShieldAlert,
    History,
    FileCheck,
    Calculator,
    Landmark,
    MessageSquare
}

// --- Menu Configuration ---
// Transform the JSON config (where icons are strings) into the specific types we need (icons as Components)
const SIDEBAR_CONFIG: Record<string, SidebarConfig> = Object.entries(sidebarData).reduce((acc, [key, value]) => {
    acc[key] = {
        title: value.title,
        // @ts-ignore - we know the JSON structure matches, ensuring safety via the map
        items: value.items.map((item: any) => ({
            ...item,
            icon: IconMap[item.icon] || HelpCircle // Fallback icon
        }))
    }
    return acc
}, {} as Record<string, SidebarConfig>)

// --- Context Definition ---
interface NavigationContextType {
    activeContext: SidebarState
    currentHeader: string
    menuItems: NavItem[]
    navigateToRoot: () => void
}

const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [activeContext, setActiveContext] = React.useState<SidebarState>("root")

    // Automatic State Sync based on URL
    React.useEffect(() => {
        const firstSegment = pathname.split('/')[1] as SidebarState

        // Define which segments trigger a drill-down
        const VALID_CONTEXTS: SidebarState[] = ["stores", "merchants", "finance", "riders", "orders", "users"]

        if (VALID_CONTEXTS.includes(firstSegment)) {
            setActiveContext(firstSegment)
        } else {
            setActiveContext("root")
        }
    }, [pathname])

    const navigateToRoot = () => {
        setActiveContext("root")
        router.push("/dashboard")
    }

    // Derived State
    const currentConfig = SIDEBAR_CONFIG[activeContext] || SIDEBAR_CONFIG.root

    return (
        <NavigationContext.Provider value={{
            activeContext,
            currentHeader: currentConfig.title,
            menuItems: currentConfig.items,
            navigateToRoot
        }}>
            {children}
        </NavigationContext.Provider>
    )
}

// --- Hook ---
export function useNavigation() {
    const context = React.useContext(NavigationContext)
    if (context === undefined) {
        throw new Error("useNavigation must be used within a NavigationProvider")
    }
    return context
}
