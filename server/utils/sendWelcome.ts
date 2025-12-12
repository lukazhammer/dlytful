import { Resend } from 'resend'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

export const sendWelcomeEmail = async (email: string) => {
    const config = useRuntimeConfig()

    // Initialize Resend
    const resend = new Resend(config.resendApiKey || process.env.RESEND_API_KEY)

    // In a real app, you would fetch this from assets or public directory properly
    // Since we are in server context, we need absolute path or URL.
    // For Vercel/Netlify, reading from file system can be tricky without proper configuration.
    // We'll try to resolve it from the public directory in dev, or use a public URL in prod.

    // Minimal plain text copy
    const text = `Hey,

Thanks for joining the dlytful waitlist.

Attached is "The I Built This in a Weekend Brand Kit" — a quick framework to give your app a real identity.

Inside:
- 1-sentence positioning template
- 4-question mission builder
- Brand archetype selector
- 24-hour brand sprint checklist

When dlytful launches, you'll be first to know. We're building something that makes this whole process even faster.

Talk soon.`

    const pathToPdf = resolve('public/brand-kit.pdf')
    let attachments = []

    if (existsSync(pathToPdf)) {
        const fileBuffer = readFileSync(pathToPdf)
        attachments.push({
            filename: 'The-I-Built-This-In-A-Weekend-Brand-Kit.pdf',
            content: fileBuffer
        })
    } else {
        console.warn('Brand kit PDF not found at', pathToPdf)
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'dlytful <hello@dlytful.com>',
            to: [email],
            subject: 'Your brand kit is here',
            text: text,
            attachments: attachments
        })

        if (error) {
            console.error('Resend Error:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (err) {
        console.error('Send Email Exception:', err)
        return { success: false, error: err }
    }
}
