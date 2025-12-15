"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bike, FileText, Check, X } from "lucide-react"

export default function RiderOnboardingPage() {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Rider Applications</h1>
                <p className="text-muted-foreground">Review documents and approve new delivery partners.</p>
            </div>

            <div className="grid gap-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-start justify-between p-5 bg-white border rounded-xl shadow-sm">
                        <div className="flex gap-4">
                            <div className="h-14 w-14 bg-blue-50 rounded-full flex items-center justify-center">
                                <Bike className="h-7 w-7 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Vijay Kumar</h3>
                                <p className="text-sm text-slate-500">Applied for: Whitefield Zone</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="outline" className="bg-gray-50 flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> Driving License
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-50 flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> RC Book
                                    </Badge>
                                    <Badge variant="outline" className="bg-gray-50 flex items-center gap-1">
                                        <FileText className="h-3 w-3" /> Aadhar Card
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button className="bg-[#2BD67C] hover:bg-[#25b869] w-full text-white">
                                <Check className="h-4 w-4 mr-2" /> Approve
                            </Button>
                            <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-100 hover:border-red-200 w-full">
                                <X className="h-4 w-4 mr-2" /> Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
