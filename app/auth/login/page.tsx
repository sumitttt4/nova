"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Check, Zap } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock Login Logic
        setTimeout(() => {
            // Clear existing cookies
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            // Set Admin Cookie
            document.cookie = "admin_token=mock-jwt-token; path=/"
            document.cookie = "user_role=admin; path=/"

            router.push("/dashboard")
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] font-sans text-[#1F2937]">
            <div className="w-full max-w-sm px-4">
                <div className="text-center mb-8">
                    <div className="bg-white mx-auto w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                        <Zap className="h-6 w-6 text-[#26BF42] fill-[#26BF42]" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Nova Admin Panel</h1>
                    <p className="text-[#6B7280] text-sm mt-1">Sign in to manage operations</p>
                </div>

                <Card className="bg-white border-0 shadow-[0_4px_6px_rgba(0,0,0,0.05)] p-8 rounded-2xl ring-1 ring-gray-100">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[#6B7280] font-medium text-xs uppercase tracking-wide">
                                Email Address
                            </Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#26BF42] transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="admin@nova-admin.com"
                                    className="pl-10 h-10 bg-white border-[#E5E7EB] text-[#1F2937] placeholder:text-gray-400 focus:border-[#26BF42] focus:ring-[#26BF42] rounded-lg transition-all"
                                    defaultValue="admin@nova-admin.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[#6B7280] font-medium text-xs uppercase tracking-wide">
                                Password
                            </Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#26BF42] transition-colors" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-10 bg-white border-[#E5E7EB] text-[#1F2937] placeholder:text-gray-400 focus:border-[#26BF42] focus:ring-[#26BF42] rounded-lg transition-all"
                                    defaultValue="password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" className="border-[#D1D5DB] data-[state=checked]:bg-[#26BF42] data-[state=checked]:border-[#26BF42]" />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none text-[#6B7280] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Remember me
                                </label>
                            </div>
                            <button type="button" className="text-sm font-medium text-[#26BF42] hover:text-[#20A035] hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 bg-[#26BF42] hover:bg-[#20A035] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-xs text-[#9CA3AF] mt-6">
                    Need access? Contact <span className="text-[#6B7280] font-medium hover:text-[#1F2937] transition-colors cursor-pointer">super admin</span>
                </p>
            </div>
        </div>
    )
}
