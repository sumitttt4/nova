"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Flame, Zap, Map } from "lucide-react"
import { cn } from "@/lib/utils"

export function ZoneSidebar() {
    const { zones, toggleZoneSurge } = useMockData()

    return (
        <div className="space-y-4 h-full overflow-auto pr-1">
            {zones.map((zone) => {
                const isHighDemand = zone.demandLevel === 'high' || zone.demandLevel === 'critical'

                return (
                    <Card key={zone.id} className={cn("transition-all", isHighDemand && "border-amber-200 bg-amber-50/30")}>
                        <CardHeader className="pb-2 p-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Map className="h-4 w-4 text-slate-500" />
                                    {zone.name}
                                </CardTitle>
                                <Badge variant={isHighDemand ? "destructive" : "secondary"}>
                                    {isHighDemand && <Flame className="h-3 w-3 mr-1 fill-current" />}
                                    {zone.demandLevel.toUpperCase()}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-muted-foreground">Active Orders</div>
                                    <div className="font-semibold text-lg">{zone.activeOrders}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Active Riders</div>
                                    <div className="font-semibold text-lg">{zone.activeRiders}</div>
                                </div>
                            </div>

                            {/* Surge Control */}
                            {isHighDemand && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2 font-medium text-sm text-[#FBC02D]">
                                            <Zap className="h-4 w-4 fill-current" />
                                            Surge Pricing
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Demand is high. Increase rates?
                                        </div>
                                    </div>
                                    <Switch
                                        checked={zone.surgeEnabled}
                                        onCheckedChange={(checked) => toggleZoneSurge(zone.id, checked)}
                                        className="data-[state=checked]:bg-[#FBC02D]"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
