import { ref } from 'vue'

let savedLocation = localStorage.getItem('userLocation') || ''
if (savedLocation === 'Melbourne') savedLocation = '' 

export const location = ref(savedLocation)

export function setLocation(newLocation) {
  const trimmed = (newLocation || '').trim()
  location.value = trimmed
  
  if (trimmed && trimmed !== '-') {
    localStorage.setItem('userLocation', trimmed)
  }
}