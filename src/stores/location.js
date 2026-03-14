import { ref } from 'vue'
import { uvData } from '@/data/mock'

// Single shared location state for the whole app.
// This makes it easy to plug into APIs later.
export const location = ref(uvData.location || '')

export function setLocation(newLocation) {
  const trimmed = (newLocation || '').trim()
  location.value = trimmed
  // Keep mock data in sync so other parts of the app
  // that still read from uvData see the latest value.
  uvData.location = trimmed
  // eslint-disable-next-line no-console
  console.log('Location updated:', trimmed)
}

