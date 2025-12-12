// Common toast messages for consistent UX
export const TOAST_MESSAGES = {
    // Success
    COPIED: 'Copied to clipboard',
    SAVED: 'Changes saved',
    SPRINT_CREATED: 'Sprint created',
    SPRINT_DELETED: 'Sprint deleted',
    GENERATION_COMPLETE: 'Your brand translation is ready',
    EXPORT_READY: 'Export downloaded',
    LOGGED_IN: 'Welcome back!',
    LOGGED_OUT: 'Signed out successfully',
    ACCOUNT_CREATED: 'Account created! Welcome to dlytful.',

    // Errors
    GENERATION_FAILED: 'Generation failed. Please try again.',
    NETWORK_ERROR: 'Connection error. Please check your internet.',
    SAVE_FAILED: 'Failed to save. Please try again.',
    DELETE_FAILED: 'Failed to delete. Please try again.',
    LOAD_FAILED: 'Failed to load. Please refresh the page.',
    AUTH_REQUIRED: 'Please sign in to continue.',
    INVALID_INPUT: 'Please check your input and try again.',

    // Info
    UPGRADE_REQUIRED: 'Upgrade to unlock this feature',
    COMING_SOON: 'This feature is coming soon!',
    COPIED_FOR_BOLT: 'Prompt copied! Paste it into Bolt.',
    DRAFT_SAVED: 'Draft saved automatically'
} as const

export type ToastMessageKey = keyof typeof TOAST_MESSAGES
