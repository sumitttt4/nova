"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Filter, Download, ArrowUpRight } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SettlementHistory } from "@/components/finance/SettlementHistory"
import { CreateSettlementRun } from "@/components/finance/CreateSettlementRun"
import { Receipt } from "lucide-react"

const storePayouts = [
    {
        id: "PAY-9901",
        recipient: "Burger King (MG Road)",
        type: "Store",
        amount: "₹12,450.00",
        status: "Processed",
        date: "12 Oct, 2023",
        account: "**** 8892"
    },
    {
        id: "PAY-9902",
        recipient: "Fresh Mart",
        type: "Store",
        amount: "₹8,200.00",
        status: "Processing",
        date: "13 Oct, 2023",
        account: "**** 1234"
    },
    {
        id: "PAY-9903",
        recipient: "Pizza Hut",
        type: "Store",
        amount: "₹15,300.00",
        status: "Failed",
        date: "11 Oct, 2023",
        account: "**** 5566"
    },
]

const riderPayouts = [
    {
        id: "PAY-8801",
        recipient: "Suresh Kumar",
        type: "Rider",
        amount: "₹2,450.00",
        status: "Processed",
        date: "12 Oct, 2023",
        account: "**** 1111"
    },
    {
        id: "PAY-8802",
        recipient: "Ramesh Babu",
        type: "Rider",
        amount: "₹1,800.00",
        status: "Processed",
        date: "12 Oct, 2023",
        account: "**** 2222"
    },
]

export default function PayoutsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                    <h1 className="text-2xl font-bold tracking-tight">Payouts & Settlements</h1>
                    <p className="text-muted-foreground">
                        Manage outgoing payments to partners and riders.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button className="gap-2">
                        Process Payouts
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Payouts</TabsTrigger>
                    <TabsTrigger value="stores">Stores</TabsTrigger>
                    <TabsTrigger value="riders">Riders</TabsTrigger>
                    <TabsTrigger value="settlements" className="gap-2">
                        <Receipt className="h-4 w-4" /> Full Settlements
                    </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 my-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search payout ID or recipient..."
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <TabsContent value="all" className="rounded-md border bg-card text-card-foreground shadow-sm p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payout ID</TableHead>
                                <TableHead>Recipient</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Account</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...storePayouts, ...riderPayouts].map((payout) => (
                                <TableRow key={payout.id}>
                                    <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                                    <TableCell className="font-medium">{payout.recipient}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal">
                                            {payout.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">{payout.account}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                payout.status === "Processed"
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : payout.status === "Processing"
                                                        ? "bg-blue-100 text-blue-700 border-blue-200"
                                                        : "bg-red-100 text-red-700 border-red-200"
                                            }
                                        >
                                            {payout.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{payout.date}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        {payout.amount}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View Breakdown</DropdownMenuItem>
                                                <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="stores">
                    <div className="p-8 text-center text-muted-foreground">Store payouts filtered view...</div>
                </TabsContent>
                <TabsContent value="riders">
                    <div className="p-8 text-center text-muted-foreground">Rider payouts filtered view...</div>
                </TabsContent>

                <TabsContent value="settlements" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <SettlementHistory />
                        </div>
                        <div>
                            <CreateSettlementRun />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
