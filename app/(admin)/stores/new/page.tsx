"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Check,
    ChevronRight,
    Store,
    ShoppingBasket,
    Carrot,
    Croissant,
    Milk,
    Fish,
    CupSoda,
    Cookie,
    Smile,
    Home,
    Pencil,
    Gamepad2,
    Baby,
    Dog,
    Pill,
    Dumbbell,
    Car,
    Hammer,
    ChefHat,
    Armchair,
    Lamp,
    Book,
    Shirt,
    Footprints,
    Watch,
    Tv,
    Smartphone,
    Laptop,
    Mouse,
    Headphones,
    Lightbulb,
    ShoppingBag,
    AlertCircle,
    FileCheck,
    Truck,
    CreditCard,
    ImagePlus
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
// Import Context
import { useMockData } from "@/contexts/MockDataContext"

// Import Configuration
import storeConfig from "@/config/store-types.json"

// --- Icon Mapping ---
const IconMap: Record<string, React.ElementType> = {
    grocery_food: ShoppingBasket,
    fruits_veg: Carrot,
    bakery: Croissant,
    dairy: Milk,
    meat_seafood: Fish,
    beverages: CupSoda,
    snacks: Cookie,
    personal_care: Smile,
    household: Home,
    stationery: Pencil,
    toys: Gamepad2,
    baby_care: Baby,
    pet_supplies: Dog,
    pharmacy_otc: Pill,
    sports_fitness: Dumbbell,
    auto_accessories: Car,
    hardware_tools: Hammer,
    home_kitchen: ChefHat,
    furniture: Armchair,
    decor: Lamp,
    books_media: Book,
    fashion_men: Shirt,
    fashion_women: ShoppingBag,
    fashion_kids: Baby,
    footwear: Footprints,
    accessories: Watch,
    electronics_appliances: Tv,
    phones: Smartphone,
    laptops: Laptop,
    computer_accessories: Mouse,
    audio_wearables: Headphones,
    lighting_electrical: Lightbulb,
    fashion_store: Shirt
}

export default function NewStorePage() {
    const router = useRouter()
    const { addNewMerchant } = useMockData()
    const [step, setStep] = React.useState(1)
    const [selectedType, setSelectedType] = React.useState<string | null>(null)
    const [formData, setFormData] = React.useState({
        storeName: "",
        ownerName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        fssai: "",
        drugLicense: "",
        gst: ""
    })

    const currentConfig = selectedType ? (storeConfig.storeTypes as any)[selectedType] : null

    const handleNext = () => setStep(prev => prev + 1)
    const handleBack = () => setStep(prev => prev - 1)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        if (!selectedType) return

        // Create the new merchant entry
        addNewMerchant({
            storeName: formData.storeName,
            storeType: selectedType,
            storeLabel: currentConfig?.label || selectedType,
            status: "approved", // Auto-approve for demo
            personal: {
                name: formData.ownerName,
                email: formData.email,
                phone: formData.phone
            },
            address: {
                line1: formData.address,
                line2: "",
                city: formData.city,
                state: "State", // Default
                pincode: formData.pincode,
                fullAddress: `${formData.address}, ${formData.city} - ${formData.pincode}`,
                lat: 0,
                lng: 0
            },
            location: `${formData.city}, India`,
            submittedAt: new Date().toISOString()
        })

        router.push("/stores?new_store_created=true")
    }

    // --- Steps Rendering ---

    const renderStep1_TypeSelection = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-semibold">What kind of store is this?</h2>
                <p className="text-muted-foreground">Select the category that best describes the partner's business.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Object.entries(storeConfig.storeTypes).map(([key, value]: [string, any]) => {
                    const Icon = IconMap[key] || Store
                    const isSelected = selectedType === key

                    return (
                        <div
                            key={key}
                            onClick={() => setSelectedType(key)}
                            className={cn(
                                "cursor-pointer group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                                isSelected
                                    ? "border-[#2BD67C] bg-[#2BD67C]/5 shadow-[#2BD67C]/10"
                                    : "border-slate-100 bg-white hover:border-slate-200"
                            )}
                        >
                            <div className={cn(
                                "mb-3 p-3 rounded-full transition-colors",
                                isSelected ? "bg-[#2BD67C] text-white" : "bg-slate-50 text-slate-500 group-hover:bg-slate-100"
                            )}>
                                <Icon className="h-6 w-6" />
                            </div>
                            <span className={cn(
                                "text-sm font-medium text-center",
                                isSelected ? "text-[#2BD67C]" : "text-slate-600"
                            )}>
                                {value.label}
                            </span>
                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <div className="h-5 w-5 bg-[#2BD67C] rounded-full flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    const renderStep2_BasicDetails = () => (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-semibold">Store Details</h2>
                <p className="text-muted-foreground">Enter the basic information for <strong>{currentConfig?.label}</strong>.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Identity & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name <span className="text-red-500">*</span></Label>
                            <Input id="storeName" name="storeName" value={formData.storeName} onChange={handleInputChange} placeholder="e.g. Fresh Mart" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ownerName">Owner Name</Label>
                            <Input id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder="e.g. John Doe" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="partner@bazuroo.com" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
                        <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Shop No. 12, Main Market..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="400001" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    const renderStep3_Compliance = () => {
        if (!currentConfig) return null

        return (
            <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center space-y-2 mb-8">
                    <h2 className="text-2xl font-semibold">Compliance & Configuration</h2>
                    <p className="text-muted-foreground">Setup rules based on the <strong>{currentConfig.label}</strong> category.</p>
                </div>

                {/* Compliance Inputs */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileCheck className="h-5 w-5 text-slate-500" />
                            <CardTitle className="text-base">Licenses & Permits</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* GST is usually common */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="gst">GST Identification Number</Label>
                                <Badge variant="outline" className="bg-slate-50 text-slate-600">Typically {currentConfig.pricingRules.tax.gstSlab}% Slab</Badge>
                            </div>
                            <Input id="gst" name="gst" value={formData.gst} onChange={handleInputChange} placeholder="22AAAAA0000A1Z5" />
                        </div>

                        {/* FSSAI for Food */}
                        {currentConfig.compliance.fssaiRequired && (
                            <div className="space-y-2">
                                <Label htmlFor="fssai">FSSAI License Number <span className="text-red-500">*</span></Label>
                                <Input id="fssai" name="fssai" value={formData.fssai} onChange={handleInputChange} placeholder="100xxxxxxxxxxx" />
                                <p className="text-xs text-muted-foreground">Required for food & grocery businesses.</p>
                            </div>
                        )}

                        {/* Drug License for Pharmacy */}
                        {currentConfig.compliance.drugLicenseRequired && (
                            <div className="space-y-2">
                                <Label htmlFor="drugLicense">Drug License Number <span className="text-red-500">*</span></Label>
                                <Input id="drugLicense" name="drugLicense" value={formData.drugLicense} onChange={handleInputChange} placeholder="DL-xxxx-xxxx" />
                                <p className="text-xs text-muted-foreground">Mandatory for pharmacy onboarding.</p>
                            </div>
                        )}

                        {/* Fallback if no specific licenses required */}
                        {!currentConfig.compliance.fssaiRequired && !currentConfig.compliance.drugLicenseRequired && (
                            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-md">
                                <Check className="h-4 w-4 text-[#2BD67C]" />
                                No special licenses (FSSAI/Drug) mandatorily tracked for this category.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Store Limits & Rules Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <ImagePlus className="h-4 w-4 text-slate-500" />
                                <CardTitle className="text-sm">Catalog Limits</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm space-y-2 text-slate-600">
                                <li className="flex justify-between">
                                    <span>Max Variants per Product:</span>
                                    <span className="font-medium text-slate-900">{currentConfig.limits.maxVariants}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Images Required:</span>
                                    <span className="font-medium text-slate-900">{currentConfig.limits.minImages} - {currentConfig.limits.maxImages}</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-slate-500" />
                                <CardTitle className="text-sm">Logistics</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm space-y-2 text-slate-600">
                                <li className="flex justify-between">
                                    <span>Large Package:</span>
                                    <span className={cn("font-medium", currentConfig.shipping.requiresLargePackage ? "text-orange-600" : "text-slate-900")}>
                                        {currentConfig.shipping.requiresLargePackage ? "Yes" : "No"}
                                    </span>
                                </li>
                                <li className="flex justify-between">
                                    <span>COD Allowed:</span>
                                    <span className={cn("font-medium", currentConfig.shipping.codAllowed ? "text-[#2BD67C]" : "text-red-500")}>
                                        {currentConfig.shipping.codAllowed ? "Yes" : "No"}
                                    </span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // --- Main Render ---

    return (
        <div className="container max-w-5xl mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => step > 1 ? handleBack() : router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Onboard New Store</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span className={cn(step >= 1 && "text-[#2BD67C] font-medium")}>1. Type</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className={cn(step >= 2 && "text-[#2BD67C] font-medium")}>2. Details</span>
                            <ChevronRight className="h-3 w-3" />
                            <span className={cn(step >= 3 && "text-[#2BD67C] font-medium")}>3. Compliance</span>
                        </div>
                    </div>
                </div>
                {step === 3 && (
                    <Button onClick={handleSubmit} className="bg-[#2BD67C] hover:bg-[#2BD67C]/90 text-black font-semibold">
                        Create Store
                    </Button>
                )}
            </div>

            <Separator />

            {/* Step Content */}
            <div className="min-h-[400px]">
                {step === 1 && renderStep1_TypeSelection()}
                {step === 2 && renderStep2_BasicDetails()}
                {step === 3 && renderStep3_Compliance()}
            </div>

            {/* Footer Navigation (for Steps 1 & 2) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-end gap-3 z-10 md:static md:bg-transparent md:border-0 md:p-0">
                {step < 3 && (
                    <Button
                        onClick={handleNext}
                        disabled={step === 1 && !selectedType}
                        className="bg-slate-900 text-white hover:bg-slate-800"
                    >
                        Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
