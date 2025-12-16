import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { reasons } = await request.json()

    if (!reasons || !Array.isArray(reasons) || reasons.length === 0) {
        return NextResponse.json({ success: false, message: "Rejection reasons required" }, { status: 400 })
    }

    // 1. Update status to 'rejected'
    // 2. Store rejection reasons
    // 3. Send email notification to merchant with reasons

    return NextResponse.json({
        success: true,
        message: `Merchant ${id} rejection processed.`
    })
}
