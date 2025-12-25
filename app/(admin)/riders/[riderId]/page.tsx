"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useMockData, Rider, RiderPayout } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    ArrowLeft, MapPin, Phone, Mail, ShieldCheck, CreditCard,
    Clock, Truck, Star, AlertCircle, CheckCircle2, XCircle, Settings
} from "lucide-react"
import { format } from "date-fns"

export default function RiderProfilePage() {
    const params = useParams()
    const router = useRouter()
    const { riders, riderPayouts, updateRiderStatus, updateRiderKyc, updateRiderRadius } = useMockData()
    const [rider, setRider] = React.useState<Rider | null>(null)
    const [payouts, setPayouts] = React.useState<RiderPayout[]>([])
    const [activeTab, setActiveTab] = React.useState("overview")

    React.useEffect(() => {
        if (params.riderId) {
            const foundRider = riders.find(r => r.id === decodeURIComponent(params.riderId as string))
            if (foundRider) {
                setRider(foundRider)
                const relevantPayouts = riderPayouts.filter(p => p.riderId === foundRider.id)
                setPayouts(relevantPayouts)
            }
        }
    }, [params.riderId, riders, riderPayouts])

    if (!rider) {
        return <div className="p-8 text-center text-slate-500">Loading rider...</div>
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
            {/* Top Bar */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        {rider.name}
                        {rider.kycStatus === 'verified' && <ShieldCheck className="h-5 w-5 text-green-500" />}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {rider.phone}</span>
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {rider.email}</span>
                        <Badge variant="outline" className="capitalize">{rider.status.replace('_', ' ')}</Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    {rider.status === 'under_review' && (
                        <>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => updateRiderStatus(rider.id, 'active')}>
                                Approve Rider
                            </Button>
                            <Button variant="destructive" onClick={() => updateRiderStatus(rider.id, 'rejected')}>
                                Reject
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="kyc">KYC & Documents</TabsTrigger>
                    <TabsTrigger value="financials">Banking & Payouts</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Wallet Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{rider.walletBalance?.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-lg font-bold">{rider.metrics?.rating || 'N/A'}</span>
                                </div>
                                <div className="text-xs text-slate-400">|</div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm">{Math.round((rider.metrics?.onlineTime || 0) / 60)}h Online</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Current Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-2 text-sm text-slate-700">
                                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                    {rider.location.address}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* KYC TAB */}
                <TabsContent value="kyc" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Identity Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="mb-2 block text-xs uppercase tracking-wider text-slate-500">Aadhar Card</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                {rider.ekyc?.documents?.aadharFront ? (
                                                    <img src={rider.ekyc.documents.aadharFront} alt="Aadhar Front" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-slate-400">No Image</div>
                                                )}
                                            </div>
                                            <p className="text-xs text-center text-slate-500">Front</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                {rider.ekyc?.documents?.aadharBack ? (
                                                    <img src={rider.ekyc.documents.aadharBack} alt="Aadhar Back" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-xs text-slate-400">No Image</div>
                                                )}
                                            </div>
                                            <p className="text-xs text-center text-slate-500">Back</p>
                                        </div>
                                    </div>
                                </div>

                                {rider.ekyc?.documents?.pan && (
                                    <div>
                                        <Label className="mb-2 block text-xs uppercase tracking-wider text-slate-500">PAN Card</Label>
                                        <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 w-1/2">
                                            <img src={rider.ekyc.documents.pan} alt="PAN Card" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Verification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="mb-2 block text-xs uppercase tracking-wider text-slate-500">Live Selfie</Label>
                                    <div className="aspect-square w-40 bg-slate-100 rounded-full overflow-hidden border border-slate-200 mx-auto">
                                        {rider.ekyc?.documents?.selfie ? (
                                            <img src={rider.ekyc.documents.selfie} alt="Selfie" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-slate-400">No Selfie</div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-2 block text-xs uppercase tracking-wider text-slate-500">Driving License</Label>
                                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                        {rider.ekyc?.documents?.dl ? (
                                            <img src={rider.ekyc.documents.dl} alt="DL" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-slate-400">No DL</div>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-700">KYC Status</span>
                                            <Badge className={`
                                                ${rider.kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                                    rider.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                                                border-0 uppercase
                                            `}>
                                                {rider.kycStatus}
                                            </Badge>
                                        </div>
                                        {rider.kycStatus !== 'verified' && (
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateRiderKyc(rider.id, 'rejected')}>
                                                    Reject
                                                </Button>
                                                <Button size="sm" onClick={() => updateRiderKyc(rider.id, 'verified')} className="bg-green-600 hover:bg-green-700">
                                                    Verify Documents
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* FINANCIALS TAB */}
                <TabsContent value="financials" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-slate-500" />
                                Bank Account Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500">Account Holder</p>
                                <p className="font-medium">{rider.bankDetails?.beneficiaryName || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500">Bank Name</p>
                                <p className="font-medium">{rider.bankDetails?.bankName || 'N/A'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500">Account Number</p>
                                <p className="font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block">
                                    {rider.bankDetails?.accountNumber ? rider.bankDetails.accountNumber.replace(/.(?=.{4})/g, '•') : 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500">IFSC Code</p>
                                <p className="font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block">
                                    {rider.bankDetails?.ifsc || 'N/A'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payout History</CardTitle>
                            <CardDescription>Recent transactions processed to rider's bank account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Transaction ID</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payouts.map((payout) => (
                                        <TableRow key={payout.id}>
                                            <TableCell>{format(new Date(payout.date), "MMM dd, yyyy")}</TableCell>
                                            <TableCell className="font-mono text-xs">{payout.transactionId}</TableCell>
                                            <TableCell className="font-medium">₹{payout.amount}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`
                                                    ${payout.status === 'processed' ? 'text-green-600 bg-green-50 border-green-200' :
                                                        payout.status === 'failed' ? 'text-red-600 bg-red-50 border-red-200' : 'text-orange-600 bg-orange-50 border-orange-200'}
                                                `}>
                                                    {payout.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {payouts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                                                No payouts found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SETTINGS TAB */}
                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-slate-500" />
                                Operational Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="max-w-md space-y-4">
                                <div>
                                    <Label>Max Delivery Radius</Label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Input
                                            type="range"
                                            min={1}
                                            max={20}
                                            value={rider.deliveryRadius || 5}
                                            onChange={(e) => updateRiderRadius(rider.id, parseInt(e.target.value))}
                                            className="flex-1 cursor-pointer"
                                        />
                                        <span className="font-bold w-12 text-right">{rider.deliveryRadius} km</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Rider will only receive orders within this distance from their current location.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
