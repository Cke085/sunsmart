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

      <div class="reminder-row">
        <div class="reminder-left">
          <span class="reminder-title">Sunscreen reapply reminder</span>
          <span class="reminder-sub">Tap once, we&apos;ll remind you in 2 hours</span>
        </div>
        <button class="set-btn" @click="reminderStore.scheduleReminder">
          Remind me in 2 hours
        </button>
      </div>

      <div class="dev-helper-row">
        <button class="dev-helper-btn" type="button" @click="reminderStore.triggerReminderNow">
          Show reminder banner now (demo only)
        </button>
      </div>

      <div class="sunscreen-note">
        Sunscreen works with clothing, not instead of it. Wear both for maximum protection against
        UV radiation.
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useReminderStore } from '@/stores/reminder'

const props = defineProps({
  uvLevel: { type: Number, default: 0 }
})

const reminderStore = useReminderStore()

const spf = computed(() => (props.uvLevel >= 6 ? 'SPF 50+' : 'SPF 30+'))
const reapply = computed(() => (props.uvLevel >= 8 ? 'Every 90 minutes' : 'Every 2 hours'))
</script>

<style scoped>
.section {
  margin-bottom: 40px;
}
.section-label {
  font-size: 11px;
  font-weight: 500;
  color: #9e9e9e;
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
.row-label {
  color: #757575;
}
.row-val {
  font-weight: 500;
  color: #1a1a1a;
}
.spf-val {
  color: #e65100;
}
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
}
.set-btn:hover {
  opacity: 0.85;
}
.sunscreen-note {
  padding: 12px 20px;
  font-size: 12px;
  color: #9e9e9e;
  background: #fafafa;
  line-height: 1.6;
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
  text-decoration: underline;
  cursor: pointer;
}
</style>
