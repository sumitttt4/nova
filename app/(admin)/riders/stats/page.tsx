"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RiderRatingChart } from "@/components/riders/RiderRatingChart"
import { RiderLifecycle } from "@/components/riders/RiderLifecycle"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Zap, AlertTriangle } from "lucide-react"

export default function RiderStatsPage() {
    const { riders } = useMockData()

    // Filter active riders for stats
    const activeRiders = riders.filter(r => r.status === 'active')

    // Top Performers based on rating > 4.5
    const topPerformers = activeRiders
        .filter(r => (r.metrics?.rating || 0) >= 4.5)
        .sort((a, b) => (b.metrics?.rating || 0) - (a.metrics?.rating || 0))
        .slice(0, 5)

    // Low Performers (Risk) based on rating < 4.0
    const atRiskRiders = activeRiders
        .filter(r => (r.metrics?.rating || 0) > 0 && (r.metrics?.rating || 0) < 4.0)

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Rider Performance</h1>
                <p className="text-muted-foreground">
                    Insights into fleet quality, ratings, and operational efficiency.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Active Fleet</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeRiders.length}</div>
                        <p className="text-xs text-muted-foreground">Currently operational riders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
                        <Trophy className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{topPerformers.length}</div>
                        <p className="text-xs text-muted-foreground">Riders with 4.5+ rating</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{atRiskRiders.length}</div>
                        <p className="text-xs text-muted-foreground">Riders with &lt; 4.0 rating</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Online Time</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">~4.5 hrs</div>
                        <p className="text-xs text-muted-foreground">Daily average per rider</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RiderLifecycle />
                <div className="h-[400px]">
                    <RiderRatingChart />
                </div>
            </div>

            {/* Top Performers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Riders</CardTitle>
                    <CardDescription>Highest rated partners driving excellence.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rider</TableHead>
                                <TableHead>Zone</TableHead>
                                <TableHead>Online Time</TableHead>
                                <TableHead className="text-right">Rating</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topPerformers.map((rider) => (
                                <TableRow key={rider.id}>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{rider.name}</span>
                                            <span className="text-xs text-muted-foreground">{rider.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{rider.location.address.split(',')[0]}</TableCell>
                                    <TableCell>{Math.floor((rider.metrics?.onlineTime || 0) / 60)}h {(rider.metrics?.onlineTime || 0) % 60}m</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            {rider.metrics?.rating} ★
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {topPerformers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
