import type { TierKey } from '~/constants/tiers'

export const useUpgrade = () => {
    const showUpgradeModal = ref(false)
    const requiredTier = ref<'one' | 'max'>('one')
    const blockedFeature = ref('')

    const promptUpgrade = (tier: 'one' | 'max', feature: string) => {
        requiredTier.value = tier
        blockedFeature.value = feature
        showUpgradeModal.value = true
    }

    const closeUpgrade = () => {
        showUpgradeModal.value = false
        blockedFeature.value = ''
    }

    const handleUpgrade = async (tier: 'one' | 'max') => {
        // For v1 without Stripe, we'll show a waitlist message
        // When Stripe is ready, this will redirect to checkout

        // Future Stripe integration:
        // const { data } = await $fetch('/api/checkout', {
        //   method: 'POST',
        //   body: { tier }
        // })
        // window.location.href = data.checkoutUrl

        return false // Indicates Stripe not ready
    }

    return {
        showUpgradeModal,
        requiredTier,
        blockedFeature,
        promptUpgrade,
        closeUpgrade,
        handleUpgrade
    }
}

// Provide/inject keys for app-level state
export const UPGRADE_INJECTION_KEY = Symbol('upgrade') as InjectionKey<ReturnType<typeof useUpgrade>>
