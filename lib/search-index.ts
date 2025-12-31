import { LucideIcon, Activity, Store, Bike, ShoppingBag, Users, DollarSign, CreditCard, Banknote, Clock, CheckCircle2, XCircle, Package, TrendingUp, Wallet, Settings, Home, FileText } from "lucide-react"

export interface SearchItem {
    id: string
    label: string
    keywords: string[]
    category: 'metric' | 'page' | 'person' | 'store' | 'action'
    href: string
    icon: LucideIcon
    value?: string | number
    description?: string
}

// Dashboard metrics that should be searchable
export const DASHBOARD_METRICS: Omit<SearchItem, 'value'>[] = [
    // Quick Stats
    {
        id: 'metric-live-orders',
        label: 'Live Orders',
        keywords: ['live', 'orders', 'pending', 'active', 'current', 'ongoing'],
        category: 'metric',
        href: '/orders',
        icon: Activity,
        description: 'Currently active orders'
    },
    {
        id: 'metric-active-riders',
        label: 'Active Riders',
        keywords: ['active', 'riders', 'delivery', 'partners', 'online', 'available'],
        category: 'metric',
        href: '/riders/list',
        icon: Bike,
        description: 'Online delivery partners'
    },
    {
        id: 'metric-revenue-today',
        label: 'Revenue Today',
        keywords: ['revenue', 'today', 'earnings', 'income', 'money', 'sales', 'daily'],
        category: 'metric',
        href: '/finance',
        icon: DollarSign,
        description: 'Today\'s total revenue'
    },
    {
        id: 'metric-active-stores',
        label: 'Active Stores',
        keywords: ['active', 'stores', 'merchants', 'shops', 'live', 'open'],
        category: 'metric',
        href: '/stores',
        icon: Store,
        description: 'Currently active stores'
    },

    // Order Metrics
    {
        id: 'metric-total-orders',
        label: 'Total Orders',
        keywords: ['total', 'orders', 'all', 'count'],
        category: 'metric',
        href: '/orders',
        icon: ShoppingBag,
        description: 'Total orders placed'
    },
    {
        id: 'metric-delivered-orders',
        label: 'Delivered Orders',
        keywords: ['delivered', 'orders', 'completed', 'success', 'done'],
        category: 'metric',
        href: '/orders',
        icon: CheckCircle2,
        description: 'Successfully delivered orders'
    },
    {
        id: 'metric-cancelled-orders',
        label: 'Cancelled Orders',
        keywords: ['cancelled', 'orders', 'failed', 'rejected', 'refund'],
        category: 'metric',
        href: '/orders',
        icon: XCircle,
        description: 'Cancelled or failed orders'
    },
    {
        id: 'metric-pending-orders',
        label: 'Pending Orders',
        keywords: ['pending', 'orders', 'waiting', 'processing', 'in-progress', 'queue'],
        category: 'metric',
        href: '/orders',
        icon: Clock,
        description: 'Orders awaiting processing'
    },

    // Payment Metrics
    {
        id: 'metric-total-payment',
        label: 'Total Payment Received',
        keywords: ['total', 'payment', 'received', 'revenue', 'income', 'money', 'earnings'],
        category: 'metric',
        href: '/finance',
        icon: DollarSign,
        description: 'All payments collected'
    },
    {
        id: 'metric-cod-received',
        label: 'COD Received',
        keywords: ['cod', 'cash', 'delivery', 'received', 'collected'],
        category: 'metric',
        href: '/finance',
        icon: Banknote,
        description: 'Cash on delivery collected'
    },
    {
        id: 'metric-cod-riders',
        label: 'COD with Riders',
        keywords: ['cod', 'riders', 'cash', 'pending', 'collection'],
        category: 'metric',
        href: '/riders',
        icon: Bike,
        description: 'Cash pending with riders'
    },
    {
        id: 'metric-prepaid',
        label: 'Prepaid Received',
        keywords: ['prepaid', 'online', 'payment', 'upi', 'card', 'digital'],
        category: 'metric',
        href: '/finance',
        icon: CreditCard,
        description: 'Online payments received'
    },

    // Store & Rider Metrics
    {
        id: 'metric-total-stores',
        label: 'Total Stores',
        keywords: ['total', 'stores', 'merchants', 'shops', 'all'],
        category: 'metric',
        href: '/stores',
        icon: Store,
        description: 'All registered stores'
    },
    {
        id: 'metric-store-applications',
        label: 'Store Applications',
        keywords: ['store', 'applications', 'merchant', 'kyc', 'pending', 'approval'],
        category: 'metric',
        href: '/stores/kyc',
        icon: Package,
        description: 'Pending merchant applications'
    },
    {
        id: 'metric-total-riders',
        label: 'Total Riders',
        keywords: ['total', 'riders', 'delivery', 'partners', 'all'],
        category: 'metric',
        href: '/riders/list',
        icon: Bike,
        description: 'All registered riders'
    },
    {
        id: 'metric-rider-applications',
        label: 'Rider Applications',
        keywords: ['rider', 'applications', 'kyc', 'pending', 'approval', 'verification'],
        category: 'metric',
        href: '/riders',
        icon: Users,
        description: 'Pending rider applications'
    },

    // User Metrics
    {
        id: 'metric-total-users',
        label: 'Total Users',
        keywords: ['total', 'users', 'customers', 'registered', 'accounts'],
        category: 'metric',
        href: '/users',
        icon: Users,
        description: 'All registered users'
    },
    {
        id: 'metric-user-registrations',
        label: 'User Registrations',
        keywords: ['user', 'registrations', 'signups', 'new', 'today'],
        category: 'metric',
        href: '/users',
        icon: TrendingUp,
        description: 'New user signups'
    },

    // Finance
    {
        id: 'metric-payouts',
        label: 'Payouts',
        keywords: ['payouts', 'settlements', 'disbursements', 'transfer', 'merchant', 'payment'],
        category: 'metric',
        href: '/finance/payouts',
        icon: Wallet,
        description: 'Merchant payouts and settlements'
    },
]

// Navigation pages
export const PAGES: SearchItem[] = [
    { id: 'page-dashboard', label: 'Dashboard', keywords: ['dashboard', 'home', 'overview', 'main'], category: 'page', href: '/dashboard', icon: Home },
    { id: 'page-orders', label: 'Orders', keywords: ['orders', 'purchases', 'transactions'], category: 'page', href: '/orders', icon: ShoppingBag },
    { id: 'page-users', label: 'Users', keywords: ['users', 'customers', 'accounts'], category: 'page', href: '/users', icon: Users },
    { id: 'page-stores', label: 'Stores', keywords: ['stores', 'merchants', 'shops', 'vendors'], category: 'page', href: '/stores', icon: Store },
    { id: 'page-merchants', label: 'Merchants', keywords: ['merchants', 'sellers', 'vendors'], category: 'page', href: '/merchants', icon: Store },
    { id: 'page-riders', label: 'Riders', keywords: ['riders', 'delivery', 'partners', 'drivers'], category: 'page', href: '/riders/list', icon: Bike },
    { id: 'page-finance', label: 'Finance', keywords: ['finance', 'money', 'accounts', 'payments', 'revenue'], category: 'page', href: '/finance', icon: Wallet },
    { id: 'page-settings', label: 'Settings', keywords: ['settings', 'config', 'configuration', 'preferences'], category: 'page', href: '/settings', icon: Settings },
]

// Quick actions
export const ACTIONS: SearchItem[] = [
    { id: 'action-add-store', label: 'Add New Store', keywords: ['add', 'new', 'store', 'create', 'merchant'], category: 'action', href: '/stores/new', icon: Store },
    { id: 'action-process-payouts', label: 'Process Payouts', keywords: ['process', 'payouts', 'settlements', 'pay', 'merchants'], category: 'action', href: '/finance/payouts', icon: CreditCard },
    { id: 'action-view-issues', label: 'View Issues', keywords: ['view', 'issues', 'problems', 'complaints', 'tickets'], category: 'action', href: '/orders/issues', icon: FileText },
]

// Helper to filter items by search query
export function filterSearchItems(items: SearchItem[], query: string): SearchItem[] {
    if (!query.trim()) return items

    const lowerQuery = query.toLowerCase().trim()

    return items.filter(item => {
        // Check label
        if (item.label.toLowerCase().includes(lowerQuery)) return true

        // Check keywords
        if (item.keywords.some(kw => kw.toLowerCase().includes(lowerQuery))) return true

        // Check description
        if (item.description?.toLowerCase().includes(lowerQuery)) return true

        return false
    })
}
