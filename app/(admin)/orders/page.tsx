import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { OrdersTable } from "@/components/orders/orders-table"
import { Search, Filter, CreditCard, X } from "lucide-react"

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                <p className="text-muted-foreground">
                    Manage and track customer orders across all stores.
                </p>
            </div>

            <Card className="shadow-apple">
                <CardContent className="p-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by order ID, user, store..."
                                className="w-full pl-9 h-9"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Select>
                                <SelectTrigger className="w-full sm:w-[180px] h-9">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                        <SelectValue placeholder="Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="picked">Picked</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select>
                                <SelectTrigger className="w-full sm:w-[180px] h-9">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                                        <SelectValue placeholder="Payment" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Payments</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="cod">COD</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="sm" className="h-9 px-3 text-muted-foreground hover:text-foreground">
                                <X className="h-3.5 w-3.5 mr-1" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <OrdersTable />
        </div>
    )
}
