"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check, X, Package, AlertCircle, ShoppingBag } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
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

export default function ProductValidationPage() {
    const { products, approveProduct, rejectProduct } = useMockData()
    const [rejectId, setRejectId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    const pendingProducts = products.filter(p => p.status === 'pending')

    const handleReject = () => {
        if (rejectId && rejectReason) {
            rejectProduct(rejectId, rejectReason)
            setRejectId(null)
            setRejectReason("")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Validation</h1>
                <p className="text-slate-500">Review newly added products for quality and guidelines.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <ShoppingBag className="h-10 w-10 text-slate-400 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No pending products</h3>
                        <p className="text-slate-500">All products have been validated.</p>
                    </div>
                ) : (
                    pendingProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="aspect-square relative bg-slate-100 p-8 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                />
                                <Badge className="absolute top-3 right-3 bg-white/90 text-slate-900 shadow-sm hover:bg-white backdrop-blur-sm">
                                    ₹{product.price}
                                </Badge>
                            </div>
                            <CardContent className="p-4 space-y-3">
                                <div>
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-slate-900 line-clamp-1" title={product.name}>{product.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-500">{product.storeName}</p>
                                    <Badge variant="outline" className="mt-2 text-xs font-normal text-slate-500 border-slate-200">{product.category}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                    <Dialog open={rejectId === product.id} onOpenChange={(open) => !open && setRejectId(null)}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                                onClick={() => setRejectId(product.id)}
                                            >
                                                <X className="h-4 w-4 mr-2" /> Reject
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Reject Product</DialogTitle>
                                                <DialogDescription>
                                                    Please provide a reason for rejecting <strong>{product.name}</strong>. This will be shared with the merchant.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="reason">Rejection Reason</Label>
                                                    <Textarea
                                                        id="reason"
                                                        placeholder="e.g. Image blurry, Inappropriate content, Wrong category..."
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setRejectId(null)}>Cancel</Button>
                                                <Button variant="destructive" onClick={handleReject} disabled={!rejectReason}>Confirm Rejection</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                        onClick={() => approveProduct(product.id)}
                                    >
                                        <Check className="h-4 w-4 mr-2" /> Approve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
