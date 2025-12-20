"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useMockData } from "@/contexts/MockDataContext"
import { Wallet, ArrowUpRight, ArrowDownLeft, FileText } from "lucide-react"
import { format } from "date-fns"

export default function FinancePage() {
    const { withdrawals } = useMockData()

    // Calculate Summary Metrics
    const totalPayouts = withdrawals
        .filter(w => w.status === 'paid')
        .reduce((sum, w) => sum + w.amount, 0)

    const pendingAmount = withdrawals
        .filter(w => w.status === 'processing')
        .reduce((sum, w) => sum + w.amount, 0)

    const pendingRequests = withdrawals.filter(w => w.status === 'processing').length

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance Overview</h1>
                <p className="text-slate-500">
                    Track platform revenue, merchant payouts, and withdrawal requests.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Payouts (YTD)</CardTitle>
                        <Wallet className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹{totalPayouts.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-600 font-medium">+12.5%</span>
                            <span className="ml-1">from last month</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pending Requests</CardTitle>
                        <FileText className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{pendingRequests}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Total value: <span className="font-semibold text-orange-600">₹{pendingAmount.toLocaleString()}</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Platform Revenue</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹1,24,500</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Current month earnings
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions List (Mini Version) */}
            <Card className="shadow-sm border-slate-100">
                <CardHeader>
                    <CardTitle>Recent Withdrawal Requests</CardTitle>
                    <CardDescription>Latest financial movements requiring attention.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {withdrawals.slice(0, 5).map(txn => (
                            <div key={txn.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm text-slate-900">{txn.storeName}</span>
                                    <span className="text-xs text-slate-500 font-mono">{txn.id} • {format(new Date(txn.requestDate), 'MMM dd')}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">₹{txn.amount.toLocaleString()}</div>
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${txn.status === 'paid' ? 'bg-green-100 text-green-700' :
                                        txn.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>{txn.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
