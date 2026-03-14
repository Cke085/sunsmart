import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReminderStore = defineStore('reminder', () => {
  const showReminderToast = ref(false)
  let reminderTimeoutId = null
  let hideToastTimeoutId = null

  const clearTimers = () => {
    if (reminderTimeoutId) clearTimeout(reminderTimeoutId)
    if (hideToastTimeoutId) clearTimeout(hideToastTimeoutId)
  }

  const scheduleReminder = () => {
    clearTimers()
    showReminderToast.value = false
    reminderTimeoutId = setTimeout(
      () => {
        showReminderToast.value = true
        hideToastTimeoutId = setTimeout(() => (showReminderToast.value = false), 15000)
      },
      2 * 60 * 60 * 1000
    )
  }

  const triggerReminderNow = () => {
    clearTimers()
    showReminderToast.value = true

    hideToastTimeoutId = setTimeout(() => {
      showReminderToast.value = false
    }, 15000)
  }

  const closeToast = () => {
    showReminderToast.value = false
    clearTimers()
  }

  return {
    showReminderToast,
    scheduleReminder,
    triggerReminderNow,
    closeToast
  }
})
