"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ShieldAlert, Zap } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock Login Logic
        // In real app: Call API -> Verify Credentials -> Set Secure Cookie
        setTimeout(() => {
            // Manually setting cookie for demo purposes (usually done by server)
            document.cookie = "admin_token=mock-jwt-token; path=/"
            router.push("/dashboard")
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[128px]" />
            </div>

            <div className="w-full max-w-md p-6 relative z-10">
                <div className="text-center mb-8">
                    <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 backdrop-blur-md shadow-xl">
                        <Zap className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 mt-2">Sign in to access the Bazuroo Admin Console.</p>
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-slate-200">Email Address</Label>
                            <Input
                                type="email"
                                placeholder="admin@bazuroo.com"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 transition-all h-11"
                                defaultValue="admin@bazuroo.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-200">Password</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500 transition-all h-11"
                                defaultValue="password"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-500/20 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-200/80 leading-relaxed">
                            This is a secure restricted area. All activities are monitored and logged. Unauthorized access is prohibited.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
