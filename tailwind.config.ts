import type { Config } from 'tailwindcss'

export default <Config>{
    content: [],
    theme: {
        extend: {
            colors: {
                // Cool backgrounds - for distance and restraint
                'dlytful-cool': '#F5F6F7',        // Cool off-white
                'dlytful-cool-muted': '#EBECED',  // Slightly deeper cool

                // Warm accents - appear rarely, feel earned
                'dlytful-sun': '#E8923A',         // Softer amber
                'dlytful-sun-soft': '#F4B366',    // Even softer
                'dlytful-herb': '#6B9F65',        // Muted sage
                'dlytful-sky': '#5A9BC9',         // Soft blue

                // Warm backgrounds - for earned intimacy
                'dlytful-cream': '#F7F4EF',       // Warm paper
                'dlytful-cream-dark': '#EDE8E0',  // Slightly deeper
                'dlytful-linen': '#FAF8F5',       // Almost white, but warm
                'dlytful-warmth': '#F9F5EE',      // Full warmth, evening light

                // Text - cool variant for distance
                'dlytful-ink': '#2C2825',         // Warm dark for body
                'dlytful-ink-cool': '#3A3D42',    // Cooler, more reserved
                'dlytful-ink-light': '#5C5550',   // Secondary
                'dlytful-ink-muted': '#8C8680',   // Tertiary
                'dlytful-ink-distant': '#9A9DA2', // Cool and far

                // The motif - dusk-warm charcoal with sun afterglow
                'dlytful-motif': '#4A3D35',       // Core line color

                // Borders
                'dlytful-border': '#E5E0D8',      // Warm
                'dlytful-border-subtle': '#EDE9E3',
                'dlytful-border-cool': '#E8EAEC', // Cool border
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                serif: ['Fraunces', 'serif'],
            },
            fontSize: {
                'display': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
                'headline': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'title': ['1.5rem', { lineHeight: '1.3' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '30': '7.5rem',
                '36': '9rem',
                '44': '11rem',
            },
            maxWidth: {
                'readable': '38rem',
                'content': '52rem',
            },
            boxShadow: {
                'soft': '0 2px 8px rgba(44, 40, 37, 0.04)',
                'lifted': '0 4px 16px rgba(44, 40, 37, 0.06)',
            },
            borderRadius: {
                'soft': '0.625rem',
                'card': '0.875rem',
            }
        }
    },
    plugins: []
}
