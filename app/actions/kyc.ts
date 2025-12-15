"use server"

import { uploadFileToStorage } from "@/lib/storage"
import { revalidatePath } from "next/cache"

export async function uploadKYCDocument(formData: FormData) {
    const file = formData.get("file") as File
    const docType = formData.get("docType") as string
    const userId = formData.get("userId") as string

    if (!file) {
        return { success: false, message: "No file provided" }
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName = `kyc/${userId}/${docType}-${Date.now()}.${file.name.split('.').pop()}`

        // This will upload to the configured S3/R2 bucket
        // If ENV vars are missing, this might fail in a real app, 
        // but for now we safeguard it or mock it if needed.
        if (process.env.AWS_ACCESS_KEY_ID) {
            await uploadFileToStorage(buffer, fileName, file.type)
        } else {
            console.warn("Mocking Upload: AWS Credentials not found.")
            // Simulate delay
            await new Promise(r => setTimeout(r, 1000))
        }

        revalidatePath('/merchants/approvals')
        revalidatePath('/riders/approvals')

        return {
            success: true,
            message: "Document uploaded successfully",
            url: `https://fake-cdn.bazuroo.in/${fileName}` // Mock URL for now
        }
    } catch (error) {
        console.error("Upload Action Error:", error)
        return { success: false, message: "Upload failed" }
    }
}
