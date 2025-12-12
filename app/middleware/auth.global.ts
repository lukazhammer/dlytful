export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()

    // Define protected route patterns
    const protectedPaths = ['/sprint', '/sprints']

    const isProtectedRoute = protectedPaths.some(path => to.path.startsWith(path))

    if (isProtectedRoute && !user.value) {
        // Store intended destination for post-login redirect
        const redirectTo = to.fullPath
        return navigateTo(`/login?redirect=${encodeURIComponent(redirectTo)}`)
    }
})
