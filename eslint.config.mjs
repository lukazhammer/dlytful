// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      '.nuxt/**',
      'dist/**',
      '.output/**',
      'node_modules/**',
      'generated/**'
    ]
  },
  {
    files: ['app/**/*.{ts,vue,js}', 'server/**/*.{ts,js}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error'
    }
  }
)
