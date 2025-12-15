"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, FileText } from "lucide-react"

export default function StoreApprovalsPage() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Store Approvals</h1>
                    <p className="text-muted-foreground">Review and approve new store listing requests.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Sweet Treats Bakery</h3>
                                <p className="text-sm text-slate-500">Submitted by Anita Desai • 2h ago</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="secondary" className="text-[10px]">Bakery</Badge>
                                    <Badge variant="outline" className="text-[10px]">Indiranagar</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                                <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                            <Button className="bg-[#2BD67C] hover:bg-[#25b869] text-white">
                                <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                        </div>
                    </div>
                ))}
                {/* Empty State visual if needed */}
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50 mt-4">
                    <p className="text-sm text-center text-slate-400">No more pending approvals.</p>
                </div>
            </div>
        </div>
    )
}
