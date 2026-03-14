<template>
  <div class="uv-page">

    <UVNotificationBanner
      v-if="showNotification"
      style="top: 90px !important; z-index: 100;"
      :uvLevel="uv.level"
      :title="notificationTitle"
      :uvReminder="notificationBody"
      :sunscreenAdvice="''"
      :clothingAdvice="''"
      :autoHideMs="0"
      :triggerKey="notificationTrigger"
    />

    <section class="page-header">
      <h1 class="page-title">Real-time UV</h1>
      <p class="page-subtitle">Real-time UV intensity alerts based on your location.</p>
    </section>

    <section class="uv-card">
      <div class="loc-row">
        <div class="loc-left">
          <span class="loc-dot" />
          <span class="loc-text">{{ location || 'Detecting location...' }}</span>
          <input
            v-model="editableLocation"
            class="loc-input"
            type="text"
            placeholder="Suburb or postcode"
            @blur="commitManualLocation"
            @keyup.enter="commitManualLocation"
            :disabled="locating"
          />
        </div>
        <button class="loc-btn" type="button" @click="showLocationPrompt = true" :disabled="locating">
          {{ locating ? 'Loading...' : 'Update location' }}
        </button>
      </div>

      <div class="uv-number-row">
        <span class="uv-number">{{ uv.level }}</span>
        <div class="uv-right">
          <span class="uv-badge" :class="badgeColorClass">{{ uvCategory }}</span>
          <span class="uv-label">UV Index</span>
        </div>
      </div>

      <UVScaleBar :uvLevel="uv.level" />
    </section>

    <section class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Sunburn risk</span>
        <span class="stat-val">{{ uvCategory }}</span>
        <span class="stat-sub">{{ sunburnSub }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Safe time outdoors</span>
        <span class="stat-val">{{ safeTime }}</span>
        <span class="stat-sub">Without protection</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Recommended SPF</span>
        <span class="stat-val">50+</span>
        <span class="stat-sub">Cancer Council AU</span>
      </div>
    </section>

    <section>
      <UVAlertBar
        :title="sunburnTitle"
        :message="sunburnMessage"
      />
    </section>

    <section class="uv-cta">
      <CTACard
        icon="☀️"
        title="Do you know why high UV is dangerous?"
        buttonText="Learn more"
        to="/awareness"
      />
    </section>

  </div>

  <Teleport to="body">
    <div
      v-if="showLocationPrompt"
      class="loc-modal-backdrop"
      @click.self="showLocationPrompt = false"
    >
      <div class="loc-modal">
        <h3 class="loc-modal-title">Use your current location?</h3>
        <p class="loc-modal-text">
          We&apos;ll ask your browser for permission to access your location so we can show
          UV and sunburn risk for where you are. You can also type a suburb or postcode
          instead if you prefer.
        </p>
        <div class="loc-modal-actions">
          <button
            type="button"
            class="loc-modal-btn secondary"
            @click="showLocationPrompt = false"
          >
            Not now
          </button>
          <button
            type="button"
            class="loc-modal-btn primary"
            @click="confirmLocate"
          >
            Allow &amp; locate me
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { getSunburnInfo } from '@/data/sunburn'
import { location as sharedLocation, setLocation } from '@/stores/location'
import UVScaleBar from '@/components/uv/UVScaleBar.vue'
import UVAlertBar from '@/components/uv/UVAlertBar.vue'
import UVNotificationBanner from '@/components/uv/UVNotificationBanner.vue'
import CTACard from '@/components/shared/CTACard.vue'

const API_KEY = '197d431fa550c96a045c38749be83926'

const uv = reactive({
  level: 0,
  notificationTitlePrefix: 'Your UV level is',
  notificationBody: 'Tap to see UV-safe clothing and sunscreen tips tailored to you.'
})

const location = sharedLocation
const locating = ref(false)
const notificationTrigger = ref(0)
const showLocationPrompt = ref(false)
const editableLocation = ref(location.value)
const showNotification = ref(false)

const bumpNotification = () => {
  notificationTrigger.value += 1
}

const fetchUVByCoords = async (lat, lon) => {
  showNotification.value = false 
  
  try {
    const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`)
    const data = await res.json()
    if (data && data.current) {
      uv.level = Math.round(data.current.uvi)
      
      if (uv.level >= 6) {
        showNotification.value = true
        bumpNotification()
      }
    }
  } catch (error) {
    console.error('Failed to acquire UV data:', error)
  }
}

const autoLocate = () => {
  if (!navigator.geolocation) {
    setLocation('-')
    editableLocation.value = ''
    return
  }
  
  locating.value = true
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`)
        const geoData = await geoRes.json()
        
        if (geoData && geoData.address) {
          const preciseName = geoData.address.suburb || geoData.address.town || geoData.address.city || 'Unknown'
          setLocation(preciseName)
          editableLocation.value = preciseName
        } else {
          setLocation('Unknown')
        }
        
        await fetchUVByCoords(lat, lon)
      } catch (error) {
        console.error('API Error:', error)
        setLocation('-') 
      } finally {
        locating.value = false
      }
    },
    (error) => {
      console.warn('The user denied location access or location services failed:', error)
      setLocation('-')
      editableLocation.value = ''
      locating.value = false
      
      showLocationPrompt.value = false 
    }
  )
}

const confirmLocate = () => {
  showLocationPrompt.value = false
  autoLocate()
}

const commitManualLocation = async () => {
  const trimmed = editableLocation.value.trim()
  if (!trimmed) return
  
  locating.value = true
  try {
    let lat, lon, resolvedName;
    
    const isPostcode = /^\d{4}$/.test(trimmed)

    if (isPostcode) {
      const zipRes = await fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=${trimmed},au&appid=${API_KEY}`)
      if (!zipRes.ok) throw new Error('Postcode not found')
      
      const zipData = await zipRes.json()
      lat = zipData.lat
      lon = zipData.lon
      
      const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`)
      const nomData = await nomRes.json()
      
      if (nomData && nomData.address) {
        resolvedName = nomData.address.suburb || nomData.address.town || nomData.address.city || zipData.name
      } else {
        resolvedName = zipData.name 
      }
      
    } else {
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${trimmed}&limit=1&appid=${API_KEY}`)
      const geoData = await geoRes.json()
      
      if (geoData && geoData.length > 0) {
        lat = geoData[0].lat
        lon = geoData[0].lon
        resolvedName = geoData[0].name
      } else {
        throw new Error('City not found')
      }
    }

    setLocation(resolvedName)
    editableLocation.value = resolvedName
    await fetchUVByCoords(lat, lon)

  } catch (error) {
    console.error('API Error:', error)
    if (!isInitialLoad.value) {
      alert('Location not found. Please try another suburb or valid postcode.')
    }
    editableLocation.value = location.value === '-' ? '' : location.value 
  } finally {
    locating.value = false
    isInitialLoad.value = false 
  }
}

const isInitialLoad = ref(true)

onMounted(() => {
  if (!editableLocation.value || editableLocation.value === '-') {
    autoLocate()
  } else {
    commitManualLocation()
  }
})

const uvCategory = computed(() => {
  const v = uv.level
  if (v <= 2) return 'Low'
  if (v <= 5) return 'Moderate'
  if (v <= 7) return 'High'
  if (v <= 10) return 'Very High'
  return 'Extreme'
})

const badgeColorClass = computed(() => {
  const v = uv.level
  if (v <= 2) return 'badge-low'
  if (v <= 5) return 'badge-moderate'
  if (v <= 7) return 'badge-high'
  if (v <= 10) return 'badge-vhigh'
  return 'badge-extreme'
})

const sunburnSub = computed(() => {
  if (uv.level <= 2) return 'Minimal risk right now'
  if (uv.level <= 5) return 'Protection recommended'
  if (uv.level <= 7) return 'Protection essential'
  if (uv.level <= 10) return 'Extra protection needed'
  return 'Maximum protection needed'
})

const safeTime = computed(() => {
  if (uv.level <= 2) return '60+ min'
  if (uv.level <= 5) return '~30 min'
  if (uv.level <= 7) return '~15 min'
  if (uv.level <= 10) return '~10 min'
  return '<10 min'
})

const sunburnTitle = computed(() => {
  const { riskIndex } = getSunburnInfo(uv.level)
  return `Sunburn risk: ${riskIndex}`
})

const sunburnMessage = computed(() => {
  const { riskLabel, timeText } = getSunburnInfo(uv.level)
  if (!timeText) return `${riskLabel} — minimal sunburn risk right now.`
  return `${riskLabel} — unprotected fair skin may start to burn in about ${timeText}.`
})

const notificationTitle = computed(() => {
  const prefix = uv.notificationTitlePrefix || 'Your UV level is'
  return `${prefix} ${uv.level}!`
})

const notificationBody = computed(() =>
  uv.notificationBody ||
  'Tap to see UV-safe clothing and sunscreen tips tailored to you.'
)
</script>

<style scoped>
.uv-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.page-header { display: flex; flex-direction: column; gap: 4px; }
.page-title { font-size: 32px; font-weight: 500; color: #1a1a1a; margin: 0; }
.page-subtitle { font-size: 14px; color: #757575; margin: 0; }

/* UV card */
.uv-card {
  background: #ffffff;
  border: 0.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.loc-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
}

.loc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e65100;
  flex-shrink: 0;
}

.loc-text {
  font-size: 14px;
  color: #757575;
  white-space: nowrap;
}

.loc-btn {
  font-size: 12px;
  padding: 5px 12px;
  border: 0.5px solid #e0e0e0;
  border-radius: 20px;
  background: none;
  color: #757575;
  cursor: pointer;
}

.loc-btn:hover:not(:disabled) { background: #f5f5f5; }
.loc-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.loc-input {
  flex: 0 0 160px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 0.5px solid #e0e0e0;
  font-size: 13px;
}

.loc-input::placeholder {
  color: #bdbdbd;
}
.loc-input:disabled { background: #f9f9f9; opacity: 0.7; }


.uv-number-row {
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

.uv-number {
  font-size: 64px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1;
}

.uv-right {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 8px;
}

.uv-badge {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
  width: fit-content;
}

.badge-low      { background: #e8f5e9; color: #1b5e20; }
.badge-moderate { background: #fffde7; color: #f57f17; }
.badge-high     { background: #fff3e0; color: #bf360c; }
.badge-vhigh    { background: #fce4ec; color: #880e4f; }
.badge-extreme  { background: #f3e5f5; color: #4a148c; }

.uv-label { font-size: 13px; color: #9e9e9e; }

/* Stat cards */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label { font-size: 12px; color: #757575; }
.stat-val   { font-size: 20px; font-weight: 500; color: #1a1a1a; }
.stat-sub   { font-size: 11px; color: #9e9e9e; }

/* CTA */
.uv-cta {
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .uv-page { padding: 24px 16px; }
  .page-title { font-size: 26px; }
  .uv-number { font-size: 48px; }
  .stats-row { grid-template-columns: 1fr; }

  .loc-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .loc-left {
    width: 100%;
  }

  .loc-input {
    flex: 1 1 auto;
  }

  .loc-btn {
    align-self: flex-end;
  }
}

/* Location privacy modal reuses UVLevelCard styles for consistency */
.loc-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.loc-modal {
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 20px 18px;
  width: min(360px, calc(100vw - 32px));
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.35);
}

.loc-modal-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.loc-modal-text {
  margin: 0 0 16px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.loc-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.loc-modal-btn {
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid transparent;
  cursor: pointer;
}

.loc-modal-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}

.loc-modal-btn.primary {
  background: #111827;
  color: #ffffff;
}
</style>