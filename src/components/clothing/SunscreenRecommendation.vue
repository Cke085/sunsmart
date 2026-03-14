<template>
  <section class="section">
    <div class="section-label">Sun protection</div>
    <div class="section-title">Sunscreen guide</div>
    <div class="section-desc">
      For UV {{ uvLevel }} and above, {{ spf }} is strongly recommended
    </div>

    <div class="sunscreen-card">
      <div class="sunscreen-row">
        <span class="row-label">Minimum SPF</span>
        <span class="row-val spf-val">{{ spf }}</span>
      </div>
      <div class="sunscreen-row">
        <span class="row-label">Apply before going out</span>
        <span class="row-val">20 minutes before</span>
      </div>
      <div class="sunscreen-row">
        <span class="row-label">Reapply every</span>
        <span class="row-val">{{ reapply }}</span>
      </div>

      <!-- Simple 2-hour reminder -->
      <div class="reminder-row">
        <div class="reminder-left">
          <span class="reminder-title">Sunscreen reapply reminder</span>
          <span class="reminder-sub">Tap once, we&apos;ll remind you in 2 hours</span>
        </div>
        <button class="set-btn" @click="scheduleReminder">
          Remind me in 2 hours
        </button>
      </div>

      <!-- Dev-only helper: instantly show the reminder toast for demos -->
      <div v-if="isDev" class="dev-helper-row">
        <button class="dev-helper-btn" type="button" @click="triggerReminderNow">
          Show reminder banner now (demo only)
        </button>
      </div>

      <div class="sunscreen-note">
        Sunscreen works with clothing, not instead of it.
        Wear both for maximum protection against UV radiation.
      </div>
    </div>
  </section>

  <!-- Right-side toast when it&apos;s time to reapply -->
  <div v-if="showReminderToast" class="reapply-toast">
    <div class="reapply-title">Time to reapply sunscreen</div>
    <p class="reapply-text">
      It&apos;s been 2 hours. Top up your sunscreen to stay protected.
    </p>
    <button class="reapply-link" type="button" @click="goToClothing">
      See more clothing tips
    </button>
  </div>
</template>

<script setup>
  import { ref, computed, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  
  const props = defineProps({
    uvLevel: { type: Number, default: 0 },
  })
  
  const router = useRouter()

  // Sunscreen logic based on UV level
  const spf = computed(() => (props.uvLevel >= 6 ? 'SPF 50+' : 'SPF 30+'))
  const reapply = computed(() =>
    props.uvLevel >= 8 ? 'Every 90 minutes' : 'Every 2 hours'
  )
  
  // Simple front-end reminder: one 2-hour timer → toast on the right
  const showReminderToast = ref(false)
  const isDev = import.meta.env.DEV
  let reminderTimeoutId
  let hideToastTimeoutId

  const clearTimers = () => {
    if (reminderTimeoutId) {
      clearTimeout(reminderTimeoutId)
      reminderTimeoutId = undefined
    }
    if (hideToastTimeoutId) {
      clearTimeout(hideToastTimeoutId)
      hideToastTimeoutId = undefined
    }
  }

  const scheduleReminder = () => {
    clearTimers()
    showReminderToast.value = false

    // Fire once after 2 hours
    reminderTimeoutId = window.setTimeout(() => {
      showReminderToast.value = true
      // Auto-hide after 15 seconds so it doesn&apos;t linger forever
      hideToastTimeoutId = window.setTimeout(() => {
        showReminderToast.value = false
      }, 15000)
    }, 2 * 60 * 60 * 1000)
  }

  const triggerReminderNow = () => {
    clearTimers()
    showReminderToast.value = true
    hideToastTimeoutId = window.setTimeout(() => {
      showReminderToast.value = false
    }, 15000)
  }

  const goToClothing = () => {
    router.push('/clothing')
  }

  onBeforeUnmount(() => {
    clearTimers()
  })
  </script>
  
  <style scoped>
  .section {
    margin-bottom: 40px;
  }
  
  .section-label {
    font-size: 11px;
    font-weight: 500;
    color: #9e9e9e;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  
  .section-title {
    font-size: 20px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 4px;
  }
  
  .section-desc {
    font-size: 13px;
    color: #757575;
    margin-bottom: 18px;
  }
  
  .sunscreen-card {
    background: #ffffff;
    border: 0.5px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .sunscreen-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 20px;
    border-bottom: 0.5px solid #f0f0f0;
    font-size: 14px;
  }
  
  .row-label { color: #757575; }
  .row-val   { font-weight: 500; color: #1a1a1a; }
  .spf-val   { color: #e65100; }
  
  .reminder-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 20px;
    border-bottom: 0.5px solid #f0f0f0;
  }
  
  .reminder-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .reminder-title {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
  }
  
  .reminder-sub {
    font-size: 12px;
    color: #9e9e9e;
  }
  
  .set-btn {
    font-size: 12px;
    padding: 6px 14px;
    background: #1a1a1a;
    color: #ffffff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
  }
  
  .set-btn:hover { opacity: 0.85; }
  
  .sunscreen-note {
    padding: 12px 20px;
    font-size: 12px;
    color: #9e9e9e;
    background: #fafafa;
    line-height: 1.6;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal {
    background: #ffffff;
    border: 0.5px solid #e0e0e0;
    border-radius: 16px;
    padding: 28px 24px;
    width: 340px;
    max-width: 90%;
  }
  
  .modal-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .modal-title {
    font-size: 17px;
    font-weight: 500;
    color: #1a1a1a;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 22px;
    color: #9e9e9e;
    cursor: pointer;
    line-height: 1;
  }
  
  .modal-desc {
    font-size: 13px;
    color: #757575;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  
  .modal-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 16px;
  }
  
  .modal-row label {
    font-size: 12px;
    color: #757575;
  }
  
  .modal-row input,
  .modal-row select {
    padding: 9px 12px;
    border: 0.5px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    background: #fafafa;
    color: #1a1a1a;
    width: 100%;
  }
  
  .modal-divider {
    height: 0.5px;
    background: #f0f0f0;
    margin: 16px 0;
  }
  
  .repeat-options {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .repeat-chip {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    border: 0.5px solid #e0e0e0;
    background: #fafafa;
    color: #757575;
    cursor: pointer;
  }
  
  .repeat-chip.active {
    background: #1a1a1a;
    color: #ffffff;
    border-color: #1a1a1a;
  }
  
  .modal-confirm {
    width: 100%;
    padding: 11px;
    background: #1a1a1a;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 8px;
  }
  
  .modal-confirm:hover { opacity: 0.85; }
  
  .success-msg {
    text-align: center;
    padding: 12px;
    font-size: 13px;
    color: #2e7d32;
    background: #e8f5e9;
    border-radius: 8px;
    margin-top: 12px;
  }

  .dev-helper-row {
    padding: 10px 20px 14px;
    border-top: 0.5px dashed #eeeeee;
  }

  .dev-helper-btn {
    font-size: 11px;
    color: #757575;
    background: none;
    border: none;
    padding: 0;
    text-decoration: underline;
    cursor: pointer;
  }

  .reapply-toast {
    position: fixed;
    right: 20px;
    bottom: 32px;
    max-width: 280px;
  background: #ffffff;
  color: #1a1a1a;
    padding: 14px 18px;
    border-radius: 10px;
  border: 0.5px solid #e0e0e0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
    font-size: 13px;
    z-index: 110;
  }

  .reapply-title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .reapply-text {
    margin: 0;
    line-height: 1.5;
  }

  .reapply-link {
    margin-top: 8px;
    background: transparent;
    border: 0;
  color: #f57f17;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }
  </style>