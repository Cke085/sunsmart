<template>
  <section class="chart-card">
    <header class="chart-header">
      <h3 class="chart-title">Non-melanoma Skin Cancer (Rare Types)</h3>
      <p class="chart-subtitle">Trends by sex and total (persons) in Victoria</p>
    </header>

    <div v-if="error" class="chart-error">
      {{ error }}
    </div>

    <div v-else class="chart-body">
      <Line v-if="chartData" :data="chartData" :options="chartOptions" />
      <p v-else class="chart-loading">Loading non-melanoma data...</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { parseCSV } from '@/utils/parseCSV'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const CANCER_CSV = 'skin_cancer_victoria.csv'

const cancerRows = ref([])
const error = ref('')

const chartData = computed(() => {
  if (!cancerRows.value.length) return null

  const rows = cancerRows.value.filter(
    (r) =>
      r['Cancer group/site']?.trim() === 'Non-melanoma skin cancer (rare types)' &&
      r['State or Territory']?.trim() === 'Victoria',
  )

  if (!rows.length) return null

  const years = [...new Set(rows.map((r) => r.Year?.trim()))].sort()

  const seriesFor = (sexLabel) =>
    years.map((year) => {
      const match = rows.find(
        (r) => r.Year?.trim() === year && r.Sex?.trim() === sexLabel,
      )
      if (!match) return null
      const raw = (match.Count || '').replace(/,/g, '')
      const n = parseInt(raw, 10)
      return Number.isNaN(n) ? null : n
    })

  return {
    labels: years,
    datasets: [
      {
        label: 'Male',
        data: seriesFor('Males'),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.06)',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
      },
      {
        label: 'Female',
        data: seriesFor('Females'),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.06)',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
      },
      {
        label: 'Persons',
        data: seriesFor('Persons'),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.06)',
        tension: 0.3,
        fill: false,
        pointRadius: 3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: '#4b5563', usePointStyle: true },
    },
    tooltip: {
      backgroundColor: '#111827',
      borderColor: '#374151',
      borderWidth: 1,
      titleColor: '#f9fafb',
      bodyColor: '#e5e7eb',
    },
  },
  scales: {
    x: {
      grid: { color: '#e5e7eb' },
      ticks: { color: '#4b5563' },
    },
    y: {
      grid: { color: '#e5e7eb' },
      ticks: { color: '#4b5563' },
      title: {
        display: true,
        text: 'Number of cases',
        color: '#4b5563',
      },
    },
  },
}

onMounted(async () => {
  try {
    cancerRows.value = await parseCSV(CANCER_CSV)
  } catch (err) {
    error.value = 'Unable to load cancer data.'
    // eslint-disable-next-line no-console
    console.error(err)
  }
})
</script>

<style scoped>
.chart-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.chart-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.chart-body {
  position: relative;
  min-height: 260px;
}

.chart-loading,
.chart-error {
  font-size: 14px;
  color: #6b7280;
}

.chart-error {
  color: #b91c1c;
}
</style>

