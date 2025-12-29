"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Mail, MessageSquare, Search, Star, Store } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

export default function StoreFeedbackPage() {
    const { storeFeedbacks, markStoreFeedbackSeen } = useMockData()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<'all' | 'seen' | 'unseen'>('all')

    const filteredFeedbacks = storeFeedbacks.filter(feedback => {
        const matchesSearch =
            feedback.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feedback.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feedback.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === 'all' ? true :
                statusFilter === 'seen' ? feedback.isSeen :
                    !feedback.isSeen

        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Store Feedback</h1>
                    <p className="text-slate-500">Insights and issues reported by merchant partners.</p>
                </div>
                <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="w-[300px]">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="unseen">Unseen</TabsTrigger>
                        <TabsTrigger value="seen">Seen</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search by store name or comment..."
                    className="pl-8 max-w-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFeedbacks.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <MessageSquare className="h-10 w-10 text-slate-400 mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No feedback found</h3>
                        <p className="text-slate-500">Try adjusting your filters.</p>
                    </div>
                ) : (
                    filteredFeedbacks.map((feedback) => (
                        <Card key={feedback.id} className={`transition-all ${!feedback.isSeen ? 'border-l-4 border-l-purple-500 shadow-sm' : 'opacity-80'}`}>
                            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                                        <Store className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{feedback.storeName}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 text-xs">
                                            <Mail className="h-3 w-3" /> {feedback.email}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${feedback.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-200' :
                                                feedback.sentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                        `}
                                    >
                                        {feedback.sentiment}
                                    </Badge>
                                    <span suppressHydrationWarning className="text-xs text-slate-400">{format(new Date(feedback.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-0.5 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-3 mb-4 min-h-[60px]">"{feedback.comment}"</p>

                                <div className="flex items-center justify-between pt-2 border-t">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-8 gap-2 ml-auto ${feedback.isSeen ? 'text-green-600 hover:text-green-700' : 'text-slate-500 hover:text-slate-900'}`}
                                        onClick={() => markStoreFeedbackSeen(feedback.id, !feedback.isSeen)}
                                    >
                                        {feedback.isSeen ? (
                                            <>
                                                <Check className="h-4 w-4" /> Seen
                                            </>
                                        ) : (
                                            <>Mark as Seen</>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
