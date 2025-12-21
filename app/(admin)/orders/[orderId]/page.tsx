"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useMockData, Order } from "@/contexts/MockDataContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, MapPin, Phone, ShoppingBag, Truck, User } from "lucide-react"
import { format } from "date-fns"

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { orders } = useMockData()
    const [order, setOrder] = React.useState<Order | null>(null)

    React.useEffect(() => {
        if (params.orderId) {
            const found = orders.find(o => o.id === decodeURIComponent(params.orderId as string))
            if (found) setOrder(found)
        }
    }, [params.orderId, orders])

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <p className="text-slate-500">Order not found.</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-green-100 text-green-700 border-green-200"
            case "preparing": return "bg-orange-100 text-orange-700 border-orange-200"
            case "cancelled": return "bg-red-100 text-red-700 border-red-200"
            default: return "bg-slate-100 text-slate-700 border-slate-200"
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-10">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Order {order.id}</h1>
                        <Badge variant="outline" className={`capitalize ${getStatusColor(order.status)} border px-3 py-1 rounded-full`}>
                            {order.status}
                        </Badge>
                    </div>
                    <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" /> Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Order Items Mockup */}
                    <Card className="shadow-sm border-slate-200">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4 text-slate-500" />
                                Order Items
                            </h3>
                        </div>
                        <CardContent className="p-0">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex justify-between items-start p-4 border-b border-slate-100 last:border-0">
                                    <div className="flex gap-4">
                                        <div className="h-16 w-16 bg-slate-100 rounded-lg flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-slate-900">Classic Burger Meal</p>
                                            <p className="text-sm text-slate-500">Extra Cheese, No Onion</p>
                                            <p className="text-xs text-slate-400 mt-1">x 1</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-slate-900">₹{Math.round(order.amount / 2)}</p>
                                </div>
                            ))}
                            <div className="p-4 bg-slate-50/30 flex justify-between items-center border-t border-slate-100">
                                <p className="font-bold text-slate-700">Total Amount</p>
                                <p className="text-xl font-bold text-slate-900">₹{order.amount}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="shadow-sm border-slate-200">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-500" />
                                Customer Details
                            </h3>
                        </div>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500">Name</p>
                                <p className="text-sm font-medium text-slate-900 mt-0.5">{order.customerName}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> Contact
                                </p>
                                <p className="text-sm font-medium text-slate-900 mt-0.5">+91 98765 43210</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Delivery Address
                                </p>
                                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                                    Flat 402, Galaxy Apartments, Sector 15, Gurgaon, Haryana
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Store Info */}
                    <Card className="shadow-sm border-slate-200">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <Truck className="h-4 w-4 text-slate-500" />
                                Store Information
                            </h3>
                        </div>
                        <CardContent className="p-4 space-y-3">
                            <div>
                                <p className="text-xs font-medium text-slate-500">Store Name</p>
                                <p className="text-sm font-medium text-slate-900 mt-0.5">{order.storeName}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
