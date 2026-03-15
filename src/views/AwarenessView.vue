<template>
  <div class="uv-page">
    <section class="uv-header">
      <div class="uv-header-left">
        <h1 class="uv-title">UV &amp; Skin Cancer Awareness</h1>
        <p class="uv-subtitle">Explore historical data and health trends across Australia.</p>
      </div>
    </section>

    <section class="chart-container block">
      <div class="filter-bar">
        <template v-if="activeTab === 'uv'">
          <select v-model="filters.city" @change="fetchData">
            <option v-for="c in dynamicOptions.uvCities" :key="c" :value="c">{{ c }}</option>
          </select>
        </template>

        <template v-else-if="activeTab === 'state'">
          <select v-model="filters.stateYear" @change="fetchData">
            <option v-for="y in dynamicOptions.stateYears" :key="y" :value="y">{{ y }}</option>
          </select>
          <select v-model="filters.sex" @change="fetchData">
            <option v-for="s in dynamicOptions.sexTypes" :key="s" :value="s">{{ s }}</option>
          </select>
          <select v-model="filters.cancerType" @change="fetchData">
            <option v-for="t in dynamicOptions.cancerTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </template>

        <template v-else-if="activeTab === 'age'">
          <select v-model="filters.ageYear" @change="fetchData">
            <option v-for="y in dynamicOptions.ageYears" :key="y" :value="y">{{ y }}</option>
          </select>
          <select v-model="filters.sex" @change="fetchData">
            <option v-for="s in dynamicOptions.sexTypes" :key="s" :value="s">{{ s }}</option>
          </select>
          <select v-model="filters.cancerType" @change="fetchData">
            <option v-for="t in dynamicOptions.cancerTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </template>
      </div>

      <div class="main-chart-area">
        <div v-if="loading" class="loader">
          <div class="spinner"></div>
          <p>Fetching from Cloud...</p>
        </div>

        <UVTrendChart v-if="activeTab === 'uv'" :data="chartData" />
        <StateCancerChart v-if="activeTab === 'state'" :data="chartData" />
        <AgeCancerChart v-if="activeTab === 'age'" :data="chartData" />
      </div>

      <div class="tab-navigation">
        <button :class="{ active: activeTab === 'uv' }" @click="switchTab('uv')">UV Trend</button>
        <button :class="{ active: activeTab === 'state' }" @click="switchTab('state')">
          State Cancer Rate
        </button>
        <button :class="{ active: activeTab === 'age' }" @click="switchTab('age')">
          Age Group Cancer Rate
        </button>
      </div>
    </section>

    <p class="data-explanation">
      * Age-specific rate refers to the number of expected cancer cases occurring per 100,000
      population.
    </p>

    <CTACard
      icon="✅"
      title="Now you know the risks — see what to wear today"
      desc="Get UV-smart clothing recommendations based on your location"
      buttonText="View clothing recommendations"
      to="/clothing"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { supabase } from '@/utils/supabase'

import UVTrendChart from '@/components/awareness/UVTrendChart.vue'
import StateCancerChart from '@/components/awareness/StateCancerChart.vue'
import AgeCancerChart from '@/components/awareness/AgeCancerChart.vue'
import CTACard from '@/components/shared/CTACard.vue'

const activeTab = ref('uv')
const loading = ref(false)
const chartData = ref([])

const dynamicOptions = reactive({
  uvCities: [],
  stateYears: [],
  ageYears: [],
  sexTypes: [],
  cancerTypes: []
})

const filters = reactive({
  city: '',
  stateYear: '',
  ageYear: '',
  sex: '',
  cancerType: ''
})

const initFilterOptions = async () => {
  try {
    const { data: uvData } = await supabase.from('uv_year_city').select('city')
    if (uvData) {
      dynamicOptions.uvCities = [...new Set(uvData.map((i) => i.city))].sort()
      filters.city = dynamicOptions.uvCities.includes('melbourne')
        ? 'melbourne'
        : dynamicOptions.uvCities[0]
    }

    const { data: stateYearsData } = await supabase
      .from('cancer_state_rate_long_view')
      .select('stat_year')
    if (stateYearsData) {
      dynamicOptions.stateYears = [...new Set(stateYearsData.map((i) => i.stat_year))].sort(
        (a, b) => b - a
      )
      filters.stateYear = dynamicOptions.stateYears[0]
    }

    const { data: ageData } = await supabase
      .from('cancer_age_rate_view')
      .select('year, sex, cancer_type')
    if (ageData) {
      dynamicOptions.ageYears = [...new Set(ageData.map((i) => i.year))].sort((a, b) => b - a)
      filters.ageYear = dynamicOptions.ageYears[0]

      dynamicOptions.sexTypes = [...new Set(ageData.map((i) => i.sex))]
        .filter((s) => s !== 'Persons' && s !== 'persons')
        .sort()
      dynamicOptions.cancerTypes = [...new Set(ageData.map((i) => i.cancer_type))].sort()

      filters.sex = dynamicOptions.sexTypes[0]
      filters.cancerType = dynamicOptions.cancerTypes[0]
    }
  } catch (err) {
    console.error('Sync error:', err)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    let query

    if (activeTab.value === 'uv') {
      query = supabase
        .from('uv_year_city')
        .select('*')
        .eq('city', filters.city)
        .order('year', { ascending: true })
    } else if (activeTab.value === 'state') {
      query = supabase
        .from('cancer_state_rate_long_view')
        .select('state_or_territory, rate')
        .eq('stat_year', parseInt(filters.stateYear))
        .eq('sex', filters.sex)
        .eq('cancer_type', filters.cancerType)
    } else if (activeTab.value === 'age') {
      query = supabase
        .from('cancer_age_rate_view')
        .select('age_group_years, age_specific_rate')
        .eq('year', parseInt(filters.ageYear))
        .eq('sex', filters.sex)
        .eq('cancer_type', filters.cancerType)
    }

    const { data, error } = await query
    if (error) throw error
    chartData.value = data
  } catch (err) {
    console.error('Fetch error:', err.message)
    chartData.value = []
  } finally {
    loading.value = false
  }
}

const switchTab = (tab) => {
  activeTab.value = tab
  fetchData()
}

onMounted(async () => {
  await initFilterOptions()
  fetchData()
})
</script>

<style scoped>
.uv-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.uv-title {
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
}
.uv-subtitle {
  margin: 8px 0 0;
  color: #666;
}
.chart-container {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  position: relative;
}
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}
.filter-bar select {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border 0.2s;
}
.filter-bar select:hover {
  border-color: #f97316;
}
.main-chart-area {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
.tab-navigation {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}
.tab-navigation button {
  padding: 10px 24px;
  border-radius: 30px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}
.tab-navigation button.active {
  background: #f97316;
  color: white;
  border-color: #f97316;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.data-explanation {
  font-size: 13px;
  color: #71717a;
  font-style: italic;
  margin-top: -12px;
}
.block {
  width: 100%;
}
</style>
