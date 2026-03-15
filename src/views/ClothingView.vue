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
import { ref, computed, onMounted } from 'vue'
import { location as sharedLocation, setLocation } from '@/stores/location'
import ClothingRecommendations from '@/components/clothing/ClothingRecommendations.vue'
import SunscreenRecommendation from '@/components/clothing/SunscreenRecommendation.vue'
import AIDayPlanner from '@/components/clothing/AIDayPlanner.vue'
import CTACard from '@/components/shared/CTACard.vue'

const aiPlan = ref('')
const loading = ref(false)

const handleAISubmit = async (formData) => {
  loading.value = true
  aiPlan.value = ''

  const prompt = `
    You are a professional Sun Safety Expert in Australia. 
    Current Situation:
    - Location: ${location.value}
    - Current UV Index: ${uvLevel.value}
    
    User Activity:
    - Outdoor Duration: ${formData.outdoorDurationHours} hours
    - Skin Type: ${formData.skinType}
    
    Task: 
    Provide a personalized, professional sun-safety plan in 3-4 bullet points. 
    Be specific about:
    1. How often to reapply sunscreen based on the current UV ${uvLevel.value}.
    2. Specific clothing items recommended for a ${formData.outdoorDurationHours}-hour stay.
    3. A clear safety warning if their skin type (${formData.skinType}) is at high risk.
    
    Tone: Concise and protective. Use emojis for readability.
  `

  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    })

    const data = await response.json()

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      aiPlan.value = data.candidates[0].content.parts[0].text
    } else {
      throw new Error('Invalid response from Gemini')
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    aiPlan.value =
      'Could not reach the AI expert. Quick tip: Stay in shade and reapply SPF 50+ every 2 hours.'
  } finally {
    loading.value = false
  }
}

const API_KEY = '197d431fa550c96a045c38749be83926'

const uvLevel = ref(0)
const location = sharedLocation

const fetchUVByCoords = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
    )
    const data = await res.json()
    if (data && data.current) {
      uvLevel.value = Math.round(data.current.uvi)
    }
  } catch (error) {
    console.error('Failed to acquire UV data:', error)
  }
}

const fetchUVByCity = async (cityName) => {
  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    )
    const geoData = await geoRes.json()
    if (geoData && geoData.length > 0) {
      await fetchUVByCoords(geoData[0].lat, geoData[0].lon)
    }
  } catch (error) {
    console.error('Failed to retrieve city coordinates:', error)
  }
}

onMounted(() => {
  if (location.value && location.value.trim() !== '' && location.value !== 'Current Location') {
    fetchUVByCity(location.value)
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        try {
          const geoRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
          )
          const geoData = await geoRes.json()
          if (geoData && geoData.length > 0) {
            setLocation(geoData[0].name)
          }
        } catch (e) {
          console.error(e)
        }

        fetchUVByCoords(lat, lon)
      },
      (error) => {
        console.error('Location failed', error)
      }
    )
  }
})

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
