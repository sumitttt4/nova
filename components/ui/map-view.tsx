"use client"

import * as React from "react"
import { MapPin, Navigation, Plus, Minus } from "lucide-react"

interface MapViewProps {
    initialLat?: number
    initialLng?: number
    zoom?: number
    markers?: Array<{
        id: string
        lat: number
        lng: number
        label?: string
        color?: string
        onClick?: () => void
    }>
    geofence?: Array<[number, number]>
    height?: string | number
}

// Simple linear projection for demo purpose (converting lat/lng to % relative to center)
// 0.01 degrees is roughly 1km
const DEG_TO_PCT = 1000 // Scale factor

export function MapView({
    initialLat = 12.9716,
    initialLng = 77.5946,
    zoom = 12,
    markers = [],
    geofence,
    height = 400
}: MapViewProps) {
    // We simulate a map viewport
    // Center is 50%, 50%
    // Delta lat/lng determines offset

    return (
        <div
            className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-50 group"
            style={{ height }}
        >
            {/* Map Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Mock Streets/Roads (Abstract) */}
            <div className="absolute top-[30%] left-0 w-full h-[8px] bg-slate-200/50 -rotate-3" />
            <div className="absolute top-0 left-[40%] w-[8px] h-full bg-slate-200/50 rotate-12" />

            {/* Controls */}
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
                <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer">
                    <Navigation size={20} />
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                        <Plus size={20} className="text-slate-500" />
                    </div>
                    <div className="p-2 hover:bg-slate-50 cursor-pointer">
                        <Minus size={20} className="text-slate-500" />
                    </div>
                </div>
            </div>

            {/* Markers Container - Centered */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2">
                    {markers.map((marker) => {
                        // Calculate relative position
                        // This is a VERY rough approximation for visual demo
                        const dy = (marker.lat - initialLat) * DEG_TO_PCT * (zoom / 10) * -1 // Invert Y because screen Y goes down
                        const dx = (marker.lng - initialLng) * DEG_TO_PCT * (zoom / 10)

                        // Clamp to prevent going too far off screen (optional)
                        // Using translate to position relative to center
                        return (
                            <div
                                key={marker.id}
                                className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
                                style={{
                                    transform: `translate(${dx}px, ${dy}px) translate(-50%, -100%)`, // Anchor bottom-center
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    marker.onClick?.()
                                }}
                            >
                                <div className="group/marker relative flex flex-col items-center cursor-pointer hover:z-50 hover:scale-110 transition-transform">
                                    {/* Label on Hover */}
                                    {marker.label && (
                                        <div className="absolute -top-8 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded shadow-lg opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                            {marker.label}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                        </div>
                                    )}
                                    <MapPin
                                        size={32}
                                        className="drop-shadow-md"
                                        color={marker.color || "#2BD67C"}
                                        fill="white"
                                    />
                                    <div className="w-2 h-1 bg-black/20 rounded-full blur-[1px]"></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Attribution */}
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono bg-white/50 px-2 py-0.5 rounded">
                Mock Map View
            </div>
        </div>
    )
}
