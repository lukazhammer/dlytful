// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },

  // Runtime configuration
  runtimeConfig: {
    // Server-side only
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',

    // Client-side (public)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'dlytful — Brand translation for indie builders',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Transform your app from generic template to memorable brand. Paste one prompt into Bolt. See the difference.' },

        // Open Graph
        { property: 'og:site_name', content: 'dlytful' },
        { property: 'og:title', content: 'dlytful — Brand translation for indie builders' },
        { property: 'og:description', content: 'Transform your app from generic template to memorable brand.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'dlytful' },
        { name: 'twitter:description', content: 'Brand translation for indie builders' },
        { name: 'twitter:image', content: '/og-image.png' },

        // Theme color
        { name: 'theme-color', content: '#FF9A00' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }
      ]
    }
  },

  // Nitro configuration for server
  nitro: {
    preset: 'vercel',
    alias: {
      '~/constants': resolve(__dirname, 'app/constants'),
      '~/types': resolve(__dirname, 'app/types')
    }
  },

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: false // Enable in CI if needed
  },
})
