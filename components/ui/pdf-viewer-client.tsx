"use client"
import * as React from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Loader2 } from "lucide-react"

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
    url: string
    scale: number
}

export default function PDFViewerClient({ url, scale }: PDFViewerProps) {
    const [numPages, setNumPages] = React.useState<number | null>(null)

    return (
        <Document
            file={url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={<div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading PDF...</div>}
            error={<div className="text-red-500">Failed to load PDF. Cross-Origin Issue likely in dev.</div>}
        >
            {Array.from(new Array(numPages || 0), (el, index) => (
                <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={scale}
                    className="mb-4 shadow-lg"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            ))}
        </Document>
    )
}
