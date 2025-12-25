"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Wallet, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function WalletsPage() {
    const { walletTransactions, merchants, riders } = useMockData()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedWalletId, setSelectedWalletId] = React.useState<string | null>(null)

    // Derived Data
    const transactions = React.useMemo(() => {
        if (!selectedWalletId) return walletTransactions.slice(0, 50) // Show recent if none selected
        return walletTransactions
            .filter(t => t.walletId === selectedWalletId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [walletTransactions, selectedWalletId])

    const selectedEntity = React.useMemo(() => {
        if (!selectedWalletId) return null
        const m = merchants.find(m => m.id === selectedWalletId)
        if (m) return { name: m.storeName, type: 'Store', balance: m.walletBalance, id: m.id }

        const r = riders.find(r => r.id === selectedWalletId)
        if (r) return { name: r.name, type: 'Rider', balance: r.walletBalance || 0, id: r.id }

        return null
    }, [selectedWalletId, merchants, riders])

    // Search Results
    const searchResults = React.useMemo(() => {
        if (!searchTerm) return []
        const lowTerm = searchTerm.toLowerCase()
        const mResults = merchants.filter(m => m.storeName.toLowerCase().includes(lowTerm) || m.id.toLowerCase().includes(lowTerm))
        const rResults = riders.filter(r => r.name.toLowerCase().includes(lowTerm) || r.id.toLowerCase().includes(lowTerm))
        return [...mResults.map(m => ({ id: m.id, name: m.storeName, type: 'Store' })), ...rResults.map(r => ({ id: r.id, name: r.name, type: 'Rider' }))]
    }, [searchTerm, merchants, riders])

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Wallets & Ledgers</h1>
                    <p className="text-muted-foreground">
                        Inspect individual wallet balances and transaction histories.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Search Sidebar */}
                <Card className="lg:col-span-1 shadow-sm border-slate-200 h-fit">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Find Entity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search Name or ID..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {searchTerm && searchResults.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4">No results found.</p>
                            )}
                            {searchResults.map(result => (
                                <button
                                    key={result.id}
                                    onClick={() => setSelectedWalletId(result.id)}
                                    className={`w-full text-left p-2 rounded-md text-sm transition-colors ${selectedWalletId === result.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-slate-100 text-slate-700'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="truncate">{result.name}</span>
                                        <Badge variant="outline" className="text-[10px] h-5">{result.type}</Badge>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">{result.id}</span>
                                </button>
                            ))}
                            {!searchTerm && !selectedWalletId && (
                                <div className="text-xs text-muted-foreground text-center py-8">
                                    Search for a merchant or rider to view their ledger.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedEntity ? (
                        <>
                            {/* Entity Header */}
                            <Card className="bg-slate-900 text-white border-0 shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-slate-400 text-sm font-medium mb-1">Current Balance</p>
                                            <h2 className="text-3xl font-bold">₹{selectedEntity.balance?.toLocaleString()}</h2>
                                            <div className="flex items-center gap-2 mt-4">
                                                <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-0">{selectedEntity.type}</Badge>
                                                <span className="text-sm text-slate-400 font-mono">{selectedEntity.id}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">{selectedEntity.name}</p>
                                            <Button variant="outline" size="sm" className="mt-4 bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white gap-2">
                                                <ArrowLeftRight className="h-4 w-4" /> Adjust Balance
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ledger Table */}
                            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference ID</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    No transactions found for this wallet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map((txn) => (
                                                <TableRow key={txn.id}>
                                                    <TableCell className="font-mono text-xs text-slate-500">{txn.referenceId || '-'}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {txn.description}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="font-normal capitalize text-xs">
                                                            {txn.category.replace('_', ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-slate-500">
                                                        {format(new Date(txn.date), 'dd MMM yyyy, HH:mm')}
                                                    </TableCell>
                                                    <TableCell className={`text-right font-medium ${txn.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    ) : (
                        <Card className="border-dashed shadow-none bg-slate-50">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <Wallet className="h-10 w-10 text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900">Select a Wallet</h3>
                                <p className="text-sm text-slate-500 max-w-sm mt-2">
                                    Use the search bar on the left to find a Merchant or Rider wallet and view their detailed transaction history.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
