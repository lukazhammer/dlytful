import type { Config } from 'tailwindcss'

export default <Config>{
    theme: {
        extend: {
            colors: {
                'dlytful-sun': '#FF9A00',
                'dlytful-sky': '#007FFF',
                'dlytful-cream': '#FAF7F2',
                'dlytful-herb': '#79B972',
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
                serif: ['Fraunces', 'serif'],
            }
        }
    },
    plugins: []
}
