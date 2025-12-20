"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, PackageX } from "lucide-react"

export function LiveMenuStatus() {
    const { merchants } = useMockData()

    // Filter merchants who have stock issues (essential or high percentage)
    const criticalMerchants = merchants.filter(
        m => m.catalogStatus?.essentialOutOfStock || (m.catalogStatus?.outOfStock || 0) > 0
    )

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <PackageX className="h-5 w-5 text-slate-500" />
                    Live Menu Health
                </CardTitle>
                <CardDescription>
                    Merchants with critical stock deficits impacting revenue.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {criticalMerchants.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">All systems operational. No critical stock alerts.</div>
                ) : (
                    <div className="space-y-4">
                        {criticalMerchants.map(merchant => (
                            <div key={merchant.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-semibold text-sm">{merchant.storeName}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {merchant.catalogStatus?.outOfStock} items out of stock
                                    </div>
                                </div>

                                {merchant.catalogStatus?.essentialOutOfStock && (
                                    <Badge variant="destructive" className="flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        Essentials OOS
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
