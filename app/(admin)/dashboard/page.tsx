"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts"

const kpiData = [
    { title: "Total Orders Today", value: "124", subtitle: "+12% from yesterday" },
    { title: "Delivered", value: "85", subtitle: "68% completion rate" },
    { title: "Preparing / Pending", value: "32", subtitle: "Current active queue" },
    { title: "Cancelled", value: "7", subtitle: "5.6% cancellation rate" },
    { title: "Active Riders", value: "42", subtitle: "85% utilization" },
    { title: "Revenue Today", value: "₹45,230", subtitle: "+8% from yesterday" },
]

const ordersTrendData = [
    { name: "Mon", orders: 95 },
    { name: "Tue", orders: 110 },
    { name: "Wed", orders: 105 },
    { name: "Thu", orders: 124 },
    { name: "Fri", orders: 145 },
    { name: "Sat", orders: 160 },
    { name: "Sun", orders: 135 },
]

const revenueTrendData = [
    { name: "Mon", revenue: 35000 },
    { name: "Tue", revenue: 42000 },
    { name: "Wed", revenue: 38000 },
    { name: "Thu", revenue: 45230 },
    { name: "Fri", revenue: 55000 },
    { name: "Sat", revenue: 62000 },
    { name: "Sun", revenue: 51000 },
]

const recentOrders = [
    { id: "ORD-7829", user: "Rahul Sharma", store: "Burger King", status: "Delivered", amount: "₹450.00" },
    { id: "ORD-7830", user: "Priya Singh", store: "Pizza Hut", status: "Preparing", amount: "₹1200.00" },
    { id: "ORD-7831", user: "Rohan Gupta", store: "Subway", status: "Pending", amount: "₹350.00" },
    { id: "ORD-7832", user: "Anjali Desai", store: "KFC", status: "Picked", amount: "₹850.00" },
    { id: "ORD-7833", user: "Arjun Reddy", store: "McDonalds", status: "Cancelled", amount: "₹250.00" },
]

const getStatusColor = (status: string) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-700 border-green-200"
        case "Preparing":
        case "Picked":
            return "bg-orange-100 text-orange-700 border-orange-200"
        case "Pending":
            return "bg-yellow-100 text-yellow-700 border-yellow-200"
        case "Cancelled":
            return "bg-red-100 text-red-700 border-red-200"
        default:
            return "bg-slate-100 text-slate-700 border-slate-200"
    }
}

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store performance and activity.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {kpiData.map((kpi, index) => (
                    <Card key={index} className="shadow-apple border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {kpi.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-bazu-dark">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-apple border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Orders Trend</CardTitle>
                        <p className="text-sm text-muted-foreground">Daily order volume for the last 7 days</p>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ordersTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="orders" fill="#2BD67C" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-apple border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Revenue Trend</CardTitle>
                        <p className="text-sm text-muted-foreground">Daily revenue for the last 7 days</p>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#278F27"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: "#278F27" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders Table */}
            <Card className="shadow-apple border-border/50">
                <CardHeader>
                    <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
                    <p className="text-sm text-muted-foreground">Latest 5 orders from all stores</p>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell>{order.user}</TableCell>
                                    <TableCell>{order.store}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`font-normal ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{order.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
