"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { MapPin, Store, Check, X, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
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

export default function MerchantApplicationsPage() {
    const { merchants, updateMerchantStatus } = useMockData()
    const [rejectId, setRejectId] = React.useState<string | null>(null)
    const [rejectReason, setRejectReason] = React.useState("")
    const [activeTab, setActiveTab] = React.useState("all")

    // Calculate counts
    const pendingCount = merchants.filter(m => m.status === 'under_review').length
    const approvedCount = merchants.filter(m => m.status === 'approved').length
    const rejectedCount = merchants.filter(m => m.status === 'rejected').length

    // Filter merchants by tab
    const filteredMerchants = merchants.filter(m => {
        if (activeTab === 'all') return true
        if (activeTab === 'pending') return m.status === 'under_review'
        if (activeTab === 'approved') return m.status === 'approved'
        if (activeTab === 'rejected') return m.status === 'rejected'
        return true
    })

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
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Merchant Applications</h1>
                    <p className="text-slate-500">Review and manage merchant partnership requests.</p>
                </div>
                {/* Summary Stats */}
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-bold text-amber-700">{pendingCount}</span>
                        <span className="text-xs text-amber-600">Pending</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-bold text-green-700">{approvedCount}</span>
                        <span className="text-xs text-green-600">Approved</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-bold text-red-700">{rejectedCount}</span>
                        <span className="text-xs text-red-600">Rejected</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full max-w-[500px] grid-cols-4 h-10">
                    <TabsTrigger value="all" className="text-xs">
                        All ({merchants.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="text-xs gap-1">
                        <Clock className="h-3 w-3" />
                        Pending ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved ({approvedCount})
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="text-xs gap-1">
                        <XCircle className="h-3 w-3" />
                        Rejected ({rejectedCount})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-[120px]">Application ID</TableHead>
                                    <TableHead>Store Name</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    {activeTab === 'pending' && (
                                        <TableHead className="text-right">Actions</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMerchants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <AlertCircle className="h-8 w-8 text-slate-300" />
                                                <p>No applications found in this category.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredMerchants.map((app) => (
                                        <TableRow key={app.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-mono text-xs font-medium text-slate-500">{app.id}</TableCell>
                                            <TableCell className="font-medium text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                                        {app.storeName.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {app.storeName}
                                                </div>
                                            </TableCell>
                                            <TableCell>{app.personal?.name || "N/A"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">{app.storeType}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {app.location}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`
                                                        ${app.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            app.status === 'under_review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                'bg-red-50 text-red-700 border-red-200'}
                                                    `}
                                                >
                                                    {app.status === 'under_review' ? 'Pending Review' : app.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-500">
                                                {new Date(app.submittedAt).toLocaleDateString()}
                                            </TableCell>
                                            {activeTab === 'pending' && (
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Dialog open={rejectId === app.id} onOpenChange={(open) => !open && setRejectId(null)}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                                                    onClick={() => setRejectId(app.id)}
                                                                >
                                                                    <X className="h-3 w-3 mr-1" /> Reject
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Reject Application</DialogTitle>
                                                                    <DialogDescription>
                                                                        Please provide a reason for rejecting <strong>{app.storeName}</strong>.
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
                                                            size="sm"
                                                            className="h-8 text-xs bg-[#278F27] hover:bg-[#278F27]/90 text-white"
                                                            onClick={() => handleApprove(app.id)}
                                                        >
                                                            <Check className="h-3 w-3 mr-1" /> Approve
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
