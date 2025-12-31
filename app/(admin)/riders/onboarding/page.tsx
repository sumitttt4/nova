"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Bike, FileText, Check, X, AlertCircle, MapPin } from "lucide-react"
import Link from "next/link"
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

export default function RiderOnboardingPage() {
    const { riders, updateRiderStatus } = useMockData()
    const [rejectId, setRejectId] = React.useState<string | null>(null)
    const [rejectReason, setRejectReason] = React.useState("")

    // Filter pending riders
    const pendingRiders = riders.filter(r => r.status === 'under_review')

    const handleApprove = (id: string) => {
        updateRiderStatus(id, 'active', [])
    }

    const handleReject = () => {
        if (rejectId && rejectReason) {
            updateRiderStatus(rejectId, 'rejected', [rejectReason])
            setRejectId(null)
            setRejectReason("")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rider Applications</h1>
                    <p className="text-muted-foreground">Review documents and approve new delivery partners.</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 h-8 px-3">
                    {pendingRiders.length} Pending
                </Badge>
            </div>

            <div className="grid gap-4">
                {pendingRiders.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-12 border-2 border-dashed">
                        <AlertCircle className="h-10 w-10 text-slate-300 mb-3" />
                        <h3 className="font-semibold text-slate-700">All caught up!</h3>
                        <p className="text-sm text-slate-500">No pending rider applications at the moment.</p>
                        <Link href="/riders/approvals" className="mt-4">
                            <Button variant="outline" size="sm">Go to Approvals Page</Button>
                        </Link>
                    </Card>
                ) : (
                    pendingRiders.map((rider) => (
                        <Card key={rider.id} className="flex items-start justify-between p-5 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Bike className="h-7 w-7 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{rider.name}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {rider.location?.address || "Location not specified"}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline" className="bg-gray-50 flex items-center gap-1 text-xs">
                                            <FileText className="h-3 w-3" /> {rider.vehicleType}
                                        </Badge>
                                        <Badge variant="outline" className="bg-gray-50 flex items-center gap-1 text-xs">
                                            <FileText className="h-3 w-3" /> KYC: {rider.kycStatus}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    className="bg-[#278F27] hover:bg-[#278F27]/90 w-full text-white"
                                    onClick={() => handleApprove(rider.id)}
                                >
                                    <Check className="h-4 w-4 mr-2" /> Approve
                                </Button>
                                <Dialog open={rejectId === rider.id} onOpenChange={(open) => !open && setRejectId(null)}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="text-red-600 hover:bg-red-50 border-red-100 hover:border-red-200 w-full"
                                            onClick={() => setRejectId(rider.id)}
                                        >
                                            <X className="h-4 w-4 mr-2" /> Reject
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reject Application</DialogTitle>
                                            <DialogDescription>
                                                Provide a reason for rejecting <strong>{rider.name}</strong>.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="reason">Rejection Reason</Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder="e.g. Documents unclear, Failed background check..."
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
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
