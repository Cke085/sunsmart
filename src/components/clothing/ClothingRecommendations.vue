<template>
  <section class="section">
    <div class="section-label">What to wear today</div>
    <div class="section-title">Clothing recommendations</div>
    <div class="section-desc">
      Based on UV {{ uvLevel }} ({{ uvCategory }}) — items marked avoid leave skin exposed
    </div>

    <!-- UV < 3: simple reassurance card -->
    <div v-if="uvLevel < 3" class="low-uv-card">
      <div class="low-uv-title">UV is low right now</div>
      <p class="low-uv-text">
        You can wear what&apos;s comfortable today. Extra sun protection (hat, sunglasses, sunscreen)
        is still a good habit, especially if you&apos;ll be outdoors for a long time.
      </p>
    </div>

    <!-- UV ≥ 3: show detailed clothing cards -->
    <div v-else class="card-grid">
      <ClothingCard
        v-for="item in recommendations"
        :key="item.id"
        :icon="item.icon"
        :name="item.name"
        :desc="item.desc"
        :badge="item.badge"
      />
    </div>
  </section>
</template>
  
<script setup>
import { computed } from 'vue'
import ClothingCard from './ClothingCard.vue'
import { clothingItems } from '@/data/clothing'

const props = defineProps({
  uvLevel: { type: Number, default: 0 },
})

// UV category label
const uvCategory = computed(() => {
  if (props.uvLevel <= 2) return 'Low'
  if (props.uvLevel <= 5) return 'Moderate'
  if (props.uvLevel <= 7) return 'High'
  if (props.uvLevel <= 10) return 'Very High'
  return 'Extreme'
})

// Only show items relevant to the current UV level (for UV ≥ 3)
const recommendations = computed(() =>
  clothingItems
    .filter((item) => props.uvLevel >= item.minUV)
    .map((item) => ({
      ...item,
      badge:
        item.badge === 'avoid'
          ? 'avoid'
          : props.uvLevel >= 6
            ? 'must'
            : 'recommended',
    })),
)
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

  .low-uv-card {
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    background: #fafafa;
    padding: 14px 16px;
    font-size: 13px;
    color: #555;
  }

  .low-uv-title {
    font-weight: 500;
    margin-bottom: 4px;
    color: #2e7d32;
  }

  .low-uv-text {
    margin: 0;
    line-height: 1.5;
  }
  
  .card-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 600px) {
    .card-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>