<script setup lang="ts">
import DlytfulLogo from '~/components/ui/DlytfulLogo.vue'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/stores/user'

const { logout } = useAuth()
const userStore = useUserStore()
const route = useRoute()

const handleLogout = async () => {
  await logout()
}

const isSidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-dlytful-linen flex font-sans text-dlytful-ink">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-dlytful-ink/10 z-20 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <!-- Sidebar: Calm navigation -->
    <aside 
      class="fixed lg:static inset-y-0 left-0 z-30 w-56 bg-white border-r border-dlytful-border-subtle transform transition-transform duration-200 ease-out lg:transform-none flex flex-col"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-5 flex items-center justify-between lg:block">
        <NuxtLink to="/sprint/new" @click="isSidebarOpen = false" class="hover:opacity-80 transition-opacity">
          <DlytfulLogo size="sm" />
        </NuxtLink>
        <button @click="isSidebarOpen = false" class="lg:hidden p-1 text-dlytful-ink-muted hover:text-dlytful-ink transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 px-3 space-y-1 mt-2">
        <NuxtLink 
          to="/sprint/new" 
          @click="isSidebarOpen = false"
          class="flex items-center px-3 py-2.5 rounded-soft text-sm transition-colors"
          :class="route.path === '/sprint/new' 
            ? 'text-dlytful-ink bg-dlytful-cream' 
            : 'text-dlytful-ink-light hover:text-dlytful-ink hover:bg-dlytful-cream/50'"
        >
          <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Sprint
        </NuxtLink>
        
        <NuxtLink 
          v-if="userStore.tier !== 'free'"
          to="/sprints" 
          @click="isSidebarOpen = false"
          class="flex items-center px-3 py-2.5 rounded-soft text-sm transition-colors"
          :class="route.path.startsWith('/sprints') 
            ? 'text-dlytful-ink bg-dlytful-cream' 
            : 'text-dlytful-ink-light hover:text-dlytful-ink hover:bg-dlytful-cream/50'"
        >
          <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          My Sprints
        </NuxtLink>

        <NuxtLink 
          to="/settings" 
          @click="isSidebarOpen = false"
          class="flex items-center px-3 py-2.5 rounded-soft text-sm transition-colors"
          :class="route.path === '/settings' 
            ? 'text-dlytful-ink bg-dlytful-cream' 
            : 'text-dlytful-ink-light hover:text-dlytful-ink hover:bg-dlytful-cream/50'"
        >
          <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </NuxtLink>
      </nav>

      <!-- User section: Simple -->
      <div class="p-4 border-t border-dlytful-border-subtle">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-dlytful-cream flex items-center justify-center">
            <span class="text-sm font-medium text-dlytful-ink-light">
              {{ userStore.user?.email?.charAt(0).toUpperCase() || 'U' }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-dlytful-ink truncate">{{ userStore.user?.email || 'User' }}</p>
          </div>
        </div>
        
        <button 
          @click="handleLogout"
          class="w-full text-left px-2 py-2 text-sm text-dlytful-ink-muted hover:text-dlytful-ink transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-dlytful-border-subtle flex items-center justify-between px-4 z-10">
      <DlytfulLogo size="sm" />
      <button @click="isSidebarOpen = true" class="p-2 -mr-2 text-dlytful-ink-light hover:text-dlytful-ink transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 min-w-0 w-full lg:pt-0 pt-14 overflow-y-auto h-screen">
      <div class="max-w-3xl mx-auto px-6 py-8 md:py-12 pb-24">
        <slot />
      </div>
    </main>
  </div>
</template>
