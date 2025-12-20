"use client"

import { LiveMap } from "@/components/live-ops/LiveMap"
import { ZoneSidebar } from "@/components/live-ops/ZoneSidebar"
import { Activity } from "lucide-react"

export default function LiveOpsPage() {
    return (
        <div className="h-[calc(100vh-80px)] flex flex-col space-y-4 animate-in fade-in duration-500 pb-4">
            <div className="flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Activity className="h-6 w-6 text-[#2BD67C]" />
                        Live Operations
                    </h1>
                    <p className="text-muted-foreground">Real-time fleet monitoring and demand heatmaps.</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                {/* Main Map Area */}
                <div className="lg:col-span-3 h-[500px] lg:h-full min-h-[500px]">
                    <LiveMap />
                </div>

                {/* Side Panel for Zones */}
                <div className="lg:col-span-1 h-full overflow-hidden flex flex-col">
                    <h3 className="font-semibold mb-4 text-sm uppercase text-muted-foreground tracking-wider">
                        Zone Performance
                    </h3>
                    <ZoneSidebar />
                </div>
            </div>
        </div>
    )
}
