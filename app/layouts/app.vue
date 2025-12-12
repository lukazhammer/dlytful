<script setup lang="ts">
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
import DlytfulButton from '~/components/ui/DlytfulButton.vue'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/stores/user'

const { logout } = useAuth()
const userStore = useUserStore()
const route = useRoute()

const handleLogout = async () => {
  await logout()
}

// Simple mobile menu state
const isSidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-dlytful-cream flex font-sans text-gray-900">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
      @click="isSidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col shadow-xl lg:shadow-none"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-6 flex items-center justify-between lg:block">
        <NuxtLink to="/sprint/new" @click="isSidebarOpen = false">
          <DlytfulLogo size="md" />
        </NuxtLink>
        <button @click="isSidebarOpen = false" class="lg:hidden text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-4">
        <NuxtLink 
          to="/sprint/new" 
          @click="isSidebarOpen = false"
          class="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-dlytful-cream hover:text-dlytful-sun transition-all duration-200 group"
          :class="{ 'bg-dlytful-cream text-dlytful-sun font-medium shadow-sm ring-1 ring-dlytful-sun/10': route.path === '/sprint/new' }"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" :class="route.path === '/sprint/new' ? 'text-dlytful-sun' : 'text-gray-400 group-hover:text-dlytful-sun'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Sprint
        </NuxtLink>
        
        <NuxtLink 
          v-if="userStore.tier !== 'free'"
          to="/sprint" 
          @click="isSidebarOpen = false"
          class="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-dlytful-cream hover:text-dlytful-sun transition-all duration-200 group"
          active-class="bg-dlytful-cream text-dlytful-sun font-medium shadow-sm ring-1 ring-dlytful-sun/10"
        >
          <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          My Sprints
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-gray-100 bg-gray-50/50">
        <div class="flex items-center gap-3 mb-4 px-2">
          <div class="w-9 h-9 rounded-full bg-dlytful-sun flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
            {{ userStore.user?.email?.charAt(0).toUpperCase() || 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate text-gray-900">{{ userStore.user?.email || 'User' }}</p>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-dlytful-sky/10 text-dlytful-sky mt-0.5">
              {{ userStore.tier }} plan
            </span>
          </div>
        </div>
        
        <DlytfulButton 
          variant="ghost" 
          size="sm" 
          class="w-full justify-start text-gray-500 hover:text-red-500 hover:bg-red-50"
          @click="handleLogout"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </DlytfulButton>
      </div>
    </aside>

    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-10 shadow-sm">
      <DlytfulLogo size="sm" variant="mark" />
      <button @click="isSidebarOpen = true" class="p-2 -mr-2 text-gray-600 hover:bg-gray-50 rounded-lg">
        <!-- Hamburger Icon -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 min-w-0 w-full lg:pt-0 pt-16 overflow-y-auto h-screen">
      <div class="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pb-24">
        <slot />
      </div>
    </main>
  </div>
</template>
