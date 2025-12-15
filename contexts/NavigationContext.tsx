"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
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
    History
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
export const SIDEBAR_CONFIG: Record<string, SidebarConfig> = {
    root: {
        title: "Main Menu",
        items: [
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { title: "Orders & Live", href: "/orders", icon: BarChart3, badge: "12" }, // Live intent
            { title: "Stores", href: "/stores", icon: Store },
            { title: "Riders", href: "/riders", icon: Bike },
            { title: "Merchants", href: "/merchants", icon: ShieldAlert }, // "Shield" implies approvals/verification
            { title: "Finance", href: "/finance", icon: Wallet },
            { title: "Users", href: "/users", icon: Users },
            { title: "Settings", href: "/settings", icon: Settings },
            { title: "Help & Support", href: "/help", icon: HelpCircle },
        ]
    },
    // Drill-Down Contexts
    stores: {
        title: "Store Management",
        items: [
            { title: "All Stores", href: "/stores", icon: Store },
            { title: "Approvals", href: "/stores/approvals", icon: CheckCircle2, badge: "3" },
            { title: "Onboarding", href: "/stores/new", icon: FileText },
            { title: "Configurations", href: "/stores/settings", icon: Settings },
        ]
    },
    merchants: {
        title: "Merchant Center",
        items: [
            { title: "Overview", href: "/merchants", icon: ShieldAlert },
            { title: "Verifications", href: "/merchants/approvals", icon: CheckCircle2, badge: "Pending" },
            { title: "KYC Database", href: "/merchants/kyc-status", icon: FileText },
            { title: "Add Merchant", href: "/merchants/new", icon: Users },
        ]
    },
    finance: {
        title: "Financials",
        items: [
            { title: "Overview", href: "/finance", icon: Wallet },
            { title: "Invoices", href: "/finance/invoices", icon: FileText },
            { title: "Merchant Payouts", href: "/payouts", icon: Store },
            { title: "Rider Payouts", href: "/riders/payouts", icon: Bike },
        ]
    },
    orders: {
        title: "Order Center",
        items: [
            { title: "Live Monitor", href: "/orders", icon: BarChart3 },
            { title: "Order History", href: "/orders/history", icon: History },
            { title: "Refunds & Disputes", href: "/orders/refunds", icon: ShieldAlert, badge: "2" },
        ]
    },
    riders: {
        title: "Fleet Management",
        items: [
            { title: "Fleet Overview", href: "/riders", icon: Bike },
            { title: "Onboarding", href: "/riders/onboarding", icon: FileText },
            { title: "Payouts", href: "/riders/payouts", icon: Wallet },
        ]
    }
}

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
    const [activeContext, setActiveContext] = React.useState<SidebarState>("root")

    // Automatic State Sync based on URL
    React.useEffect(() => {
        const firstSegment = pathname.split('/')[1] as SidebarState

        // Define which segments trigger a drill-down
        const VALID_CONTEXTS: SidebarState[] = ["stores", "merchants", "finance", "riders", "orders"]

        if (VALID_CONTEXTS.includes(firstSegment)) {
            setActiveContext(firstSegment)
        } else {
            setActiveContext("root")
        }
    }, [pathname])

    const navigateToRoot = () => {
        setActiveContext("root")
        // Note: The Sidebar component handles the actual link/router push or we let the user click
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
