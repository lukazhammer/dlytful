import { computed } from 'vue'
import { TIERS, type TierKey } from '~/constants/tiers'
import type { Tier } from '~/types/user'

export const useTier = () => {
    // Mock user store access - replace with actual store later
    // const userStore = useUserStore()
    // const userTier = computed(() => userStore.user?.tier || 'free')

    // Temporary mock:
    const tier = ref<Tier>('free')

    const tierConfig = computed(() => TIERS[tier.value])

    const isFree = computed(() => tier.value === 'free')
    const isPaid = computed(() => tier.value !== 'free')

    const canAccess = (feature: string) => {
        // This is a naive check. Ideally we check against specific feature flags in the TIER config
        // For now returning true if features array includes it (fuzzy match) or strictly defined
        return tierConfig.value.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
    }

    const checkLimit = (limitKey: 'maxArchetypes', currentCount: number) => {
        const limit = tierConfig.value[limitKey]
        if (limit === undefined) return true // No limit?
        return currentCount < limit
    }

    return {
        tier,
        tierConfig,
        isFree,
        isPaid,
        canAccess,
        checkLimit
    }
}
