"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, FileText, ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"

// Dynamic import for PDF Viewer to avoid SSR "DOMMatrix" error
const PDFViewer = dynamic(() => import("./pdf-viewer-client"), {
    ssr: false,
    loading: () => <div className="p-4 text-center text-slate-500">Loading PDF Viewer...</div>
})

interface DocViewerProps {
    url?: string
    type: "image" | "pdf"
    alt?: string
    aspectRatio?: "video" | "square" | "portrait"
}

export function DocViewer({ url, type, alt = "Document", aspectRatio = "video" }: DocViewerProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [scale, setScale] = React.useState(1.0)

    // Fallback for missing URLs in mock mode
    if (!url) {
        return (
            <div className={`w-full bg-slate-100 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm font-medium ${aspectRatio === "video" ? "aspect-video" : "aspect-square"}`}>
                No Document
            </div>
        )
    }

    const AspectClass = {
        video: "aspect-video",
        square: "aspect-square",
        portrait: "aspect-[3/4]"
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className={`group relative w-full ${AspectClass[aspectRatio]} bg-slate-100 rounded-xl overflow-hidden cursor-pointer border border-slate-200 transition-all hover:border-slate-400 hover:shadow-md`}>
                    {type === "image" ? (
                        <Image
                            src={url}
                            alt={alt}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 bg-slate-50">
                            <FileText size={32} />
                            <span className="text-xs font-bold uppercase">PDF Document</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                            <Eye size={20} className="text-slate-900" />
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl h-[90vh] bg-slate-50 flex flex-col p-1 gap-0 overflow-hidden">
                {/* Viewer Toolbar */}
                <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm z-10 shrink-0">
                    <h3 className="font-bold text-slate-800 truncate max-w-[200px]">{alt}</h3>
                    {type === "pdf" && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setScale(Math.max(0.5, scale - 0.2))}>
                                <ZoomOut size={16} />
                            </Button>
                            <span className="text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                            <Button variant="outline" size="icon" onClick={() => setScale(Math.min(2.5, scale + 0.2))}>
                                <ZoomIn size={16} />
                            </Button>
                        </div>
                    )}
                    <a href={url} download target="_blank" rel="noreferrer">
                        <Button size="sm">Download Original</Button>
                    </a>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-200/50">
                    {type === "image" ? (
                        <div className="relative w-full h-full min-h-[400px]">
                            <Image
                                src={url}
                                alt={alt}
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </div>
                    ) : (
                        <div className="max-w-full">
                            <PDFViewer url={url} scale={scale} />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
