<template>
  <NavBar />
  <RouterView />

  <transition name="toast-fade">
    <div v-if="reminderStore.showReminderToast" class="reapply-toast">
      <div class="reapply-title">Time to reapply sunscreen</div>
      <p class="reapply-text">It's been 2 hours. Top up your sunscreen to stay protected.</p>
      <div class="toast-actions">
        <button class="reapply-link" @click="handleGoToClothing">See advice</button>
        <button class="dismiss-btn" @click="reminderStore.closeToast">Dismiss</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import NavBar from '@/components/shared/NavBar.vue'
import { useReminderStore } from '@/stores/reminder'

const router = useRouter()
const reminderStore = useReminderStore()

const handleGoToClothing = () => {
  reminderStore.closeToast()
  router.push('/clothing')
}
</script>

<style>
.reapply-toast {
  position: fixed;
  right: 20px;
  bottom: 32px;
  max-width: 280px;
  background: #ffffff;
  color: #1a1a1a;
  padding: 16px 20px;
  border-radius: 12px;
  border: 0.5px solid #e0e0e0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  z-index: 2000;
}

.reapply-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: #e65100;
}

.reapply-text {
  margin: 0 0 12px;
  line-height: 1.5;
  color: #424242;
}

.toast-actions {
  display: flex;
  gap: 16px;
}

.reapply-link {
  background: transparent;
  border: 0;
  color: #f57f17;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
}

.dismiss-btn {
  background: transparent;
  border: 0;
  color: #9e9e9e;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
