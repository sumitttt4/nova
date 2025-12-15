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
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
    Search,
    Filter,
    Eye,
    MapPin,
    FileText,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Copy
} from "lucide-react"

// --- Mock Data ---
type KYCRecord = {
    id: string
    storeName: string
    ownerName: string
    phone: string
    status: "approved" | "rejected" | "under_review"
    submittedDate: string
    approvedDate?: string
    rejectedReason?: string
    documents: {
        pan: string
        gst: string
        fssai: string
    }
}

const MOCK_KYC_DATA: KYCRecord[] = [
    {
        id: "STR-8821",
        storeName: "Spice Garden",
        ownerName: "Rajesh Kumar",
        phone: "+91 98765 43210",
        status: "approved",
        submittedDate: "12 Oct, 2023",
        approvedDate: "14 Oct, 2023",
        documents: {
            pan: "ABCDE1234F",
            gst: "29ABCDE1234F1Z5",
            fssai: "12345678901234"
        }
    },
    {
        id: "STR-8822",
        storeName: "Daily Fresh Mart",
        ownerName: "Suresh Reddy",
        phone: "+91 98765 11111",
        status: "under_review",
        submittedDate: "20 Oct, 2023",
        documents: {
            pan: "FGHIJ5678K",
            gst: "29FGHIJ5678K1Z5",
            fssai: "98765432109876"
        }
    },
    {
        id: "STR-8823",
        storeName: "Cool Point Juice",
        ownerName: "Anil Kapoor",
        phone: "+91 98765 22222",
        status: "rejected",
        submittedDate: "15 Oct, 2023",
        rejectedReason: "Blurry FSSAI Document",
        documents: {
            pan: "KLMNO9012P",
            gst: "29KLMNO9012P1Z5",
            fssai: "56789012345678"
        }
    },
    {
        id: "STR-8824",
        storeName: "Urban Tadka",
        ownerName: "Priya Sharma",
        phone: "+91 98765 33333",
        status: "approved",
        submittedDate: "10 Oct, 2023",
        approvedDate: "11 Oct, 2023",
        documents: {
            pan: "PQRST3456U",
            gst: "29PQRST3456U1Z5",
            fssai: "43210987654321"
        }
    },
    {
        id: "STR-8825",
        storeName: "Bakery World",
        ownerName: "David John",
        phone: "+91 98765 44444",
        status: "approved",
        submittedDate: "05 Oct, 2023",
        approvedDate: "07 Oct, 2023",
        documents: {
            pan: "VWXYZ7890A",
            gst: "29VWXYZ7890A1Z5",
            fssai: "87654321098765"
        }
    }
]

export default function KYCStatusPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [selectedRecord, setSelectedRecord] = React.useState<KYCRecord | null>(null)
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)

    // Filter Logic
    const filteredData = MOCK_KYC_DATA.filter(record => {
        const matchesSearch =
            record.phone.includes(searchTerm) ||
            record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.storeName.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || record.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleView = (record: KYCRecord) => {
        setSelectedRecord(record)
        setIsSheetOpen(true)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Master KYC Database</h1>
                    <p className="text-muted-foreground">Search and access KYC documents for all merchants.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-4 border-gray-100 shadow-sm bg-white">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Phone, Store Name or ID..."
                            className="pl-9 bg-gray-50/50 border-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-[200px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="bg-gray-50/50 border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Filter Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="under_review">Under Review</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Data Table */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-semibold">Store Details</TableHead>
                            <TableHead className="font-semibold">Owner Info</TableHead>
                            <TableHead className="font-semibold">Documents</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="text-right font-semibold">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No records found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((record) => (
                                <TableRow key={record.id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">{record.storeName}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{record.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-700">{record.ownerName}</span>
                                            <span className="text-xs text-muted-foreground">{record.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200">PAN</Badge>
                                            <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200">GST</Badge>
                                            <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200">FSSAI</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={record.status} />
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {record.submittedDate}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" className="hover:bg-slate-100" onClick={() => handleView(record)}>
                                            <Eye className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Read-Only Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    {selectedRecord && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <SheetTitle className="text-xl font-bold">{selectedRecord.storeName}</SheetTitle>
                                        <SheetDescription>
                                            KYC Record ID: <span className="font-mono text-xs">{selectedRecord.id}</span>
                                        </SheetDescription>
                                    </div>
                                    <StatusBadge status={selectedRecord.status} />
                                </div>
                            </SheetHeader>

                            {/* Rejection Reason Alert */}
                            {selectedRecord.status === 'rejected' && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-red-900">Application Rejected</h4>
                                        <p className="text-xs text-red-700 mt-1">{selectedRecord.rejectedReason}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Personal & Business Info
                                </h3>
                                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-slate-400">Owner Name</Label>
                                            <p className="text-sm font-medium text-slate-900">{selectedRecord.ownerName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-xs text-slate-400">Phone</Label>
                                            <p className="text-sm font-medium text-slate-900">{selectedRecord.phone}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-slate-400">Submission Date</Label>
                                            <p className="text-sm font-medium text-slate-900">{selectedRecord.submittedDate}</p>
                                        </div>
                                        {selectedRecord.approvedDate && (
                                            <div>
                                                <Label className="text-xs text-slate-400">Approval Date</Label>
                                                <p className="text-sm font-medium text-green-700">{selectedRecord.approvedDate}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Registered Documents
                                </h3>
                                <div className="space-y-3">
                                    <ReadOnlyDocCard title="PAN Card" value={selectedRecord.documents.pan} />
                                    <ReadOnlyDocCard title="GST Certificate" value={selectedRecord.documents.gst} />
                                    <ReadOnlyDocCard title="FSSAI License" value={selectedRecord.documents.fssai} />
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'approved') {
        return (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 px-2.5 py-0.5">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
            </Badge>
        )
    }
    if (status === 'rejected') {
        return (
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 px-2.5 py-0.5">
                <XCircle className="h-3 w-3 mr-1" /> Rejected
            </Badge>
        )
    }
    return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 px-2.5 py-0.5">
            Under Review
        </Badge>
    )
}

function ReadOnlyDocCard({ title, value }: { title: string, value: string }) {
    return (
        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                </div>
                <div>
                    <span className="text-sm font-semibold text-slate-900 block">{title}</span>
                    <span className="text-xs text-muted-foreground font-mono">{value}</span>
                </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                <Copy className="h-4 w-4" />
            </Button>
        </div>
    )
}
