import { Suspense } from "react"
import { StoresClient } from "./stores-client"

export default function StoresPage() {
    return (
        <Suspense fallback={<div className="p-6">Loading stores...</div>}>
            <StoresClient />
        </Suspense>
    )
}
