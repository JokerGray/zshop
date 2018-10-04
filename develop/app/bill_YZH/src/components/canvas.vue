<!--
  canvas组件：
  1.标题，数据
  2.图表
-->

<template>
  <div class="ctitle">
    <!--canvas 标题-->
    <div class="title" v-show="isTitle">
      <span>{{hl}}</span>
      <span v-show="t_right">点击单价0.05</span>
    </div>
    <!--canvas 统计数据-->
    <div class="marked">
      <!--第一行-->
      <div class="m_warp">
        <div class="m_a">
          <i></i>
          <span>{{t1}}</span>
        </div>
        <div class="m_b">
          <i></i>
          <span>{{t2}}</span>
        </div>
      </div>
      <!--第二行-->
      <div class="t_tatol">
        <span>{{n1}}</span>
        <span>{{n2}}</span>
      </div>
    </div>

    <!--canvas 组件-->
     <div class="mon" v-show="isCanvas">

     </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
      props:{
           t_right:false,
          isTitle:true,
            isCanvas:false,
           hl:'',
           t1:'',
           t2:'',
            n1:'',
            n2:''
      },
      mounted(){
        var myChart = echarts.init(document.querySelector(".ctitle .mon"));
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
          data:[220, 432, 100, 934, 290, 330, 320]
        })
        myChart.setOption(a);
      }
  }
</script>

<style scoped>
  .ctitle{
    padding-top:0.36rem;
    padding-bottom: 0.8rem;
    background-color: #fff;
  }
  .title {
    height: 1.73333333rem;
    display: flex;
    font-weight: bold;
  }
  .title span:first-child {
    margin-top: 0.72rem;
    margin-bottom: 1.04rem;
    font-size: 0.6rem;
    width: 61.4%;
    color: #333;
  }
  .title span:last-child {
    margin-top: 0.53333333rem;
    font-size: 0.4rem;
    color: #999;
    margin-right: 0.4rem;
  }
  .marked {
    margin: 0 auto;
    font-size: 0.44rem;
    width: calc(100% - 0.96rem);
    color: #333;
    text-align: center;
    padding:0.54rem 0;
  }
  .marked .m_warp{
    display: flex;
  }
  .marked i {
    display: inline-block;
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 0.16rem;
  }
  .marked .m_a,.m_b{
    text-align: center;
    width: 100%;
  }
  .marked .m_a i {
    background-color: #0cb8ff;
  }
  .marked .m_a span {
    margin-left: 0.21333333rem;
  }
  .marked .m_b{
    margin-right: 1.2rem;
  }
  .marked .m_b i {
    background-color: #ff7733;
  }
  .marked .m_b span {
    margin-left: 0.21333333rem;
  }
  .t_tatol {
    margin-top: 0.32rem;
    font-size: 0.46666667rem;
    color: #333;
    display: flex;
  }
  .t_tatol span{
    flex: 0 0 50%;
    text-indent: -1.4rem;
  }
  .mon{
    width: 100%;
  }
</style>
