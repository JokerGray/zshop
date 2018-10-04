<!--
  抢标赚账单详情
-->
<template>
  <div>
    <titles :name="name"></titles>
    <div>
      <div class="water">
        <p class="w_title">本月</p>
        <div class="w_conent">
          <div class="w_c w_c_1">
            <span>今天</span>
            <span><i>+</i><strong>150.00</strong></span>
          </div>
          <div class="w_c w_c_2">
            <span>14:30</span>
            <span><i></i>需要"私人私厨"</span>
          </div>
        </div>
        <div class="w_conent">
          <div class="w_c w_c_1">
            <span>今天</span>
            <span><i>+</i><strong>150.00</strong></span>
          </div>
          <div class="w_c w_c_2">
            <span>14:30</span>
            <span><i></i>需要"私人私厨"</span>
          </div>
        </div>
      </div>
      <div class="water">
        <p class="w_title">本月</p>
        <div class="w_conent">
          <div class="w_c w_c_1">
            <span>今天</span>
            <span><i>+</i><strong>150.00</strong></span>
          </div>
          <div class="w_c w_c_2">
            <span>14:30</span>
            <span><i></i>需要"私人私厨"</span>
          </div>
        </div>
        <div class="w_conent">
          <div class="w_c w_c_1">
            <span>今天</span>
            <span><i>+</i><strong>150.00</strong></span>
          </div>
          <div class="w_c w_c_2">
            <span>14:30</span>
            <span><i></i>需要"私人私厨"</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .water{
    width: 100%;
    background-color: #fff;
  }
  .water .w_title{
    font-size: 0.56rem;
    font-weight: 600;
    height: 1.6rem;
    line-height: 1.6rem;
    color: #333;
    text-indent: 1.2rem;
    text-align: left;
    background-color: #f5f5f5;
  }
  .water .w_conent{
    margin-left: 0.9rem;
    border-bottom: 1px solid #ccc;
  }
  .water .w_conent:last-child{
    border-bottom: none;
  }
  .water .w_c{
    text-indent: 0.4rem;
  }
  .water .w_c_1{
    display: flex;
    justify-content: flex-start;
    padding-top: 0.6rem;
  }
  .water .w_c_1 span:first-child{
    font-size: 0.56rem;
    color: #999;
  }
  .water .w_c_1 span:last-child{
    font-size: 0.76rem;
    color: #333;
    margin-left: 1.44rem;
  }
  .water .w_c_1 span:last-child i{
    margin-right: 0.2rem;
  }
  .water .w_c_1 span strong{
    font-weight: 600;
  }
  .water .w_c_2{
    display: flex;
    justify-content: flex-start;
    padding-bottom: 0.6rem;
  }
  .water .w_c_2 span{
    color: #999;
    font-size: 0.48rem;
  }
  .water .w_c_2 span:last-child{
    margin-left: 1.44rem;
  }
  .water .w_c_2 span:last-child i{
    margin-right: 0.2rem;
    display: inline-block;
    width: 0.24rem;
    height: 0.24rem;
    border-radius: 0.12rem;
    background-color: #ff7733;
  }
</style>

<script>
  import titles from '../../components/headr.vue'
  export default {
      components:{
          titles
      },
      data(){
          return {
              name:"抢标赚账单详情"
          }
      }
  }
</script>
