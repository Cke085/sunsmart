<template>
  <div class="clothing-page">
    <div class="content">

      <!-- Page header -->
      <h1 class="page-title">Recommended clothing</h1>
      <div class="page-sub">
        Based on current UV index
        <span class="loc-pill">📍 {{ location || 'Detecting location...' }}</span>
      </div>

      <!-- UV summary bar -->
      <div class="uv-bar" :class="uvBarClass">
        <span class="uv-dot" />
        UV Index <strong>{{ uvLevel }}</strong> — {{ uvCategory }}
      </div>

      <!-- Section 1: Clothing recommendations -->
      <ClothingRecommendations :uvLevel="uvLevel" />

      <!-- Section 2: Sunscreen + reminder modal -->
      <SunscreenRecommendation :uvLevel="uvLevel" />

      <!-- Section 3: AI day planner -->
      <AIDayPlanner />

      <!-- CTA → Awareness page -->
      <CTACard
        icon="📊"
        title="Want to understand why UV is so dangerous?"
        desc="See skin cancer trends and UV data across Australia"
        buttonText="Learn more"
        to="/awareness"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { uvData } from '@/data/mock'
import { location as sharedLocation } from '@/store/location'
import ClothingRecommendations from '@/components/clothing/ClothingRecommendations.vue'
import SunscreenRecommendation from '@/components/clothing/SunscreenRecommendation.vue'
import AIDayPlanner from '@/components/clothing/AIDayPlanner.vue'
import CTACard from '@/components/shared/CTACard.vue'

// Temporary: use mock UV data until backend is ready
const uv = uvData
const uvLevel = ref(uv.level)
const location = sharedLocation

const uvCategory = computed(() => {
  if (uvLevel.value <= 2) return 'Low'
  if (uvLevel.value <= 5) return 'Moderate'
  if (uvLevel.value <= 7) return 'High'
  if (uvLevel.value <= 10) return 'Very High'
  return 'Extreme'
})

const uvBarClass = computed(() => {
  const v = uvLevel.value
  if (v <= 2) return 'uv-low'
  if (v <= 5) return 'uv-moderate'
  if (v <= 7) return 'uv-high'
  if (v <= 10) return 'uv-vhigh'
  return 'uv-extreme'
})
</script>

<style scoped>
.clothing-page {
  min-height: 100vh;
  background: #ffffff;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 6px;
}

.page-sub {
  font-size: 14px;
  color: #757575;
  display: flex;
  align-items: center;
  gap: 8px;
}

.loc-pill {
  background: #f5f5f5;
  border: 0.5px solid #e0e0e0;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 13px;
  color: #757575;
}

/* UV bar */
.uv-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 8px;
  border: 0.5px solid;
  font-size: 14px;
}

.uv-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.uv-low {
  background: rgba(76, 175, 80, 0.12);
  border-color: rgba(76, 175, 80, 0.5);
  color: #2e7d32;
}
.uv-low .uv-dot {
  background: #4caf50;
}

.uv-moderate {
  background: rgba(255, 235, 59, 0.18);
  border-color: rgba(255, 235, 59, 0.7);
  color: #f57f17;
}
.uv-moderate .uv-dot {
  background: #ffeb3b;
}

.uv-high {
  background: rgba(255, 152, 0, 0.15);
  border-color: rgba(255, 152, 0, 0.7);
  color: #e65100;
}
.uv-high .uv-dot {
  background: #ff9800;
}

.uv-vhigh {
  background: rgba(244, 67, 54, 0.14);
  border-color: rgba(244, 67, 54, 0.7);
  color: #c62828;
}
.uv-vhigh .uv-dot {
  background: #f44336;
}

.uv-extreme {
  background: rgba(156, 39, 176, 0.14);
  border-color: rgba(156, 39, 176, 0.7);
  color: #6a1b9a;
}
.uv-extreme .uv-dot {
  background: #9c27b0;
}

@media (max-width: 600px) {
  .content {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 26px;
  }
}
</style>