"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewStorePage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto py-8 animate-in fade-in">
            <Link href="/stores" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Stores
            </Link>

            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Add New Store</h1>
                <p className="text-muted-foreground">Fill in the details to onboard a new partner store.</p>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label>Store Name</Label>
                        <Input placeholder="e.g. Tasty Bites" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Input placeholder="e.g. Fast Food" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input placeholder="+91" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Full Address</Label>
                        <Input placeholder="Street, Area, City..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Owner Email</Label>
                        <Input type="email" placeholder="partner@example.com" />
                    </div>

                    <Button className="w-full bg-[#2BD67C] hover:bg-[#25b869] text-white mt-4">Create Store</Button>
                </CardContent>
            </Card>
        </div>
    )
}
