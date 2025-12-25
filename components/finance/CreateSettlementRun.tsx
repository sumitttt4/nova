"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Calculator, CheckCircle2 } from "lucide-react"

export function CreateSettlementRun() {
    const { createSettlement, merchants, riders } = useMockData()
    const [type, setType] = React.useState<"store" | "rider">("store")
    const [recipient, setRecipient] = React.useState("")
    const [amount, setAmount] = React.useState(0)
    const [isSuccess, setIsSuccess] = React.useState(false)

    // Simplified list for mock purposes (take top 5)
    const activeMerchants = merchants.slice(0, 5)
    const activeRiders = riders.slice(0, 5)

    const handleCalculate = () => {
        // Mock Calculation Logic
        const gross = Math.floor(Math.random() * 50000) + 5000
        const comm = Math.floor(gross * 0.15) // 15% commission
        const tax = Math.floor(gross * 0.05)   // 5% tax
        const net = gross - comm - tax

        createSettlement({
            recipientId: recipient,
            recipientName: type === 'store'
                ? activeMerchants.find(m => m.id === recipient)?.storeName || 'Unknown Store'
                : activeRiders.find(r => r.id === recipient)?.name || 'Unknown Rider',
            type: type,
            breakdown: {
                grossAmount: gross,
                commission: comm,
                tax: tax,
                adjustments: 0
            },
            netAmount: net,
            status: 'processed',
            transactionReference: `TXN_MOCK_${Math.floor(Math.random() * 99999)}`
        })

        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Run Manual Settlement</CardTitle>
                <CardDescription>Calculate and generate a settlement record for a partner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(v: "store" | "rider") => setType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="store">Merchant Store</SelectItem>
                                <SelectItem value="rider">Delivery Partner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Select Recipient</Label>
                        <Select value={recipient} onValueChange={setRecipient}>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select ${type === 'store' ? 'Store' : 'Rider'}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {type === 'store' ? (
                                    activeMerchants.map(m => (
                                        <SelectItem key={m.id} value={m.id}>{m.storeName}</SelectItem>
                                    ))
                                ) : (
                                    activeRiders.map(r => (
                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="flex gap-2">
                        <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground">
                            <CalendarIcon className="mr-2 h-4 w-4" /> Last 7 Days
                        </Button>
                    </div>
                </div>

                {isSuccess && (
                    <div className="bg-green-50 text-green-600 p-3 rounded flex items-center gap-2 text-sm animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4" /> Settlement Created Successfully!
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full bg-[#2BD67C] hover:bg-[#2BD67C]/90 text-black font-bold"
                    onClick={handleCalculate}
                    disabled={!recipient}
                >
                    <Calculator className="mr-2 h-4 w-4" /> Calculate & Settle
                </Button>
            </CardFooter>
        </Card>
    )
}
