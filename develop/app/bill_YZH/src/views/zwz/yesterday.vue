<template>
  <div class="yesterday">
    昨天
    <div class="y_main">

    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    mounted(){
      var myChart = echarts.init(document.querySelector(".yesterday .y_main"));
      function setCanvas(obj){
        var options = {
          tooltip : {
            trigger: 'axis',
            triggerOn: 'mousemove'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : {
            type: 'category',
            boundaryGap: false,
            data: [],
          },
          yAxis : {
            type : 'value',
            splitNumber:2,
            splitLine:{
              lineStyle:{
                type:'dashed'
              }
            },
            axisLine:{
              show:false,
            }
          },
          series : {
            type:'line',
            silent:true,
            //线条
            lineStyle:{
              normal:{
                color:obj.color,
              }
            },
            //拐点
            itemStyle:{
              normal:{
                color:obj.color,
              },
              emphasis:{
                borderWidth:5
              }
            },
            //渲染面积
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: obj.color // 0% 处的颜色
                }, {
                  offset: 1, color: '#fff' // 100% 处的颜色
                }], false)
              }
            },
            data:obj.data
          }
        };
        return options;
      }
      var a = setCanvas({
          color:'#66D2FE',
          data:[20, 32, 1, 34, 290, 330, 320]
      })
      myChart.setOption(a);
    },

    beforeRouteEnter(to,from,next){
      next();
    }
  }
</script>

<style scoped>
  .y_main {
    height: 13.06666rem;
  }
</style>
