"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { differenceInMinutes } from "date-fns"
import { AlertTriangle, Clock, Activity } from "lucide-react"

export function RiderLifecycle() {
    const { riders } = useMockData()

    // Mock "Now" as usually the mock data context defines it, but here we can just use new Date() or consistent mock time if exported. 
    // Since MockDataContext uses a fixed MOCK_NOW, we should ideally use that, but it's internal to the context file.
    // We'll calculate relative to "now" assuming the data fits. 
    // Actually, let's just use the `lastOrderTime` and see if it's > 30 mins ago.
    const NOW = new Date("2023-11-20T10:00:00") // Matching the mock data context time for consistency

    const atRiskRiders = riders.filter(rider => {
        if (rider.status !== 'active' || rider.activeOrder) return false
        if (!rider.metrics?.lastOrderTime) return false

        const minutesSinceLastOrder = differenceInMinutes(NOW, new Date(rider.metrics.lastOrderTime))
        return minutesSinceLastOrder > 30
    })

    const totalOnlineMinutes = riders.reduce((acc, r) => acc + (r.metrics?.onlineTime || 0), 0)
    const totalActiveMinutes = riders.reduce((acc, r) => acc + (r.metrics?.activeTime || 0), 0)
    const utilization = totalOnlineMinutes > 0 ? Math.round((totalActiveMinutes / totalOnlineMinutes) * 100) : 0

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Rider Lifecycle
                    </div>
                </CardTitle>
                <CardDescription>Efficiency tracking & churn prevention</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-500 font-medium mb-1">Fleet Utilization</div>
                        <div className="text-2xl font-bold text-slate-900">{utilization}%</div>
                        <div className="text-xs text-slate-400 mt-1">Active vs Online Time</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <div className="text-xs text-orange-600 font-medium mb-1">At Risk (Idle &gt; 30m)</div>
                        <div className="text-2xl font-bold text-orange-700">{atRiskRiders.length}</div>
                        <div className="text-xs text-orange-400 mt-1">Riders needing attention</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Churn Alerts
                    </h4>
                    {atRiskRiders.length === 0 ? (
                        <div className="text-sm text-slate-500 italic">No riders at risk currently.</div>
                    ) : (
                        atRiskRiders.slice(0, 3).map(rider => (
                            <div key={rider.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {rider.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-900">{rider.name}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            Idle for {differenceInMinutes(NOW, new Date(rider.metrics!.lastOrderTime!))}m
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                    Risk
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
