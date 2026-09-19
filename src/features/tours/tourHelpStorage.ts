const STORAGE_KEY = 'nail-karatas-tour-help-v1'
let dismissedInSession = false

export function isTourHelpDismissed(): boolean {
  if (dismissedInSession) return true
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dismissed'
  } catch {
    return false
  }
}

export function dismissTourHelp(): void {
  // Keep dismissal across route changes even if browser storage is blocked.
  dismissedInSession = true
  try {
    localStorage.setItem(STORAGE_KEY, 'dismissed')
  } catch {
    // A reload can show help again when persistence is unavailable.
  }
}
