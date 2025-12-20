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
import { format } from "date-fns"

export default function OrderIssuesPage() {
    const { orderIssues } = useMockData()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order Issues</h1>
                <p className="text-slate-500">Manage reported problems and customer complaints.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead>ISSUE ID</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Reported</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderIssues.map((issue) => (
                            <TableRow key={issue.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-mono text-xs font-medium text-slate-500">{issue.id}</TableCell>
                                <TableCell className="font-mono text-xs text-blue-600">{issue.orderId}</TableCell>
                                <TableCell className="font-medium text-slate-900">{issue.customerName}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 capitalize">
                                        {issue.type.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${issue.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                                                issue.priority === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'}
                                        `}
                                    >
                                        {issue.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`
                                            ${issue.status === 'open' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                                issue.status === 'investigating' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                                    'bg-green-100 text-green-800 hover:bg-green-100'}
                                        `}
                                    >
                                        {issue.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">
                                    {format(new Date(issue.reportedAt), "MMM dd, p")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
