<template>
  <div class="uv-scale" role="group" aria-label="UV scale">
    <!-- Numbers on top -->
    <div v-if="showLabels" class="tick-values" aria-hidden="true">
      <div
        v-for="mark in marks"
        :key="mark.value"
        class="tick-value"
        :class="mark.align"
        :style="{ left: mark.left }"
      >
        {{ mark.value }}
      </div>
    </div>

    <!-- Color bar in the middle -->
    <div class="bar" :style="{ background: gradient }">
      <div class="thumb" :style="{ left: thumbLeft }" :title="`UV ${uvLevel}`" />
    </div>

    <!-- Labels on bottom -->
    <div v-if="showLabels" class="tick-labels" aria-hidden="true">
      <div
        v-for="mark in marks"
        :key="mark.value"
        class="tick-label"
        :class="mark.align"
        :style="{ left: mark.left }"
      >
        {{ mark.level }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  uvLevel: { type: Number, default: 0 },
  max: { type: Number, default: 11 },
  showLabels: { type: Boolean, default: true },
})

const clamped = computed(() => {
  const m = Number.isFinite(props.max) && props.max > 0 ? props.max : 11
  const v = Number.isFinite(props.uvLevel) ? props.uvLevel : 0
  return Math.min(Math.max(v, 0), m)
})

const thumbLeft = computed(() => {
  const m = Number.isFinite(props.max) && props.max > 0 ? props.max : 11
  const pct = (clamped.value / m) * 100
  return `${pct}%`
})

const gradient = computed(() => {
  // Low -> Moderate -> High -> Very High -> Extreme
  return 'linear-gradient(90deg, #4caf50 0%, #ffeb3b 25%, #ff9800 50%, #f44336 75%, #9c27b0 100%)'
})

const marks = computed(() => {
  const m = Number.isFinite(props.max) && props.max > 0 ? props.max : 11
  const spec = [
    { value: 0, level: 'Low' },
    { value: 3, level: 'Moderate' },
    { value: 6, level: 'High' },
    { value: 8, level: 'Very high' },
    { value: 11, level: 'Extreme' },
  ]
  return spec
    .filter((x) => x.value <= m)
    .map((x) => ({
      ...x,
      left: `${(x.value / m) * 100}%`,
      align: x.value === 0 ? 'start' : x.value === m ? 'end' : 'center',
    }))
})
</script>

<style scoped>
.uv-scale {
  width: 100%;
  max-width: 520px;
  position: relative;
}

.bar {
  position: relative;
  height: 14px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
}

.thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  border: 2px solid rgba(0, 0, 0, 0.25);
}

.tick-values {
  position: relative;
  height: 20px;
  font-size: 11px;
  margin-bottom: 4px;
}

.tick-value {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
}

.tick-value.start {
  left: 0;
  transform: none;
}

.tick-value.end {
  right: 0;
  left: auto;
  transform: none;
}

.tick-labels {
  position: relative;
  height: 18px;
  margin-top: 4px;
  font-size: 10px;
}

.tick-label {
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(0, 0, 0, 0.7);
  white-space: nowrap;
}

.tick-label.start {
  left: 0;
  transform: none;
}

.tick-label.end {
  left: auto;
  right: 0;
  transform: none;
}
</style>
