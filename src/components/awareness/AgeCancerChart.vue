<template>
  <div class="chart-wrapper">
    <div v-if="!data || data.length === 0" class="no-data-overlay">
      No data available for the current selection.
    </div>
    <div ref="chartRef" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, shallowRef } from 'vue'
import * as echarts from 'echarts'

const props = defineProps(['data'])
const chartRef = ref(null)
const myChart = shallowRef(null)

const updateChart = () => {
  if (!myChart.value) return

  if (!props.data || props.data.length === 0) {
    myChart.value.setOption(
      {
        title: { text: 'No Data Available', left: 'center', top: 'center' },
        series: []
      },
      true
    )
    return
  }

  try {
    const sorted = [...props.data].sort((a, b) => {
      const strA = a.age_group_years || '0'
      const strB = b.age_group_years || '0'

      const ageA = parseInt(strA.split('-')[0]) || 0
      const ageB = parseInt(strB.split('-')[0]) || 0
      return ageA - ageB
    })

    myChart.value.setOption(
      {
        title: { text: 'Cancer Rate by Age Group', left: 'center' },
        tooltip: {
          trigger: 'axis',
          formatter: '{b} Age Group: {c} per 100k'
        },
        grid: { bottom: '15%', containLabel: true },
        xAxis: {
          type: 'category',
          data: sorted.map((i) => i.age_group_years),
          name: 'Age Group',
          axisLabel: { rotate: 45 }
        },
        yAxis: {
          type: 'value',
          name: 'Rate per 100k'
        },
        series: [
          {
            data: sorted.map((i) => i.age_specific_rate),
            type: 'line',
            smooth: true,
            itemStyle: { color: '#f97316' },
            symbolSize: 8,
            label: { show: true, position: 'top' }
          }
        ]
      },
      true
    )
  } catch (err) {
    console.error('Error in AgeCancerChart visualization:', err)
  }
}

onMounted(() => {
  myChart.value = echarts.init(chartRef.value)
  updateChart()
  window.addEventListener('resize', () => myChart.value?.resize())
})

watch(() => props.data, updateChart, { deep: true })
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
}
.no-data-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #f97316;
  font-weight: bold;
  z-index: 5;
}
</style>
