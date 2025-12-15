"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { DocViewer } from "@/components/ui/doc-viewer"
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertCircle,
    CheckCircle2,
    XCircle,
    UserCheck,
    Bike,
    MapPin,
    CreditCard,
    ShieldAlert,
    ScanFace,
    Shirt,
    Phone,
    User,
    ChevronRight
} from "lucide-react"

export default function RiderApprovalsPage() {
    const { riders, updateRiderStatus } = useMockData()
    const [selectedRider, setSelectedRider] = React.useState<string | null>(null)
    const [showRejectDialog, setShowRejectDialog] = React.useState(false)
    const [rejectionReasons, setRejectionReasons] = React.useState<string[]>([])

    // Safety Toggle
    const [faceMatchConfirmed, setFaceMatchConfirmed] = React.useState(false)

    // Filter for Under Review
    const pendingRiders = riders.filter(r => r.status === 'under_review')
    const activeRider = riders.find(r => r.id === selectedRider)

    const handleApprove = () => {
        if (!activeRider) return

        // Fee check
        if (activeRider.onboardingFee.status === 'unpaid') {
            const confirm = window.confirm("⚠️ Application Fee is UNPAID. Are you sure you want to approve this rider?")
            if (!confirm) return
        }

        updateRiderStatus(activeRider.id, 'active')
        setSelectedRider(null)
        setFaceMatchConfirmed(false)
    }

    const handleReject = () => {
        if (!activeRider) return
        updateRiderStatus(activeRider.id, 'rejected', rejectionReasons)
        setShowRejectDialog(false)
        setSelectedRider(null)
        setRejectionReasons([])
    }

    const toggleReason = (reason: string) => {
        setRejectionReasons(prev =>
            prev.includes(reason)
                ? prev.filter(r => r !== reason)
                : [...prev, reason]
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rider Verification Console</h1>
                    <p className="text-slate-500 mt-1">Review e-KYC anomalies and approve rider applications.</p>
                </div>
                <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl border border-orange-100/50 shadow-sm flex items-center gap-2 text-sm font-bold">
                    <UserCheck className="h-4 w-4" />
                    Pending: {pendingRiders.length}
                </div>
            </div>

            <Card className="shadow-sm border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[120px]">Rider ID</TableHead>
                            <TableHead>Profile</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingRiders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-slate-500">
                                    All caught up! No active applications.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pendingRiders.map((rider) => (
                                <TableRow key={rider.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-mono text-xs font-medium text-slate-500">
                                        {rider.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                                <User size={16} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 text-sm">{rider.name}</span>
                                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                                    <Phone size={10} /> {rider.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="gap-1.5 font-medium">
                                            <Bike size={12} />
                                            {rider.vehicleType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-medium text-slate-600 max-w-[200px] truncate">
                                        {rider.location.address}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200 shadow-none">
                                            Under Review
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Sheet open={selectedRider === rider.id} onOpenChange={(open) => {
                                            if (!open) setSelectedRider(null)
                                            else setSelectedRider(rider.id)
                                        }}>
                                            <SheetTrigger asChild>
                                                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-8 px-4">
                                                    Verify Now
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent className="w-[600px] sm:w-[840px] overflow-y-auto bg-slate-50/50 p-0 border-l border-slate-200">
                                                {activeRider && (
                                                    <RiderVerificationContent
                                                        rider={activeRider}
                                                        onApprove={handleApprove}
                                                        onReject={() => setShowRejectDialog(true)}
                                                        faceMatchConfirmed={faceMatchConfirmed}
                                                        setFaceMatchConfirmed={setFaceMatchConfirmed}
                                                    />
                                                )}
                                            </SheetContent>
                                        </Sheet>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Rejection Dialog for Current Selection */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Select valid reasons for rejection. This will be sent to the rider.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        {['Face Mismatch', 'Unpaid Onboarding Fee', 'Fuzzy Documents', 'Address Mismatch', 'Underage Applicant'].map((reason) => (
                            <div
                                key={reason}
                                onClick={() => toggleReason(reason)}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                    ${rejectionReasons.includes(reason)
                                        ? 'bg-red-50 border-red-200 text-red-700'
                                        : 'bg-white border-gray-100 hover:border-red-100 hover:bg-red-50/50'}
                                `}
                            >
                                <div className={`
                                    h-4 w-4 rounded border flex items-center justify-center
                                    ${rejectionReasons.includes(reason) ? 'bg-red-500 border-red-500' : 'border-gray-300'}
                                `}>
                                    {rejectionReasons.includes(reason) && <CheckCircle2 size={10} className="text-white" />}
                                </div>
                                <span className="text-sm font-medium">{reason}</span>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            disabled={rejectionReasons.length === 0}
                            onClick={handleReject}
                        >
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function RiderVerificationContent({ rider, onApprove, onReject, faceMatchConfirmed, setFaceMatchConfirmed }: any) {
    const isFeePaid = rider.onboardingFee.status === 'paid'

    // Helper for KV pairs
    const InfoRow = ({ label, val1, val2, warning }: any) => {
        const isMatch = val1?.toLowerCase() === val2?.toLowerCase()
        return (
            <div className="grid grid-cols-5 gap-4 text-sm py-2 border-b border-dashed border-gray-100 last:border-0 items-center">
                <span className="col-span-1 text-slate-500 font-medium">{label}</span>
                <span className="col-span-2 text-slate-900 font-semibold truncate">{val1}</span>
                <span className={`col-span-2 font-mono flex items-center justify-between ${isMatch ? 'text-green-600' : 'text-amber-600'}`}>
                    {val2}
                    {isMatch ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                </span>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-[#F8FAFC]">
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{rider.name}</h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <MapPin size={14} className="text-[#2BD67C]" />
                            {rider.location.address}
                        </div>
                    </div>
                    <a
                        href={`https://www.google.com/maps?q=${rider.location.lat},${rider.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
                    >
                        View Map <ChevronRight size={12} />
                    </a>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Block B: e-KYC Match */}
                <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="text-blue-600 h-5 w-5" />
                        <h3 className="font-bold text-slate-900">e-KYC Cross Check</h3>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-5 gap-4 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <span className="col-span-1">Field</span>
                        <span className="col-span-2">User Submitted</span>
                        <span className="col-span-2">Aadhar API Fetch</span>
                    </div>
                    <InfoRow
                        label="Full Name"
                        val1={rider.ekyc.userSubmitted.name}
                        val2={rider.ekyc.apiFetched.name}
                    />
                    <InfoRow
                        label="Father's Name"
                        val1={rider.ekyc.userSubmitted.fatherName}
                        val2={rider.ekyc.apiFetched.fatherName}
                    />
                    <InfoRow
                        label="DOB"
                        val1={rider.ekyc.userSubmitted.dob}
                        val2={rider.ekyc.apiFetched.dob}
                    />
                    <InfoRow
                        label="Address"
                        val1={rider.ekyc.userSubmitted.address}
                        val2={rider.ekyc.apiFetched.address}
                    />
                </div>

                {/* Block C: Identity Check */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <ScanFace className="text-purple-600 h-5 w-5" />
                        <h3 className="font-bold text-slate-900">Identity Verification</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase">Aadhar Card Photo</p>
                            <DocViewer
                                url={rider.ekyc.documents.aadharFront || `https://api.dicebear.com/7.x/initials/svg?seed=${rider.name}`} // Fallback for demo
                                type="image"
                                alt="Aadhar Card"
                                aspectRatio="video"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase">Live Selfie</p>
                            <div className="relative">
                                <DocViewer
                                    url={rider.ekyc.documents.selfie || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rider.name}`}
                                    type="image"
                                    alt="Rider Selfie"
                                    aspectRatio="square"
                                />
                                <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 pointer-events-none">Geotagged</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <div
                            className={`
                                w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-colors
                                ${faceMatchConfirmed ? 'bg-purple-600 border-purple-600' : 'bg-white border-purple-300'}
                            `}
                            onClick={() => setFaceMatchConfirmed(!faceMatchConfirmed)}
                        >
                            {faceMatchConfirmed && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium text-purple-900">I confirm that the Live Selfie matches the ID Proof photo.</span>
                    </div>
                </div>

                {/* Block D: Logistics */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Bike className="text-orange-600 h-5 w-5" />
                        <h3 className="font-bold text-slate-900">Logistics & Fees</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm"><Shirt size={16} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Gear Size</p>
                                    <p className="font-bold text-slate-900">{rider.logistics.tShirtSize}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm"><CreditCard size={16} /></div>
                                <div>
                                    <p className="text-xs text-slate-500">Onboarding Fee</p>
                                    <p className="font-bold text-slate-900">₹{rider.onboardingFee.amount}</p>
                                </div>
                            </div>
                            {isFeePaid ? (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">PAID</Badge>
                            ) : (
                                <Badge variant="destructive" className="animate-pulse">PENDING</Badge>
                            )}
                        </div>
                    </div>
                    {!isFeePaid && (
                        <div className="mt-3 text-xs text-red-600 font-medium flex items-center gap-1.5">
                            <AlertCircle size={12} />
                            Rider cannot start trips until fee is cleared. Warning will be shown on approval.
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white border-t border-gray-200 flex items-center justify-between sticky bottom-0 z-10">
                <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 w-[140px]" onClick={onReject}>
                    Reject Application
                </Button>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">
                        {!faceMatchConfirmed ? "Confirm face match to enable →" : "All checks passed"}
                    </span>
                    <Button
                        className="bg-[#2BD67C] hover:bg-[#25B869] text-white px-8 font-bold shadow-lg shadow-[#2BD67C]/20"
                        disabled={!faceMatchConfirmed}
                        onClick={onApprove}
                    >
                        Approve Rider
                    </Button>
                </div>
            </div>
        </div>
    )
}
