"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Store, MapPin, Phone, Mail, Package, ShoppingBag, Settings, BarChart3 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { CatalogTab } from "@/components/merchants/tabs/CatalogTab"

export default function MerchantDashboardPage() {
    const params = useParams()
    const router = useRouter()
    const { merchants } = useMockData()
    const merchantId = params?.merchantId as string

    const merchant = merchants.find(m => m.id === merchantId)

    if (!merchant) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-xl font-semibold">Store not found</h2>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="ghost"
                    className="w-fit -ml-2 text-slate-500 hover:text-slate-900"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Merchants
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 shadow-sm">
                            <Store className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{merchant.storeName}</h1>
                            <div className="flex items-center gap-3 text-slate-500 mt-1">
                                <span className="flex items-center gap-1 text-sm">
                                    <MapPin className="h-3.5 w-3.5" /> {merchant.location}
                                </span>
                                <Separator orientation="vertical" className="h-4" />
                                <Badge variant="outline" className="text-xs font-normal">
                                    {merchant.storeType}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Badge
                            className={
                                merchant.status === "approved"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100 text-sm px-3 py-1"
                                    : "bg-orange-100 text-orange-700 hover:bg-orange-100 text-sm px-3 py-1"
                            }
                        >
                            {merchant.status === "approved" ? "● Live Store" : "● Under Maintenance"}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white border text-slate-500 h-12 p-1 w-full sm:w-auto overflow-x-auto justify-start">
                    <TabsTrigger value="overview" className="h-full px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                        <BarChart3 className="mr-2 h-4 w-4" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="catalog" className="h-full px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                        <Package className="mr-2 h-4 w-4" /> Catalog
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="h-full px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                        <ShoppingBag className="mr-2 h-4 w-4" /> Orders
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="h-full px-6 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Contact Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Contact Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{merchant.personal?.phone || "N/A"}</p>
                                        <p className="text-xs text-slate-500">Primary Contact</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{merchant.personal?.email || "N/A"}</p>
                                        <p className="text-xs text-slate-500">Email Address</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">4.8</h3>
                                    <p className="text-xs text-slate-500">Average Rating</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">12 mins</h3>
                                    <p className="text-xs text-slate-500">Avg. Prep Time</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">85%</h3>
                                    <p className="text-xs text-slate-500">Order Acceptance</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">0.5%</h3>
                                    <p className="text-xs text-slate-500">Cancellation Rate</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* CATALOG TAB */}
                <TabsContent value="catalog">
                    <CatalogTab merchant={merchant} />
                </TabsContent>

                {/* ORDERS TAB (Placeholder) */}
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>View and manage live orders for this store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-slate-400">No active orders found.</div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SETTINGS TAB (Placeholder) */}
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Configuration</CardTitle>
                            <CardDescription>Manage operating hours, delivery radius, and notifications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-slate-400">Settings panel coming soon.</div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
