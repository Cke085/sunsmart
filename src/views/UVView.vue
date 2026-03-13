<template>
  <div class="uv-page">
    <section class="uv-header">
      <h1 class="uv-title">Real-time UV</h1>
      <p class="uv-subtitle">
        Real-time UV intensity alerts based on user location.
      </p>
    </section>

    <section class="uv-main">
      <UVLevelCard
        :uvLevel="uv.level"
        :uvCategory="uvCategory"
        :location="location"
        @update:location="location = $event"
      />

      <UVScaleBar :uvLevel="uv.level" class="block" />
    </section>

    <section class="uv-message">
      <UVAlertBar class="block" :message="alertMessage" />
    </section>

    <section class="uv-cta">
      <CTACard
        title="Not sure what to wear today? See UV-smart clothing suggestions."
        buttonText="Open clothing guide"
        to="/clothing"
      />
    </section>

    <UVNotificationBanner
      :uvLevel="uv.level"
      :title="notificationTitle"
      :uvReminder="notificationBody"
      :sunscreenAdvice="''"
      :clothingAdvice="''"
      :autoHideMs="0"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { uvData } from '@/data/mock'
import UVLevelCard from '@/components/uv/UVLevelCard.vue'
import UVScaleBar from '@/components/uv/UVScaleBar.vue'
import UVAlertBar from '@/components/uv/UVAlertBar.vue'
import UVNotificationBanner from '@/components/uv/UVNotificationBanner.vue'
import CTACard from '@/components/shared/CTACard.vue'

const uv = uvData
const location = ref(uv.location || '')

const uvCategory = computed(() => {
  const v = uv.level
  if (v <= 2) return 'Low'
  if (v <= 5) return 'Moderate'
  if (v <= 7) return 'High'
  if (v <= 10) return 'Very High'
  return 'Extreme'
})

const alertMessage = computed(() => uv.message)

const notificationTitle = computed(() => {
  const prefix = uv.notificationTitlePrefix || 'Your UV level is'
  return `${prefix} ${uv.level}!`
})

const notificationBody = computed(
  () =>
    uv.notificationBody ||
    'Tap to see UV-safe clothing and sunscreen tips tailored to you.'
)
</script>

<style scoped>
.uv-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px 20px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.block {
  width: 100%;
}

.uv-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.uv-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
}

.uv-subtitle {
  margin: 0;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}

.uv-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uv-message {
  margin-top: 4px;
}

.uv-cta {
  margin-top: 4px;
}
</style>