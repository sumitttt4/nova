"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AlertTriangle,
    PackageX,
    Wallet,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MerchantInsights() {
    const { merchants, payouts } = useMockData()

    // Calculate insights
    const criticalMerchants = merchants.filter(
        m => m.catalogStatus?.essentialOutOfStock || (m.catalogStatus?.outOfStock || 0) > 0
    )

    const pendingPayouts = payouts.filter(p => p.status === 'pending')
    const processedPayouts = payouts.filter(p => p.status === 'processed')
    const failedPayouts = payouts.filter(p => p.status === 'failed')

    const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)
    const totalProcessedAmount = processedPayouts.reduce((sum, p) => sum + p.amount, 0)

    return (
        <Card className="border-slate-200 shadow-sm">
            <Tabs defaultValue="stock" className="w-full">
                <CardHeader className="pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-900">Merchant Insights</CardTitle>
                            <CardDescription>Real-time health and financial overview</CardDescription>
                        </div>
                        <TabsList className="grid w-full sm:w-auto grid-cols-2 h-9">
                            <TabsTrigger value="stock" className="text-xs gap-1.5 px-3">
                                <PackageX className="h-3.5 w-3.5" />
                                Stock Health
                            </TabsTrigger>
                            <TabsTrigger value="payouts" className="text-xs gap-1.5 px-3">
                                <Wallet className="h-3.5 w-3.5" />
                                Payouts
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    {/* Stock Health Tab */}
                    <TabsContent value="stock" className="mt-0 space-y-4">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                                <div className="text-2xl font-bold text-red-600">{criticalMerchants.length}</div>
                                <div className="text-[10px] text-red-600/70 font-medium uppercase tracking-wide">Critical</div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                                <div className="text-2xl font-bold text-amber-600">
                                    {criticalMerchants.filter(m => m.catalogStatus?.essentialOutOfStock).length}
                                </div>
                                <div className="text-[10px] text-amber-600/70 font-medium uppercase tracking-wide">Essentials OOS</div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                                <div className="text-2xl font-bold text-green-600">
                                    {merchants.length - criticalMerchants.length}
                                </div>
                                <div className="text-[10px] text-green-600/70 font-medium uppercase tracking-wide">Healthy</div>
                            </div>
                        </div>

                        {/* Critical List */}
                        <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
                            {criticalMerchants.length === 0 ? (
                                <div className="text-sm text-slate-500 py-8 text-center">
                                    <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-2" />
                                    All systems operational
                                </div>
                            ) : (
                                criticalMerchants.slice(0, 5).map(merchant => (
                                    <div key={merchant.id} className="flex items-center justify-between py-3 group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {merchant.storeName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-slate-900 group-hover:text-[#2BD67C] transition-colors">
                                                    {merchant.storeName}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {merchant.catalogStatus?.outOfStock} items out of stock
                                                </div>
                                            </div>
                                        </div>
                                        {merchant.catalogStatus?.essentialOutOfStock && (
                                            <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] h-6 gap-1">
                                                <AlertTriangle className="h-3 w-3" />
                                                Critical
                                            </Badge>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {criticalMerchants.length > 5 && (
                            <Link href="/stores" className="block">
                                <Button variant="ghost" className="w-full h-8 text-xs text-slate-500 hover:text-[#2BD67C]">
                                    View all {criticalMerchants.length} alerts
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                            </Link>
                        )}
                    </TabsContent>

                    {/* Payouts Tab */}
                    <TabsContent value="payouts" className="mt-0 space-y-4">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                                <div className="text-xl font-bold text-amber-600">₹{(totalPendingAmount / 1000).toFixed(0)}K</div>
                                <div className="text-[10px] text-amber-600/70 font-medium uppercase tracking-wide">Pending</div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                                <div className="text-xl font-bold text-green-600">₹{(totalProcessedAmount / 1000).toFixed(0)}K</div>
                                <div className="text-[10px] text-green-600/70 font-medium uppercase tracking-wide">Processed</div>
                            </div>
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                                <div className="text-xl font-bold text-red-600">{failedPayouts.length}</div>
                                <div className="text-[10px] text-red-600/70 font-medium uppercase tracking-wide">Failed</div>
                            </div>
                        </div>

                        {/* Recent Payouts List */}
                        <div className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
                            {payouts.slice(0, 6).map(payout => (
                                <div key={payout.id} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${payout.status === 'processed' ? 'bg-green-100' :
                                                payout.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'
                                            }`}>
                                            {payout.status === 'processed' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                                            {payout.status === 'pending' && <Clock className="h-4 w-4 text-amber-600" />}
                                            {payout.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-600" />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm text-slate-900">{payout.merchantName}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{payout.transactionId}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm text-slate-900">₹{payout.amount.toLocaleString('en-IN')}</div>
                                        <div className="text-[10px] text-slate-400">{new Date(payout.date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/finance/payouts" className="block">
                            <Button variant="ghost" className="w-full h-8 text-xs text-slate-500 hover:text-[#2BD67C]">
                                View all payouts
                                <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                        </Link>
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    )
}
