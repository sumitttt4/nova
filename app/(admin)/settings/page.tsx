"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Configuration</CardTitle>
                            <CardDescription>
                                Configure general platform settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Maintenance Mode</Label>
                                    <CardDescription>
                                        Temporarily disable the platform for all users.
                                    </CardDescription>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Automatic Payouts</Label>
                                    <CardDescription>
                                        Process store and rider payouts automatically daily.
                                    </CardDescription>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Platform Name</Label>
                                <Input defaultValue="Bazuroo" />
                            </div>
                            <div className="space-y-2">
                                <Label>Support Email</Label>
                                <Input defaultValue="support@bazuroo.in" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="account">
                    <div className="text-muted-foreground p-4">Account settings content...</div>
                </TabsContent>
                <TabsContent value="notifications">
                    <div className="text-muted-foreground p-4">Notification preferences...</div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
