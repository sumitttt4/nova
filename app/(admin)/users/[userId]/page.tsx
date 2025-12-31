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
    Ban,
    ShieldAlert,
    Smartphone,
    MapPin,
    Wallet,
    ShoppingBag,
    ArrowDownLeft,
    ChevronLeft,
    CreditCard
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function UserDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { users, orders, updateUserStatus } = useMockData()

    // Find User
    const user = users.find(u => u.id === params?.userId || (params?.userId && u.id.toLowerCase() === (params.userId as string).toLowerCase())) || users[0]

    if (!user) {
        return <div className="p-10 text-center text-muted-foreground">User not found</div>
    }

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
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">{user.id}</span>
                            <span>•</span>
                            <span>Joined {format(new Date(user.joinedAt), "PPP")}</span>
                            <span>•</span>
                            <Badge className={cn(
                                "capitalize shadow-none",
                                user.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                    user.status === 'warned' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                                        'bg-red-100 text-red-700 hover:bg-red-100'
                            )}>
                                {user.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
                        onClick={() => {
                            if (confirm(`Are you sure you want to warn ${user.name}?`)) {
                                updateUserStatus(user.id, 'warned')
                            }
                        }}
                        disabled={user.status === 'warned' || user.status === 'banned'}
                    >
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        {user.status === 'warned' ? 'Already Warned' : 'Warn User'}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (confirm(`Are you sure you want to ban ${user.name}? This action cannot be easily undone.`)) {
                                updateUserStatus(user.id, 'banned')
                            }
                        }}
                        disabled={user.status === 'banned'}
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        {user.status === 'banned' ? 'Already Banned' : 'Ban User'}
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-sm">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Device & App</CardTitle>
                        <Smartphone className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{user.platform}</div>
                        <p className="text-sm text-muted-foreground mt-1">Version: {user.deviceVersion}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{user.walletBalance.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground mt-1">Credits Available</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userOrders.length}</div>
                        <p className="text-sm text-muted-foreground mt-1">Lifetime</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="orders" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="orders">Order History</TabsTrigger>
                    <TabsTrigger value="addresses">Saved Addresses</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>

                {/* 1. Order History */}
                <TabsContent value="orders" className="mt-6">
                    <Card className="shadow-sm border-none md:border">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="w-[120px]">Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Store</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right pr-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {userOrders.length > 0 ? userOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-slate-50/80">
                                            <TableCell className="font-mono text-xs font-medium text-slate-600">
                                                {order.id}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">
                                                {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-900">{order.storeName}</TableCell>
                                            <TableCell className="text-right font-bold text-slate-900">₹{order.amount}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge variant="secondary" className={cn(
                                                    "capitalize font-medium shadow-none",
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                                            'bg-slate-100 text-slate-700 hover:bg-slate-100'
                                                )}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                                No orders found for this user.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. Saved Addresses */}
                <TabsContent value="addresses" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.savedAddresses.map((addr) => (
                            <Card key={addr.id} className="shadow-sm hover:border-slate-300 transition-colors">
                                <CardContent className="p-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <MapPin className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold capitalize text-slate-900">{addr.label}</h4>
                                            <p className="text-xs text-slate-500">ID: {addr.id}</p>
                                        </div>
                                    </div>
                                    <div className="pl-[52px]">
                                        <p className="text-sm text-slate-600 leading-relaxed">{addr.address}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {user.savedAddresses.length === 0 && (
                            <div className="col-span-2 text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <MapPin className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium">No saved addresses found.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* 3. Payment History */}
                <TabsContent value="payments" className="mt-6">
                    <Card className="shadow-sm">
                        <CardHeader className="px-6 py-4 border-b bg-slate-50/50">
                            <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {paymentHistory.map((txn) => (
                                    <div key={txn.id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={cn("p-2.5 rounded-full shrink-0", txn.type === 'credit' ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-600")}>
                                                {txn.type === 'credit' ? <ArrowDownLeft className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="font-medium text-sm text-slate-900">{txn.description}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                                    <span>{format(new Date(txn.date), "MMM dd, p")}</span>
                                                    <span>•</span>
                                                    <span>{txn.method}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cn("font-bold text-sm", txn.type === 'credit' ? "text-green-600" : "text-slate-900")}>
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
