<template>
  <section class="section">
    <div class="section-label">AI-powered</div>
    <div class="section-title">Your AI day planner</div>
    <div class="section-desc">
      Tell us how long you'll be outside and your skin type — we'll build a personalised UV
      protection schedule for your day.
    </div>

    <div class="ai-card">
      <div class="ai-head">
        <span class="ai-title">Generate my day plan</span>
      </div>

      <div class="form-block">
        <div class="slider-head">
          <label class="form-label" style="margin-bottom: 0">
            How many hours will you be outdoors?
          </label>
          <div style="display: flex; align-items: center; gap: 8px">
            <input
              type="number"
              v-model.number="form.duration"
              min="1"
              max="10"
              style="
                width: 55px;
                padding: 6px;
                border: 0.5px solid #e0e0e0;
                border-radius: 8px;
                text-align: center;
                font-size: 14px;
                background: #fafafa;
              "
            />
            <span class="slider-val">hrs</span>
          </div>
        </div>
        <input type="range" min="1" max="10" step="1" v-model.number="form.duration" />
        <div class="slider-ticks">
          <span>1h</span>
          <span>5h</span>
          <span>10h</span>
        </div>
      </div>

      <div class="divider" />

      <div class="form-block">
        <label class="form-label">Skin type</label>
        <div class="skin-grid">
          <div
            v-for="skin in skinTypes"
            :key="skin.type"
            class="skin-card"
            :class="{ active: form.skinType === skin.type }"
            @click="form.skinType = skin.type"
          >
            <div class="skin-swatch" :style="{ background: skin.color }" />
            <span class="skin-name">{{ skin.type }}</span>
            <span class="skin-desc">{{ skin.desc }}</span>
            <span class="skin-burn">{{ skin.burn }}</span>
          </div>
        </div>
      </div>

      <button class="generate-btn" type="button" @click="handleGenerate" :disabled="loading">
        {{ loading ? 'Analyzing UV patterns...' : 'Generate my sun-safety plan' }}
      </button>

      <div v-if="aiPlan" class="ai-result-box">
        <div class="ai-result-header">
          <span class="ai-icon">✨</span>
          <span>Your Personalized Plan</span>
        </div>
        <div class="ai-result-text">{{ aiPlan }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  duration: 2,
  skinType: 'Type I'
})

const loading = ref(false)
const aiPlan = ref('')

const emit = defineEmits(['submit'])

const handleGenerate = async () => {
  if (form.value.duration < 1) form.value.duration = 1
  if (form.value.duration > 10) form.value.duration = 10

  loading.value = true
  aiPlan.value = ''

  const prompt = `Provide a sun-safety plan for Skin Type ${form.value.skinType}, outdoor duration ${form.value.duration} hours. Use emojis.`

  try {
    const API_KEY = import.meta.env.VITE_GEMINI_KEY

    console.log('Checking available models...')
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    const listRes = await fetch(listUrl)
    const listData = await listRes.json()

    if (!listRes.ok) {
      throw new Error(`API Key error: ${listData.error?.message || 'Invalid Key'}`)
    }

    const availableModels = listData.models || []
    console.log('Available models:', availableModels)

    const targetModel =
      availableModels.find((m) => m.name.includes('flash'))?.name ||
      availableModels.find((m) => m.name.includes('pro'))?.name

    if (!targetModel) {
      throw new Error('No compatible Gemini models found in your account.')
    }

    console.log(`🚀 Using the latest model found: ${targetModel}`)

    const generateUrl = `https://generativelanguage.googleapis.com/v1/${targetModel}:generateContent?key=${API_KEY}`

    const response = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Generation failed')

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      aiPlan.value = data.candidates[0].content.parts[0].text
    }
  } catch (error) {
    console.error('Diagnostic Error:', error)
    aiPlan.value = `Access failed: ${error.message}. Please check your network or try again later.`
  } finally {
    loading.value = false
  }
}

const skinTypes = [
  { type: 'Type I', color: '#FDDBB4', desc: 'Very fair', burn: 'Always burns' },
  { type: 'Type II', color: '#F5C896', desc: 'Fair', burn: 'Usually burns' },
  { type: 'Type III', color: '#D4956A', desc: 'Medium', burn: 'Sometimes burns' },
  { type: 'Type IV', color: '#A0623A', desc: 'Olive', burn: 'Rarely burns' },
  { type: 'Type V–VI', color: '#5C3317', desc: 'Brown', burn: 'Very rarely burns' }
]
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
  letter-spacing: 0.08em;
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
  margin-bottom: 20px;
  line-height: 1.6;
}
.ai-card {
  background: #ffffff;
  border: 0.5px dashed #bdbdbd;
  border-radius: 12px;
  padding: 24px;
}
.ai-head {
  margin-bottom: 22px;
}
.ai-title {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
}
.form-block {
  margin-bottom: 20px;
}
.form-label {
  font-size: 12px;
  color: #757575;
  margin-bottom: 6px;
  display: block;
}
.divider {
  height: 0.5px;
  background: #f0f0f0;
  margin: 4px 0 20px;
}
.slider-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.slider-val {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
}
input[type='range'] {
  width: 100%;
  cursor: pointer;
}
.slider-ticks {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #bdbdbd;
  margin-top: 4px;
}
.skin-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}
.skin-card {
  border: 0.5px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
  background: #ffffff;
}
.skin-card.active {
  border: 2px solid #1a1a1a;
  background: #fafafa;
}
.skin-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
}
.skin-name {
  font-size: 11px;
  font-weight: 600;
  color: #1a1a1a;
}
.skin-desc,
.skin-burn {
  font-size: 9px;
  color: #9e9e9e;
  text-align: center;
  line-height: 1.2;
}
.generate-btn {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: opacity 0.2s;
}
.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.ai-result-box {
  margin-top: 24px;
  padding: 18px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #1a1a1a;
  animation: fadeIn 0.4s ease-out;
}
.ai-result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
  color: #1a1a1a;
}
.ai-result-text {
  font-size: 13px;
  line-height: 1.7;
  color: #444;
  white-space: pre-line;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 600px) {
  .skin-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
