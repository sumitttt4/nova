"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Filter } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KycPage() {
    const { riders, merchants } = useMockData()
    const router = useRouter()
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const { riders: pendingRiders, merchants: pendingMerchants } = React.useMemo(() => {
        const _riders = riders
            .filter(r => r.kycStatus === 'pending')
            .map(r => ({
                id: r.id,
                name: r.name,
                type: 'Rider',
                submittedAt: r.submittedAt,
                status: 'pending'
            }))
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

        const _merchants = merchants
            .filter(m => m.status === 'under_review')
            .map(m => ({
                id: m.id,
                name: m.storeName,
                type: 'Merchant',
                submittedAt: m.submittedAt,
                status: 'pending'
            }))
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

        return { riders: _riders, merchants: _merchants }
    }, [riders, merchants])

    if (!isMounted) return null

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">KYC Requests</h1>
                    <p className="text-muted-foreground">
                        Centralized queue for verifying ID documents and compliance.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="riders" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="riders" className="relative">
                        Rider Requests
                        {pendingRiders.length > 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                {pendingRiders.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="merchants" className="relative">
                        Store Requests
                        {pendingMerchants.length > 0 && (
                            <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                {pendingMerchants.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 my-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by ID or Name..."
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <TabsContent value="riders" className="rounded-md border bg-card text-card-foreground shadow-sm p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rider ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingRiders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No pending rider KYC requests.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingRiders.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-mono text-xs text-slate-500">{req.id}</TableCell>
                                        <TableCell className="font-medium">{req.name}</TableCell>
                                        <TableCell className="text-sm text-slate-500">
                                            {format(new Date(req.submittedAt), 'dd MMM, HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 uppercase text-[10px]">
                                                Pending Review
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/riders/${req.id}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" /> Review
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="merchants" className="rounded-md border bg-card text-card-foreground shadow-sm p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Store ID</TableHead>
                                <TableHead>Store Name</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingMerchants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No pending merchant KYC requests.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pendingMerchants.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-mono text-xs text-slate-500">{req.id}</TableCell>
                                        <TableCell className="font-medium">{req.name}</TableCell>
                                        <TableCell className="text-sm text-slate-500">
                                            {format(new Date(req.submittedAt), 'dd MMM, HH:mm')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 uppercase text-[10px]">
                                                Pending Review
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push(`/merchants/${req.id}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" /> Review
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="history">
                    <div className="p-8 text-center text-muted-foreground border rounded-md border-dashed">
                        History view coming soon...
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
