"use client"

import * as React from "react"
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Card,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Eye,
    CheckCircle2,
    XCircle,
    MapPin,
    FileText,
    ExternalLink,
    AlertCircle,
    Check,
    Download,
} from "lucide-react"
import { useMockData, Merchant } from "@/contexts/MockDataContext"
import { Checkbox } from "@/components/ui/checkbox"
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// --- Static Rich Data for UI Demo (Images/Docs) ---
const RICH_DATA_STORE: Record<string, any> = {
    "MER-REQ-001": {
        locationDetails: {
            address: "123, 100ft Road, Indiranagar, Bangalore",
            pincode: "560038",
            lat: 12.9716,
            lng: 77.5946,
            storeFrontImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
        },
        documents: {
            pan: { number: "ABCDE1234F", url: "https://dummyimage.com/600x400/eee/aaa&text=PAN+Card" },
            gst: { number: "29ABCDE1234F1Z5", url: "https://dummyimage.com/600x400/eee/aaa&text=GST+Certificate" },
            fssai: { number: "12345678901234", expiry: "31/12/2025", url: "https://dummyimage.com/600x400/eee/aaa&text=FSSAI+License" },
            signature: { url: "https://dummyimage.com/400x200/eee/aaa&text=Signature" },
            contract: { url: "#" },
            authorizedPerson: { name: "Rajesh Kumar", url: "https://dummyimage.com/600x400/eee/aaa&text=ID+Proof" }
        }
    },
    "MER-REQ-002": {
        locationDetails: {
            address: "45, 5th Block, Koramangala, Bangalore",
            pincode: "560034",
            lat: 12.9352,
            lng: 77.6245,
            storeFrontImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
        },
        documents: {
            pan: { number: "FGHIJ5678K", url: "https://dummyimage.com/600x400/eee/aaa&text=PAN+Card" },
            gst: { number: "29FGHIJ5678K1Z5", url: "https://dummyimage.com/600x400/eee/aaa&text=GST+Certificate" },
            fssai: { number: "98765432109876", expiry: "15/10/2026", url: "https://dummyimage.com/600x400/eee/aaa&text=FSSAI+License" },
            signature: { url: "https://dummyimage.com/400x200/eee/aaa&text=Signature" },
            contract: { url: "#" },
            authorizedPerson: { name: "Suresh Reddy", url: "https://dummyimage.com/600x400/eee/aaa&text=ID+Proof" }
        }
    }
}

const REJECTION_REASONS = [
    "Invalid PAN card",
    "GST number mismatch",
    "FSSAI license expired",
    "Document photo unclear",
    "Other (specify)"
]

const logAction = (action: string, details: any) => {
    console.log(`[ADMIN_LOG] ${new Date().toISOString()} | Admin: ADMIN-001 | Action: ${action}`, details)
}

export default function MerchantApprovalsPage() {
    const { merchants, updateMerchantStatus } = useMockData()
    const [selectedApp, setSelectedApp] = React.useState<Merchant | null>(null)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [toast, setToast] = React.useState<{ message: string, type: 'success' | 'error' } | null>(null)

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])

    // Filter for Under Review Status
    const applications = merchants.filter(m => m.status === 'under_review')

    const handleView = (app: Merchant) => {
        // Enriched object for modal
        const richData = RICH_DATA_STORE[app.id]
        if (!richData) {
            console.warn("No rich data found for", app.id)
        }
        setSelectedApp({ ...app, ...richData })
        setIsSheetOpen(true)
    }

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    const handleApprove = (id: string) => {
        logAction("APPROVE_MERCHANT", { merchantId: id })
        updateMerchantStatus(id, 'approved')
        setIsSheetOpen(false)
        showToast("Merchant successfully approved!", "success")
    }

    const handleReject = (id: string, reasons: string[]) => {
        logAction("REJECT_MERCHANT", { merchantId: id, reasons })
        updateMerchantStatus(id, 'rejected', reasons)
        setIsSheetOpen(false)
        showToast("Merchant application rejected.", "error")
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(applications.map(app => app.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id])
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id))
        }
    }

    const handleBulkApprove = () => {
        if (confirm(`Are you sure you want to approve ${selectedIds.length} merchants?`)) {
            selectedIds.forEach(id => {
                logAction("BULK_APPROVE", { merchantId: id })
                updateMerchantStatus(id, 'approved')
            })
            setSelectedIds([])
            showToast(`${selectedIds.length} merchants approved successfully!`, "success")
        }
    }

    const handleExport = () => {
        const dataToExport = applications.map(app => ({
            "Store ID": app.id,
            "Store Name": app.storeName,
            "Owner Name": app.personal?.name || "N/A",
            "Phone": app.personal?.phone || "N/A",
            "Location": app.location,
            "Submitted At": app.submittedAt,
            "Status": app.status
        }))

        const ws = XLSX.utils.json_to_sheet(dataToExport)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Pending Merchants")
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' })
        saveAs(data, `merchant_approvals_${new Date().toISOString().split('T')[0]}.xlsx`)

        showToast("Export downloaded successfully!", "success")
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* ... Toast ... */}
            {toast && (
                <div className={`
                    fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg border font-semibold animate-in slide-in-from-right-4
                    ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}
                `}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Verification Workbench</h1>
                    <p className="text-muted-foreground">Review and approve new merchant onboarding requests.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" /> Export List
                    </Button>
                    <Badge variant="secondary" className="px-3 py-1">
                        Pending Reviews: {applications.length}
                    </Badge>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-800 px-3 py-1 rounded text-sm font-medium">
                            {selectedIds.length} Selected
                        </div>
                        <span className="text-sm text-slate-300">Merchants ready for action</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="bg-[#2BD67C] hover:bg-[#25b869] text-white"
                            onClick={handleBulkApprove}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve Selected
                        </Button>
                    </div>
                </div>
            )}

            <Card className="shadow-sm border-gray-100">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={applications.length > 0 && selectedIds.length === applications.length}
                                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                                />
                            </TableHead>
                            <TableHead className="w-[120px]">Store ID</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Store Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Submitted</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                        <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
                                        <p className="font-medium">All caught up!</p>
                                        <p className="text-xs">No pending approvals.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            applications.map((app) => (
                                <TableRow key={app.id} className={selectedIds.includes(app.id) ? "bg-slate-50" : ""}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(app.id)}
                                            onCheckedChange={(checked) => handleSelectOne(app.id, checked as boolean)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{app.id}</TableCell>
                                    <TableCell className="flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {app.location}
                                    </TableCell>
                                    <TableCell className="font-medium">{app.storeName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{app.storeType}</Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{app.submittedAt}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Under Review</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="secondary" onClick={() => handleView(app)}>
                                            <Eye className="h-3.5 w-3.5 mr-2" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Verification Modal/Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-3xl overflow-y-auto sm:p-0">
                    {selectedApp && (
                        <VerificationDrawerContent
                            app={selectedApp}
                            onClose={() => setIsSheetOpen(false)}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

function VerificationDrawerContent({ app, onClose, onApprove, onReject }: {
    app: Merchant | any, // Using any for enriched properties from RICH_DATA_STORE
    onClose: () => void,
    onApprove: (id: string) => void,
    onReject: (id: string, reasons: string[]) => void
}) {
    // Verification State
    const [docVerification, setDocVerification] = React.useState<Record<string, boolean>>({
        pan: false,
        gst: false,
        fssai: false,
        signature: false,
        contract: false,
        authPerson: false,
    })

    const [showRejectReason, setShowRejectReason] = React.useState(false)
    const [selectedReasons, setSelectedReasons] = React.useState<string[]>([])

    const toggleVerify = (key: string) => {
        setDocVerification(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const allVerified = Object.values(docVerification).every(v => v === true)

    const toggleRejectReason = (reason: string) => {
        setSelectedReasons(prev =>
            prev.includes(reason)
                ? prev.filter(r => r !== reason)
                : [...prev, reason]
        )
    }

    // Safely access rich data with fallbacks
    const docs = app.documents || {}
    const loc = app.locationDetails || {}
    const personal = app.personal || {}

    return (
        <div className="flex flex-col h-full bg-[#FAFAFA]">
            {/* Header */}
            <div className="p-6 border-b bg-white sticky top-0 z-10 shadow-sm flex items-center justify-between">
                <div>
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        {app.storeName}
                        <Badge variant="outline" className="font-normal text-xs">{app.id}</Badge>
                    </SheetTitle>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                        Verified: {Object.values(docVerification).filter(Boolean).length}/6
                    </span>
                    <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#2BD67C] transition-all duration-300"
                            style={{ width: `${(Object.values(docVerification).filter(Boolean).length / 6) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. Personal Info */}
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Personal Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div>
                            <Label className="text-xs text-slate-400">Full Name</Label>
                            <p className="font-medium text-slate-900">{personal.name || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-slate-400">Email Address</Label>
                            <p className="font-medium text-slate-900">{personal.email || "N/A"}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-slate-400">Phone</Label>
                            <p className="font-medium text-slate-900">{personal.phone || "N/A"}</p>
                        </div>
                    </div>
                </section>

                {/* 2. Location */}
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Location & Storefront
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
                            <div>
                                <Label className="text-xs text-slate-400">Full Address</Label>
                                <p className="font-medium text-slate-900 leading-snug mt-1">{loc.address || app.location}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-slate-400">Pincode</Label>
                                    <p className="font-medium text-slate-900">{loc.pincode || "N/A"}</p>
                                </div>
                                <div className="flex items-end">
                                    <a
                                        href={'https://www.google.com/maps?q=' + (loc.lat || 0) + ',' + (loc.lng || 0)}
                                        target="_blank"
                                        className="text-blue-500 hover:underline flex items-center gap-1 text-sm font-medium"
                                    >
                                        <MapPin size={16} /> View on Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                        {loc.storeFrontImage && (
                            <div className="h-40 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden relative group">
                                <img
                                    src={loc.storeFrontImage}
                                    alt="Store Front"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2">
                                    <p className="text-xs text-white font-medium text-center">Store Front Photo</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Documents Verification */}
                {docs.pan && (
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Document Verification
                        </h3>

                        <div className="grid gap-4">
                            <VerificationCard
                                title="PAN Card"
                                details={[`Number: ${docs.pan?.number || 'N/A'}`]}
                                imageUrl={docs.pan?.url}
                                isVerified={docVerification.pan}
                                onVerify={() => toggleVerify('pan')}
                            />
                            <VerificationCard
                                title="GST Certificate"
                                details={[`GSTIN: ${docs.gst?.number || 'N/A'}`]}
                                imageUrl={docs.gst?.url}
                                isVerified={docVerification.gst}
                                onVerify={() => toggleVerify('gst')}
                            />
                            <VerificationCard
                                title="FSSAI License"
                                details={[`Lic No: ${docs.fssai?.number || 'N/A'}`]}
                                imageUrl={docs.fssai?.url}
                                isVerified={docVerification.fssai}
                                onVerify={() => toggleVerify('fssai')}
                            />
                            <VerificationCard
                                title="Authorized Person ID"
                                details={[`Name: ${docs.authorizedPerson?.name || 'N/A'}`]}
                                imageUrl={docs.authorizedPerson?.url}
                                isVerified={docVerification.authPerson}
                                onVerify={() => toggleVerify('authPerson')}
                            />
                            <div className="grid md:grid-cols-2 gap-4">
                                <VerificationCard
                                    title="Signature"
                                    details={["E-Sign Capture"]}
                                    imageUrl={docs.signature?.url}
                                    isVerified={docVerification.signature}
                                    onVerify={() => toggleVerify('signature')}
                                    small
                                />
                                {/* Contract Placeholder */}
                                <div className={`
                                    bg-white p-4 rounded-xl border-2 transition-all flex flex-col justify-between
                                    ${docVerification.contract ? 'border-[#2BD67C]/50 bg-[#2BD67C]/5' : 'border-gray-100 hover:border-gray-200'}
                                `}>
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-900">Partner Contract</h4>
                                            <Badge variant="outline" className="font-normal">PDF</Badge>
                                        </div>
                                        <div className="h-24 bg-gray-50 rounded-lg mt-3 flex items-center justify-center border border-dashed border-gray-200">
                                            <FileText className="h-8 w-8 text-gray-300" />
                                        </div>
                                    </div>
                                    <Button
                                        className={`w-full mt-4 gap-2 ${docVerification.contract ? 'bg-[#2BD67C] hover:bg-[#25b869]' : 'bg-gray-900'}`}
                                        variant={docVerification.contract ? "default" : "secondary"}
                                        onClick={() => toggleVerify('contract')}
                                    >
                                        {docVerification.contract ? <Check className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        {docVerification.contract ? "Verified" : "Verify Contract"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t space-y-4 z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
                {showRejectReason && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-in slide-in-from-bottom-2">
                        <h4 className="font-bold text-red-800 text-sm mb-3">Reason for Rejection:</h4>
                        <div className="flex flex-wrap gap-2">
                            {REJECTION_REASONS.map(reason => (
                                <button
                                    key={reason}
                                    onClick={() => toggleRejectReason(reason)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                                        ${selectedReasons.includes(reason)
                                            ? 'bg-red-100 border-red-200 text-red-700'
                                            : 'bg-white border-red-100 text-red-400 hover:border-red-200'
                                        }
                                    `}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        {selectedReasons.includes("Other (specify)") && (
                            <textarea
                                className="w-full mt-3 p-3 text-sm border border-red-200 rounded-lg focus:outline-none focus:border-red-400 bg-white"
                                placeholder="Please specify the reason..."
                                rows={3}
                                autoFocus
                            />
                        )}
                    </div>
                )}

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 h-12 text-base font-semibold"
                        onClick={() => {
                            if (showRejectReason && selectedReasons.length > 0) {
                                onReject(app.id, selectedReasons)
                            } else {
                                setShowRejectReason(!showRejectReason)
                            }
                        }}
                    >
                        <XCircle className="mr-2 h-5 w-5" />
                        {showRejectReason && selectedReasons.length > 0 ? "Confirm Review Rejection" : "Reject Application"}
                    </Button>
                    <Button
                        disabled={!allVerified}
                        onClick={() => onApprove(app.id)}
                        className={`
                            flex-1 h-12 text-base font-bold shadow-lg transition-all
                            ${allVerified
                                ? 'bg-[#2BD67C] hover:bg-[#25B869] text-white shadow-[#2BD67C]/25'
                                : 'bg-gray-100 text-gray-400 shadow-none'}
                        `}
                    >
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Approve Merchant
                    </Button>
                </div>
            </div>
        </div>
    )
}

function VerificationCard({ title, details, imageUrl, isVerified, onVerify, small }: any) {
    return (
        <div className={`
            bg-white p-4 rounded-xl border-2 transition-all duration-300
            ${isVerified
                ? 'border-[#2BD67C] shadow-[0_0_0_4px_rgba(43,214,124,0.1)]'
                : 'border-gray-100 hover:border-blue-100'
            }
        `}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className={`font-bold text-lg ${isVerified ? 'text-[#2BD67C]' : 'text-slate-900'}`}>
                        {title}
                    </h4>
                    {details.map((d: string, i: number) => (
                        <p key={i} className="text-sm font-medium text-slate-500 mt-1">{d}</p>
                    ))}
                </div>
                <button
                    onClick={onVerify}
                    className={`
                        h-10 w-10 rounded-full flex items-center justify-center transition-all bg-white shadow-sm border
                         ${isVerified
                            ? 'bg-[#2BD67C] text-white border-[#2BD67C]'
                            : 'border-gray-200 text-gray-300 hover:border-blue-200 hover:text-blue-500'
                        }
                    `}
                >
                    <Check className="h-6 w-6" />
                </button>
            </div>

            {imageUrl && (
                <div className={`bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative group ${small ? 'h-32' : 'h-48'}`}>
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                        <Button size="sm" variant="secondary" className="shadow-lg pointer-events-none">
                            <Eye className="h-4 w-4 mr-2" /> Preview
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
