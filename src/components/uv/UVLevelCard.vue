<template>
    <div class="uv-card">
  
      <div class="location-row">
        <span class="location-icon" aria-hidden="true">&#128205;</span>
        <span class="location-text">{{ location || 'Location not set' }}</span>
      </div>
  
      <div class="uv-main-row">
        <div class="uv-number">UV Level: {{ uvLevel }}</div>
        <div class="uv-badge" :class="badgeClass">{{ uvCategory }}</div>
      </div>

      <button class="locate-btn" @click="autoLocate">
        {{
          locating
            ? 'Locating...'
            : location
              ? 'Update location'
              : 'Detect my location'
        }}
      </button>
  
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  
  const props = defineProps({
    // Values are supplied by the parent (e.g. from mock/API).
    // Keep defaults neutral to avoid hard-coded UV data here.
    uvLevel: { type: Number, default: 0 },
    uvCategory: { type: String, default: '' },
    location: { type: String, default: '' },
  })
  
  const emit = defineEmits(['update:location', 'update:position'])
  const locating = ref(false)
  
  const autoLocate = () => {
  if (!navigator.geolocation) return
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      emit('update:position', {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      })
      emit('update:location', 'Current Location')
      locating.value = false
    },
    () => {
      alert('Unable to detect location. Please allow location access.')
      locating.value = false
    }
  )
}

  
  const badgeClass = computed(() => ({
    low: props.uvCategory === 'Low',
    moderate: props.uvCategory === 'Moderate',
    high: props.uvCategory === 'High',
    vhigh: props.uvCategory === 'Very High',
    extreme: props.uvCategory === 'Extreme',
  }))
  </script>
  
  <style scoped>
  .uv-card {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 24px;
    display: inline-block;
    min-width: 260px;
    max-width: 340px;
  }
  
  .location-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  
  .location-icon {
    font-size: 16px;
  }
  
  .location-text {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-right: 8px;
  }

  .uv-main-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .locate-btn {
    background: none;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .locate-btn:hover {
    border-color: #ff9800;
    color: #ff9800;
  }
  
  .uv-number {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .uv-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 14px;
  }
  
  .low      { background: #4caf50; color: white; }
  .moderate { background: #ffeb3b; color: black; }
  .high     { background: #ff9800; color: white; }
  .vhigh    { background: #f44336; color: white; }
  .extreme  { background: #9c27b0; color: white; }
  </style>
