<script setup lang="ts">
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import DlytfulInput from '~/components/ui/DlytfulInput.vue'
import { useAuth } from '~/composables/useAuth'
import { useUIStore } from '~/stores/ui'

const emit = defineEmits<{
  (e: 'deleted'): void
}>()

const { logout } = useAuth()
const uiStore = useUIStore()

const showConfirm = ref(false)
const confirmText = ref('')
const deleting = ref(false)

const canDelete = computed(() => confirmText.value === 'DELETE')

const handleDeleteClick = () => {
  showConfirm.value = true
}

const handleCancel = () => {
  showConfirm.value = false
  confirmText.value = ''
}

const handleConfirmDelete = async () => {
  if (!canDelete.value) return
  
  deleting.value = true
  
  try {
    const api = useApi()
    await api.del('/account')
    
    uiStore.showToast('success', 'Account deleted')
    await logout()
    emit('deleted')
  } catch (error) {
    uiStore.showToast('error', 'Failed to delete account. Please try again.')
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="rounded-xl border border-red-200 bg-red-50 p-6">
    <h3 class="font-serif text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
    
    <template v-if="!showConfirm">
      <p class="text-sm text-red-700 mb-4">
        Once you delete your account, all your data will be permanently removed. This cannot be undone.
      </p>
      
      <button
        @click="handleDeleteClick"
        class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-100 transition-colors text-sm font-medium"
      >
        Delete my account
      </button>
    </template>
    
    <template v-else>
      <div class="bg-white rounded-lg p-4 border border-red-200">
        <p class="text-sm text-red-800 font-medium mb-4">
          Are you absolutely sure? Type <span class="font-mono font-bold">DELETE</span> to confirm.
        </p>
        
        <DlytfulInput
          v-model="confirmText"
          placeholder="Type DELETE"
          class="mb-4"
        />
        
        <div class="flex gap-3">
          <DlytfulButton 
            variant="ghost" 
            size="sm"
            @click="handleCancel"
          >
            Cancel
          </DlytfulButton>
          
          <button
            @click="handleConfirmDelete"
            :disabled="!canDelete || deleting"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="canDelete 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
          >
            {{ deleting ? 'Deleting...' : 'Permanently delete account' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
