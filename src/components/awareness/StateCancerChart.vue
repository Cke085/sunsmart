<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script setup>
import { onMounted, ref, watch, shallowRef } from 'vue'
import * as echarts from 'echarts'

const props = defineProps(['data'])
const chartRef = ref(null)
const myChart = shallowRef(null)

const updateChart = () => {
  if (!myChart.value || !props.data) return
  const sorted = [...props.data].sort((a, b) => b.rate - a.rate)
  myChart.value.setOption({
    title: { text: 'Cancer Rate by State', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: sorted.map((i) => i.state_or_territory),
      axisLabel: { rotate: 30 }
    },
    yAxis: { type: 'value', name: 'Rate per 100k' },
    series: [{ data: sorted.map((i) => i.rate), type: 'bar', itemStyle: { color: '#f97316' } }]
  })
}

onMounted(() => {
  myChart.value = echarts.init(chartRef.value)
  updateChart()
  window.addEventListener('resize', () => myChart.value?.resize())
})
watch(() => props.data, updateChart, { deep: true })
</script>
