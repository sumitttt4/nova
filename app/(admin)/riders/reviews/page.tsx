"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useMockData } from "@/contexts/MockDataContext"
import { Search, Star } from "lucide-react"
import { format } from "date-fns"
import { useState, useMemo } from "react"

export default function RiderReviewsPage() {
    const { riderReviews } = useMockData()
    const [searchQuery, setSearchQuery] = useState("")
    const [ratingFilter, setRatingFilter] = useState<number | null>(null)

    const filteredReviews = useMemo(() => {
        return riderReviews.filter(review => {
            const matchesSearch = searchQuery === "" ||
                review.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                review.comment.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesRating = ratingFilter === null || review.rating === ratingFilter

            return matchesSearch && matchesRating
        })
    }, [riderReviews, searchQuery, ratingFilter])

    const averageRating = useMemo(() => {
        if (riderReviews.length === 0) return 0
        const sum = riderReviews.reduce((acc, r) => acc + r.rating, 0)
        return (sum / riderReviews.length).toFixed(1)
    }, [riderReviews])

    const ratingDistribution = useMemo(() => {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        riderReviews.forEach(r => {
            dist[r.rating as keyof typeof dist]++
        })
        return dist
    }, [riderReviews])

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Rider Reviews & Ratings</h1>
                <p className="text-sm text-slate-500 mt-1">Customer feedback for delivery riders</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Reviews</CardDescription>
                        <CardTitle className="text-3xl">{riderReviews.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Average Rating</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            {averageRating} <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>5-Star Reviews</CardDescription>
                        <CardTitle className="text-3xl">{ratingDistribution[5]}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>1-Star Reviews</CardDescription>
                        <CardTitle className="text-3xl text-red-600">{ratingDistribution[1]}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by rider name, customer, or comment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                        <button
                            key={rating}
                            onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${ratingFilter === rating
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {rating}★
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredReviews.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-slate-500">
                            No reviews found matching your criteria.
                        </CardContent>
                    </Card>
                ) : (
                    filteredReviews.map(review => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{review.riderName}</CardTitle>
                                        <CardDescription>
                                            Reviewed by {review.userName} • Order {review.orderId}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={`h-4 w-4 ${star <= review.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-slate-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span suppressHydrationWarning className="text-xs text-slate-400">
                                            {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700">{review.comment}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
