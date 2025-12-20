"use client"

import * as React from "react"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Merchant } from "@/contexts/MockDataContext"
import storeConfig from "@/config/store-types.json"
import { CatalogItemForm } from "./CatalogItemForm"

interface CatalogTabProps {
    merchant: Merchant
}

export function CatalogTab({ merchant }: CatalogTabProps) {
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")

    // --- Mock Products based on Store Type ---
    // In a real app, this would fetch from API based on merchant.id
    // Here we generate some dummy data that looks correct for the store type.
    const [products, setProducts] = React.useState<any[]>([])

    React.useEffect(() => {
        // Generate dummy initial data
        if (merchant.storeType === "grocery_food") {
            setProducts([
                { id: "PRD-1", name: "Fortune Besan", type: "Closed Pack", attributes: { packSize: "500g", price: 65, mrp: 70 }, status: "in_stock", stock: 20 },
                { id: "PRD-2", name: "Loose Sugar", type: "Open Item (Loose)", attributes: { unit: "kg", pricePerUnit: 42 }, status: "in_stock", stock: 50 },
                { id: "PRD-3", name: "Amul Butter", type: "Closed Pack", attributes: { packSize: "100g", price: 54, mrp: 55 }, status: "low_stock", stock: 5 },
            ])
        } else if (merchant.storeType === "pharmacy_otc") {
            setProducts([
                { id: "PRD-1", name: "Dolo 650", type: "OTC Medicines", attributes: { dose: "650mg", pack: "15 tabs", price: 30 }, status: "in_stock", stock: 100 },
                { id: "PRD-2", name: "Vicks VapoRub", type: "OTC Medicines", attributes: { dose: "25g", pack: "Jar", price: 95 }, status: "in_stock", stock: 12 },
            ])
        } else {
            // Default generic
            setProducts([
                { id: "PRD-1", name: "Sample Product A", type: "General", attributes: { price: 100 }, status: "in_stock", stock: 10 },
            ])
        }
    }, [merchant.storeType])

    const handleAddProduct = (newProduct: any) => {
        setProducts(prev => [{
            id: `PRD-${Math.floor(Math.random() * 10000)}`,
            ...newProduct,
            status: "in_stock",
            stock: 10
        }, ...prev])
        setIsSheetOpen(false)
    }

    const handleDelete = (id: string) => {
        if (confirm("Delete this product?")) {
            setProducts(prev => prev.filter(p => p.id !== id))
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:flex-1 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9 bg-white w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4 text-slate-500" />
                    </Button>
                </div>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="w-full sm:w-auto bg-[#2BD67C] hover:bg-[#25b869] text-white font-semibold">
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[100%] sm:max-w-xl overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle>Add New Product</SheetTitle>
                        </SheetHeader>
                        <CatalogItemForm
                            merchant={merchant}
                            config={storeConfig}
                            onSubmit={handleAddProduct}
                            onCancel={() => setIsSheetOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Product Details</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                    No products found in catalog.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="font-medium text-slate-900">{product.name}</div>
                                        <div className="text-xs text-slate-500">
                                            {/* Render key attributes */}
                                            {Object.entries(product.attributes).slice(0, 2).map(([k, v]) => (
                                                <span key={k} className="mr-2 inline-block bg-slate-100 rounded px-1.5 py-0.5">
                                                    {k}: {String(v)}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal text-slate-600">
                                            {product.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold text-slate-900">
                                        ₹{product.attributes.price || product.attributes.pricePerUnit || 0}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`
                                                h-2 w-2 rounded-full 
                                                ${product.status === 'in_stock' ? 'bg-green-500' : 'bg-orange-500'}
                                            `} />
                                            <span className="text-sm">{product.stock} units</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
