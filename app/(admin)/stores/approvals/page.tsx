"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Check, X, FileText, Store, AlertCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function StoreApprovalsPage() {
    const { merchants, updateMerchantStatus } = useMockData()
    const [rejectId, setRejectId] = React.useState<string | null>(null)
    const [rejectReason, setRejectReason] = React.useState("")

    // Filter merchants under review
    const pendingMerchants = merchants.filter(m => m.status === 'under_review')

    const handleApprove = (id: string) => {
        updateMerchantStatus(id, 'approved', [])
    }

    const handleReject = () => {
        if (rejectId && rejectReason) {
            updateMerchantStatus(rejectId, 'rejected', [rejectReason])
            setRejectId(null)
            setRejectReason("")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Store Approvals</h1>
                    <p className="text-muted-foreground">Review and approve new store listing requests.</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 h-8 px-3">
                    {pendingMerchants.length} Pending
                </Badge>
            </div>

            <div className="grid gap-4">
                {pendingMerchants.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 border-2 border-dashed">
                        <AlertCircle className="h-10 w-10 text-slate-300 mb-3" />
                        <h3 className="font-semibold text-slate-700">All caught up!</h3>
                        <p className="text-sm text-slate-500">No pending store approvals at the moment.</p>
                    </Card>
                ) : (
                    pendingMerchants.map((merchant) => (
                        <Card key={merchant.id} className="flex items-center justify-between p-4 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Store className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{merchant.storeName}</h3>
                                    <p className="text-sm text-slate-500">
                                        Submitted by {merchant.personal?.name || "Owner"} • {new Date(merchant.submittedAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2 mt-1">
                                        <Badge variant="secondary" className="text-[10px]">{merchant.storeType}</Badge>
                                        <Badge variant="outline" className="text-[10px]">{merchant.location}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Dialog open={rejectId === merchant.id} onOpenChange={(open) => !open && setRejectId(null)}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                                            onClick={() => setRejectId(merchant.id)}
                                        >
                                            <X className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reject Store Application</DialogTitle>
                                            <DialogDescription>
                                                Provide a reason for rejecting <strong>{merchant.storeName}</strong>.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="reason">Rejection Reason</Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder="e.g. Incomplete documentation, Invalid license..."
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setRejectId(null)}>Cancel</Button>
                                            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason}>
                                                Confirm Rejection
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    className="bg-[#2BD67C] hover:bg-[#25b869] text-white"
                                    onClick={() => handleApprove(merchant.id)}
                                >
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
