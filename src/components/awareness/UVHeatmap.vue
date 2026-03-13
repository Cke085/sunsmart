<template>
  <section class="chart-card">
    <header class="chart-header">
      <h3 class="chart-title">Monthly UV Heatmap</h3>
      <p class="chart-subtitle">Average daily maximum UV by month and year</p>
    </header>

    <div v-if="error" class="chart-error">
      {{ error }}
    </div>

    <div v-else class="heatmap-wrapper">
      <table v-if="years.length" class="heatmap-table">
        <thead>
          <tr>
            <th>Year</th>
            <th v-for="month in months" :key="month">{{ month }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in matrix" :key="row.year">
            <th>{{ row.year }}</th>
            <td
              v-for="(cell, colIndex) in row.values"
              :key="`${row.year}-${colIndex}`"
              :class="['hm-cell', { 'hm-empty': !cell }]"
              :style="cell ? { background: cell.color } : {}"
              :title="cell ? `${months[colIndex]} ${row.year}: UV ${cell.value}` : 'No data'"
            >
              {{ cell ? cell.value : '-' }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="chart-loading">Loading UV data...</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { parseCSV } from '@/utils/parseCSV'

const UV_CSV = 'melbourne_daily_max_uv.csv'

const uvRows = ref([])
const error = ref('')

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const avg = (arr) => (arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0)
const round2 = (n) => Math.round(n * 100) / 100

const uvToColor = (value, min, max) => {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)))
  const r = Math.round(30 + t * (247 - 30))
  const g = Math.round(20 + t * (100 - 20))
  const b = Math.round(60 + t * (10 - 60))
  return `rgba(${r},${g},${b},0.85)`
}

const years = computed(() => {
  if (!uvRows.value.length) return []

  const data = {}
  uvRows.value.forEach((raw) => {
    const cleanRow = {}
    Object.keys(raw).forEach((k) => {
      cleanRow[k.trim()] = raw[k]
    })

    const year = cleanRow.Year?.trim()
    const date = cleanRow.Date?.trim()
    const uv = parseFloat(cleanRow.UV_Index)
    if (!year || !date || Number.isNaN(uv)) return

    const parts = date.split(/[/-]/)
    if (parts.length < 3) return
    const monthIndex = parseInt(parts[1], 10) - 1
    if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return

    if (!data[year]) data[year] = Array.from({ length: 12 }, () => [])
    if (!Array.isArray(data[year][monthIndex])) data[year][monthIndex] = []
    data[year][monthIndex].push(uv)
  })

  return Object.keys(data).sort()
})

const matrix = computed(() => {
  if (!uvRows.value.length || !years.value.length) return []

  const grouped = {}
  uvRows.value.forEach((raw) => {
    const cleanRow = {}
    Object.keys(raw).forEach((k) => {
      cleanRow[k.trim()] = raw[k]
    })

    const year = cleanRow.Year?.trim()
    const date = cleanRow.Date?.trim()
    const uv = parseFloat(cleanRow.UV_Index)
    if (!year || !date || Number.isNaN(uv)) return

    const parts = date.split(/[/-]/)
    if (parts.length < 3) return
    const monthIndex = parseInt(parts[1], 10) - 1
    if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return

    if (!grouped[year]) grouped[year] = Array.from({ length: 12 }, () => [])
    if (!Array.isArray(grouped[year][monthIndex])) grouped[year][monthIndex] = []
    grouped[year][monthIndex].push(uv)
  })

  const allAverages = []
  years.value.forEach((y) => {
    grouped[y].forEach((arr) => {
      if (arr.length) allAverages.push(avg(arr))
    })
  })

  if (!allAverages.length) return []

  const minUV = Math.min(...allAverages)
  const maxUV = Math.max(...allAverages)

  return years.value.map((year) => ({
    year,
    values: grouped[year].map((arr, idx) => {
      if (!arr.length) return null
      const value = round2(avg(arr))
      return {
        monthIndex: idx,
        value,
        color: uvToColor(value, minUV, maxUV),
      }
    }),
  }))
})

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
  overflow-x: auto;
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

.heatmap-wrapper {
  width: 100%;
  overflow-x: auto;
}

.heatmap-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.heatmap-table th,
.heatmap-table td {
  padding: 6px 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.heatmap-table thead th {
  position: sticky;
  top: 0;
  background: #f9fafb;
  z-index: 1;
  font-weight: 600;
}

.hm-cell {
  color: #111827;
  font-weight: 500;
}

.hm-empty {
  background: #f3f4f6;
  color: #9ca3af;
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

