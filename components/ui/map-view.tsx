"use client"

import * as React from "react"
// @ts-ignore
import Map, { Marker, Popup, Source, Layer, NavigationControl } from "react-map-gl"
import { MapPin, Navigation } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"

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
    geofence?: Array<[number, number]> // Polygons: Array of [lng, lat]
    height?: string | number
}

// Custom Map Style (Light Mode)
const MAP_STYLE = "mapbox://styles/mapbox/light-v11"

export function MapView({
    initialLat = 12.9716,
    initialLng = 77.5946,
    zoom = 12,
    markers = [],
    geofence,
    height = 400
}: MapViewProps) {
    const [viewState, setViewState] = React.useState({
        latitude: initialLat,
        longitude: initialLng,
        zoom: zoom
    })

    // Geofencing GeoJSON for Mapbox Source
    const geoJsonData: any = React.useMemo(() => {
        if (!geofence || geofence.length === 0) return null
        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [geofence]
            }
        }
    }, [geofence])

    // If no token is provided, we show a nice fallback UI
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (!token) {
        return (
            <div
                className="w-full bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-3"
                style={{ height }}
            >
                <div className="p-4 bg-white rounded-full shadow-sm">
                    <Navigation size={32} className="text-slate-300" />
                </div>
                <div className="text-center px-6">
                    <p className="font-bold text-slate-600">Map Configuration Required</p>
                    <p className="text-sm mt-1">Please add <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your .env file to enable live maps.</p>
                </div>
                {/* Fallback Static Visualization for Demo if needed */}
                <div className="text-xs text-slate-400 mt-4 max-w-sm text-center">
                    Note: Markers for {markers.map(m => m.label).join(", ")} would appear here.
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative" style={{ height }}>
            <Map
                {...viewState}
                onMove={(evt: any) => setViewState(evt.viewState)}
                style={{ width: "100%", height: "100%" }}
                mapStyle={MAP_STYLE}
                mapboxAccessToken={token}
            >
                <NavigationControl position="top-right" />

                {/* Markers */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        latitude={marker.lat}
                        longitude={marker.lng}
                        anchor="bottom"
                        onClick={(e: any) => {
                            e.originalEvent.stopPropagation()
                            marker.onClick?.()
                        }}
                    >
                        <div className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                            {/* Label on Hover */}
                            {marker.label && (
                                <div className="absolute -top-8 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
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
                    </Marker>
                ))}

                {/* Geofencing Polygon */}
                {geoJsonData && (
                    <Source id="geofence-source" type="geojson" data={geoJsonData}>
                        <Layer
                            id="geofence-fill"
                            type="fill"
                            paint={{
                                "fill-color": "#2BD67C",
                                "fill-opacity": 0.15
                            }}
                        />
                        <Layer
                            id="geofence-line"
                            type="line"
                            paint={{
                                "line-color": "#2BD67C",
                                "line-width": 2,
                                "line-dasharray": [2, 2]
                            }}
                        />
                    </Source>
                )}
            </Map>
        </div>
    )
}
