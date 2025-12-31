"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function StoreSettingsPage() {
    const [commission, setCommission] = React.useState("15")
    const [onboardingFee, setOnboardingFee] = React.useState("999")
    const [autoApprove, setAutoApprove] = React.useState(false)
    const [requireFSSAI, setRequireFSSAI] = React.useState(true)
    const [saved, setSaved] = React.useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        setCommission("15")
        setOnboardingFee("999")
        setAutoApprove(false)
        setRequireFSSAI(true)
    }

    return (
        <div className="space-y-6 max-w-4xl animate-in fade-in">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Store Configurations</h1>
                <p className="text-muted-foreground">Global settings applied to all store partners.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Commission & Fees</CardTitle>
                        <CardDescription>Set default commission rates for new stores.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Default Commission (%)</Label>
                                <Input
                                    value={commission}
                                    onChange={(e) => setCommission(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Onboarding Fee (₹)</Label>
                                <Input
                                    value={onboardingFee}
                                    onChange={(e) => setOnboardingFee(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Operational Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Auto-Approve Menu Updates</Label>
                                <p className="text-sm text-muted-foreground">Allow stores to change prices without review</p>
                            </div>
                            <Switch
                                checked={autoApprove}
                                onCheckedChange={setAutoApprove}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Require FSSAI License</Label>
                                <p className="text-sm text-muted-foreground">Mandatory upload during onboarding</p>
                            </div>
                            <Switch
                                checked={requireFSSAI}
                                onCheckedChange={setRequireFSSAI}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handleReset}>Reset</Button>
                    <Button
                        className="bg-[#2BD67C] hover:bg-[#25b869] text-white gap-2"
                        onClick={handleSave}
                    >
                        {saved && <CheckCircle2 className="h-4 w-4" />}
                        {saved ? "Saved!" : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
