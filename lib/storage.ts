import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 Client (Works for AWS S3 and Cloudflare R2)
const s3Client = new S3Client({
    region: process.env.AWS_REGION || "auto",
    endpoint: process.env.AWS_ENDPOINT, // Essential for Cloudflare R2
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
})

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "bazuroo-kyc-docs"

/**
 * Upload a file to S3/R2
 */
export async function uploadFileToStorage(file: Buffer, fileName: string, contentType: string) {
    try {
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file,
            ContentType: contentType,
        })

        await s3Client.send(command)

        // Return the public URL or Key depending on strategy
        return fileName
    } catch (error) {
        console.error("S3 Upload Error:", error)
        throw new Error("Failed to upload document")
    }
}

/**
 * Get a signed URL for secure viewing (Valid for 1 hour)
 */
export async function getSignedDocumentUrl(fileKey: string) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
        })

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
        return url
    } catch (error) {
        console.error("S3 Signing Error:", error)
        return null
    }
}
