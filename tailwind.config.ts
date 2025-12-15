/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/components/**/*.{js,vue,ts}",
        "./app/layouts/**/*.vue",
        "./app/pages/**/*.vue",
        "./app/plugins/**/*.{js,ts}",
        "./app/app.vue",
        "./app/error.vue",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B0F1A', // Night Ink
                surface: '#121624', // Slightly lighter than Night Ink for panels
                surfaceHighlight: '#1A1F30',
                text: '#E9ECF3', // Cloud
                textMuted: '#7FA6D6', // Day Sky
                brand: '#FFFFFF',
                accent: '#C08A2B', // Eclipse Amber
                umber: '#6A4A2D',
                skyDeep: '#223A66',
                skyDay: '#7FA6D6',
                cloud: '#E9ECF3',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            }
        },
    },
    plugins: [],
}
