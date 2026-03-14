<template>
  <div class="uv-page">
    <section class="uv-header">
      <div class="uv-header-left">
        <h1 class="uv-title">UV &amp; Skin Cancer Awareness</h1>
        <p class="uv-subtitle">Historical UV exposure and skin cancer trends for Victoria.</p>
      </div>

      <div v-if="!statsError" class="aw-stats">
        <div class="stat-pill">
          <span class="stat-value">{{ avgUV }}</span>
          <span class="stat-label">Avg Max UV</span>
        </div>
        <div class="stat-pill">
          <span class="stat-value">{{ uvDays.toLocaleString() }}</span>
          <span class="stat-label">UV Days Recorded</span>
        </div>
        <div class="stat-pill">
          <span class="stat-value">{{ totalMelanoma.toLocaleString() }}</span>
          <span class="stat-label">Total Melanoma Cases</span>
        </div>
      </div>
      <p v-else class="stats-error">Unable to load summary statistics.</p>
    </section>

    <section class="aw-grid">
      <UVTrendChart class="block" />
      <UVHeatmap class="block" />

      <div class="aw-row-two">
        <MelanomaTrendChart class="block" />
        <NonMelanomaTrendChart class="block" />
      </div>

      <RateCompareChart class="block" />
      <UVHighDaysChart class="block" />
    </section>
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
import { computed, onMounted, ref } from 'vue'
import { parseCSV } from '@/utils/parseCSV'
import UVTrendChart from '@/components/awareness/UVTrendChart.vue'
import UVHeatmap from '@/components/awareness/UVHeatmap.vue'
import MelanomaTrendChart from '@/components/awareness/MelanomaTrendChart.vue'
import NonMelanomaTrendChart from '@/components/awareness/NonMelanomaTrendChart.vue'
import RateCompareChart from '@/components/awareness/RateCompareChart.vue'
import UVHighDaysChart from '@/components/awareness/UVHighDaysChart.vue'
import CTACard from '@/components/shared/CTACard.vue'

const UV_CSV = 'melbourne_daily_max_uv.csv'
const CANCER_CSV = 'skin_cancer_victoria.csv'

const uvRows = ref([])
const cancerRows = ref([])
const statsError = ref(false)

const round2 = (n) => Math.round(n * 100) / 100
const avg = (arr) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0)

const avgUV = computed(() => {
  const allUV = uvRows.value.map((r) => parseFloat(r.UV_Index)).filter((v) => !Number.isNaN(v))
  return round2(avg(allUV)) || 0
})

const uvDays = computed(() => {
  return uvRows.value.filter((r) => {
    const v = parseFloat(r.UV_Index)
    return !Number.isNaN(v)
  }).length
})

const totalMelanoma = computed(() => {
  const melanoma = cancerRows.value.filter(
    (r) =>
      r['Cancer group/site']?.trim() === 'Melanoma of the skin' &&
      r['Sex']?.trim() === 'Persons' &&
      r['State or Territory']?.trim() === 'Victoria'
  )
  return melanoma.reduce((sum, row) => {
    const raw = (row['Count'] || '').replace(/,/g, '')
    const n = parseInt(raw, 10)
    return sum + (Number.isNaN(n) ? 0 : n)
  }, 0)
})

onMounted(async () => {
  try {
    const [uv, cancer] = await Promise.all([parseCSV(UV_CSV), parseCSV(CANCER_CSV)])
    uvRows.value = uv
    cancerRows.value = cancer
  } catch (err) {
    statsError.value = true
    // eslint-disable-next-line no-console
    console.error(err)
  }
})
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

.uv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.uv-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.uv-title {
  margin: 0;
  font-size: 32px;
  font-weight: 500;
}

.uv-subtitle {
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.block {
  width: 100%;
}

.aw-stats {
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  justify-content: flex-end;
}

.stat-pill {
  flex: 0 0 auto;
  background: #fff7ed;
  border-radius: 12px;
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid #fed7aa;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #f97316;
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
}

.stats-error {
  font-size: 13px;
  color: #b91c1c;
}

.aw-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aw-row-two {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

@media (min-width: 900px) {
  .aw-row-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
