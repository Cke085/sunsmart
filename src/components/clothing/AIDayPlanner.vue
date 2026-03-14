<template>
    <section class="section">
      <div class="section-label">AI-powered</div>
      <div class="section-title">Your AI day planner</div>
      <div class="section-desc">
        Tell us your plans and preferences — we'll build a personalised
        UV protection schedule for your day.
      </div>
  
      <div class="ai-card">
        <div class="ai-head">
          <span class="ai-title">Generate my day plan</span>
        </div>
  
        <!-- Time range + activity on one row -->
        <div class="time-row">
          <div class="form-col">
            <label class="form-label">Going out at</label>
            <input type="time" v-model="form.startTime" />
          </div>
          <div class="form-col">
            <label class="form-label">Heading home at</label>
            <input type="time" v-model="form.endTime" />
          </div>
          <div class="form-col form-col--wide">
            <label class="form-label">What are you doing today?</label>
            <input
              class="activity-input"
              v-model="form.activity"
              placeholder="e.g. Morning run"
            />
          </div>
        </div>
  
        <!-- Activity location -->
        <div class="form-block">
          <label class="form-label">Activity location</label>
          <div class="chip-group">
            <span
              v-for="loc in locationOptions"
              :key="loc"
              class="chip"
              :class="{ active: form.location === loc }"
              @click="form.location = loc"
            >
              {{ loc }}
            </span>
          </div>
        </div>
  
        <div class="divider" />
  
        <!-- Vitamin D slider -->
        <div class="form-block">
          <div class="slider-head">
            <span class="form-label" style="margin-bottom: 0;">
              Vitamin D exposure goal
            </span>
            <span class="slider-val">{{ form.vitaminD }} min</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="5"
            v-model="form.vitaminD"
          />
          <div class="slider-ticks">
            <span>Minimal</span>
            <span>Moderate</span>
            <span>Maximum</span>
          </div>
        </div>
  
        <!-- Skin type -->
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
              <div
                class="skin-swatch"
                :style="{ background: skin.color }"
              />
              <span class="skin-name">{{ skin.type }}</span>
              <span class="skin-desc">{{ skin.desc }}</span>
              <span class="skin-burn">{{ skin.burn }}</span>
            </div>
          </div>
        </div>
  
        <!-- Protection priority -->
        <div class="form-block form-block-priority">
          <label class="form-label">What matters most to you today?</label>
          <div class="chip-group">
            <span
              v-for="p in priorityOptions"
              :key="p"
              class="chip"
              :class="{ active: form.priority === p }"
              @click="form.priority = p"
            >
              {{ p }}
            </span>
          </div>
        </div>
  
        <!-- When backend is ready, this payload can be POSTed directly -->
        <button class="generate-btn" type="button" @click="handleGenerate">
          Generate my sun-safety plan
        </button>
  
      </div>
    </section>
  </template>
  
<script setup>
  import { ref } from 'vue'
  
  // Form state 
  const form = ref({
    startTime: '08:00',
    endTime: '18:00',
    activity: '',
    location: 'Outdoors',
    vitaminD: 15,
    skinType: 'Type I',
    priority: 'Max protection',
  })
  
  const emit = defineEmits(['submit'])
  
  const handleGenerate = () => {
    const payload = {
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      activity: form.value.activity,
      location: form.value.location,
      vitaminDMinutes: Number(form.value.vitaminD),
      skinType: form.value.skinType,
      priority: form.value.priority,
    }
  
    // For now: just emit up and log; backend can hook into `submit`
    emit('submit', payload)
    // eslint-disable-next-line no-console
    console.log('AI day planner payload', payload)
  }
  
  // Location chip options
  const locationOptions = [
    'Outdoors',
    'Indoors',
    'Mixed',
    'Near water',
    'High altitude',
  ]
  
  // Priority chip options
  const priorityOptions = [
    'Max protection',
    'Balance UV + vitamin D',
    'Stay cool',
    'Sport / active',
  ]
  
  // Skin type data — based on Fitzpatrick scale
  const skinTypes = [
    {
      type: 'Type I',
      color: '#FDDBB4',
      desc: 'Very fair, freckles common',
      burn: 'Always burns, never tans',
    },
    {
      type: 'Type II',
      color: '#F5C896',
      desc: 'Fair, light eyes or hair',
      burn: 'Usually burns, tans minimally',
    },
    {
      type: 'Type III',
      color: '#D4956A',
      desc: 'Medium, olive undertone',
      burn: 'Sometimes burns, tans gradually',
    },
    {
      type: 'Type IV',
      color: '#A0623A',
      desc: 'Olive to light brown',
      burn: 'Rarely burns, tans easily',
    },
    {
      type: 'Type V–VI',
      color: '#5C3317',
      desc: 'Brown to dark brown',
      burn: 'Very rarely burns, tans deeply',
    },
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
  }
  
  .ai-title {
    font-size: 15px;
    font-weight: 500;
    color: #1a1a1a;
  }
  
  .ai-badge {
    font-size: 11px;
    padding: 3px 8px;
    background: #f5f5f5;
    border: 0.5px solid #e0e0e0;
    border-radius: 20px;
    color: #9e9e9e;
  }
  
  /* Time row */
  .time-row {
    display: flex;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: nowrap;
    align-items: flex-start;
  }
  
  .form-col {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 0 0 auto;
  }

  .form-col--wide {
    flex: 1 1 auto;
  }
  
  .form-label {
    font-size: 12px;
    color: #757575;
    margin-bottom: 6px;
    display: block;
  }
  
  .time-row input {
    padding: 9px 10px;
    border: 0.5px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    background: #fafafa;
    color: #1a1a1a;
    width: auto;
    min-width: 120px;
    max-width: 150px;
  }
  
  /* Activity input */
  .activity-input {
    width: 100%;
    padding: 9px 12px;
    border: 0.5px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    background: #fafafa;
    color: #1a1a1a;
  }
  
  .activity-input::placeholder {
    color: #bdbdbd;
  }
  
  /* Chips */
  .chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .form-block-priority {
    margin-top: 12px;
  }
  
  .chip {
    padding: 6px 13px;
    border-radius: 20px;
    font-size: 12px;
    border: 0.5px solid #e0e0e0;
    background: #fafafa;
    color: #757575;
    cursor: pointer;
    transition: all 0.15s;
  }
  
  .chip.active {
    background: #1a1a1a;
    color: #ffffff;
    border-color: #1a1a1a;
  }
  
  /* Divider */
  .divider {
    height: 0.5px;
    background: #f0f0f0;
    margin: 4px 0 20px;
  }
  
  /* Vitamin D slider */
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
  }
  
  .slider-ticks {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #bdbdbd;
    margin-top: 4px;
  }
  
  /* Skin type grid */
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
  
  .skin-card:hover {
    border-color: #bdbdbd;
  }
  
  .skin-card.active {
    border: 2px solid #1a1a1a;
  }
  
  .skin-swatch {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 0.5px solid rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
  }
  
  .skin-name {
    font-size: 12px;
    font-weight: 500;
    color: #1a1a1a;
    text-align: center;
  }
  
  .skin-desc {
    font-size: 11px;
    color: #757575;
    text-align: center;
    line-height: 1.4;
  }
  
  .skin-burn {
    font-size: 10px;
    color: #bdbdbd;
    text-align: center;
    line-height: 1.3;
  }
  
  /* Generate button */
  .generate-btn {
    width: 100%;
    padding: 11px;
    background: #1a1a1a;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    opacity: 1;
    margin-top: 20px;
  }

  .generate-btn:hover {
    opacity: 0.9;
  }
  
  @media (max-width: 600px) {
    .skin-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  
    .time-row {
      flex-direction: column;
      gap: 12px;
    }
  }
  </style>