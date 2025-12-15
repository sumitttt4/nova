"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function RefundRequestsPage() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Refund Requests</h1>
                    <p className="text-muted-foreground">Manage customer disputes and refund processing.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-4 bg-white border border-red-100 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">Order #ORD-9921</h3>
                            <Badge variant="destructive">Critical</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">Reason: Missing items • Customer: Rahul S.</p>
                        <p className="text-xs text-slate-400 mt-1">Requested 15 mins ago</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Deny</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">Approve Refund</Button>
                    </div>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">Order #ORD-9850</h3>
                            <Badge variant="outline">Pending</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">Reason: Wrong items delivered • Customer: Priya K.</p>
                        <p className="text-xs text-slate-400 mt-1">Requested 1h ago</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Deny</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">Approve Refund</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
