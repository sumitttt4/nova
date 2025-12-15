"use client"

import * as React from "react"
import { format, subDays, subHours } from "date-fns"

// --- Types ---
export type MerchantStatus = "approved" | "rejected" | "under_review"

export type Merchant = {
    id: string
    storeName: string
    storeType: string
    location: string
    coordinates?: {
        lat: number
        lng: number
    }
    submittedAt: string
    status: MerchantStatus
    personal: {
        name: string
        phone: string
        email: string
    }
    rejectionReasons?: string[]
}

export type Withdrawal = {
    id: string
    storeId: string
    storeName: string
    amount: number
    status: "processing" | "paid" | "failed" // 'pending' was implied but usually mapped to processing
    requestDate: Date
    accountNumber: string
}

export type Order = {
    id: string
    customerName: string
    storeName: string
    amount: number
    status: "delivered" | "preparing" | "cancelled"
    createdAt: Date
    // Keep 'time' string in mind for UI if needed, but logic uses createdAt
}

export type RiderStatus = "active" | "rejected" | "under_review"

export type Rider = {
    id: string
    name: string
    phone: string
    vehicleType: "Bike" | "Cycle"
    status: RiderStatus
    submittedAt: string
    location: {
        lat: number
        lng: number
        address: string
    }
    ekyc: {
        userSubmitted: {
            name: string
            fatherName: string
            dob: string
            address: string
        }
        apiFetched: {
            name: string
            fatherName: string
            dob: string
            address: string
        }
        documents: {
            aadharFront: string
            selfie: string
        }
    }
    logistics: {
        plateNumber: string
        tShirtSize: "M" | "L" | "XL"
    }
    onboardingFee: {
        status: "paid" | "unpaid"
        amount: number
        txnId?: string
    }
    rejectionReasons?: string[]

    // Additional fields for Master DB
    joiningDate?: Date
    walletBalance?: number
}

interface MockDataContextType {
    merchants: Merchant[]
    withdrawals: Withdrawal[]
    orders: Order[]
    riders: Rider[]

    // Actions
    updateMerchantStatus: (id: string, status: MerchantStatus, reasons?: string[]) => void
    updateRiderStatus: (id: string, status: RiderStatus, reasons?: string[]) => void
    addNewMerchant: (data: Partial<Merchant>) => void
    approveWithdrawal: (id: string) => void
    rejectWithdrawal: (id: string) => void
    addOrder: (order: Partial<Order>) => void
}

// --- Initial Mock Data ---
const INITIAL_MERCHANTS: Merchant[] = [
    {
        id: "MER-REQ-001",
        storeName: "Spice Garden",
        storeType: "Restaurant",
        location: "Indiranagar, Bangalore",
        coordinates: { lat: 12.9716, lng: 77.5946 },
        submittedAt: "2 hours ago",
        status: "under_review",
        personal: { name: "Rajesh Kumar", phone: "+91 98765 43210", email: "raj@spice.com" }
    },
    {
        id: "MER-REQ-002",
        storeName: "Daily Fresh Mart",
        storeType: "Grocery",
        location: "Koramangala, Bangalore",
        coordinates: { lat: 12.9352, lng: 77.6245 },
        submittedAt: "5 hours ago",
        status: "under_review",
        personal: { name: "Suresh Reddy", phone: "+91 99999 88888", email: "suresh@fresh.com" }
    },
    {
        id: "MER-REQ-003",
        storeName: "Cool Point",
        storeType: "Beverages",
        location: "HSR Layout, Bangalore",
        coordinates: { lat: 12.9121, lng: 77.6445 },
        submittedAt: "1 day ago",
        status: "rejected",
        personal: { name: "Anil K", phone: "+91 77777 66666", email: "anil@cool.com" },
        rejectionReasons: ["Blurry FSSAI Document"]
    }
]

const INITIAL_WITHDRAWALS: Withdrawal[] = [
    { id: "TXN-991", storeId: "STR-001", storeName: "Spice Garden", amount: 12500, status: "processing", requestDate: new Date(), accountNumber: "**** 8821" },
    { id: "TXN-992", storeId: "STR-002", storeName: "Burger King", amount: 45000, status: "paid", requestDate: subDays(new Date(), 1), accountNumber: "**** 4452" },
    { id: "TXN-993", storeId: "STR-001", storeName: "Spice Garden", amount: 1500, status: "processing", requestDate: new Date(), accountNumber: "**** 8821" },
    { id: "TXN-994", storeId: "STR-003", storeName: "Pizza Hut", amount: 25000, status: "processing", requestDate: new Date(), accountNumber: "**** 1111" },
]

const INITIAL_ORDERS: Order[] = [
    { id: "ORD-1122", customerName: "Rahul Dravid", storeName: "Spice Garden", amount: 450, status: "preparing", createdAt: new Date() },
    { id: "ORD-1121", customerName: "Priya S", storeName: "Daily Fresh", amount: 120, status: "delivered", createdAt: subHours(new Date(), 1) },
    { id: "ORD-1120", customerName: "Amit B", storeName: "Spice Garden", amount: 850, status: "delivered", createdAt: subDays(new Date(), 1) },
    { id: "ORD-1119", customerName: "John D", storeName: "Burger King", amount: 320, status: "cancelled", createdAt: subDays(new Date(), 2) },
    { id: "ORD-1118", customerName: "Sara L", storeName: "Pizza Hut", amount: 1250, status: "delivered", createdAt: subDays(new Date(), 30) },
    { id: "ORD-1117", customerName: "Mike R", storeName: "Dominos", amount: 2100, status: "delivered", createdAt: new Date() },
]

const INITIAL_RIDERS: Rider[] = [
    {
        id: "RIDER-001",
        name: "Vikram Singh",
        phone: "+91 98765 43210",
        vehicleType: "Bike",
        status: "under_review",
        submittedAt: "2 hours ago",
        location: {
            lat: 12.9716,
            lng: 77.5946,
            address: "Indiranagar, Bangalore, Karnataka"
        },
        ekyc: {
            userSubmitted: {
                name: "Vikram Singh",
                fatherName: "Ramesh Singh",
                dob: "1995-05-15",
                address: "No. 12, 1st Cross, Indiranagar"
            },
            apiFetched: {
                name: "Vikram Singh",
                fatherName: "Ramesh Singh",
                dob: "1995-05-15",
                address: "No. 12, 1st Cross, Indiranagar"
            },
            documents: {
                aadharFront: "/placeholder-aadhar.jpg",
                selfie: "/placeholder-selfie.jpg"
            }
        },
        logistics: {
            plateNumber: "KA-01-AB-1234",
            tShirtSize: "L"
        },
        onboardingFee: {
            status: "paid",
            amount: 999,
            txnId: "TXN-FEE-001"
        }
    },
    {
        id: "RIDER-002",
        name: "Rahul K",
        phone: "+91 88888 77777",
        vehicleType: "Cycle",
        status: "under_review",
        submittedAt: "4 hours ago",
        location: {
            lat: 12.9352,
            lng: 77.6245,
            address: "Koramangala, Bangalore"
        },
        ekyc: {
            userSubmitted: {
                name: "Rahul Kumar",
                fatherName: "Ashok K",
                dob: "1998-08-20",
                address: "Koramangala 4th Block"
            },
            apiFetched: {
                name: "Rahul Kumar",
                fatherName: "Ashok Kumar", // Slight mismatch
                dob: "1998-08-20",
                address: "Koramangala 4th Block"
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
        joiningDate: subDays(new Date(), 0),
        walletBalance: 0
    },
    {
        id: "RIDER-003",
        name: "Amit Patel",
        phone: "+91 99887 77665",
        vehicleType: "Bike",
        status: "active",
        submittedAt: "5 days ago",
        location: {
            lat: 12.9555,
            lng: 77.6111,
            address: "Domlur, Bangalore"
        },
        ekyc: {
            userSubmitted: {
                name: "Amit Patel",
                fatherName: "Sanjay Patel",
                dob: "1994-11-10",
                address: "Domlur Layout"
            },
            apiFetched: {
                name: "Amit Patel",
                fatherName: "Sanjay Patel",
                dob: "1994-11-10",
                address: "Domlur Layout"
            },
            documents: { aadharFront: "", selfie: "" }
        },
        logistics: { plateNumber: "KA-05-XY-9988", tShirtSize: "XL" },
        onboardingFee: { status: "paid", amount: 999, txnId: "TXN-888" },
        joiningDate: subDays(new Date(), 5),
        walletBalance: 1250
    }
]

const MockDataContext = React.createContext<MockDataContextType | undefined>(undefined)

export function MockDataProvider({ children }: { children: React.ReactNode }) {
    const [merchants, setMerchants] = React.useState<Merchant[]>(INITIAL_MERCHANTS)
    const [withdrawals, setWithdrawals] = React.useState<Withdrawal[]>(INITIAL_WITHDRAWALS)
    const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS)
    const [riders, setRiders] = React.useState<Rider[]>(INITIAL_RIDERS)

    // Actions
    const updateMerchantStatus = (id: string, status: MerchantStatus, reasons: string[] = []) => {
        setMerchants(prev => prev.map(m =>
            m.id === id ? { ...m, status, rejectionReasons: reasons } : m
        ))
    }

    const updateRiderStatus = (id: string, status: RiderStatus, reasons: string[] = []) => {
        setRiders(prev => prev.map(r =>
            r.id === id ? { ...r, status, rejectionReasons: reasons } : r
        ))
    }

    const addNewMerchant = (data: Partial<Merchant>) => {
        const newMerchant: Merchant = {
            id: `MER-REQ-${Math.floor(Math.random() * 1000)}`,
            storeName: data.storeName || "New Store",
            storeType: data.storeType || "Retail",
            location: data.location || "Bangalore",
            submittedAt: "Just now",
            status: "under_review",
            personal: {
                name: data.personal?.name || "Unknown",
                phone: data.personal?.phone || "",
                email: data.personal?.email || ""
            },
            ...data
        }
        setMerchants(prev => [newMerchant, ...prev])
    }

    const approveWithdrawal = (id: string) => {
        setWithdrawals(prev => prev.map(w =>
            w.id === id ? { ...w, status: "paid" } : w
        ))
    }

    const rejectWithdrawal = (id: string) => {
        setWithdrawals(prev => prev.map(w =>
            w.id === id ? { ...w, status: "failed" } : w
        ))
    }

    const addOrder = (order: Partial<Order>) => {
        const newOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 9999)}`,
            customerName: "New Customer",
            storeName: "Unknown Store",
            amount: 0,
            status: "preparing",
            createdAt: new Date(),
            ...order
        }
        setOrders(prev => [newOrder, ...prev])
    }

    return (
        <MockDataContext.Provider value={{
            merchants,
            withdrawals,
            orders,
            riders,
            updateMerchantStatus,
            updateRiderStatus,
            addNewMerchant,
            approveWithdrawal,
            rejectWithdrawal,
            addOrder
        }}>
            {children}
        </MockDataContext.Provider>
    )
}

// --- Hook ---
export function useMockData() {
    const context = React.useContext(MockDataContext)
    if (context === undefined) {
        throw new Error("useMockData must be used within a MockDataProvider")
    }
    return context
}
