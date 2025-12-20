"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CatalogItemFormProps {
    merchant: any
    config: any
    onSubmit: (data: any) => void
    onCancel: () => void
}

export function CatalogItemForm({ merchant, config, onSubmit, onCancel }: CatalogItemFormProps) {
    const storeTypeKey = merchant.storeType
    const typeConfig = config.storeTypes[storeTypeKey]

    // --- State ---
    const [selectedSubtype, setSelectedSubtype] = React.useState<string | null>(null)
    const [formData, setFormData] = React.useState<Record<string, any>>({})
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    // If only one subtype exists (e.g. some stores), auto-select it?
    // Not implementing auto-select for now to let user choose explicitly if desired,
    // but if types keys length is 1, maybe good UX.
    React.useEffect(() => {
        if (typeConfig && Object.keys(typeConfig.types).length === 1 && !selectedSubtype) {
            setSelectedSubtype(Object.keys(typeConfig.types)[0])
        }
    }, [typeConfig, selectedSubtype])

    if (!typeConfig) {
        return (
            <div className="text-center p-6 text-red-500">
                Configuration not found for store type: {storeTypeKey}
            </div>
        )
    }

    const currentSubtypeConfig = selectedSubtype ? typeConfig.types[selectedSubtype] : null

    // --- Handlers ---

    const handleFieldChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        if (errors[key]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[key]
                return newErrors
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Basic Validation
        const newErrors: Record<string, string> = {}
        if (!currentSubtypeConfig) return

        // Check required fields defined in attributes
        Object.entries(currentSubtypeConfig.attributes as Record<string, any>).forEach(([key, attr]) => {
            if (attr.isRequired && (formData[key] === undefined || formData[key] === "")) {
                newErrors[key] = `${attr.label} is required`
            }
        })

        if (!formData["name"] && currentSubtypeConfig.attributes["name"] === undefined) {
            // If "name" is not an official attribute but we need a display name? 
            // Actually most types should have a way to derive name. 
            // If not, we might need a generic "Product Name" field if not in attributes.
            // Looking at config: otc_meds has 'name', open_item doesn't have 'name' (maybe category is name?)
            // For open_item, typical usage is "Sugar (loose)".
            if (!formData.tempName) {
                newErrors["tempName"] = "Product Name is required"
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        // Construct Product Object
        const productData = {
            name: formData["name"] || formData["tempName"] || "New Product",
            type: currentSubtypeConfig.label,
            typeKey: selectedSubtype,
            attributes: { ...formData }
        }

        onSubmit(productData)
    }

    // --- Dynamic Input Renderer ---
    const renderInput = (key: string, attr: any) => {
        const error = errors[key]

        switch (attr.input) {
            case "text":
            case "number":
                return (
                    <Input
                        type={attr.input}
                        id={key}
                        value={formData[key] || ""}
                        onChange={(e) => handleFieldChange(key, attr.input === "number" ? parseFloat(e.target.value) : e.target.value)}
                        className={cn(error && "border-red-500 bg-red-50")}
                        placeholder={attr.label}
                    />
                )
            case "select":
                return (
                    <Select onValueChange={(val) => handleFieldChange(key, val)} value={formData[key]}>
                        <SelectTrigger className={cn(error && "border-red-500 bg-red-50")}>
                            <SelectValue placeholder={`Select ${attr.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {attr.allowedValues.map((val: string) => (
                                <SelectItem key={val} value={val}>{val}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
            case "boolean":
                return (
                    <div className="flex items-center space-x-2 h-10">
                        <Checkbox
                            id={key}
                            checked={formData[key] || false}
                            onCheckedChange={(checked) => handleFieldChange(key, checked)}
                        />
                        <Label htmlFor={key} className="cursor-pointer">{attr.label}?</Label>
                    </div>
                )
            case "chips": // Simple comma separated for now, could be better
                return (
                    <div className="space-y-1">
                        <Select onValueChange={(val) => handleFieldChange(key, val)} value={formData[key]}>
                            <SelectTrigger className={cn(error && "border-red-500 bg-red-50")}>
                                <SelectValue placeholder={`Select ${attr.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {attr.allowedValues && attr.allowedValues.map((val: string) => (
                                    <SelectItem key={val} value={val}>{val}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground">Select from common values.</p>
                    </div>
                )
            default:
                return (
                    <Input
                        type="text"
                        id={key}
                        value={formData[key] || ""}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                    />
                )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            {/* 1. Subtype Selection */}
            {!selectedSubtype && Object.keys(typeConfig.types).length > 1 && (
                <div className="space-y-4">
                    <Label className="text-base font-semibold">Select Product Category</Label>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(typeConfig.types).map(([key, value]: [string, any]) => (
                            <div
                                key={key}
                                onClick={() => setSelectedSubtype(key)}
                                className="cursor-pointer border-2 rounded-lg p-4 hover:border-slate-800 hover:bg-slate-50 transition-all text-center"
                            >
                                <span className="font-medium text-slate-800">{value.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Dynamic Form */}
            {currentSubtypeConfig && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    {Object.keys(typeConfig.types).length > 1 && (
                        <div className="flex justify-between items-center bg-slate-100 p-2 rounded-lg">
                            <span className="font-semibold text-sm px-2">Type: {currentSubtypeConfig.label}</span>
                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { setSelectedSubtype(null); setFormData({}); }}>Change</Button>
                        </div>
                    )}

                    {/* Generic Name Field if not present in attributes */}
                    {!currentSubtypeConfig.attributes["name"] && (
                        <div className="space-y-2">
                            <Label htmlFor="tempName">Product Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="tempName"
                                value={formData.tempName || ""}
                                onChange={(e) => handleFieldChange("tempName", e.target.value)}
                                className={cn(errors["tempName"] && "border-red-500 bg-red-50")}
                                placeholder="e.g. Loose Sugar"
                            />
                            {errors["tempName"] && <p className="text-xs text-red-500">{errors["tempName"]}</p>}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(currentSubtypeConfig.attributes as Record<string, any>).map(([key, attr]) => (
                            <div key={key} className={cn("space-y-2", attr.input === "boolean" ? "flex items-end pb-2" : "")}>
                                {attr.input !== "boolean" && (
                                    <Label htmlFor={key}>
                                        {attr.label}
                                        {attr.isRequired && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                )}
                                {renderInput(key, attr)}
                                {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                        <Button type="submit" className="bg-[#2BD67C] hover:bg-[#25b869] text-white font-bold px-8">
                            Add Product
                        </Button>
                    </div>
                </div>
            )}
        </form>
    )
}
