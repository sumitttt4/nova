"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewMerchantPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto py-8 animate-in fade-in">
            <Link href="/merchants" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Merchants
            </Link>

            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Merchant Onboarding</h1>
                <p className="text-muted-foreground">Register a new business entity.</p>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label>Business Legal Name</Label>
                        <Input placeholder="e.g. Spice World Private Limited" />
                    </div>
                    <div className="space-y-2">
                        <Label>GSTIN</Label>
                        <Input placeholder="29ABCDE1234F1Z5" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Contact Person</Label>
                            <Input placeholder="Representative Name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input placeholder="+91" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Official Email</Label>
                        <Input type="email" placeholder="accounts@business.com" />
                    </div>

                    <Button className="w-full mt-4">Proceed to Agreement</Button>
                </CardContent>
            </Card>
        </div>
    )
}
