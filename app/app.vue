<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Global Components -->
    <ToastContainer />
    <UpgradeModal
      :is-open="showUpgradeModal"
      :required-tier="requiredTier"
      :feature="blockedFeature"
      @close="closeUpgrade"
      @upgrade="handleUpgrade"
    />
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '~/components/ui/ToastContainer.vue'
import UpgradeModal from '~/components/upgrade/UpgradeModal.vue'
import { useUpgrade, UPGRADE_INJECTION_KEY } from '~/composables/useUpgrade'

// Setup upgrade system at app level
const upgrade = useUpgrade()
const { showUpgradeModal, requiredTier, blockedFeature, closeUpgrade, handleUpgrade } = upgrade

// Provide to all descendants
provide(UPGRADE_INJECTION_KEY, upgrade)
</script>
