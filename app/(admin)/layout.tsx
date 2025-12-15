import { AdminShell } from "@/components/layout/admin-shell"
import { NavigationProvider } from "@/contexts/NavigationContext"
import { MockDataProvider } from "@/contexts/MockDataContext"
import { ReactQueryProvider } from "@/components/providers/query-provider"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ReactQueryProvider>
            <MockDataProvider>
                <NavigationProvider>
                    <AdminShell>{children}</AdminShell>
                </NavigationProvider>
            </MockDataProvider>
        </ReactQueryProvider>
    )
}
