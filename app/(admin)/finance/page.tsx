"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useMockData } from "@/contexts/MockDataContext"
import { Wallet, ArrowUpRight, ArrowDownLeft, FileText, Calculator, Landmark, History } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function FinancePage() {
    const { settlements, taxRecords, walletTransactions, isLoading } = useMockData()
    const router = useRouter()

    if (isLoading) return <div className="p-8 text-center">Loading Data...</div>

    // --- KPI Calculations ---

    // 1. Net Revenue (Platform Earnings)
    // In a real app, this would be sum of Commissions - Adjustments. 
    // For mock, we'll sum WalletTransactions of type 'commission'.
    const platformRevenue = walletTransactions
        .filter(t => t.category === 'commission')
        .reduce((sum, t) => sum + t.amount, 0)

    // 2. Pending Settlements (Gross Liability to Partners)
    const pendingSettlementsCount = settlements.filter(s => s.status === 'pending').length
    const pendingSettlementsValue = settlements
        .filter(s => s.status === 'pending')
        .reduce((sum, s) => sum + s.netAmount, 0)

    // 3. Tax Liability (GST + TDS collected but not paid)
    const pendingTax = taxRecords
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0)

    // 4. Wallet Volume (Total money moved)
    const totalVolume = walletTransactions
        .reduce((sum, t) => sum + t.amount, 0)

    // Recent Transactions
    const recentActivity = [...walletTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance Dashboard</h1>
                <p className="text-slate-500">
                    High-level financial KPIs, settlement status, and tax liabilities.
                </p>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Net Revenue</CardTitle>
                        <BarChartIcon className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹{platformRevenue.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">Total commissions earned</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200" role="button" onClick={() => router.push('/finance/settlements')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pending Settlements</CardTitle>
                        <Calculator className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹{pendingSettlementsValue.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Across <span className="font-medium text-slate-900">{pendingSettlementsCount}</span> pending runs
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200" role="button" onClick={() => router.push('/finance/taxes')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Tax Liability</CardTitle>
                        <Landmark className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹{pendingTax.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">Unpaid GST & TDS</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200" role="button" onClick={() => router.push('/finance/wallets')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Wallet Volume</CardTitle>
                        <Wallet className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹{totalVolume.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">Total credit/debit flow</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 md:grid-cols-7">
                <Card className="md:col-span-4 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Recent Wallet Activity</CardTitle>
                        <CardDescription>Latest credits and debits across all entity wallets.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">No recent transactions</div>
                            ) : (
                                recentActivity.map((txn) => (
                                    <div key={txn.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {txn.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 capitalize">{txn.category.replace('_', ' ')}</p>
                                                <p className="text-xs text-slate-500 font-mono">{txn.walletId}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-sm ${txn.type === 'credit' ? 'text-green-700' : 'text-slate-900'}`}>
                                                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {format(new Date(txn.date), 'dd MMM HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Tips */}
                <div className="md:col-span-3 space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <button
                                onClick={() => router.push('/finance/settlements')}
                                className="w-full flex items-center justify-between p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                            >
                                <span className="text-sm font-medium text-slate-700">Run Settlements</span>
                                <ArrowUpRight className="h-4 w-4 text-slate-400" />
                            </button>
                            <button
                                onClick={() => router.push('/finance/taxes')}
                                className="w-full flex items-center justify-between p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                            >
                                <span className="text-sm font-medium text-slate-700">Download Tax Reports</span>
                                <ArrowUpRight className="h-4 w-4 text-slate-400" />
                            </button>
                        </CardContent>
                    </Card>

                    <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
                        <h4 className="font-semibold text-sky-800 text-sm mb-1 flex items-center">
                            <History className="h-3 w-3 mr-1.5" />
                            Next Auto-Settlement
                        </h4>
                        <p className="text-xs text-sky-600">
                            Scheduled for <strong>Monday, 10:00 AM</strong>. Ensure all adjustments are logged before then.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BarChartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="20" y2="10" />
            <line x1="18" x2="18" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="16" />
        </svg>
    )
}
