"use client"

import * as React from "react"
import { format, subDays, subHours } from "date-fns"
import api from "@/lib/api"
import { generateUsers, generateRiders, generateOrders, generateMerchants, generateRiderPayouts, generateSettlements, generatePayouts, generateTaxRecords, generateWalletTransactions, generateFeedbacks, generateProducts, generateStoreFeedbacks, generateRiderReviews, generateRiderFeedbacks } from "@/lib/dummy-data"

// --- Types ---

export type AppSettings = {
    _id: string
    app: string
    version: {
        android: {
            current: string
            minimum_required: string
            force_update: boolean
            store_link: string
        }
        ios: {
            current: string
            minimum_required: string
            force_update: boolean
            store_link: string
        }
    }
    maintenance: {
        active: boolean
        title: string
        message: string
        banner_message: string
    }
    announcement: {
        active: boolean
        title: string | null
        message: string | null
    }
    support: {
        contact: string
        email: string
        whatsapp: string
    }
    terms: {
        version: string
    }
    updatedAt: string
    updatedBy: string
}

export type MerchantStatus = "approved" | "rejected" | "under_review"

export type Merchant = {
    id: string
    merchantId: string
    storeId: string
    ownerUserId: string
    personName: string
    storeName: string
    storeType: string
    storeLabel?: string
    phone: string
    altPhone?: string
    email: string
    status: MerchantStatus
    address: {
        line1: string
        line2: string
        city: string
        state: string
        pincode: string
        fullAddress: string
        lat?: number
        lng?: number
    }
    location?: string
    openHours: {
        timingMode: string
        storeTiming: Record<string, { open: string, close: string, closed: boolean }>
    }
    walletBalance: number
    progress: {
        storeProfile: boolean
        kycSubmitted: boolean
        agreementDone: boolean
        agreementAccepted: boolean
        live: boolean
    }
    flags: {
        storeAdded: boolean
        blocked: boolean
    }
    storePhoto?: string
    subcategories?: any[]
    submittedAt: string
    activePlan?: any
    coordinates?: { lat: number, lng: number }
    personal?: { name: string, phone: string, email: string }
    rejectionReasons?: string[]
    catalogStatus?: {
        totalItems: number
        outOfStock: number
        essentialOutOfStock: boolean
    }
}

export type User = {
    id: string
    name: string
    email: string
    phone: string
    walletBalance: number
    deviceVersion: string
    platform: 'android' | 'ios'
    joinedAt: string
    status: 'active' | 'banned' | 'warned'
    savedAddresses: {
        id: string
        label: string
        address: string
    }[]
}

export type Withdrawal = {
    id: string
    storeId: string
    storeName: string
    amount: number
    status: "processing" | "paid" | "failed"
    requestDate: Date
    accountNumber: string
}

export type Order = {
    id: string
    customerName: string
    storeName: string
    amount: number
    status: "preparing" | "delivered" | "cancelled" | "ready" | "pending" | "out_for_delivery" | "ready_for_pickup"
    createdAt: Date
    customerId?: string
    paymentMode: 'COD' | 'Prepaid'
    paymentStatus: 'pending' | 'paid' | 'failed'
    isPaid: boolean
}

export type Zone = {
    id: string
    name: string
    center: { lat: number, lng: number }
    activeOrders: number
    activeRiders: number
    demandLevel: "normal" | "high" | "critical"
    surgeEnabled: boolean
}

export type RiderStatus = "active" | "inactive" | "under_review" | "blocked" | "rejected"

export type Rider = {
    id: string
    name: string
    phone: string
    email: string // Added email for completeness
    vehicleType: string
    status: RiderStatus
    activeOrder?: string | null
    submittedAt: string
    deliveryRadius: number // km, max 20
    kycStatus: "pending" | "verified" | "rejected" | "partial"
    location: {
        lat: number
        lng: number
        address: string
    }
    ekyc: {
        documents: {
            aadharFront: string
            aadharBack: string
            selfie: string
            dl: string
            pan?: string
        }
        apiFetched?: {
            dob?: string
            gender?: string
            nameMatchScore?: number
        }
    }
    bankDetails: {
        accountNumber: string
        ifsc: string
        beneficiaryName: string
        bankName: string
    }
    logistics: {
        plateNumber: string
        tShirtSize: string
    }
    onboardingFee: {
        status: string
        amount: number
        txnId?: string
    }
    joiningDate?: Date
    walletBalance?: number
    rejectionReasons?: string[]
    metrics?: {
        onlineTime: number
        activeTime: number
        rating: number
        lastOrderTime?: Date
    }
}

export type RiderPayout = {
    id: string
    riderId: string
    riderName: string
    amount: number
    status: "processed" | "pending" | "failed"
    date: Date
    transactionId: string
}

export type Payout = {
    id: string
    merchantName: string
    amount: number
    status: "processed" | "pending" | "failed" // 'processed' maps to 'Paid', 'pending' to 'Brand Gold'
    date: Date
    transactionId: string
}

export type Settlement = {
    id: string
    recipientId: string
    recipientName: string
    type: 'store' | 'rider'
    periodStart: Date
    periodEnd: Date
    breakdown: {
        grossAmount: number
        commission: number
        tax: number
        adjustments: number
    }
    netAmount: number
    status: 'pending' | 'processed' | 'failed'
    transactionReference?: string
}

export type OrderIssue = {
    id: string
    orderId: string
    customerName: string
    type: "missing_item" | "wrong_item" | "quality" | "not_delivered"
    priority: "high" | "medium" | "low"
    status: "open" | "resolved" | "investigating"
    reportedAt: Date
    description: string
}

export type TaxRecord = {
    id: string
    entityId: string
    entityName: string
    type: 'GST_INPUT' | 'GST_OUTPUT' | 'TDS_PAYABLE' | 'TCS_COLLECTED'
    amount: number
    taxableAmount: number
    rate: number // Percentage (e.g., 18, 1, 5)
    period: string // YYYY-MM
    status: 'pending' | 'filed' | 'paid'
    date: Date
}

export type WalletTransaction = {
    id: string
    walletId: string // Maps to Merchant/Rider ID
    amount: number
    type: 'credit' | 'debit'
    category: 'payout' | 'commission' | 'tax_deduction' | 'adjustment' | 'order_revenue' | 'bonus' | 'penalty'
    description: string
    referenceId?: string // Order ID or Settlement ID
    date: Date
    balanceAfter: number
}

export type Feedback = {
    id: string
    userId: string
    userName: string
    userEmail: string
    rating: number // 1-5
    comment: string
    sentiment: 'positive' | 'negative' | 'neutral'
    isSeen: boolean
    createdAt: Date
}

export type Product = {
    id: string
    merchantId: string
    storeName: string
    name: string
    category: string
    price: number
    image: string
    status: 'pending' | 'approved' | 'rejected'
    rejectionReason?: string
    createdAt: Date
}

export type StoreFeedback = {
    id: string
    merchantId: string
    storeName: string
    email: string
    rating: number // 1-5
    comment: string
    sentiment: 'positive' | 'negative' | 'neutral'
    isSeen: boolean
    createdAt: Date
}

export type RiderReview = {
    id: string
    riderId: string
    riderName: string
    userId: string
    userName: string
    orderId: string
    rating: number
    comment: string
    createdAt: Date
}

export type RiderFeedback = {
    id: string
    riderId: string
    riderName: string
    category: 'app_issue' | 'payment' | 'support' | 'suggestion' | 'other'
    sentiment: 'positive' | 'negative' | 'neutral'
    comment: string
    isSeen: boolean
    createdAt: Date
}

// --- Initial Mock Data ---

const MOCK_NOW = new Date("2023-11-20T10:00:00Z")

const INITIAL_APP_SETTINGS: Record<string, AppSettings> = {
    user_app: {
        "_id": "user_app",
        "app": "user",
        "version": {
            "android": { "current": "1.0.0", "minimum_required": "1.0.0", "force_update": false, "store_link": "https://play.google.com/store/apps/details?id=com.bazuroo.user" },
            "ios": { "current": "1.0.0", "minimum_required": "1.0.0", "force_update": false, "store_link": "https://apps.apple.com/app/idXXXXXXXX" }
        },
        "maintenance": { "active": false, "title": "App Maintenance", "message": "We’re upgrading for a better experience.", "banner_message": "We’ll be back soon." },
        "announcement": { "active": false, "title": null, "message": null },
        "support": { "contact": "+919572106859", "email": "support@bazuroo.com", "whatsapp": "https://wa.me/+919572106859" },
        "terms": { "version": "1.0" },
        "updatedAt": "2025-12-08T10:22:00Z",
        "updatedBy": "Manish - Founder - M"
    },
    store_app: {
        "_id": "store_app",
        "app": "store",
        "version": {
            "android": { "current": "1.0.0", "minimum_required": "1.0.0", "force_update": false, "store_link": "https://play.google.com/store/apps/details?id=com.bazuroo.store" },
            "ios": { "current": "1.0.0", "minimum_required": "1.0.0", "force_update": false, "store_link": "https://apps.apple.com/app/idXXXXXXXX" }
        },
        "maintenance": { "active": false, "title": "Store Panel Maintenance", "message": "We’re updating your business dashboard.", "banner_message": "Store services will resume shortly." },
        "announcement": { "active": false, "title": null, "message": null },
        "support": { "contact": "+919572106859", "email": "merchant-support@bazuroo.com", "whatsapp": "https://wa.me/+919572106859" },
        "terms": { "version": "1.0" },
        "updatedAt": "2025-12-08T10:22:00Z",
        "updatedBy": "Manish - Founder - M"
    },
    rider_app: {
        "_id": "rider_app",
        "app": "rider",
        "version": {
            "android": { "current": "1.0.0", "minimum_required": "1.0.0", "force_update": false, "store_link": "https://play.google.com/store/apps/details?id=com.bazuroo.rider" },
            "ios": { "current": "1.0.0", "minimum_required": "1.0.0", "force_update": false, "store_link": "https://apps.apple.com/app/idXXXXXXXX" }
        },
        "maintenance": { "active": false, "title": "Rider App Maintenance", "message": "We’re upgrading the rider experience.", "banner_message": "Rider services will resume shortly." },
        "announcement": { "active": false, "title": null, "message": null },
        "support": { "contact": "+919572106859", "email": "rider-support@bazuroo.com", "whatsapp": "https://wa.me/+919572106859" },
        "terms": { "version": "1.0" },
        "updatedAt": "2025-12-08T10:22:00Z",
        "updatedBy": "Manish - Founder - M"
    }
}

const INITIAL_ZONES: Zone[] = [
    {
        id: "ZONE-001",
        name: "Connaught Place",
        center: { lat: 28.6304, lng: 77.2177 },
        activeOrders: 42,
        activeRiders: 28,
        demandLevel: "high",
        surgeEnabled: false
    },
    {
        id: "ZONE-002",
        name: "Hauz Khas",
        center: { lat: 28.5494, lng: 77.2001 },
        activeOrders: 15,
        activeRiders: 30,
        demandLevel: "normal",
        surgeEnabled: false
    }
]

const INITIAL_MERCHANTS: Merchant[] = [
    {
        id: "68a736f63eca10797799f9f1", merchantId: "MER_49212252", ownerUserId: "USR_41728842", personName: "Manish Ranjann",
        storeName: "Manish MedicalWallah", storeType: "grocery_food", storeLabel: "Grocery & Essentials", phone: "6205112773", altPhone: "6205112773", email: "mnbvc@gmail.com",
        status: "approved", address: { line1: "Lajpat Nagar II", line2: "Central Market", city: "New Delhi", state: "Delhi", pincode: "110024", fullAddress: "Lajpat Nagar II, Central Market, New Delhi, India", lat: 28.5693, lng: 77.2458 },
        location: "Lajpat Nagar, New Delhi", coordinates: { lat: 28.5693, lng: 77.2458 }, personal: { name: "Manish Ranjann", phone: "6205112773", email: "mnbvc@gmail.com" },
        submittedAt: "2025-08-21T15:10:46.019Z", openHours: { timingMode: "custom", storeTiming: { monday: { open: "11:00", close: "23:59", closed: false } } as any },
        walletBalance: 15400, progress: { storeProfile: true, kycSubmitted: true, agreementDone: true, agreementAccepted: true, live: true },
        flags: { storeAdded: false, blocked: false }, storePhoto: "stores/STORE_35029811/banner_9f5672e6-90a1-41d2-8534-866751644b8a.webp",
        activePlan: { name: "Business", price: 9999, status: "active" },
        catalogStatus: { totalItems: 150, outOfStock: 12, essentialOutOfStock: true }, storeId: "STORE_35029811"
    },
    // Keep other minimal merchants for fallback or initial rendering
    {
        id: "MER-002", merchantId: "MER_002", ownerUserId: "USR-003", personName: "Sohan Lal",
        storeName: "Saket Supermart", storeType: "grocery_food", storeLabel: "Supermarket", phone: "9811223344", email: "saket.mart@example.com",
        status: "approved", address: { line1: "J-Block", line2: "Saket", city: "New Delhi", state: "Delhi", pincode: "110017", fullAddress: "J-Block, Saket, New Delhi", lat: 28.5244, lng: 77.2188 },
        location: "Saket, Delhi", openHours: { timingMode: "everyday", storeTiming: {} as any },
        walletBalance: 45000, progress: { storeProfile: true, kycSubmitted: true, agreementDone: true, agreementAccepted: true, live: true },
        flags: { storeAdded: true, blocked: false }, submittedAt: "2025-10-01T10:00:00Z", catalogStatus: { totalItems: 500, outOfStock: 5, essentialOutOfStock: false }, storeId: "STORE_GROCERY_001"
    }
]

const INITIAL_WITHDRAWALS: Withdrawal[] = [
    { id: "TXN-991", storeId: "STORE_35029811", storeName: "Manish MedicalWallah", amount: 12500, status: "processing", requestDate: MOCK_NOW, accountNumber: "**** 8821" },
]

const INITIAL_PAYOUTS: Payout[] = [
    { id: "PO-001", merchantName: "Manish MedicalWallah", amount: 15400, status: "processed", date: subDays(MOCK_NOW, 1), transactionId: "TXN_HDFC_8382" },
]

const INITIAL_ISSUES: OrderIssue[] = [
    { id: "ISS-001", orderId: "ORD-1122", customerName: "Rahul Dravid", type: "missing_item", priority: "high", status: "open", reportedAt: MOCK_NOW, description: "Ordered 2 Naans, received only 1." },
]


interface MockDataContextType {
    merchants: Merchant[]
    withdrawals: Withdrawal[]
    orders: Order[]
    riders: Rider[]
    users: User[]
    payouts: Payout[]
    riderPayouts: RiderPayout[]
    settlements: Settlement[]
    orderIssues: OrderIssue[]
    appSettings: Record<string, AppSettings>
    zones: Zone[]
    taxRecords: TaxRecord[]
    walletTransactions: WalletTransaction[]
    feedbacks: Feedback[]
    products: Product[]
    storeFeedbacks: StoreFeedback[]
    riderReviews: RiderReview[]
    riderFeedbacks: RiderFeedback[]
    isLoading: boolean

    // Actions
    updateMerchantStatus: (id: string, status: MerchantStatus, reasons?: string[]) => void
    updateRiderStatus: (id: string, status: RiderStatus, reasons?: string[]) => void
    updateRiderKyc: (id: string, status: 'verified' | 'rejected' | 'pending') => void
    updateRiderRadius: (id: string, radius: number) => void
    addNewMerchant: (data: Partial<Merchant>) => void
    approveWithdrawal: (id: string) => void
    rejectWithdrawal: (id: string) => void
    addOrder: (order: Partial<Order>) => void
    updateOrderStatus: (id: string, status: Order['status']) => void
    updateAppSettings: (key: string, newSettings: AppSettings) => void
    toggleZoneSurge: (id: string, enabled: boolean) => void
    createSettlement: (data: Partial<Settlement>) => void
    markFeedbackSeen: (id: string, seen: boolean) => void
    approveProduct: (id: string) => void
    rejectProduct: (id: string, reason: string) => void
    markStoreFeedbackSeen: (id: string, seen: boolean) => void
    markRiderFeedbackSeen: (id: string, seen: boolean) => void
    updateUserStatus: (id: string, status: User['status']) => void
}

const MockDataContext = React.createContext<MockDataContextType | undefined>(undefined)

export function MockDataProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = React.useState(true)
    const [merchants, setMerchants] = React.useState<Merchant[]>(INITIAL_MERCHANTS)
    const [withdrawals, setWithdrawals] = React.useState<Withdrawal[]>(INITIAL_WITHDRAWALS)
    const [orders, setOrders] = React.useState<Order[]>([])
    const [riders, setRiders] = React.useState<Rider[]>([])
    const [users, setUsers] = React.useState<User[]>([])
    const [payouts, setPayouts] = React.useState<Payout[]>(INITIAL_PAYOUTS)
    const [riderPayouts, setRiderPayouts] = React.useState<RiderPayout[]>([])
    const [settlements, setSettlements] = React.useState<Settlement[]>([])
    const [orderIssues, setOrderIssues] = React.useState<OrderIssue[]>(INITIAL_ISSUES)
    const [appSettings, setAppSettings] = React.useState<Record<string, AppSettings>>(INITIAL_APP_SETTINGS)
    const [zones, setZones] = React.useState<Zone[]>(INITIAL_ZONES)
    const [taxRecords, setTaxRecords] = React.useState<TaxRecord[]>([])
    const [walletTransactions, setWalletTransactions] = React.useState<WalletTransaction[]>([])
    const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([])
    const [products, setProducts] = React.useState<Product[]>([])
    const [storeFeedbacks, setStoreFeedbacks] = React.useState<StoreFeedback[]>([])
    const [riderReviews, setRiderReviews] = React.useState<RiderReview[]>([])
    const [riderFeedbacks, setRiderFeedbacks] = React.useState<RiderFeedback[]>([])

    const DATA_VERSION = '4.0' // Bumped to regenerate merchants with pending/rejected statuses
    const STORAGE_KEYS = [
        'bazuroo_users',
        'bazuroo_riders',
        'bazuroo_orders',
        'bazuroo_merchants',
        'bazuroo_zones',
        'bazuroo_app_settings',
        'bazuroo_rider_payouts',
        'bazuroo_settlements',
        'bazuroo_payouts',
        'bazuroo_tax_records',
        'bazuroo_wallet_transactions',
        'bazuroo_feedbacks',
        'bazuroo_products',
        'bazuroo_store_feedbacks',
        'bazuroo_rider_reviews',
        'bazuroo_rider_feedbacks',
        'bazuroo_data_version'
    ]

    // Load Data Effect
    React.useEffect(() => {
        const loadData = async () => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800))

            try {
                // Check Version
                const currentVersion = localStorage.getItem('bazuroo_data_version')
                if (currentVersion !== DATA_VERSION) {
                    console.log("Data version mismatch. Resetting mock data...")
                    localStorage.removeItem('bazuroo_users')
                    localStorage.removeItem('bazuroo_riders')
                    localStorage.removeItem('bazuroo_orders')
                    localStorage.removeItem('bazuroo_merchants')
                    localStorage.removeItem('bazuroo_rider_payouts')
                    localStorage.removeItem('bazuroo_settlements')
                    localStorage.removeItem('bazuroo_payouts')
                    localStorage.removeItem('bazuroo_tax_records')
                    localStorage.removeItem('bazuroo_wallet_transactions')
                }

                // Try loading from localStorage
                const localUsers = localStorage.getItem('bazuroo_users')
                const localRiders = localStorage.getItem('bazuroo_riders')
                const localOrders = localStorage.getItem('bazuroo_orders')
                const localMerchants = localStorage.getItem('bazuroo_merchants')
                const localRiderPayouts = localStorage.getItem('bazuroo_rider_payouts')
                const localSettlements = localStorage.getItem('bazuroo_settlements')
                const localPayouts = localStorage.getItem('bazuroo_payouts')
                const localTaxRecords = localStorage.getItem('bazuroo_tax_records')
                const localWalletTransactions = localStorage.getItem('bazuroo_wallet_transactions')
                const localFeedbacks = localStorage.getItem('bazuroo_feedbacks')
                const localProducts = localStorage.getItem('bazuroo_products')
                const localStoreFeedbacks = localStorage.getItem('bazuroo_store_feedbacks')
                const localRiderReviews = localStorage.getItem('bazuroo_rider_reviews')
                const localRiderFeedbacks = localStorage.getItem('bazuroo_rider_feedbacks')

                let loadedMerchants = INITIAL_MERCHANTS

                if (localMerchants) {
                    loadedMerchants = JSON.parse(localMerchants)
                    setMerchants(loadedMerchants)
                } else {
                    // Generate if missing
                    const generatedMerchants = generateMerchants(10)
                    loadedMerchants = [...INITIAL_MERCHANTS, ...generatedMerchants]
                    setMerchants(loadedMerchants)
                }

                if (localUsers && localRiders && localOrders) {
                    console.log("Loading data from LocalStorage...")
                    setUsers(JSON.parse(localUsers))
                    setRiders(JSON.parse(localRiders))
                    setOrders(JSON.parse(localOrders))
                    if (localRiderPayouts) setRiderPayouts(JSON.parse(localRiderPayouts))
                    if (localSettlements) setSettlements(JSON.parse(localSettlements))
                    if (localPayouts) setPayouts(JSON.parse(localPayouts))
                    if (localTaxRecords) setTaxRecords(JSON.parse(localTaxRecords))
                    if (localWalletTransactions) setWalletTransactions(JSON.parse(localWalletTransactions))

                    if (localFeedbacks) {
                        setFeedbacks(JSON.parse(localFeedbacks))
                    } else {
                        // If no feedbacks but users exist, generate them
                        const users = JSON.parse(localUsers)
                        setFeedbacks(generateFeedbacks(30, users))
                    }

                    if (localProducts) setProducts(JSON.parse(localProducts))
                    else setProducts(generateProducts(50, loadedMerchants))

                    if (localStoreFeedbacks) setStoreFeedbacks(JSON.parse(localStoreFeedbacks))
                    else setStoreFeedbacks(generateStoreFeedbacks(20, loadedMerchants))

                    if (localRiderReviews) setRiderReviews(JSON.parse(localRiderReviews))
                    else setRiderReviews(generateRiderReviews(30, JSON.parse(localRiders), JSON.parse(localUsers)))

                    if (localRiderFeedbacks) setRiderFeedbacks(JSON.parse(localRiderFeedbacks))
                    else setRiderFeedbacks(generateRiderFeedbacks(20, JSON.parse(localRiders)))
                } else {
                    console.log("Generating fresh Mock Data...")
                    const newUsers = generateUsers(200)
                    const newRiders = generateRiders(80)

                    // Use loadedMerchants (which is either from LS or newly generated) for orders
                    const newOrders = generateOrders(500, newUsers, loadedMerchants)
                    const newRiderPayouts = generateRiderPayouts(100, newRiders)
                    const newSettlements = generateSettlements(40, loadedMerchants, newRiders)
                    const newPayouts = generatePayouts(100, loadedMerchants)

                    setUsers(newUsers)
                    setRiders(newRiders)
                    setOrders(newOrders)
                    setRiderPayouts(newRiderPayouts)
                    setSettlements(newSettlements)
                    setSettlements(newSettlements)
                    setPayouts(newPayouts)

                    const newTaxRecords = generateTaxRecords(100, loadedMerchants)
                    setTaxRecords(newTaxRecords)

                    const newWalletTransactions = generateWalletTransactions(200, loadedMerchants, newRiders)
                    setWalletTransactions(newWalletTransactions)

                    const newFeedbacks = generateFeedbacks(60, newUsers)
                    setFeedbacks(newFeedbacks)

                    const newProducts = generateProducts(100, loadedMerchants)
                    setProducts(newProducts)

                    const newStoreFeedbacks = generateStoreFeedbacks(40, loadedMerchants)
                    setStoreFeedbacks(newStoreFeedbacks)

                    const newRiderReviews = generateRiderReviews(80, newRiders, newUsers)
                    const newRiderFeedbacks = generateRiderFeedbacks(40, newRiders)

                    setRiderReviews(newRiderReviews)
                    setRiderFeedbacks(newRiderFeedbacks)

                    // Persist
                    localStorage.setItem('bazuroo_users', JSON.stringify(newUsers))
                    localStorage.setItem('bazuroo_riders', JSON.stringify(newRiders))
                    localStorage.setItem('bazuroo_orders', JSON.stringify(newOrders))
                    localStorage.setItem('bazuroo_merchants', JSON.stringify(loadedMerchants))
                    localStorage.setItem('bazuroo_zones', JSON.stringify(INITIAL_ZONES))
                    localStorage.setItem('bazuroo_rider_payouts', JSON.stringify(newRiderPayouts))
                    localStorage.setItem('bazuroo_settlements', JSON.stringify(newSettlements))
                    localStorage.setItem('bazuroo_payouts', JSON.stringify(newPayouts))
                    localStorage.setItem('bazuroo_tax_records', JSON.stringify(newTaxRecords))
                    localStorage.setItem('bazuroo_wallet_transactions', JSON.stringify(newWalletTransactions))
                    localStorage.setItem('bazuroo_feedbacks', JSON.stringify(newFeedbacks))
                    localStorage.setItem('bazuroo_products', JSON.stringify(newProducts))
                    localStorage.setItem('bazuroo_store_feedbacks', JSON.stringify(newStoreFeedbacks))
                    localStorage.setItem('bazuroo_rider_reviews', JSON.stringify(newRiderReviews))
                    localStorage.setItem('bazuroo_rider_feedbacks', JSON.stringify(newRiderFeedbacks))
                    localStorage.setItem('bazuroo_data_version', DATA_VERSION)
                }
            } catch (e) {
                console.error("Error loading mock data", e)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    // Persistence Effect
    React.useEffect(() => {
        if (!isLoading && users.length > 0) {
            localStorage.setItem('bazuroo_users', JSON.stringify(users))
            localStorage.setItem('bazuroo_riders', JSON.stringify(riders))
            localStorage.setItem('bazuroo_orders', JSON.stringify(orders))
            localStorage.setItem('bazuroo_merchants', JSON.stringify(merchants))
            localStorage.setItem('bazuroo_rider_payouts', JSON.stringify(riderPayouts))
            localStorage.setItem('bazuroo_settlements', JSON.stringify(settlements))
            localStorage.setItem('bazuroo_payouts', JSON.stringify(payouts))
            localStorage.setItem('bazuroo_tax_records', JSON.stringify(taxRecords))
            localStorage.setItem('bazuroo_wallet_transactions', JSON.stringify(walletTransactions))
            localStorage.setItem('bazuroo_feedbacks', JSON.stringify(feedbacks))
            localStorage.setItem('bazuroo_products', JSON.stringify(products))
            localStorage.setItem('bazuroo_store_feedbacks', JSON.stringify(storeFeedbacks))
            localStorage.setItem('bazuroo_rider_reviews', JSON.stringify(riderReviews))
            localStorage.setItem('bazuroo_rider_feedbacks', JSON.stringify(riderFeedbacks))
            localStorage.setItem('bazuroo_data_version', DATA_VERSION)
        }
    }, [users, riders, orders, merchants, riderPayouts, isLoading, feedbacks, products, storeFeedbacks, riderReviews, riderFeedbacks, settlements, payouts, taxRecords, walletTransactions])


    const updateMerchantStatus = (id: string, status: MerchantStatus, reasons: string[] = []) => {
        setMerchants(prev => prev.map(m => m.id === id ? { ...m, status, rejectionReasons: reasons } : m))
    }

    const updateRiderStatus = (id: string, status: RiderStatus, reasons: string[] = []) => {
        setRiders(prev => prev.map(r => r.id === id ? { ...r, status, rejectionReasons: reasons } : r))
    }

    const updateRiderKyc = (id: string, status: 'verified' | 'rejected' | 'pending') => {
        setRiders(prev => prev.map(r => r.id === id ? { ...r, kycStatus: status } : r))
    }

    const updateRiderRadius = (id: string, radius: number) => {
        setRiders(prev => prev.map(r => r.id === id ? { ...r, deliveryRadius: radius } : r))
    }

    const addNewMerchant = (data: Partial<Merchant>) => {
        const newMerchant: Merchant = {
            ...INITIAL_MERCHANTS[0],
            id: `MER-${Date.now()}`,
            merchantId: `MER_${Math.floor(Math.random() * 100000)}`,
            storeId: `STORE_${Math.floor(Math.random() * 100000)}`,
            ...data,
            submittedAt: new Date().toISOString()
        } as Merchant
        setMerchants(prev => [newMerchant, ...prev])
    }

    const approveWithdrawal = (id: string) => {
        setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'paid' } : w))
    }

    const rejectWithdrawal = (id: string) => {
        setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'failed' } : w))
    }

    const addOrder = (order: Partial<Order>) => {
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            customerName: "New Customer",
            storeName: "Store",
            amount: 0,
            status: "preparing",
            createdAt: new Date(),
            ...order
        } as Order
        setOrders(prev => [newOrder, ...prev])
    }

    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }

    const updateAppSettings = (key: string, newSettings: AppSettings) => {
        setAppSettings(prev => ({ ...prev, [key]: newSettings }))
    }

    const toggleZoneSurge = (id: string, enabled: boolean) => {
        setZones(prev => prev.map(z => z.id === id ? { ...z, surgeEnabled: enabled } : z))
    }

    const createSettlement = (data: Partial<Settlement>) => {
        const newSettlement: Settlement = {
            id: `SET-${Date.now()}`,
            recipientId: 'UNKNOWN',
            recipientName: 'Unknown',
            type: 'store',
            periodStart: new Date(),
            periodEnd: new Date(),
            breakdown: { grossAmount: 0, commission: 0, tax: 0, adjustments: 0 },
            netAmount: 0,
            status: 'pending',
            ...data
        } as Settlement
        setSettlements(prev => [newSettlement, ...prev])
    }

    const markFeedbackSeen = (id: string, seen: boolean) => {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, isSeen: seen } : f))
    }

    const approveProduct = (id: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p))
    }

    const rejectProduct = (id: string, reason: string) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected', rejectionReason: reason } : p))
    }

    const markStoreFeedbackSeen = (id: string, seen: boolean) => {
        setStoreFeedbacks(prev => prev.map(f => f.id === id ? { ...f, isSeen: seen } : f))
    }

    const markRiderFeedbackSeen = (id: string, seen: boolean) => {
        const updated = riderFeedbacks.map(f => f.id === id ? { ...f, isSeen: seen } : f)
        setRiderFeedbacks(updated)
        localStorage.setItem('bazuroo_rider_feedbacks', JSON.stringify(updated))
    }

    const updateUserStatus = (id: string, status: User['status']) => {
        const updated = users.map(u => u.id === id ? { ...u, status } : u)
        setUsers(updated)
        localStorage.setItem('bazuroo_users', JSON.stringify(updated))
    }

    return (
        <MockDataContext.Provider value={{
            merchants,
            withdrawals,
            orders,
            riders,
            users,
            payouts,
            riderPayouts,
            settlements,
            orderIssues,
            appSettings,
            zones,
            taxRecords,
            walletTransactions,
            feedbacks,
            products,
            storeFeedbacks,
            riderReviews,
            riderFeedbacks,
            isLoading,
            updateMerchantStatus,
            updateRiderStatus,
            updateRiderKyc,
            updateRiderRadius,
            addNewMerchant,
            approveWithdrawal,
            rejectWithdrawal,
            addOrder,
            updateOrderStatus,
            updateAppSettings,
            toggleZoneSurge,
            createSettlement,
            markFeedbackSeen,
            approveProduct,
            rejectProduct,
            markStoreFeedbackSeen,
            markRiderFeedbackSeen,
            updateUserStatus
        }}>
            {children}
        </MockDataContext.Provider>
    )
}

export function useMockData() {
    const context = React.useContext(MockDataContext)
    if (context === undefined) {
        throw new Error("useMockData must be used within a MockDataProvider")
    }
    return context
}
