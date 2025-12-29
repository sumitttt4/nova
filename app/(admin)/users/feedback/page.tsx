"use client"

import { useMockData } from "@/contexts/MockDataContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Mail, MessageSquare, Search, Star, User } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

export default function FeedbackPage() {
    const { feedbacks, markFeedbackSeen } = useMockData()
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<'all' | 'seen' | 'unseen'>('all')
    const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')

    const filteredFeedbacks = feedbacks.filter(feedback => {
        const matchesSearch =
            feedback.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feedback.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feedback.userEmail.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus =
            statusFilter === 'all' ? true :
                statusFilter === 'seen' ? feedback.isSeen :
                    !feedback.isSeen

        const matchesSentiment =
            sentimentFilter === 'all' ? true :
                feedback.sentiment === sentimentFilter

        return matchesSearch && matchesStatus && matchesSentiment
    })

    const sentimentCounts = {
        all: feedbacks.length,
        positive: feedbacks.filter(f => f.sentiment === 'positive').length,
        negative: feedbacks.filter(f => f.sentiment === 'negative').length,
        neutral: feedbacks.filter(f => f.sentiment === 'neutral').length
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Feedback</h1>
                    <p className="text-slate-500">View and manage customer feedback and ratings.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="w-[300px]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="unseen">Unseen</TabsTrigger>
                            <TabsTrigger value="seen">Seen</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sentimentCounts.all}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Positive</CardTitle>
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                            {((sentimentCounts.positive / sentimentCounts.all) * 100).toFixed(0)}%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Neutral</CardTitle>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            {((sentimentCounts.neutral / sentimentCounts.all) * 100).toFixed(0)}%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{sentimentCounts.neutral}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Negative</CardTitle>
                        <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                            {((sentimentCounts.negative / sentimentCounts.all) * 100).toFixed(0)}%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{sentimentCounts.negative}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search feedback..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={sentimentFilter === 'all' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSentimentFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={sentimentFilter === 'positive' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSentimentFilter('positive')}
                        className={sentimentFilter === 'positive' ? "bg-green-600 hover:bg-green-700" : "text-green-600 border-green-200 hover:bg-green-50"}
                    >
                        Positive
                    </Button>
                    <Button
                        variant={sentimentFilter === 'neutral' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSentimentFilter('neutral')}
                        className={sentimentFilter === 'neutral' ? "bg-yellow-600 hover:bg-yellow-700" : "text-yellow-600 border-yellow-200 hover:bg-yellow-50"}
                    >
                        Neutral
                    </Button>
                    <Button
                        variant={sentimentFilter === 'negative' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSentimentFilter('negative')}
                        className={sentimentFilter === 'negative' ? "bg-red-600 hover:bg-red-700" : "text-red-600 border-red-200 hover:bg-red-50"}
                    >
                        Negative
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFeedbacks.map((feedback) => (
                    <Card key={feedback.id} className={`transition-all ${!feedback.isSeen ? 'border-l-4 border-l-blue-500 shadow-sm' : 'opacity-80'}`}>
                        <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">{feedback.userName}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 text-xs">
                                        <Mail className="h-3 w-3" /> {feedback.userEmail}
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
                                <span className="text-xs font-mono text-slate-400">ID: {feedback.id}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 gap-2 ${feedback.isSeen ? 'text-green-600 hover:text-green-700' : 'text-slate-500 hover:text-slate-900'}`}
                                    onClick={() => markFeedbackSeen(feedback.id, !feedback.isSeen)}
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
                ))}
            </div>
            {filteredFeedbacks.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg border-slate-200">
                    <MessageSquare className="h-10 w-10 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No feedback found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    )
}
