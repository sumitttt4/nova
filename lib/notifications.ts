
/**
 * Mock Service for Multi-Channel Notifications
 * Supports: SMS, WhatsApp, Email, Push
 */

export type NotificationChannel = 'sms' | 'whatsapp' | 'email' | 'push'

interface NotificationPayload {
    userId: string
    channel: NotificationChannel[]
    templateId: string
    variables: Record<string, string>
}

export async function sendNotification(payload: NotificationPayload) {
    console.log(`[NOTIFS] Processing notification for ${payload.userId}...`)

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500))

    const results = payload.channel.map(channel => {
        const status = Math.random() > 0.1 ? 'sent' : 'failed' // 10% failure rate simulation
        console.log(`[NOTIFS] ${channel.toUpperCase()} -> ${payload.userId} | Template: ${payload.templateId} | Status: ${status}`)
        return { channel, status }
    })

    return {
        success: results.every(r => r.status === 'sent'),
        details: results
    }
}

// Pre-defined templates for KYC
export const NOTIFICATION_TEMPLATES = {
    KYC_APPROVED: "tmpl_kyc_approved_v1",
    KYC_REJECTED: "tmpl_kyc_rejected_v1",
    DOC_EXPIRY_WARNING: "tmpl_doc_expiry_warning"
}
