"use client"

import * as React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Rider, useMockData } from "@/contexts/MockDataContext"
import { Badge } from "@/components/ui/badge"

// --- Custom Icons ---

const createRiderIcon = (color: string) => {
    return L.divIcon({
        className: "bg-transparent",
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    })
}

const goldIcon = createRiderIcon("#FBC02D") // Active with Order
const mintIcon = createRiderIcon("#2BD67C") // Idle / Available

export default function LiveMapClient() {
    const { riders } = useMockData()

    // Filter only active riders for the live map
    const activeFleet = riders.filter(r => r.status === 'active' && r.location)
    const delhiCenter: [number, number] = [28.6139, 77.2090]

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border shadow-sm z-0 relative">
            <MapContainer center={delhiCenter} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {activeFleet.map((rider) => {
                    // Determine icon based on if they have an active order
                    const isBusy = !!rider.activeOrder
                    const icon = isBusy ? goldIcon : mintIcon

                    return (
                        <Marker
                            key={rider.id}
                            position={[rider.location.lat, rider.location.lng]}
                            icon={icon}
                        >
                            <Popup>
                                <div className="space-y-2 min-w-[200px]">
                                    <div className="flex items-center justify-between">
                                        <div className="font-bold text-sm">{rider.name}</div>
                                        <Badge variant="outline" className={isBusy ? "border-[#FBC02D] bg-yellow-50 text-yellow-800" : "border-[#2BD67C] bg-green-50 text-green-800"}>
                                            {isBusy ? "On Order" : "Idle"}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <div>Phone: {rider.phone}</div>
                                        <div>Vehicle: {rider.vehicleType}</div>
                                        {isBusy && <div className="mt-1 font-medium">Order: #{rider.activeOrder}</div>}
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white p-3 rounded-lg shadow-lg border text-xs space-y-2">
                <div className="font-semibold mb-1">Rider Status</div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FBC02D] border border-gray-200"></span>
                    <span>Busy (Active Order)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2BD67C] border border-gray-200"></span>
                    <span>Idle (Available)</span>
                </div>
            </div>
        </div>
    )
}
