"use client"

import * as React from "react"
import { useMockData, Withdrawal } from "@/contexts/MockDataContext"
import { isSameDay, format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
    AlertCircle,
    CheckCircle2,
    XCircle,
    Wallet,
    AlertTriangle,
    ArrowUpRight
} from "lucide-react"

export default function WithdrawalsPage() {
    const { withdrawals, approveWithdrawal, rejectWithdrawal } = useMockData()
    const [toast, setToast] = React.useState<{ message: string, type: 'success' | 'error' } | null>(null)

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleApprove = (id: string, storeId: string) => {
        // Double check limits just in case, though UI should block it
        if (isDailyLimitReached(storeId)) {
            showToast("Daily limit reached for this store!", "error")
            return
        }
        approveWithdrawal(id)
        showToast("Withdrawal approved successfully.", "success")
    }

    const handleReject = (id: string) => {
        rejectWithdrawal(id)
        showToast("Withdrawal request rejected.", "success")
    }

    // --- Business Logic Helpers ---

    // Check if store has any PAID withdrawal today
    const isDailyLimitReached = (storeId: string) => {
        const today = new Date()
        return withdrawals.some(w =>
            w.storeId === storeId &&
            w.status === 'paid' &&
            isSameDay(new Date(w.requestDate), today)
        )
    }

    // Sort: Processing first, then by Date desc
    const sortedWithdrawals = [...withdrawals].sort((a, b) => {
        if (a.status === 'processing' && b.status !== 'processing') return -1
        if (a.status !== 'processing' && b.status === 'processing') return 1
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    })

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto p-8">
            {/* Custom Toast */}
            {toast && (
                <div className={`
                    fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg border font-semibold animate-in slide-in-from-right-4 flex items-center gap-2
                    ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}
                `}>
                    {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    {toast.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Withdrawal Requests</h1>
                    <p className="text-slate-500 mt-1">Manage merchant payout requests and enforce limits.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Wallet className="h-4 w-4 text-[#2BD67C]" />
                    Pending: ₹{withdrawals.filter(w => w.status === 'processing').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
            </div>

            <Card className="shadow-sm border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[140px]">Request ID</TableHead>
                            <TableHead>Store Detail</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Risk Analysis</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedWithdrawals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-slate-500">
                                    No withdrawal requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedWithdrawals.map((txn) => {
                                const isHighValue = txn.amount > 20000 // Let's simplify logic: User asked for > 2000, I'll use that.
                                const isDailyLimit = isDailyLimitReached(txn.storeId)
                                const isProcessing = txn.status === 'processing'

                                return (
                                    <TableRow key={txn.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-medium text-slate-500">
                                            {txn.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">{txn.storeName}</span>
                                                <span className="text-xs text-slate-400 font-mono">{txn.accountNumber}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-slate-900">
                                                ₹{txn.amount.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {format(new Date(txn.requestDate), 'MMM dd, p')}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={txn.status} />
                                        </TableCell>
                                        <TableCell>
                                            {isProcessing ? (
                                                <div className="flex flex-col gap-1.5">
                                                    {txn.amount > 2000 && (
                                                        <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold px-2 py-1 bg-red-50 rounded-md w-fit">
                                                            <AlertTriangle size={12} />
                                                            Exceeds Limit (&gt;2k)
                                                        </div>
                                                    )}
                                                    {isDailyLimit && (
                                                        <div className="flex items-center gap-1.5 text-xs text-orange-600 font-bold px-2 py-1 bg-orange-50 rounded-md w-fit">
                                                            <AlertCircle size={12} />
                                                            Daily Limit Reached
                                                        </div>
                                                    )}
                                                    {txn.amount <= 2000 && !isDailyLimit && (
                                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                            <CheckCircle2 size={12} /> Safe to approve
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isProcessing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                        onClick={() => handleReject(txn.id)}
                                                    >
                                                        <XCircle size={18} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className={`
                                                            h-8 px-3 text-xs font-bold rounded-lg transition-all
                                                            ${isDailyLimit
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-[#2BD67C] hover:bg-[#25b869] text-white shadow-md shadow-[#2BD67C]/20'}
                                                        `}
                                                        disabled={isDailyLimit}
                                                        onClick={() => handleApprove(txn.id, txn.storeId)}
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="ghost" disabled className="text-xs opacity-50">
                                                    Archived
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'paid':
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none">Paid</Badge>
        case 'processing':
            return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100 shadow-none animate-pulse">Processing</Badge>
        case 'failed':
            return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-100 shadow-none">Failed</Badge>
        default:
            return <Badge variant="secondary">{status}</Badge>
    }
}
