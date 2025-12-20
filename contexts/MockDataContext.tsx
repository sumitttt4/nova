"use client"

import * as React from "react"
import { format, subDays, subHours } from "date-fns"

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
    status: "preparing" | "delivered" | "cancelled" | "ready"
    createdAt: Date
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
    vehicleType: string
    status: RiderStatus
    activeOrder?: string | null // New field for map visualization
    submittedAt: string
    location: {
        lat: number
        lng: number
        address: string
    }
    ekyc: {
        userSubmitted: any
        apiFetched: any
        documents: {
            aadharFront: string
            selfie: string
        }
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
        onlineTime: number // minutes today
        activeTime: number // minutes in active deliveries today
        rating: number // 0-5
        lastOrderTime?: Date // For churn detection
    }
}

export type Payout = {
    id: string
    merchantName: string
    amount: number
    status: "processed" | "pending" | "failed" // 'processed' maps to 'Paid', 'pending' to 'Brand Gold'
    date: Date
    transactionId: string
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

// --- Initial Mock Data ---

const MOCK_NOW = new Date("2023-11-20T10:00:00")

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

const INITIAL_USERS: User[] = [
    {
        id: "USR-001", name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 9876543210", walletBalance: 450, deviceVersion: "0.9.0", platform: "android", joinedAt: "2023-11-01T10:00:00Z", status: "active",
        savedAddresses: [{ id: "ADDR-1", label: "Home", address: "B-12, Karol Bagh, New Delhi" }, { id: "ADDR-2", label: "Work", address: "DLF Cyber City, Gurgaon" }]
    },
    {
        id: "USR-002", name: "Priya Patel", email: "priya@example.com", phone: "+91 9876543211", walletBalance: 1200, deviceVersion: "1.0.0", platform: "ios", joinedAt: "2023-11-05T10:00:00Z", status: "warned",
        savedAddresses: [{ id: "ADDR-3", label: "Home", address: "M-Block, GK-1, New Delhi" }]
    }
]

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

const INITIAL_RIDERS: Rider[] = [
    {
        id: "RIDER-001",
        name: "Vikram Singh",
        phone: "+91 98765 43210",
        vehicleType: "Bike",
        status: "active",
        activeOrder: "ORD-1122", // Active
        submittedAt: "2 hours ago",
        location: {
            lat: 28.6315,
            lng: 77.2167,
            address: "Connaught Place, New Delhi"
        },
        ekyc: {
            userSubmitted: {
                name: "Vikram Singh",
                fatherName: "Ramesh Singh",
                dob: "1995-05-15",
                address: "Hz. 12, Paharganj, Delhi"
            },
            apiFetched: {
                name: "Vikram Singh",
                fatherName: "Ramesh Singh",
                dob: "1995-05-15",
                address: "Hz. 12, Paharganj, Delhi"
            },
            documents: {
                aadharFront: "/placeholder-aadhar.jpg",
                selfie: "/placeholder-selfie.jpg"
            }
        },
        logistics: {
            plateNumber: "DL-01-AB-1234",
            tShirtSize: "L"
        },
        onboardingFee: {
            status: "paid",
            amount: 999,
            txnId: "TXN-FEE-001"
        },
        metrics: {
            onlineTime: 240,
            activeTime: 180,
            rating: 4.8,
            lastOrderTime: MOCK_NOW
        }
    },
    {
        id: "RIDER-002",
        name: "Rahul K",
        phone: "+91 88888 77777",
        vehicleType: "Cycle",
        status: "active",
        activeOrder: null, // Idle
        submittedAt: "4 hours ago",
        location: {
            lat: 28.5480,
            lng: 77.2010,
            address: "Hauz Khas Village, New Delhi"
        },
        ekyc: {
            userSubmitted: {
                name: "Rahul Kumar",
                fatherName: "Ashok K",
                dob: "1998-08-20",
                address: "Green Park, Delhi"
            },
            apiFetched: {
                name: "Rahul Kumar",
                fatherName: "Ashok Kumar",
                dob: "1998-08-20",
                address: "Green Park, Delhi"
            },
            documents: {
                aadharFront: "/placeholder-aadhar-2.jpg",
                selfie: "/placeholder-selfie-2.jpg"
            }
        },
        logistics: {
            plateNumber: "N/A",
            tShirtSize: "M"
        },
        onboardingFee: {
            status: "unpaid",
            amount: 999
        },
        joiningDate: subDays(MOCK_NOW, 0),
        walletBalance: 0,
        metrics: {
            onlineTime: 120,
            activeTime: 10,
            rating: 3.5, // Low rating flag
            lastOrderTime: subHours(MOCK_NOW, 3)
        }
    },
    {
        id: "RIDER-003",
        name: "Amit Patel",
        phone: "+91 99887 77665",
        vehicleType: "Bike",
        status: "active",
        activeOrder: "ORD-9999", // Active
        submittedAt: "5 days ago",
        location: {
            lat: 28.5823,
            lng: 77.0500,
            address: "Sector 10, Dwarka, New Delhi"
        },
        ekyc: {
            userSubmitted: {
                name: "Amit Patel",
                fatherName: "Sanjay Patel",
                dob: "1994-11-10",
                address: "Palam, Delhi"
            },
            apiFetched: {
                name: "Amit Patel",
                fatherName: "Sanjay Patel",
                dob: "1994-11-10",
                address: "Palam, Delhi"
            },
            documents: { aadharFront: "", selfie: "" }
        },
        logistics: { plateNumber: "DL-05-XY-9988", tShirtSize: "XL" },
        onboardingFee: { status: "paid", amount: 999, txnId: "TXN-888" },
        joiningDate: subDays(MOCK_NOW, 5),
        walletBalance: 1250,
        metrics: {
            onlineTime: 300,
            activeTime: 280,
            rating: 4.9,
            lastOrderTime: MOCK_NOW
        }
    },
    {
        id: "RIDER-004", name: "Suresh", phone: "123", vehicleType: "Bike", status: "active", activeOrder: null, submittedAt: "",
        location: { lat: 28.6320, lng: 77.2180, address: "Barakhamba Road, New Delhi" }, ekyc: {} as any, logistics: {} as any, onboardingFee: {} as any,
        metrics: {
            onlineTime: 180,
            activeTime: 40,
            rating: 4.2,
            lastOrderTime: subHours(MOCK_NOW, 1) // > 30 mins idle
        }
    },
    {
        id: "RIDER-005", name: "Mahesh", phone: "123", vehicleType: "Bike", status: "active", activeOrder: "ORD-88", submittedAt: "",
        location: { lat: 28.6300, lng: 77.2150, address: "Janpath, New Delhi" }, ekyc: {} as any, logistics: {} as any, onboardingFee: {} as any,
        metrics: {
            onlineTime: 60,
            activeTime: 10,
            rating: 4.5,
            lastOrderTime: MOCK_NOW
        }
    },
    {
        id: "RIDER-006", name: "Ganesh", phone: "123", vehicleType: "Bike", status: "active", activeOrder: null, submittedAt: "",
        location: { lat: 28.5490, lng: 77.1990, address: "IIT Delhi Area, New Delhi" }, ekyc: {} as any, logistics: {} as any, onboardingFee: {} as any,
        metrics: {
            onlineTime: 400,
            activeTime: 50,
            rating: 3.8, // Low
            lastOrderTime: subHours(MOCK_NOW, 4)
        }
    }
]

const INITIAL_MERCHANTS: Merchant[] = [
    {
        id: "68a736f63eca10797799f9f1", merchantId: "MER_49212252", storeId: "STORE_35029811", ownerUserId: "USR_41728842", personName: "Manish Ranjann",
        storeName: "Manish MedicalWalllllllllllah", storeType: "grocery_food", storeLabel: "Pharmacy (OTC)", phone: "6205112773", altPhone: "6205112773", email: "mnbvc@gmail.com",
        status: "approved", address: { line1: "Lajpat Nagar II", line2: "Central Market", city: "New Delhi", state: "Delhi", pincode: "110024", fullAddress: "Lajpat Nagar II, Central Market, New Delhi, India", lat: 28.5693, lng: 77.2458 },
        location: "Lajpat Nagar, New Delhi", coordinates: { lat: 28.5693, lng: 77.2458 }, personal: { name: "Manish Ranjann", phone: "6205112773", email: "mnbvc@gmail.com" },
        submittedAt: "2025-08-21T15:10:46.019Z", openHours: { timingMode: "custom", storeTiming: { monday: { open: "11:00", close: "23:59", closed: false } } as any },
        walletBalance: 0, progress: { storeProfile: true, kycSubmitted: true, agreementDone: true, agreementAccepted: true, live: true },
        flags: { storeAdded: false, blocked: false }, storePhoto: "stores/STORE_35029811/banner_9f5672e6-90a1-41d2-8534-866751644b8a.webp",
        activePlan: { name: "Business", price: 9999, status: "active" },
        catalogStatus: {
            totalItems: 150,
            outOfStock: 12,
            essentialOutOfStock: true
        }
    }
]

const INITIAL_WITHDRAWALS: Withdrawal[] = [
    { id: "TXN-991", storeId: "STR-001", storeName: "Spice Garden", amount: 12500, status: "processing", requestDate: MOCK_NOW, accountNumber: "**** 8821" },
    { id: "TXN-992", storeId: "STR-002", storeName: "Burger King", amount: 45000, status: "paid", requestDate: subDays(MOCK_NOW, 1), accountNumber: "**** 4452" },
]

const INITIAL_ORDERS: Order[] = [
    { id: "ORD-1122", customerName: "Rahul Dravid", storeName: "Spice Garden", amount: 450, status: "preparing", createdAt: MOCK_NOW },
    { id: "ORD-1121", customerName: "Priya S", storeName: "Daily Fresh", amount: 120, status: "delivered", createdAt: subHours(MOCK_NOW, 1) },
]

const INITIAL_PAYOUTS: Payout[] = [
    { id: "PO-001", merchantName: "Spice Garden", amount: 15400, status: "processed", date: subDays(MOCK_NOW, 1), transactionId: "TXN_HDFC_8382" },
    { id: "PO-002", merchantName: "Burger King", amount: 28900, status: "pending", date: MOCK_NOW, transactionId: "TXN_SBI_9921" },
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
    orderIssues: OrderIssue[]
    appSettings: Record<string, AppSettings>
    zones: Zone[]

    // Actions
    updateMerchantStatus: (id: string, status: MerchantStatus, reasons?: string[]) => void
    updateRiderStatus: (id: string, status: RiderStatus, reasons?: string[]) => void
    addNewMerchant: (data: Partial<Merchant>) => void
    approveWithdrawal: (id: string) => void
    rejectWithdrawal: (id: string) => void
    addOrder: (order: Partial<Order>) => void
    updateAppSettings: (key: string, newSettings: AppSettings) => void
    toggleZoneSurge: (id: string, enabled: boolean) => void
}

const MockDataContext = React.createContext<MockDataContextType | undefined>(undefined)

export function MockDataProvider({ children }: { children: React.ReactNode }) {
    const [merchants, setMerchants] = React.useState<Merchant[]>(INITIAL_MERCHANTS)
    const [withdrawals, setWithdrawals] = React.useState<Withdrawal[]>(INITIAL_WITHDRAWALS)
    const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS)
    const [riders, setRiders] = React.useState<Rider[]>(INITIAL_RIDERS)
    const [users, setUsers] = React.useState<User[]>(INITIAL_USERS)
    const [payouts] = React.useState<Payout[]>(INITIAL_PAYOUTS)
    const [orderIssues] = React.useState<OrderIssue[]>(INITIAL_ISSUES)
    const [appSettings, setAppSettings] = React.useState<Record<string, AppSettings>>(INITIAL_APP_SETTINGS)
    const [zones, setZones] = React.useState<Zone[]>(INITIAL_ZONES)

    const updateAppSettings = (key: string, newSettings: AppSettings) => {
        setAppSettings(prev => ({ ...prev, [key]: newSettings }))
    }

    const toggleZoneSurge = (id: string, enabled: boolean) => {
        setZones(prev => prev.map(z => z.id === id ? { ...z, surgeEnabled: enabled } : z))
    }

    const updateMerchantStatus = (id: string, status: MerchantStatus, reasons: string[] = []) => {
        setMerchants(prev => prev.map(m => m.id === id ? { ...m, status, rejectionReasons: reasons } : m))
    }

    const updateRiderStatus = (id: string, status: RiderStatus, reasons: string[] = []) => {
        setRiders(prev => prev.map(r => r.id === id ? { ...r, status, rejectionReasons: reasons } : r))
    }

    const addNewMerchant = (data: Partial<Merchant>) => {
        const newMerchant = {
            id: `MER-REQ-${Math.floor(Math.random() * 1000)}`,
            storeName: "New Store", storeType: "General", status: "under_review",
            address: { line1: "", line2: "", city: "", state: "", pincode: "", fullAddress: "" },
            openHours: { timingMode: "custom", storeTiming: {} },
            walletBalance: 0,
            progress: { storeProfile: true, kycSubmitted: false, agreementDone: false, agreementAccepted: false, live: false },
            flags: { storeAdded: false, blocked: false },
            submittedAt: new Date().toISOString(),
            personal: { name: "", phone: "", email: "" },
            ...data
        } as Merchant
        setMerchants(prev => [newMerchant, ...prev])
    }

    const approveWithdrawal = (id: string) => { setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "paid" } : w)) }
    const rejectWithdrawal = (id: string) => { setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "failed" } : w)) }
    const addOrder = (order: Partial<Order>) => {
        const newOrder = { id: `ORD-${Math.random()}`, customerName: "New", storeName: "Store", amount: 0, status: "preparing", createdAt: new Date(), ...order } as Order
        setOrders(prev => [newOrder, ...prev])
    }

    return (
        <MockDataContext.Provider value={{
            merchants, withdrawals, orders, riders, users, payouts, orderIssues, appSettings, zones,
            updateMerchantStatus, updateRiderStatus, addNewMerchant, approveWithdrawal, rejectWithdrawal, addOrder, updateAppSettings, toggleZoneSurge
        }}>
            {children}
        </MockDataContext.Provider>
    )
}

export function useMockData() {
    const context = React.useContext(MockDataContext)
    if (context === undefined) { throw new Error("useMockData must be used within a MockDataProvider") }
    return context
}
