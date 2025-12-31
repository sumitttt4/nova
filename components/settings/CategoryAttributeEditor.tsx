"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Info, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// --- Schemas & Types ---

const categorySchema = z.object({
    maxVariants: z.number().min(1, "Must allow at least 1 variant"),
    maxImages: z.number().min(1, "Must allow at least 1 image"),
    fssaiRequired: z.boolean().optional(),
    drugLicenseRequired: z.boolean().optional(),
    warrantyRequired: z.boolean().optional(),
    minOrderQty: z.number().min(1),
    maxOrderQty: z.number().min(1),
}).refine((data) => data.minOrderQty <= data.maxOrderQty, {
    message: "Min Order Qty cannot be higher than Max Order Qty",
    path: ["minOrderQty"],
})

type CategoryConfig = z.infer<typeof categorySchema>

// Mock Data for Initial State
const INITIAL_CONFIG: Record<string, CategoryConfig> = {
    grocery_food: {
        maxVariants: 20,
        maxImages: 5,
        fssaiRequired: true,
        minOrderQty: 1,
        maxOrderQty: 50
    },
    pharmacy_otc: {
        maxVariants: 10,
        maxImages: 3,
        drugLicenseRequired: true,
        minOrderQty: 1,
        maxOrderQty: 10
    },
    electronics_appliances: {
        maxVariants: 50,
        maxImages: 10,
        warrantyRequired: true,
        minOrderQty: 1,
        maxOrderQty: 5
    }
}

export function CategoryAttributeEditor() {
    const [selectedCategory, setSelectedCategory] = React.useState("grocery_food")
    const [configs, setConfigs] = React.useState(INITIAL_CONFIG)
    const [isSaving, setIsSaving] = React.useState(false)

    // Form initialization
    const form = useForm<CategoryConfig>({
        resolver: zodResolver(categorySchema),
        defaultValues: configs[selectedCategory],
        values: configs[selectedCategory] // Update form when valid state changes
    })

    const { register, handleSubmit, formState: { errors, isDirty }, watch, setValue, reset } = form

    // Reset form when category changes
    React.useEffect(() => {
        reset(configs[selectedCategory])
    }, [selectedCategory, configs, reset])

    const watchAllFields = watch()

    // Helper to check if value changed from system default
    const isChanged = (field: keyof CategoryConfig) => {
        const currentVal = watchAllFields[field]
        const defaultVal = INITIAL_CONFIG[selectedCategory][field]
        return currentVal !== defaultVal
    }

    const onSubmit = (data: CategoryConfig) => {
        setIsSaving(true)
        console.log("Saving for", selectedCategory, data)

        // Mock API Call
        setTimeout(() => {
            setConfigs(prev => ({
                ...prev,
                [selectedCategory]: data
            }))
            setIsSaving(false)
        }, 1000)
    }

    return (
        <Card className="border-slate-100 shadow-lg shadow-slate-200/50 rounded-2xl hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] relative">
            <CardHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 rounded-t-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Category Logic Editor</CardTitle>
                        <CardDescription>Define operational limits and compliance rules per category.</CardDescription>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Category Selector */}
                        <div className="w-[180px]">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-offset-0 focus:ring-slate-900/10 font-medium h-9 text-sm">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grocery_food">Grocery & Food</SelectItem>
                                    <SelectItem value="pharmacy_otc">Pharmacy (OTC)</SelectItem>
                                    <SelectItem value="electronics_appliances">Electronics</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sticky Save Button */}
                        <Button
                            type="submit"
                            form="category-form"
                            disabled={isSaving || !isDirty}
                            className={cn(
                                "bg-[#2BD67C] hover:bg-[#2BD67C]/90 text-white font-bold h-9 px-4 transition-all duration-300",
                                isDirty && !isSaving && "shadow-[0_0_20px_rgba(43,214,124,0.5)] animate-pulse"
                            )}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Configuration"
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* SECTION 1: Operational Limits */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-slate-500" />
                                Operational Limits
                            </CardTitle>
                            <CardDescription className="text-xs">Configure inventory and order quantity constraints.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Max Variants per Item</Label>
                                    <Input
                                        type="number"
                                        {...register("maxVariants", { valueAsNumber: true })}
                                        className={`bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10 ${errors.maxVariants ? "border-red-500" : ""} ${isChanged("maxVariants") ? "border-[#FBC02D] ring-1 ring-[#FBC02D]/20" : ""}`}
                                    />
                                    {errors.maxVariants && <p className="text-xs text-red-500">{errors.maxVariants.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Max Images per Item</Label>
                                    <Input
                                        type="number"
                                        {...register("maxImages", { valueAsNumber: true })}
                                        className={`bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10 ${errors.maxImages ? "border-red-500" : ""} ${isChanged("maxImages") ? "border-[#FBC02D] ring-1 ring-[#FBC02D]/20" : ""}`}
                                    />
                                    {errors.maxImages && <p className="text-xs text-red-500">{errors.maxImages.message}</p>}
                                </div>
                            </div>

                            <Separator className="my-3" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Min Order Qty</Label>
                                    <Input
                                        type="number"
                                        {...register("minOrderQty", { valueAsNumber: true })}
                                        className={`bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10 ${errors.minOrderQty ? "border-red-500" : ""} ${isChanged("minOrderQty") ? "border-[#FBC02D] ring-1 ring-[#FBC02D]/20" : ""}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Max Order Qty</Label>
                                    <Input
                                        type="number"
                                        {...register("maxOrderQty", { valueAsNumber: true })}
                                        className={`bg-slate-50 border-slate-200 focus-visible:ring-offset-0 focus-visible:ring-slate-900/10 ${errors.maxOrderQty ? "border-red-500" : ""} ${isChanged("maxOrderQty") ? "border-[#FBC02D] ring-1 ring-[#FBC02D]/20" : ""}`}
                                    />
                                </div>
                            </div>
                            {errors.minOrderQty && <p className="text-sm text-red-500 flex items-center gap-1 mt-1"><AlertTriangle className="h-3 w-3" /> {errors.minOrderQty.message}</p>}
                        </CardContent>
                    </Card>

                    {/* SECTION 2: Legal Compliance */}
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Info className="h-4 w-4 text-slate-500" />
                                Legal Compliance
                            </CardTitle>
                            <CardDescription className="text-xs">Mandatory licenses and certifications for this category.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Grocery Specific */}
                            {selectedCategory === 'grocery_food' && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">FSSAI License Mandatory</Label>
                                        <p className="text-xs text-slate-500">Merchants must upload FSSAI certificate to sell.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {form.getValues("fssaiRequired") && <span className="text-xs font-bold text-[#FBC02D] bg-[#FBC02D]/10 px-2 py-1 rounded">STRICT</span>}
                                        <Switch
                                            checked={watch("fssaiRequired")}
                                            onCheckedChange={(checked) => setValue("fssaiRequired", checked, { shouldDirty: true })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Pharmacy Specific */}
                            {selectedCategory === 'pharmacy_otc' && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">Drug License Verification</Label>
                                        <p className="text-xs text-slate-500">Retail Drug License (Form 20/21) required.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {form.getValues("drugLicenseRequired") && <span className="text-xs font-bold text-[#FBC02D] bg-[#FBC02D]/10 px-2 py-1 rounded">STRICT</span>}
                                        <Switch
                                            checked={watch("drugLicenseRequired")}
                                            onCheckedChange={(checked) => setValue("drugLicenseRequired", checked, { shouldDirty: true })}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Electronics Specific */}
                            {selectedCategory === 'electronics_appliances' && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium">Warranty Info Required</Label>
                                        <p className="text-xs text-slate-500">Force merchants to provide warranty details.</p>
                                    </div>
                                    <Switch
                                        checked={watch("warrantyRequired")}
                                        onCheckedChange={(checked) => setValue("warrantyRequired", checked, { shouldDirty: true })}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </form>
            </CardContent>
            <CardFooter className="flex justify-center items-center bg-slate-50/50 p-3 border-t">
                <p className="text-xs text-slate-400">
                    Changes reflect immediately in Store App.
                </p>
            </CardFooter>
        </Card>
    )
}
