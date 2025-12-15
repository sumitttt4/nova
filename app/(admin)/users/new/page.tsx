"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewUserPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto py-8 animate-in fade-in">
            <Link href="/users" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
            </Link>

            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Create User Profile</h1>
                <p className="text-muted-foreground">Manually register a new customer account.</p>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            <Input placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            <Input placeholder="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label>Mobile Number</Label>
                        <Input placeholder="+91" />
                    </div>
                    <div className="space-y-2">
                        <Label>Initial Password</Label>
                        <Input type="password" />
                    </div>

                    <Button className="w-full mt-4">Create Account</Button>
                </CardContent>
            </Card>
        </div>
    )
}
