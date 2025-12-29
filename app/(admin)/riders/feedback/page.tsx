"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useMockData } from "@/contexts/MockDataContext"
import { Search, Eye, EyeOff } from "lucide-react"
import { format } from "date-fns"
import { useState, useMemo } from "react"

export default function RiderFeedbackPage() {
    const { riderFeedbacks, markRiderFeedbackSeen } = useMockData()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusTab, setStatusTab] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

    const filteredFeedbacks = useMemo(() => {
        return riderFeedbacks.filter(feedback => {
            const matchesSearch = searchQuery === "" ||
                feedback.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feedback.comment.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusTab === "all" ||
                (statusTab === "unseen" && !feedback.isSeen) ||
                (statusTab === "seen" && feedback.isSeen)

            const matchesCategory = categoryFilter === null || feedback.category === categoryFilter

            return matchesSearch && matchesStatus && matchesCategory
        })
    }, [riderFeedbacks, searchQuery, statusTab, categoryFilter])

    const unseenCount = useMemo(() => {
        return riderFeedbacks.filter(f => !f.isSeen).length
    }, [riderFeedbacks])

    const categoryLabels: Record<string, string> = {
        app_issue: 'App Issue',
        payment: 'Payment',
        support: 'Support',
        suggestion: 'Suggestion',
        other: 'Other'
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Rider App Feedback</h1>
                <p className="text-sm text-slate-500 mt-1">Feedback and issues reported by delivery riders</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Feedback</CardDescription>
                        <CardTitle className="text-3xl">{riderFeedbacks.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Unseen</CardDescription>
                        <CardTitle className="text-3xl text-orange-600">{unseenCount}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>App Issues</CardDescription>
                        <CardTitle className="text-3xl">
                            {riderFeedbacks.filter(f => f.category === 'app_issue').length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Payment Issues</CardDescription>
                        <CardTitle className="text-3xl text-red-600">
                            {riderFeedbacks.filter(f => f.category === 'payment').length}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by rider name or comment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setCategoryFilter(categoryFilter === key ? null : key)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${categoryFilter === key
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={statusTab} onValueChange={setStatusTab}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unseen">
                        Unseen {unseenCount > 0 && <Badge className="ml-2" variant="destructive">{unseenCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="seen">Seen</TabsTrigger>
                </TabsList>

                <TabsContent value={statusTab} className="space-y-4 mt-4">
                    {filteredFeedbacks.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center text-slate-500">
                                No feedback found matching your criteria.
                            </CardContent>
                        </Card>
                    ) : (
                        filteredFeedbacks.map(feedback => (
                            <Card key={feedback.id} className={!feedback.isSeen ? 'border-l-4 border-l-orange-500' : ''}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">{feedback.riderName}</CardTitle>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {categoryLabels[feedback.category]}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge
                                                    variant={
                                                        feedback.sentiment === 'positive' ? 'default' :
                                                            feedback.sentiment === 'negative' ? 'destructive' : 'secondary'
                                                    }
                                                >
                                                    {feedback.sentiment}
                                                </Badge>
                                                <span suppressHydrationWarning className="text-xs text-slate-400">
                                                    {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant={feedback.isSeen ? "outline" : "default"}
                                            size="sm"
                                            onClick={() => markRiderFeedbackSeen(feedback.id, !feedback.isSeen)}
                                        >
                                            {feedback.isSeen ? (
                                                <>
                                                    <EyeOff className="h-4 w-4 mr-2" />
                                                    Mark Unseen
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Mark as Seen
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700">{feedback.comment}</p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
