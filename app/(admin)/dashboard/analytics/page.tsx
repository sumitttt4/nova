"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Download,
    Calendar as CalendarIcon,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Users,
    CreditCard,
    Activity
} from "lucide-react"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"

const revenueData = [
    { date: "Oct 01", revenue: 2400, orders: 120 },
    { date: "Oct 02", revenue: 1398, orders: 98 },
    { date: "Oct 03", revenue: 9800, orders: 340 },
    { date: "Oct 04", revenue: 3908, orders: 156 },
    { date: "Oct 05", revenue: 4800, orders: 190 },
    { date: "Oct 06", revenue: 3800, orders: 175 },
    { date: "Oct 07", revenue: 4300, orders: 182 },
    { date: "Oct 08", revenue: 5400, orders: 210 },
    { date: "Oct 09", revenue: 4900, orders: 195 },
    { date: "Oct 10", revenue: 6500, orders: 245 },
]

const categoryData = [
    { name: "Food Delivery", value: 55, color: "#ef4444" }, // Red-500
    { name: "Grocery", value: 25, color: "#f97316" },      // Orange-500
    { name: "Pharmacy", value: 15, color: "#3b82f6" },     // Blue-500
    { name: "Parcel", value: 5, color: "#10b981" },        // Emerald-500
]

const topStores = [
    { name: "Burger King (MG Road)", orders: 1245, revenue: "₹4,50,000", growth: "+12%" },
    { name: "Relax Medicals", orders: 850, revenue: "₹2,10,500", growth: "+8%" },
    { name: "Fresh Mart", orders: 620, revenue: "₹3,20,000", growth: "+15%" },
    { name: "Pizza Hut (Indiranagar)", orders: 580, revenue: "₹2,80,000", growth: "-2%" },
    { name: "Apollo Pharmacy", orders: 450, revenue: "₹1,50,000", growth: "+5%" },
]

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold tracking-tight">Analytics Reports</h2>
                    <p className="text-muted-foreground">
                        Detailed insights into your business performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select defaultValue="7d">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 3 Months</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Key Metric Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹4,23,050</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12,234</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                            -4.5% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹450</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            +7% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue & Order Overview</CardTitle>
                        <CardDescription>
                            Comparing revenue vs order count trends.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    yAxisId="left"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Revenue" />
                                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#16a34a" strokeWidth={2} dot={false} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Categories Pie Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>
                            Distribution of orders across verticals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performing Stores */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Stores</CardTitle>
                        <CardDescription>
                            Highest revenue generating partners this month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topStores.map((store, i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background font-bold text-sm">
                                            {i + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{store.name}</p>
                                            <p className="text-xs text-muted-foreground">{store.orders} Orders</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-right">
                                        <div className={store.growth.startsWith("+") ? "text-green-600" : "text-red-600"}>
                                            <span className="text-xs font-medium">{store.growth}</span>
                                        </div>
                                        <div className="w-[100px] font-semibold">
                                            {store.revenue}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
