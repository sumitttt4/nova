"use client"

import * as React from "react"
import { MapView } from "@/components/ui/map-view"
import { useMockData, Rider, Order } from "@/contexts/MockDataContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bike, MapPin, Phone, ShoppingBag, Clock } from "lucide-react"

export default function LiveTrackingPage() {
    const { riders, orders } = useMockData()

    // Filter for Active Riders and Live Orders
    // We'll simulate finding riders who are "online" (status != rejected)
    const activeRiders = React.useMemo(() => {
        return riders.filter(r => r.status === 'active' || r.status === 'under_review')
    }, [riders])

    // Find "Live" orders (preparing)
    const liveOrders = React.useMemo(() => {
        return orders.filter(o => o.status === 'preparing')
    }, [orders])

    // State for map interaction
    const [selectedRiderId, setSelectedRiderId] = React.useState<string | null>(null)

    // Convert riders to map markers
    const markers = React.useMemo(() => {
        return activeRiders
            .filter(r => r.location && r.location.lat && r.location.lng)
            .map(rider => ({
                id: rider.id,
                lat: rider.location.lat,
                lng: rider.location.lng,
                label: rider.name,
                color: rider.status === 'active' ? '#2BD67C' : '#F59E0B', // Green for active, Orange for under review
                onClick: () => setSelectedRiderId(rider.id)
            }))
    }, [activeRiders])

    const selectedRider = activeRiders.find(r => r.id === selectedRiderId)

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Live Operations</h1>
                    <p className="text-slate-500">
                        Real-time tracking of <span className="font-bold text-slate-900">{activeRiders.length}</span> riders and <span className="font-bold text-slate-900">{liveOrders.length}</span> active orders.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedRiderId(null)}>Reset View</Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Left: Sidebar List */}
                <Card className="col-span-1 border-gray-100 shadow-sm flex flex-col overflow-hidden h-full">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700 flex justify-between items-center">
                        Active Fleet
                        <Badge variant="secondary" className="bg-slate-200 text-slate-700">{activeRiders.length}</Badge>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {activeRiders.map(rider => (
                            <div
                                key={rider.id}
                                onClick={() => setSelectedRiderId(rider.id)}
                                className={`
                                    p-3 rounded-xl border transition-all cursor-pointer group
                                    ${selectedRiderId === rider.id
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-sm truncate">{rider.name}</h4>
                                    <Badge className={`
                                        text-[10px] px-1.5 py-0 h-5
                                        ${rider.status === 'active'
                                            ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none'
                                            : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-100'}
                                    `}>
                                        {rider.status}
                                    </Badge>
                                </div>
                                <div className={`flex items-center gap-2 mt-2 text-xs ${selectedRiderId === rider.id ? 'text-slate-300' : 'text-slate-500'}`}>
                                    <Bike size={12} />
                                    <span>{rider.vehicleType}</span>
                                    <span className="mx-1">•</span>
                                    <Phone size={12} />
                                    <span>{rider.phone}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right: Map & Details */}
                <div className="col-span-3 flex flex-col gap-4 h-full min-h-0">
                    <div className="flex-1 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                        <MapView
                            markers={markers}
                            height="100%"
                            initialLat={12.9716} // Bangalore Center default
                            initialLng={77.5946}
                            zoom={11}
                        />

                        {/* Floating Selected Rider Card */}
                        {selectedRider && (
                            <div className="absolute top-4 right-4 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-right-4 z-10">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                    <h3 className="font-bold text-lg text-slate-900">{selectedRider.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono">{selectedRider.id}</p>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <MapPin size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase">Current Location</p>
                                            <p className="text-sm font-medium text-slate-800 leading-snug">
                                                {selectedRider.location.address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mock Assigned Order */}
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <div className="flex items-center gap-2 text-purple-700 font-bold text-xs mb-2">
                                            <ShoppingBag size={12} />
                                            Active Delivery
                                        </div>
                                        {liveOrders.length > 0 ? (
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-900">{liveOrders[0].customerName}</p>
                                                <div className="flex justify-between text-xs text-slate-500">
                                                    <span>{liveOrders[0].storeName}</span>
                                                    <span>₹{liveOrders[0].amount}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 italic">No active order assigned.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center px-4">
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                        <Clock size={12} /> Last ping: 1m ago
                                    </span>
                                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-7">
                                        Force Logout
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
