<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage your data and account preferences.</p>
      </div>
      <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl class="sm:divide-y sm:divide-gray-200">
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Data Export</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <button @click="handleExport" :disabled="exporting" class="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {{ exporting ? 'Preparing download...' : 'Export my data (JSON)' }}
              </button>
              <p class="mt-2 text-xs text-gray-500">Download a copy of your personal data and account history.</p>
            </dd>
          </div>
          <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-red-500">Danger Zone</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <button @click="handleDelete" :disabled="deleting" class="inline-flex items-center px-4 py-2 border border-red-600 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                {{ deleting ? 'Deleting...' : 'Delete my account' }}
              </button>
              <p class="mt-2 text-xs text-gray-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const exporting = ref(false)
const deleting = ref(false)

const handleExport = async () => {
  try {
    exporting.value = true
    const data = await $fetch('/api/account/export')
    
    // Create download link
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dlytful-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (e) {
    alert('Failed to export data. Please try again.')
  } finally {
    exporting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Are you ABSOLUTELY SURE? This will permanently delete your account and cannot be undone.')) {
    return
  }
  
  // Double confirmation
  const email = prompt('Please type "DELETE" to confirm.')
  if (email !== 'DELETE') {
    return
  }

  try {
    deleting.value = true
    await $fetch('/api/account/delete', { method: 'POST' })
    
    // Sign out client-side to clear session
    const supabase = useSupabaseClient()
    await supabase.auth.signOut()
    
    alert('Your account has been deleted.')
    navigateTo('/')
  } catch (e: any) {
    alert('Failed to delete account: ' + (e.statusMessage || e.message))
  } finally {
    deleting.value = false
  }
}
</script>
