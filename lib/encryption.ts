import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = (process.env.ENCRYPTION_KEY || '12345678901234567890123456789012').slice(0, 32) // Must be 32 chars

export function encryptData(text: string) {
    const iv = randomBytes(16)
    const cipher = createCipheriv(ALGORITHM, Buffer.from(KEY), iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag().toString('hex')

    return {
        iv: iv.toString('hex'),
        content: encrypted,
        authTag: authTag
    }
}

export function decryptData(encrypted: { iv: string, content: string, authTag: string }) {
    const decipher = createDecipheriv(
        ALGORITHM,
        Buffer.from(KEY),
        Buffer.from(encrypted.iv, 'hex')
    )

    decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'))

    let decrypted = decipher.update(encrypted.content, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}
