"use client"

import * as React from "react"
import { useMockData } from "@/contexts/MockDataContext"
import { AppSettings } from "@/contexts/MockDataContext"
import { AppConfigCard } from "@/components/settings/AppConfigCard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryAttributeEditor } from "@/components/settings/CategoryAttributeEditor"
import { Save, Smartphone, Store, Bike, Sparkles } from "lucide-react"

export default function SettingsPage() {
    const { appSettings } = useMockData()
    const [isSaving, setIsSaving] = React.useState(false)

    const onSave = () => {
        setIsSaving(true)
        // Simulate Server Action which updates 'updatedAt'
        setTimeout(() => setIsSaving(false), 1000)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-4 border-b">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Control Center</h1>
                    <p className="text-muted-foreground">Manage versions, maintenance, and support for all platforms.</p>
                </div>
                <Button onClick={onSave} disabled={isSaving} className="bg-[#2BD67C] hover:bg-[#2BD67C]/90 text-black font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
                    {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Configuration</>}
                </Button>
            </div>

            <Tabs defaultValue="user_app" className="w-full space-y-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-4 h-12 bg-white border border-slate-200/60 shadow-sm rounded-xl p-1">
                    <TabsTrigger value="user_app" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300">
                        <Smartphone className="h-4 w-4" />
                        User App
                    </TabsTrigger>
                    <TabsTrigger value="store_app" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300">
                        <Store className="h-4 w-4" />
                        Merchant
                    </TabsTrigger>
                    <TabsTrigger value="rider_app" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300">
                        <Bike className="h-4 w-4" />
                        Rider
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300">
                        <Sparkles className="h-4 w-4" />
                        Store Logic
                    </TabsTrigger>
                </TabsList>

                {/* User App Settings */}
                <TabsContent value="user_app" className="space-y-4 focus-visible:outline-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">Customer Application</h2>
                            <p className="text-sm text-slate-500">Configure settings for the main Play Store / App Store customer app.</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                            Last update: {appSettings.user_app ? new Date(appSettings.user_app.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    {appSettings.user_app && <AppConfigCard appKey="user_app" data={appSettings.user_app} />}
                </TabsContent>

                {/* Merchant App Settings */}
                <TabsContent value="store_app" className="space-y-4 focus-visible:outline-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">Merchant Dashboard App</h2>
                            <p className="text-sm text-slate-500">Settings for the business partner application.</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                            Last update: {appSettings.store_app ? new Date(appSettings.store_app.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    {appSettings.store_app && <AppConfigCard appKey="store_app" data={appSettings.store_app} />}
                </TabsContent>

                {/* Rider App Settings */}
                <TabsContent value="rider_app" className="space-y-4 focus-visible:outline-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">Delivery Partner App</h2>
                            <p className="text-sm text-slate-500">Configuration for the logistics and rider fleet app.</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                            Last update: {appSettings.rider_app ? new Date(appSettings.rider_app.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    {appSettings.rider_app && <AppConfigCard appKey="rider_app" data={appSettings.rider_app} />}
                </TabsContent>

                {/* Category Logic Editor */}
                <TabsContent value="categories" className="space-y-4 focus-visible:outline-none">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-lg font-semibold tracking-tight">Store Category Logic</h2>
                            <p className="text-sm text-slate-500">Configure business rules, compliance, and limits for store categories.</p>
                        </div>
                    </div>
                    <CategoryAttributeEditor />
                </TabsContent>
            </Tabs>
        </div>
    )
}
