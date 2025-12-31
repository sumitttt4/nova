"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ShoppingBag, Store, ChevronRight, Package } from "lucide-react"
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export default function ProductValidationPage() {
    const { products, approveProduct, rejectProduct } = useMockData()
    const [rejectId, setRejectId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [expandedStores, setExpandedStores] = useState<string[]>([])

    const pendingProducts = products.filter(p => p.status === 'pending')

    // Group products by store
    const productsByStore = pendingProducts.reduce((acc, product) => {
        const storeName = product.storeName
        if (!acc[storeName]) {
            acc[storeName] = []
        }
        acc[storeName].push(product)
        return acc
    }, {} as Record<string, typeof pendingProducts>)

    const storeNames = Object.keys(productsByStore)

    // Initialize all stores as expanded
    useState(() => {
        setExpandedStores(storeNames)
    })

    const toggleStore = (storeName: string) => {
        setExpandedStores(prev =>
            prev.includes(storeName)
                ? prev.filter(s => s !== storeName)
                : [...prev, storeName]
        )
    }

    const handleReject = () => {
        if (rejectId && rejectReason) {
            rejectProduct(rejectId, rejectReason)
            setRejectId(null)
            setRejectReason("")
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Validation</h1>
                    <p className="text-slate-500">Review newly added products for quality and guidelines.</p>
                </div>
                {/* Summary Stats */}
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <Package className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-bold text-amber-700">{pendingProducts.length}</span>
                        <span className="text-xs text-amber-600">Pending</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <Store className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-bold text-blue-700">{storeNames.length}</span>
                        <span className="text-xs text-blue-600">Stores</span>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {pendingProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <ShoppingBag className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900">All caught up!</h3>
                    <p className="text-slate-500 text-sm">No pending products to validate.</p>
                </div>
            ) : (
                /* Grouped by Store */
                <div className="space-y-4">
                    {storeNames.map((storeName) => {
                        const storeProducts = productsByStore[storeName]
                        const isExpanded = expandedStores.includes(storeName)

                        return (
                            <Card key={storeName} className="border-slate-200 shadow-sm overflow-hidden">
                                {/* Store Header */}
                                <Collapsible open={isExpanded} onOpenChange={() => toggleStore(storeName)}>
                                    <CollapsibleTrigger asChild>
                                        <CardHeader className="py-3 px-4 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                                        {storeName.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-base font-semibold text-slate-900">{storeName}</CardTitle>
                                                        <p className="text-xs text-slate-500">{storeProducts.length} product{storeProducts.length > 1 ? 's' : ''} pending</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                                        {storeProducts.length} pending
                                                    </Badge>
                                                    <ChevronRight className={cn(
                                                        "h-5 w-5 text-slate-400 transition-transform duration-200",
                                                        isExpanded && "rotate-90"
                                                    )} />
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <CardContent className="p-4 pt-0">
                                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                                                {storeProducts.map((product) => (
                                                    <div key={product.id} className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-all duration-200">
                                                        {/* Product Image */}
                                                        <div className="aspect-[4/3] relative bg-slate-100 p-4 flex items-center justify-center overflow-hidden">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            <Badge className="absolute top-2 right-2 bg-white/95 text-slate-900 shadow-sm text-xs font-bold">
                                                                ₹{product.price}
                                                            </Badge>
                                                        </div>

                                                        {/* Product Info */}
                                                        <div className="p-3 space-y-2">
                                                            <div>
                                                                <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{product.name}</h4>
                                                                <Badge variant="outline" className="mt-1 text-[10px] font-normal text-slate-500 border-slate-200 h-5">
                                                                    {product.category}
                                                                </Badge>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex gap-2 pt-2">
                                                                <Dialog open={rejectId === product.id} onOpenChange={(open) => !open && setRejectId(null)}>
                                                                    <DialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="flex-1 h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                                            onClick={() => setRejectId(product.id)}
                                                                        >
                                                                            <X className="h-3 w-3 mr-1" /> Reject
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
                                                                    size="sm"
                                                                    className="flex-1 h-8 text-xs bg-[#278F27] hover:bg-[#278F27]/90 text-white"
                                                                    onClick={() => approveProduct(product.id)}
                                                                >
                                                                    <Check className="h-3 w-3 mr-1" /> Approve
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Collapsible>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
