"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertTriangle,
    Ban,
    ShieldAlert,
    Smartphone,
    MapPin,
    Wallet,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronLeft,
    CreditCard
} from "lucide-react"
import { cn } from "@/lib/utils"

// Helper to compare versions
const isVersionOutdated = (current: string, required: string) => {
    return current.localeCompare(required, undefined, { numeric: true, sensitivity: 'base' }) < 0
}

export default function UserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { users, appSettings, orders } = useMockData()

    // Find User
    const user = users.find(u => u.id === params?.userId || (params?.userId && u.id.toLowerCase() === (params.userId as string).toLowerCase())) || users[0]

    if (!user) {
        return <div className="p-10">User not found</div>
    }

    // Version Check
    const userAppConfig = appSettings['user_app']?.version[user.platform]
    const isOutdated = userAppConfig ? isVersionOutdated(user.deviceVersion, userAppConfig.minimum_required) : false

    // Filtered Orders
    const userOrders = orders.filter(o => o.customerName.includes(user.name.split(' ')[0]))

    // Mock Payment History (Expanded)
    const paymentHistory = [
        { id: 'TXN-8821', type: 'debit', amount: 320, method: 'UPI', date: '2023-11-21 14:30', description: 'Order #ORD-1119' },
        { id: 'TXN-8820', type: 'debit', amount: 120, method: 'Wallet', date: '2023-11-20 09:15', description: 'Order #ORD-1121' },
        { id: 'TXN-8819', type: 'credit', amount: 500, method: 'NetBanking', date: '2023-11-15 18:00', description: 'Wallet Top-up' },
        { id: 'TXN-8818', type: 'debit', amount: 850, method: 'Card', date: '2023-11-12 20:45', description: 'Order #ORD-1090' },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>ID: {user.id}</span>
                            <span>•</span>
                            <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <Badge className={cn(
                                "capitalize",
                                user.status === 'active' ? 'bg-[#2BD67C] text-black hover:bg-[#2BD67C]/90' :
                                    user.status === 'warned' ? 'bg-[#FBC02D] text-black hover:bg-[#FBC02D]/90' :
                                        'bg-red-500 hover:bg-red-600'
                            )}>
                                {user.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-black border-none font-medium">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Warn User
                    </Button>
                    <Button variant="destructive" className="font-medium">
                        <Ban className="mr-2 h-4 w-4" />
                        Ban User
                    </Button>
                </div>
            </div>

            {/* Version Mismatch Alert */}
            {isOutdated && (
                <div className="flex w-full items-start gap-4 rounded-lg border border-[#FBC02D] bg-[#FBC02D]/10 p-4 text-yellow-900">
                    <AlertTriangle className="h-5 w-5 mt-0.5 text-[#FBC02D] shrink-0" />
                    <div className="grid gap-1">
                        <h5 className="font-bold leading-none tracking-tight">Version Mismatch Detected</h5>
                        <div className="text-sm opacity-90">
                            User is on <strong>{user.platform} v{user.deviceVersion}</strong> which is below the minimum required <strong>v{userAppConfig?.minimum_required}</strong>.
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview (Moved Above Tabs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Device & App</CardTitle>
                        <Smartphone className="h-5 w-5 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{user.platform}</div>
                        <p className="text-sm text-muted-foreground">Version: {user.deviceVersion}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
                        <Wallet className="h-5 w-5 text-[#2BD67C]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{user.walletBalance.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">Credits Available</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                        <ShoppingBag className="h-5 w-5 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userOrders.length}</div>
                        <p className="text-sm text-muted-foreground">Lifetime</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="bg-slate-100 p-1 w-full justify-start h-auto">
                    <TabsTrigger value="orders" className="px-6 py-2">Order History</TabsTrigger>
                    <TabsTrigger value="addresses" className="px-6 py-2">Saved Addresses</TabsTrigger>
                    <TabsTrigger value="payments" className="px-6 py-2">Payment History</TabsTrigger>
                </TabsList>

                {/* 1. Order History */}
                <TabsContent value="orders">
                    <Card>
                        <CardHeader className="px-6 py-4 border-b">
                            <CardTitle>Order History</CardTitle>
                        </CardHeader>
                        <div className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Store</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userOrders.length > 0 ? userOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-slate-50">
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{order.storeName}</TableCell>
                                            <TableCell>₹{order.amount}</TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "capitalize",
                                                    order.status === 'delivered' ? 'bg-[#2BD67C] hover:bg-[#2BD67C]/90 text-black' :
                                                        order.status === 'cancelled' ? 'bg-[#FBC02D] hover:bg-[#FBC02D]/90 text-black' :
                                                            'bg-blue-500'
                                                )}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No orders found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                {/* 2. Saved Addresses */}
                <TabsContent value="addresses">
                    <Card className="border-none shadow-none bg-transparent">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.savedAddresses.map((addr) => (
                                <div key={addr.id} className="bg-white p-6 rounded-lg border shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-slate-600" />
                                        </div>
                                        <span className="font-semibold capitalize">{addr.label}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 pl-10">{addr.address}</p>
                                </div>
                            ))}
                            {user.savedAddresses.length === 0 && (
                                <div className="col-span-2 text-center py-10 bg-white rounded-lg border border-dashed">
                                    <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-muted-foreground">No saved addresses.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                {/* 3. Payment History */}
                <TabsContent value="payments">
                    <Card>
                        <CardHeader className="px-6 py-4 border-b">
                            <CardTitle>Transactions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {paymentHistory.map((txn) => (
                                    <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("p-2 rounded-full", txn.type === 'credit' ? "bg-[#2BD67C]/10 text-green-700" : "bg-slate-100 text-slate-700")}>
                                                {txn.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="font-medium text-sm">{txn.description}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <span>{txn.date}</span>
                                                    <span>•</span>
                                                    <span>{txn.method}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cn("font-bold", txn.type === 'credit' ? "text-[#278F27]" : "text-black")}>
                                            {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
