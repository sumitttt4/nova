"use client"

import * as React from "react"
import { AppSettings, useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Smartphone, LifeBuoy, ExternalLink, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppConfigCardProps {
    appKey: string
    data: AppSettings
}

export function AppConfigCard({ appKey, data }: AppConfigCardProps) {
    const { updateAppSettings } = useMockData()
    const [forceUpdateDialogOpen, setForceUpdateDialogOpen] = React.useState(false)
    const [pendingForceUpdate, setPendingForceUpdate] = React.useState<{ platform: 'android' | 'ios', value: boolean } | null>(null)

    const handleUpdate = (section: keyof AppSettings, field: string, value: any) => {
        const updatedApp = { ...data }
        // @ts-ignore
        if (typeof updatedApp[section] === 'object' && updatedApp[section] !== null) {
            // @ts-ignore
            updatedApp[section] = { ...updatedApp[section], [field]: value }
        } else {
            // @ts-ignore
            updatedApp[section] = value
        }
        updateAppSettings(appKey, updatedApp)
    }

    const handleVersionUpdate = (platform: 'android' | 'ios', field: string, value: any) => {
        const updatedApp = { ...data }
        updatedApp.version[platform] = {
            ...updatedApp.version[platform],
            [field]: value
        }
        updateAppSettings(appKey, updatedApp)
    }

    const initiateForceUpdateToggle = (platform: 'android' | 'ios', currentValue: boolean) => {
        setPendingForceUpdate({ platform, value: !currentValue })
        setForceUpdateDialogOpen(true)
    }

    const confirmForceUpdate = () => {
        if (pendingForceUpdate) {
            handleVersionUpdate(pendingForceUpdate.platform, 'force_update', pendingForceUpdate.value)
        }
        setForceUpdateDialogOpen(false)
        setPendingForceUpdate(null)
    }

    return (
        <div className="space-y-6">
            {/* Danger Zone: Maintenance */}
            <Card className={cn("transition-all duration-300 border-l-4 rounded-2xl shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]", data.maintenance.active ? "border-l-[#FBC02D] border-y-[#FBC02D]/20 border-r-[#FBC02D]/20 bg-yellow-50/30" : "border-l-slate-200 border-slate-100")}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className={cn("h-5 w-5", data.maintenance.active ? "text-[#FBC02D]" : "text-slate-400")} />
                                <CardTitle className="text-base font-bold">Maintenance Mode</CardTitle>
                            </div>
                            <CardDescription>Temporarily disable the app for users.</CardDescription>
                        </div>
                        <Switch
                            checked={data.maintenance.active}
                            onCheckedChange={(checked) => handleUpdate('maintenance', 'active', checked)}
                            className={cn(data.maintenance.active && "data-[state=checked]:bg-[#FBC02D]")}
                        />
                    </div>
                </CardHeader>
                {data.maintenance.active && (
                    <CardContent className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-0">
                        <Separator className="my-2 bg-yellow-200/50" />
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Maintenance Title</Label>
                                <Input
                                    value={data.maintenance.title}
                                    onChange={(e) => handleUpdate('maintenance', 'title', e.target.value)}
                                    className="bg-white border-yellow-200/60 focus-visible:ring-yellow-400/50 text-slate-900 shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Banner Message</Label>
                                <Input
                                    value={data.maintenance.banner_message}
                                    onChange={(e) => handleUpdate('maintenance', 'banner_message', e.target.value)}
                                    className="bg-white border-yellow-300/50 focus-visible:ring-yellow-500/50 shadow-sm font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Full Message</Label>
                            <Input
                                value={data.maintenance.message}
                                onChange={(e) => handleUpdate('maintenance', 'message', e.target.value)}
                                className="bg-white border-yellow-200/60 focus-visible:ring-yellow-400/50 text-slate-900 shadow-sm"
                            />
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Main Configuration Card */}
            <Card className="shadow-lg shadow-slate-200/50 border-slate-100 rounded-2xl hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-slate-500" />
                        <CardTitle className="text-base font-bold">App Configuration</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* Version Control Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-slate-500" />
                                Version Control
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Android Column */}
                            <div className="space-y-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                <div className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span> Android
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Current</Label>
                                        <div className="flex items-center justify-between px-3 py-2 bg-white border rounded-md text-sm font-mono text-slate-700 shadow-sm">
                                            {data.version.android.current}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase">Min. Required</Label>
                                        <Input
                                            value={data.version.android.minimum_required}
                                            onChange={(e) => handleVersionUpdate('android', 'minimum_required', e.target.value)}
                                            className="font-mono bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div
                                        onClick={() => initiateForceUpdateToggle('android', data.version.android.force_update)}
                                        className={cn("cursor-pointer flex items-center justify-between p-2 rounded border transition-colors hover:bg-slate-100", data.version.android.force_update ? "bg-amber-50 border-amber-200 hover:bg-amber-100" : "bg-white border-slate-200")}
                                    >
                                        <span className={cn("text-xs font-medium", data.version.android.force_update ? "text-amber-700" : "text-slate-600")}>
                                            Force Update Active
                                        </span>
                                        <Switch
                                            checked={data.version.android.force_update}
                                            className={cn("scale-75 pointer-events-none", data.version.android.force_update && "data-[state=checked]:bg-[#FBC02D]")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* iOS Column */}
                            <div className="space-y-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                <div className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-slate-400"></span> iOS
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Current</Label>
                                        <div className="flex items-center justify-between px-3 py-2 bg-white border rounded-md text-sm font-mono text-slate-700 shadow-sm">
                                            {data.version.ios.current}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700 uppercase">Min. Required</Label>
                                        <Input
                                            value={data.version.ios.minimum_required}
                                            onChange={(e) => handleVersionUpdate('ios', 'minimum_required', e.target.value)}
                                            className="font-mono bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <div
                                        onClick={() => initiateForceUpdateToggle('ios', data.version.ios.force_update)}
                                        className={cn("cursor-pointer flex items-center justify-between p-2 rounded border transition-colors hover:bg-slate-100", data.version.ios.force_update ? "bg-amber-50 border-amber-200 hover:bg-amber-100" : "bg-white border-slate-200")}
                                    >
                                        <span className={cn("text-xs font-medium", data.version.ios.force_update ? "text-amber-700" : "text-slate-600")}>
                                            Force Update Active
                                        </span>
                                        <Switch
                                            checked={data.version.ios.force_update}
                                            className={cn("scale-75 pointer-events-none", data.version.ios.force_update && "data-[state=checked]:bg-[#FBC02D]")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Support Hub Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                <LifeBuoy className="h-4 w-4 text-blue-500" />
                                Support Channels
                            </h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Contact Number</Label>
                                <Input
                                    value={data.support.contact}
                                    onChange={(e) => handleUpdate('support', 'contact', e.target.value)}
                                    placeholder="+91..."
                                    className="bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Hepl Email</Label>
                                <Input
                                    value={data.support.email}
                                    onChange={(e) => handleUpdate('support', 'email', e.target.value)}
                                    placeholder="support@bazuroo.com"
                                    className="bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label className="font-bold text-slate-700">WhatsApp Integration</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={data.support.whatsapp}
                                        onChange={(e) => handleUpdate('support', 'whatsapp', e.target.value)}
                                        placeholder="https://wa.me/..."
                                        className="bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10"
                                    />
                                    <Button
                                        className="bg-[#278F27] hover:bg-[#278F27]/90 text-white shrink-0"
                                        onClick={() => window.open(data.support.whatsapp, '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Test
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={forceUpdateDialogOpen} onOpenChange={setForceUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Apply Force Update?</DialogTitle>
                        <DialogDescription>
                            This will immediately block all users on versions lower than <span className="font-bold">{pendingForceUpdate ? data.version[pendingForceUpdate.platform].minimum_required : ''}</span> from using the app until they update.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setForceUpdateDialogOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-[#FBC02D] text-black hover:bg-[#FBC02D]/90"
                            onClick={confirmForceUpdate}
                        >
                            Confirm Force Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
