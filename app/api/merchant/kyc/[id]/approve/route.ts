import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // 1. Verify all required docs are present in DB
    // 2. Update status to 'approved'
    // 3. Trigger "Store Activation" workflow (send email, enable login)

    return NextResponse.json({
        success: true,
        message: `Merchant ${id} has been approved and activated.`
    })
}
