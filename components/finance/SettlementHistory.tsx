"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Settlement } from "@/contexts/MockDataContext"
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Download } from "lucide-react"
import { format } from "date-fns"

export function SettlementHistory() {
    const { settlements } = useMockData()

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
            <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Settlement History</h3>
                <p className="text-sm text-muted-foreground">Detailed breakdown of all generated settlements.</p>
            </div>
            {settlements.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                    No settlements generated yet.
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Settlement ID</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead className="text-right">Net Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settlements.map((settlement) => (
                            <TableRow key={settlement.id}>
                                <TableCell className="font-mono text-xs">{settlement.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{settlement.recipientName}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{settlement.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(settlement.periodStart), 'dd MMM')} - {format(new Date(settlement.periodEnd), 'dd MMM')}
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-700">
                                    ₹{settlement.netAmount.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={
                                        settlement.status === 'processed' ? 'bg-green-50 text-green-700 border-green-200' :
                                            settlement.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                'bg-red-50 text-red-700 border-red-200'
                                    }>
                                        {settlement.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <SettlementDetailsSheet settlement={settlement} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

function SettlementDetailsSheet({ settlement }: { settlement: Settlement }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" /> View
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader className="mb-6">
                    <SheetTitle>Settlement Details</SheetTitle>
                    <SheetDescription>
                        Breakdown for {settlement.id}
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[80vh] pr-4">
                    <div className="space-y-6">
                        {/* Header Box */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">Total Payable</p>
                                <p className="text-2xl font-bold text-slate-900">₹{settlement.netAmount.toLocaleString()}</p>
                            </div>
                            <Badge>{settlement.status}</Badge>
                        </div>

                        {/* Recipient Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-500">Recipient</p>
                                <p className="font-medium">{settlement.recipientName}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Type</p>
                                <p className="font-medium capitalize">{settlement.type}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Period Start</p>
                                <p className="font-medium">{format(new Date(settlement.periodStart), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Period End</p>
                                <p className="font-medium">{format(new Date(settlement.periodEnd), 'dd MMM yyyy')}</p>
                            </div>
                            {settlement.transactionReference && (
                                <div className="col-span-2">
                                    <p className="text-slate-500">Reference ID</p>
                                    <p className="font-mono text-xs bg-slate-100 p-1 rounded inline-block">
                                        {settlement.transactionReference}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-slate-100" />

                        {/* Financial Breakdown Table */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold">Financial Breakdown</h4>

                            <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200">
                                <span className="text-slate-600">Gross Sales / Earnings</span>
                                <span className="font-medium">₹{settlement.breakdown.grossAmount.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200 text-red-600">
                                <span>Platform Commission</span>
                                <span>- ₹{settlement.breakdown.commission.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200 text-red-600">
                                <span>Tax (TDS/GST)</span>
                                <span>- ₹{settlement.breakdown.tax.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-sm py-2 border-b border-dashed border-slate-200">
                                <span className="text-slate-600">Adjustments (Refunds/Bonus)</span>
                                <span className={settlement.breakdown.adjustments >= 0 ? "text-green-600" : "text-red-600"}>
                                    {settlement.breakdown.adjustments >= 0 ? '+' : ''} ₹{settlement.breakdown.adjustments.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between text-base font-bold pt-2 mt-2 bg-slate-50 p-3 rounded">
                                <span>Net Settlement Amount</span>
                                <span>₹{settlement.netAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button className="w-full gap-2" variant="outline">
                                <Download className="h-4 w-4" /> Download PDF Statement
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
