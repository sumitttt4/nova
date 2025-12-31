"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewUserPage() {
    const router = useRouter()
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [success, setSuccess] = React.useState(false)

    const isFormValid = firstName && lastName && email && phone && password

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid) return

        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setSuccess(true)
            setTimeout(() => {
                router.push("/users")
            }, 1500)
        }, 1000)
    }

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
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 mb-4">
                            <Label>Mobile Number</Label>
                            <Input
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 mb-6">
                            <Label>Initial Password</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#278F27] hover:bg-[#278F27]/90 text-white"
                            disabled={!isFormValid || isSubmitting || success}
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {success && <CheckCircle2 className="h-4 w-4 mr-2" />}
                            {success ? "Account Created!" : isSubmitting ? "Creating..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
