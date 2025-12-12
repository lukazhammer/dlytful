export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser()

    if (!user.value) {
        return navigateTo('/login')
    }

    // Check tier from user store
    // Note: In a real app, you'd get this from the user store or fetch it
    // For now, we'll let the page handle the tier check since store might not be initialized yet
})
