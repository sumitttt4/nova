import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    return NextResponse.json({
        success: true,
        data: [], // List of riders
        message: "Fetched rider list"
    })
}

export async function POST(request: Request) {
    // Create new rider application
    return NextResponse.json({ success: true, message: "Rider application received" }, { status: 201 })
}
