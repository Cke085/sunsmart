<template>
  <section class="chart-card">
    <header class="chart-header">
      <h3 class="chart-title">Days with High UV (&gt;= 6)</h3>
      <p class="chart-subtitle">Number of high-UV days per year in Melbourne</p>
    </header>

    <div v-if="error" class="chart-error">
      {{ error }}
    </div>

    <div v-else class="chart-body">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
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
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { parseCSV } from '@/utils/parseCSV'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const UV_CSV = 'melbourne_daily_max_uv.csv'

const uvRows = ref([])
const error = ref('')

const chartData = computed(() => {
  if (!uvRows.value.length) return null

  const byYear = {}
  uvRows.value.forEach((row) => {
    const year = row.Year?.trim()
    const uv = parseFloat(row.UV_Index)
    if (!year || Number.isNaN(uv)) return
    if (!byYear[year]) byYear[year] = 0
    if (uv >= 6) byYear[year] += 1
  })

  const years = Object.keys(byYear).sort()
  if (!years.length) return null

  const counts = years.map((y) => byYear[y])

  return {
    labels: years,
    datasets: [
      {
        label: 'Days with UV >= 6',
        data: counts,
        backgroundColor: counts.map((v) => {
          if (v > 200) return 'rgba(220,38,38,0.9)'
          if (v > 150) return 'rgba(249,115,22,0.9)'
          return 'rgba(245,158,11,0.85)'
        }),
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#111827',
      borderColor: '#374151',
      borderWidth: 1,
      titleColor: '#f9fafb',
      bodyColor: '#e5e7eb',
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.y} days with UV >= 6`,
      },
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
        text: 'Number of days',
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

