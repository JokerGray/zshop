<template>
  <div class="week">
    <cantitle
              :t1="canvas1.t1"
              :t2="canvas1.t2"
              :n1="canvas1.n1"
              :n2="canvas1.n2"
              :isCanvas="kg1"
    ></cantitle>
    <div class="kg1"></div>
    <div class="w2_main">
      <cantitle
        isTitle="true"
        :title="canvas2.isTitle"
                :hl="canvas2.hl"
                :t1="canvas2.t1"
                :t2="canvas2.t2"
                :n1="canvas2.n1"
                :n2="canvas2.n2"
                :isCanvas="kg1"
      ></cantitle>
      <div class="kg1"></div>
    </div>
    <water :data="data"></water>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import cantitle from '../../components/canvas.vue'
  import water from '../../components/water.vue'
  import YiHzoCanvas from '../../assets/js/line'
  export default {
    components:{
      cantitle,water
    },
    data(){
        return {
            data:[

              {
                  time:"09-24 14:30",
                  num:1,
                  money:"15.00"
              },
              {
                time:"09-14 14:30",
                num:1,
                money:"15.00"
              },
              {
                time:"09-24 14:30",
                num:1,
                money:"15.00"
              },
              {
                time:"09-25 14:30",
                num:1,
                money:"15.00"
              }
            ],
            canvas1:{
              t1:"劵被使用总次数",
              t2:"总收入",
              n1:1256,
              n2:"￥56.26"
            },
            canvas2:{
              hl:'分享"我家小厨100元代金卷"',
              t1:"劵被使用次数",
              t2:"收入",
              n1:56,
              n2:"￥12.26"
            },
            kg1:true,
            kg2:true
        }
    },
    mounted(){

    },
    beforeRouteEnter(to,from,next){
        next();
    }
  }
</script>

<style scoped>
  .week{
    background-color: #f5f5f5;
  }
  .w_main{
    width: 100%;
    background-color: #fff;
  }
  .w2_main{
    margin-top: 10px;
    width: 100%;
    background-color: #fff;
  }
</style>
