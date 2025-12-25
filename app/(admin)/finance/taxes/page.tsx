"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Landmark, FileCheck, AlertCircle } from "lucide-react"
import { format } from "date-fns"

export default function TaxHubPage() {
    const { taxRecords } = useMockData()

    // --- Metrics ---
    const gstOutput = taxRecords.filter(t => t.type === 'GST_OUTPUT').reduce((sum, t) => sum + t.amount, 0)
    const gstInput = taxRecords.filter(t => t.type === 'GST_INPUT').reduce((sum, t) => sum + t.amount, 0)
    const netGstPayable = Math.max(0, gstOutput - gstInput)

    const tdsPayable = taxRecords.filter(t => t.type === 'TDS_PAYABLE' && t.status === 'pending').reduce((sum, t) => sum + t.amount, 0)
    const tcsCollected = taxRecords.filter(t => t.type === 'TCS_COLLECTED').reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Tax & Compliance Hub</h1>
                    <p className="text-muted-foreground">
                        Monitor GST liabilities, TDS deductions, and TCS collections.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export GSTR-1
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="shadow-sm border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Net GST Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{netGstPayable.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Output (Collect) - Input (Credit)</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">TDS Payable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{tdsPayable.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Pending deposit to Govt.</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">TCS Collected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{tcsCollected.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">1% Tax Collected at Source</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Filings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{taxRecords.filter(t => t.status === 'pending').length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all tax types</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="gst" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="gst">GST Reports</TabsTrigger>
                    <TabsTrigger value="tds">TDS (194O)</TabsTrigger>
                    <TabsTrigger value="tcs">TCS (ECO)</TabsTrigger>
                </TabsList>

                <TabsContent value="gst" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>GST Records</CardTitle>
                            <CardDescription>Input Tax Credit and Output Tax Liability.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaxTable records={taxRecords.filter(t => t.type.includes('GST'))} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tds" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>TDS Records</CardTitle>
                            <CardDescription>Tax Deducted at Source (Section 194O) from Merchants.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaxTable records={taxRecords.filter(t => t.type === 'TDS_PAYABLE')} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tcs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>TCS Records</CardTitle>
                            <CardDescription>Tax Collected at Source (1%) for Ecommerce Operations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaxTable records={taxRecords.filter(t => t.type === 'TCS_COLLECTED')} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function TaxTable({ records }: { records: any[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taxable Value</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Tax Amount</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {records.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No records found.</TableCell>
                    </TableRow>
                ) : (
                    records.map((rec) => (
                        <TableRow key={rec.id}>
                            <TableCell className="font-medium">{rec.period}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span>{rec.entityName}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">{rec.entityId}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-xs">{rec.type.replace('_', ' ')}</Badge>
                            </TableCell>
                            <TableCell>₹{rec.taxableAmount.toLocaleString()}</TableCell>
                            <TableCell>{rec.rate}%</TableCell>
                            <TableCell className="text-right font-bold">₹{rec.amount.toLocaleString()}</TableCell>
                            <TableCell>
                                <Badge className={
                                    rec.status === 'paid' || rec.status === 'filed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                }>
                                    {rec.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}
