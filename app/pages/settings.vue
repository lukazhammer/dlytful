<script setup lang="ts">
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulCard from '~/components/ui/DlytfulCard.vue'
import PlanCard from '~/components/settings/PlanCard.vue'
import DangerZone from '~/components/settings/DangerZone.vue'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/stores/user'
import { useUIStore } from '~/stores/ui'
import { TIERS, type TierKey } from '~/constants/tiers'

definePageMeta({
  layout: 'app',
  middleware: ['auth']
})

const router = useRouter()
const { user, logout } = useAuth()
const userStore = useUserStore()
const uiStore = useUIStore()

const currentTier = computed(() => userStore.tier as TierKey)

// Format member since date
const memberSince = computed(() => {
  if (!user.value?.created_at) return 'Unknown'
  return new Date(user.value.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const handleSignOut = async () => {
  try {
    await logout()
    router.push('/')
  } catch (error) {
    uiStore.showToast('error', 'Failed to sign out')
  }
}

const handleUpgrade = (tier: TierKey) => {
  // For v1 without Stripe, show coming soon
  uiStore.showToast('info', 'Upgrades coming soon! Join the waitlist for early pricing.')
}

const handleAccountDeleted = () => {
  router.push('/')
}

// Available upgrade tiers
const upgradeTiers = computed((): TierKey[] => {
  if (currentTier.value === 'free') return ['one', 'max']
  if (currentTier.value === 'one') return ['max']
  return []
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <header>
      <h1 class="font-serif text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p class="text-gray-600">Manage your account and subscription</p>
    </header>

    <!-- Section 1: Account -->
    <section>
      <h2 class="font-serif text-xl font-semibold text-gray-900 mb-4">Account</h2>
      
      <DlytfulCard variant="bordered">
        <div class="divide-y divide-gray-100">
          <!-- Email -->
          <div class="p-4 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium text-gray-900">{{ user?.email || 'Not available' }}</p>
            </div>
          </div>
          
          <!-- Member since -->
          <div class="p-4 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Member since</p>
              <p class="font-medium text-gray-900">{{ memberSince }}</p>
            </div>
          </div>
          
          <!-- Sign out -->
          <div class="p-4">
            <DlytfulButton variant="ghost" @click="handleSignOut">
              Sign out
            </DlytfulButton>
          </div>
        </div>
      </DlytfulCard>
    </section>

    <!-- Section 2: Your Plan -->
    <section>
      <h2 class="font-serif text-xl font-semibold text-gray-900 mb-4">Your Plan</h2>
      
      <!-- Current Plan -->
      <div class="mb-6">
        <PlanCard 
          :tier="currentTier"
          :is-current="true"
        />
      </div>
      
      <!-- Upgrade Options -->
      <div v-if="upgradeTiers.length > 0" class="space-y-4">
        <p class="text-sm text-gray-500 font-medium">Upgrade your plan</p>
        
        <div class="grid gap-4 md:grid-cols-2">
          <PlanCard 
            v-for="tier in upgradeTiers"
            :key="tier"
            :tier="tier"
            @upgrade="handleUpgrade(tier)"
          />
        </div>
      </div>
      
      <!-- Max tier message -->
      <div v-else class="bg-dlytful-cream rounded-xl p-6 text-center">
        <p class="text-gray-700">
          🎉 You're on our top tier! You have access to everything.
        </p>
      </div>
    </section>

    <!-- Section 3: Data -->
    <section>
      <h2 class="font-serif text-xl font-semibold text-gray-900 mb-4">Data</h2>
      
      <div class="space-y-4">
        <!-- Export -->
        <DlytfulCard variant="bordered">
          <div class="p-4 flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900">Export all data</p>
              <p class="text-sm text-gray-500">Download all your sprints as JSON</p>
            </div>
            <DlytfulButton 
              variant="ghost" 
              size="sm"
              @click="uiStore.showToast('info', 'Export coming soon!')"
            >
              Export
            </DlytfulButton>
          </div>
        </DlytfulCard>
        
        <!-- Danger Zone -->
        <DangerZone @deleted="handleAccountDeleted" />
      </div>
    </section>
  </div>
</template>
