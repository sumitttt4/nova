"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, FileText, MapPin, Phone, Mail, User, Eye, CheckCircle2, XCircle, Clock, AlertTriangle, Bike, IdCard, Camera, CreditCard } from "lucide-react"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type DocStatus = 'pending' | 'verified' | 'rejected'

type DocState = {
    name: string
    status: DocStatus
    reason?: string
    mandatory: boolean
}

const RIDER_DOCUMENTS: Omit<DocState, 'status' | 'reason'>[] = [
    { name: 'Aadhar Front', mandatory: true },
    { name: 'Aadhar Back', mandatory: false },
    { name: 'PAN Card', mandatory: false },
    { name: 'Live Selfie', mandatory: true },
    { name: 'Driving License', mandatory: false },
]

export default function RiderKYCPage() {
    const { riders, updateRiderStatus } = useMockData()
    const [viewingDoc, setViewingDoc] = React.useState<{ riderId: string, docName: string } | null>(null)
    const [rejectReason, setRejectReason] = React.useState("")
    const [showRejectDialog, setShowRejectDialog] = React.useState(false)
    const [selectedRiderForReject, setSelectedRiderForReject] = React.useState<string | null>(null)
    const [finalRejectReason, setFinalRejectReason] = React.useState("")

    // Track document verification status per rider
    const [docStates, setDocStates] = React.useState<Record<string, DocState[]>>({})

    const pendingRiders = riders.filter(r => r.status === 'under_review')

    // Initialize document states for pending riders
    React.useEffect(() => {
        const initialStates: Record<string, DocState[]> = {}
        pendingRiders.forEach(r => {
            if (!docStates[r.id]) {
                initialStates[r.id] = RIDER_DOCUMENTS.map(doc => ({
                    ...doc,
                    status: 'pending' as DocStatus
                }))
            }
        })
        if (Object.keys(initialStates).length > 0) {
            setDocStates(prev => ({ ...prev, ...initialStates }))
        }
    }, [pendingRiders.length])

    const verifyDoc = (riderId: string, docName: string) => {
        setDocStates(prev => ({
            ...prev,
            [riderId]: prev[riderId]?.map(d =>
                d.name === docName ? { ...d, status: 'verified' as DocStatus, reason: undefined } : d
            ) || []
        }))
        setViewingDoc(null)
    }

    const rejectDoc = (riderId: string, docName: string) => {
        if (!rejectReason.trim()) return
        setDocStates(prev => ({
            ...prev,
            [riderId]: prev[riderId]?.map(d =>
                d.name === docName ? { ...d, status: 'rejected' as DocStatus, reason: rejectReason } : d
            ) || []
        }))
        setRejectReason("")
        setViewingDoc(null)
    }

    const getDocStatus = (riderId: string, docName: string): DocState | undefined => {
        return docStates[riderId]?.find(d => d.name === docName)
    }

    const allMandatoryDocsVerified = (riderId: string): boolean => {
        const docs = docStates[riderId]
        return docs?.filter(d => d.mandatory).every(d => d.status === 'verified') || false
    }

    const allDocsVerified = (riderId: string): boolean => {
        const docs = docStates[riderId]
        return docs?.every(d => d.status === 'verified') || false
    }

    const hasRejectedDocs = (riderId: string): boolean => {
        const docs = docStates[riderId]
        return docs?.some(d => d.status === 'rejected') || false
    }

    const getRejectedDocReasons = (riderId: string): string[] => {
        const docs = docStates[riderId]
        return docs?.filter(d => d.status === 'rejected' && d.reason).map(d => `${d.name}: ${d.reason}`) || []
    }

    const handleFinalApprove = (riderId: string) => {
        updateRiderStatus(riderId, 'active', [])
    }

    const handleFinalReject = () => {
        if (selectedRiderForReject) {
            const reasons = getRejectedDocReasons(selectedRiderForReject)
            if (finalRejectReason) reasons.push(finalRejectReason)
            updateRiderStatus(selectedRiderForReject, 'rejected', reasons)
            setSelectedRiderForReject(null)
            setShowRejectDialog(false)
            setFinalRejectReason("")
        }
    }

    const getStatusBadge = (status: DocStatus, reason?: string) => {
        switch (status) {
            case 'verified':
                return <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200 gap-1"><CheckCircle2 className="h-3 w-3" />Verified</Badge>
            case 'rejected':
                return (
                    <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 gap-1" title={reason}>
                        <XCircle className="h-3 w-3" />Rejected
                    </Badge>
                )
            default:
                return <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 gap-1"><Clock className="h-3 w-3" />Pending</Badge>
        }
    }

    const getDocIcon = (docName: string) => {
        switch (docName) {
            case 'Aadhar Front':
            case 'Aadhar Back':
                return IdCard
            case 'Live Selfie':
                return Camera
            case 'PAN Card':
                return CreditCard
            case 'Driving License':
                return FileText
            default:
                return FileText
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rider KYC Review</h1>
                    <p className="text-slate-500">Review and verify rider identity documents.</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 h-8 px-3">
                    {pendingRiders.length} Pending
                </Badge>
            </div>


            <div className="grid gap-4">
                {pendingRiders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <User className="h-10 w-10 text-slate-400 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No pending KYC requests</h3>
                        <p className="text-slate-500">All rider documents have been processed.</p>
                    </div>
                ) : (
                    pendingRiders.map((rider) => {
                        const allMandatory = allMandatoryDocsVerified(rider.id)
                        const allVerified = allDocsVerified(rider.id)
                        const hasRejected = hasRejectedDocs(rider.id)

                        return (
                            <Card key={rider.id} className={cn(
                                "overflow-hidden border-slate-200 shadow-sm transition-all",
                                allVerified && "border-l-4 border-l-green-500",
                                hasRejected && "border-l-4 border-l-red-500"
                            )}>
                                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center shadow-sm">
                                                <Bike className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    {rider.name}
                                                    <Badge variant="secondary" className="font-normal text-xs">{rider.vehicleType}</Badge>
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-4 mt-1">
                                                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {rider.phone}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {rider.location?.address || "N/A"}</span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                onClick={() => {
                                                    setSelectedRiderForReject(rider.id)
                                                    setShowRejectDialog(true)
                                                }}
                                            >
                                                <X className="h-4 w-4 mr-2" /> Reject
                                            </Button>
                                            <Button
                                                className={cn(
                                                    "shadow-sm",
                                                    allMandatory
                                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                                )}
                                                disabled={!allMandatory}
                                                onClick={() => handleFinalApprove(rider.id)}
                                            >
                                                <Check className="h-4 w-4 mr-2" /> Approve Rider
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                                        Documents <span className="text-slate-400 font-normal">(Click to review)</span>
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {RIDER_DOCUMENTS.map((doc) => {
                                            const docState = getDocStatus(rider.id, doc.name)
                                            const DocIcon = getDocIcon(doc.name)
                                            return (
                                                <div
                                                    key={doc.name}
                                                    className={cn(
                                                        "p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group min-h-[100px] relative",
                                                        docState?.status === 'verified' ? "border-green-200 bg-green-50/50" :
                                                            docState?.status === 'rejected' ? "border-red-200 bg-red-50/50" :
                                                                "border-slate-200 hover:bg-slate-50 hover:border-blue-200"
                                                    )}
                                                    onClick={() => setViewingDoc({ riderId: rider.id, docName: doc.name })}
                                                >
                                                    <DocIcon className={cn(
                                                        "h-6 w-6 transition-colors",
                                                        docState?.status === 'verified' ? "text-green-500" :
                                                            docState?.status === 'rejected' ? "text-red-500" :
                                                                "text-slate-400 group-hover:text-blue-500"
                                                    )} />
                                                    <span className="text-xs font-medium text-slate-700 text-center">{doc.name}</span>
                                                    {getStatusBadge(docState?.status || 'pending', docState?.reason)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>

            {/* Document Review Dialog */}
            <Dialog open={viewingDoc !== null} onOpenChange={(open) => !open && setViewingDoc(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Review: {viewingDoc?.docName}
                            {RIDER_DOCUMENTS.find(d => d.name === viewingDoc?.docName)?.mandatory && (
                                <Badge className="bg-red-100 text-red-700 border-red-200 ml-2">Mandatory</Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            Verify this document or reject with a reason.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Mock Document Preview */}
                    <div className="bg-slate-100 rounded-lg p-8 flex items-center justify-center min-h-[300px] border">
                        <div className="text-center">
                            {viewingDoc && React.createElement(getDocIcon(viewingDoc.docName), { className: "h-16 w-16 text-slate-300 mx-auto mb-4" })}
                            <p className="text-slate-500 text-sm">Document preview would appear here</p>
                            <p className="text-slate-400 text-xs mt-1">{viewingDoc?.docName}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Rejection Reason (required if rejecting)</Label>
                        <Textarea
                            placeholder="e.g. Document is blurry, Name doesn't match, Expired document..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setViewingDoc(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => viewingDoc && rejectDoc(viewingDoc.riderId, viewingDoc.docName)}
                            disabled={!rejectReason.trim()}
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Document
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => viewingDoc && verifyDoc(viewingDoc.riderId, viewingDoc.docName)}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Verify Document
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Final Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Rider Application</DialogTitle>
                        <DialogDescription>
                            Provide a final reason for rejecting this rider application.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRiderForReject && getRejectedDocReasons(selectedRiderForReject).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-red-700 mb-2">Rejected Documents:</p>
                            <ul className="text-sm text-red-600 space-y-1">
                                {getRejectedDocReasons(selectedRiderForReject).map((r, i) => (
                                    <li key={i}>• {r}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label>Additional Comments (optional)</Label>
                        <Textarea
                            placeholder="Any additional reason for rejection..."
                            value={finalRejectReason}
                            onChange={(e) => setFinalRejectReason(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleFinalReject}>
                            Confirm Rejection
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
