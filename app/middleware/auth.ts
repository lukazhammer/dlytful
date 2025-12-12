// Named auth middleware for specific routes
export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser()

    if (!user.value) {
        return navigateTo('/login')
    }
})
