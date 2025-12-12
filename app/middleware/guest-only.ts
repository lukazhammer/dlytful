export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser()

    // If user is already authenticated, redirect to the app
    if (user.value) {
        return navigateTo('/sprint/new')
    }
})
