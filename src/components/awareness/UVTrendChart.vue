<template>
  <section class="chart-card">
    <header class="chart-header">
      <h3 class="chart-title">Annual Average Max UV (Melbourne)</h3>
      <p class="chart-subtitle">Average of daily maximum UV index by year</p>
    </header>

    <div v-if="error" class="chart-error">
      {{ error }}
    </div>

    <div v-else class="chart-body">
      <Line v-if="chartData" :data="chartData" :options="chartOptions" />
      <p v-else class="chart-loading">Loading UV data...</p>
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
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { parseCSV } from '@/utils/parseCSV'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const UV_CSV = 'melbourne_daily_max_uv.csv'

const uvRows = ref([])
const error = ref('')

const round2 = (n) => Math.round(n * 100) / 100
const avg = (arr) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0)

const chartData = computed(() => {
  if (!uvRows.value.length) return null

  const byYear = {}
  uvRows.value.forEach((row) => {
    const year = row.Year?.trim()
    const uv = parseFloat(row.UV_Index)
    if (!year || Number.isNaN(uv)) return
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(uv)
  })

  const years = Object.keys(byYear).sort()
  const values = years.map((y) => round2(avg(byYear[y])))

  if (!years.length) return null

  return {
    labels: years,
    datasets: [
      {
        label: 'Avg Max UV',
        data: values,
        borderColor: '#f7931e',
        backgroundColor: 'rgba(247,147,30,0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#f7931e',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#161b22',
      borderColor: '#30363d',
      borderWidth: 1,
      titleColor: '#0f172a',
      bodyColor: '#1f2933',
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
        text: 'Average Max UV Index',
        color: '#4b5563',
      },
    },
  },
}

onMounted(async () => {
  try {
    uvRows.value = await parseCSV(UV_CSV)
  } catch (err) {
    error.value = 'Unable to load UV data.'
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

