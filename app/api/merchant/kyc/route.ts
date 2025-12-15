import { NextResponse } from 'next/server'

// MOCK Database Access for Demo
// In production, import { db } from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Logic to list all merchants with optional status filter
    return NextResponse.json({
        success: true,
        data: [/* MOCK DATA */],
        message: "Fetched merchant list"
    })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate Body (Zod schema validation recommended here)

        // Logic to create new merchant KYC record
        // const newEntry = await db.merchantsKyc.create({ data: body })

        return NextResponse.json({
            success: true,
            message: "Application submitted successfully",
            id: "MER-NEW-001"
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 })
    }
}
