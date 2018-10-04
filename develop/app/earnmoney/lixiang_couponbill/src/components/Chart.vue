<template>
    <section>
        detail
    </section>
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
var myChart = null
export default {
  props: {
    chartData: Array,
    loading: Boolean
  },
  watch: {
    chartData (arr, oldArr) {
      let arrX = []
      let arrY = []
      let type = this.$parent.activeTab
      for (let i = 0; i < arr.length; i++) {
        arrX.push(arr[i]['id'])
        arrY.push(arr[i]['value'])
      }
      if (type === 'day' || type === 'yesterday') {
        for (let i = 0; i < arrX.length; i++) {
          arrX[i] = (parseInt(arrX[i]) < 10 ? '0' : '') + arrX[i] + ':00'
        }
      }
      this.setChart(arrX, arrY)
    },
    loading (val, oldVal) {
      if (myChart) {
        val ? myChart.showLoading({text: '加载中······', effect: 'whirling'}) : myChart.hideLoading()
      }
    }
  },
  methods: {
    setChart (dataX, dataY) {
      myChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: {
          top: 10,
          right: 10,
          bottom: 0,
          left: 0,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dataX,
          axisLabel: {
            show: false,
            textStyle: { color: '#FFF' }
          },
          axisTick: { show: false },
          axisLine: {
            lineStyle: { color: '#999' }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          },
          axisLabel: {
            show: true,
            textStyle: { color: '#999' },
            formatter: function (value) { return value },
            interval: 15
          },
          splitLine: {
            lineStyle: { type: 'dotted' }
          }
        },
        series: [{
          name: '次数',
          type: 'line',
          stack: '总量',
          symbolSize: 5,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#fff5c0' }, { offset: 1, color: '#fffbe9' }])
            }
          },
          itemStyle: {
            normal: {
              color: '#ffd600',
              lineStyle: { color: '#ffd600' }
            }
          },
          data: dataY
        }],
        radiusAxis: {
          axisLine: { show: [false] }
        },
        color: ['rgba(255,215,0,0.5)']
      })
    }
  },
  mounted () {
    myChart = echarts.init(this.$el)
    window.addEventListener('resize', myChart.resize, false)
  }
}
</script>
