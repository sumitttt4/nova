import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id

    // Fetch single record logic
    return NextResponse.json({
        success: true,
        data: { id, name: "Mock Store", status: "under_review" }
    })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const id = params.id
    const body = await request.json()

    // Logic to update specific fields (e.g. re-upload a doc)

    return NextResponse.json({ success: true, message: `Merchant ${id} updated` })
}
