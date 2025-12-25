"use client"

import * as React from "react"
import { SettlementHistory } from "@/components/finance/SettlementHistory"
import { CreateSettlementRun } from "@/components/finance/CreateSettlementRun"
import { Info } from "lucide-react"

export default function SettlementsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Settlement Engine</h1>
                    <p className="text-muted-foreground">
                        Process payouts, calculate taxes, and generate financial records.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main History Table - Takes 2/3 width */}
                <div className="lg:col-span-2 space-y-4">
                    <SettlementHistory />
                </div>

                {/* Sidebar Actions - Takes 1/3 width */}
                <div className="space-y-6">
                    <CreateSettlementRun />

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                            <Info className="h-4 w-4" />
                            <span>Settlement Rules</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-blue-700/80">
                            <li>Commission is deducted automatically (15% Store, 20% Rider).</li>
                            <li>TDS (1%) is deducted for sums &gt; ₹5,000.</li>
                            <li>TCS (1%) is collected for GST liability.</li>
                            <li>Wallets are debited immediately upon processing.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
