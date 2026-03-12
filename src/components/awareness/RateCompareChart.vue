<template>
  <section class="chart-card">
    <header class="chart-header">
      <h3 class="chart-title">Age-standardised Melanoma Rates</h3>
      <p class="chart-subtitle">Comparison of 2001 ASP vs 2023 Australian population standard</p>
    </header>

    <div v-if="error" class="chart-error">
      {{ error }}
    </div>

    <div v-else class="chart-body">
      <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      <p v-else class="chart-loading">Loading rate data...</p>
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

const CANCER_CSV = 'skin_cancer_victoria.csv'

const cancerRows = ref([])
const error = ref('')

const chartData = computed(() => {
  if (!cancerRows.value.length) return null

  const personsRows = cancerRows.value.filter(
    (r) =>
      r.Sex?.trim() === 'Persons' && r['State or Territory']?.trim() === 'Victoria',
  )

  if (!personsRows.length) return null

  const years = [...new Set(personsRows.map((r) => r.Year?.trim()))].sort()

  const allKeys = Object.keys(cancerRows.value[0] || {})
  const col2001 = allKeys.find((k) => k.includes('2001')) || ''
  const col2023 = allKeys.find((k) => k.includes('2023')) || ''

  const melanomaRows = personsRows.filter(
    (r) => r['Cancer group/site']?.trim() === 'Melanoma of the skin',
  )

  const ratesFor = (colName) =>
    years.map((year) => {
      const row = melanomaRows.find((r) => r.Year?.trim() === year)
      if (!row || !colName) return null
      const v = parseFloat(row[colName])
      return Number.isNaN(v) ? null : v
    })

  return {
    labels: years,
    datasets: [
      {
        label: '2001 ASP Standard',
        data: ratesFor(col2001),
        backgroundColor: 'rgba(37,99,235,0.75)',
        borderColor: '#2563eb',
        borderWidth: 1,
        borderRadius: 3,
      },
      {
        label: '2023 AUS Population Standard',
        data: ratesFor(col2023),
        backgroundColor: 'rgba(249,115,22,0.75)',
        borderColor: '#f97316',
        borderWidth: 1,
        borderRadius: 3,
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
        text: 'Rate per 100,000',
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

