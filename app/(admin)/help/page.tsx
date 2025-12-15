"use client"

import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HelpPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
                <p className="text-muted-foreground">Get help with your admin panel.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search docs..."
                    className="pl-9 w-full md:w-[300px]"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Support</CardTitle>
                        <CardDescription>
                            Need urgent help? Reach out to our technical team.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium">tech.support@bazuroo.in</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Phone:</span>
                            <span className="font-medium">+91 99887 76655</span>
                        </div>
                        <Button className="w-full mt-4">Raise Ticket</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Feature Request</CardTitle>
                        <CardDescription>
                            Have an idea? Let us know.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            We are constantly improving. Submit your feedback to help us build better.
                        </p>
                        <Button variant="outline" className="w-full">Submit Feedback</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How do I onboard a new merchant?</AccordionTrigger>
                        <AccordionContent>
                            Go to the Merchants tab, click on "Onboard Merchant" button at the top right, and fill in the required business and contact details.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How are rider payouts calculated?</AccordionTrigger>
                        <AccordionContent>
                            Rider payouts are calculated based on the total number of completed deliveries multiplied by the zone-wise base fare, plus any incentives.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I manually refund an order?</AccordionTrigger>
                        <AccordionContent>
                            Yes, navigate to the Transactions page (under Finance), find the specific transaction ID, click the actions menu (three dots), and select "Issue Refund".
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}
