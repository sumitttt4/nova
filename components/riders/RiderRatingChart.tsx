"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Star } from "lucide-react"

export function RiderRatingChart() {
    const { riders } = useMockData()

    // Calculate distribution
    const distribution = [
        { name: "< 4.0", count: 0, color: "#ef4444" }, // Red
        { name: "4.0 - 4.5", count: 0, color: "#f59e0b" }, // Amber
        { name: "4.5 - 5.0", count: 0, color: "#22c55e" }, // Green
    ]

    let lowRatedRidersConfirm = 0

    riders.forEach(r => {
        const rating = r.metrics?.rating || 0
        if (rating < 4.0 && rating > 0) {
            distribution[0].count++
            lowRatedRidersConfirm++
        }
        else if (rating >= 4.0 && rating < 4.5) distribution[1].count++
        else if (rating >= 4.5) distribution[2].count++
    })

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded shadow-sm text-xs">
                    <p className="font-semibold">{label}</p>
                    <p>{`${payload[0].value} Riders`}</p>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    Rating Distribution
                </CardTitle>
                <CardDescription>
                    Quality assurance & fleet standards
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                {distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Avg Fleet Rating</span>
                        <span className="font-bold text-slate-900">4.4 / 5.0</span>
                    </div>
                    {lowRatedRidersConfirm > 0 && (
                        <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded flex items-center gap-2">
                            <Star className="h-3 w-3 fill-current" />
                            {lowRatedRidersConfirm} riders below 4.0 threshold.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
