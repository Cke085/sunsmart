<template>
  <div class="clothing-card">
    <div class="card-top">
      <div class="card-icon">{{ icon }}</div>
      <span class="badge" :class="badgeClass">{{ badgeLabel }}</span>
    </div>
    <div class="card-name">{{ name }}</div>
    <div class="card-desc">{{ desc }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, required: true },
  badge: {
    type: String,
    default: 'recommended',
    validator: (v) => ['must', 'recommended', 'avoid'].includes(v),
  },
})

// Badge display label
const badgeLabel = computed(() => {
  if (props.badge === 'must') return 'Must wear'
  if (props.badge === 'avoid') return 'Avoid'
  return 'Recommended'
})

// Badge colour class
const badgeClass = computed(() => ({
  'badge-must': props.badge === 'must',
  'badge-rec': props.badge === 'recommended',
  'badge-avoid': props.badge === 'avoid',
}))
</script>

<style scoped>
.clothing-card {
  background: #ffffff;
  border: 0.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.15s;
}

.clothing-card:hover {
  border-color: #bdbdbd;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
}

.badge-must      { background: #fff3e0; color: #e65100; }
.badge-rec       { background: #e8f5e9; color: #2e7d32; }
.badge-avoid     { background: #fce4ec; color: #c62828; }

.card-name {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}

.card-desc {
  font-size: 13px;
  color: #757575;
  line-height: 1.5;
}
</style>