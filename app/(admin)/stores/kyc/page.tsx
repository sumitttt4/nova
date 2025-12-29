"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check, X, FileText, MapPin, Phone, Mail, Store } from "lucide-react"
import { format } from "date-fns"

export default function StoreKYCPage() {
    const { merchants, updateMerchantStatus } = useMockData()

    const pendingMerchants = merchants.filter(m => m.status === 'under_review')

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Store KYC Requests</h1>
                <p className="text-slate-500">Review and verify new store registration applications.</p>
            </div>

            <div className="grid gap-4">
                {pendingMerchants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <FileText className="h-10 w-10 text-slate-400 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No pending requests</h3>
                        <p className="text-slate-500">All store applications have been processed.</p>
                    </div>
                ) : (
                    pendingMerchants.map((merchant) => (
                        <Card key={merchant.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                                            <Store className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {merchant.storeName}
                                                <Badge variant="secondary" className="font-normal text-xs">{merchant.storeType.replace('_', ' ')}</Badge>
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <span className="flex items-center gap-1"><UserIcon className="h-3 w-3" /> {merchant.personName}</span>
                                                <span className="text-slate-300">•</span>
                                                <span suppressHydrationWarning>Applied on {format(new Date(merchant.submittedAt), 'MMM d, yyyy')}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                            onClick={() => updateMerchantStatus(merchant.id, 'rejected', ['Documents unclear'])}
                                        >
                                            <X className="h-4 w-4 mr-2" /> Reject
                                        </Button>
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200"
                                            onClick={() => updateMerchantStatus(merchant.id, 'approved')}
                                        >
                                            <Check className="h-4 w-4 mr-2" /> Approve Listing
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Contact Details</h4>
                                    <div className="grid gap-3 text-sm">
                                        <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            {merchant.phone}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            {merchant.email}
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                                            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                                            {merchant.address.fullAddress}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Documents</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                                <span className="text-sm font-medium text-slate-700">GST Certificate</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Verified</Badge>
                                        </div>
                                        <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                                <span className="text-sm font-medium text-slate-700">FSSAI License</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Verified</Badge>
                                        </div>
                                        <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                                <span className="text-sm font-medium text-slate-700">PAN Card</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Verified</Badge>
                                        </div>
                                        <div className="p-3 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                                                <span className="text-sm font-medium text-slate-700">Business Proof</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">Verified</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
