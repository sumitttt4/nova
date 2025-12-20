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
import { MapPin, Calendar, Store } from "lucide-react"

export default function MerchantApplicationsPage() {
    const { merchants } = useMockData()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Merchant Applications</h1>
                <p className="text-slate-500">History of all merchant partnership requests.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead>Application ID</TableHead>
                            <TableHead>Store Name</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Submitted</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {merchants.map((app) => (
                            <TableRow key={app.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-mono text-xs font-medium text-slate-500">{app.id}</TableCell>
                                <TableCell className="font-medium text-slate-900 flex items-center gap-2">
                                    <Store className="h-4 w-4 text-slate-400" />
                                    {app.storeName}
                                </TableCell>
                                <TableCell>{app.personal?.name || "N/A"}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{app.storeType}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-slate-500 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {app.location}
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
                                    {app.submittedAt}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
