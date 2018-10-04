<!--
  账单流水组件
-->
<template>
  <div class="water">
    <ul>
      <li v-for="item in data">
        <div>
          <span class="time">
            {{item.time}}
          </span>
          <span class="num">
            数量：{{item.num}}
          </span>
          <span class="money">
            <i>+</i>{{item.money}}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
      props:['data']
  }
</script>

<style scoped>
  .water{
    background-color: #fff;
  }
  .water ul{
    margin-left: 0.85333rem;
    margin-right: 0.34667rem;
  }
  .water ul li{
    display: block;
    height: 1.33333rem;
    line-height: 1.33333rem;
    border-top: 1px solid #dadada;
  }
  .water li div{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .water span{
    font-size: 0.373333rem;
    color: #999;
  }
  .water .money{
    color: #333;
    font-size: 0.56666rem;
  }
  .water .money i{
    font-size: 0.32rem;
    vertical-align: top;
  }
</style>
