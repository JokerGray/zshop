<!--
路由组件：
1.路由部分
2.时间日期
-->

<template>
  <div class="routing">
      <div class="r_nav">
        <ul>
          <li><router-link to="/now">今日</router-link></li>
          <li><router-link to="/yesterday">昨日</router-link></li>
          <li><router-link to="/week">近7日</router-link></li>
          <li><router-link to="/month">近30日</router-link></li>
        </ul>
      </div>
      <div class="date">
        <span>2017-1-18至2017-1-24</span>
      </div>
      <div class="r_nav_content">
        <router-view></router-view>
      </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
  .r_nav .router-link-active{
    color: #000;
  }
  .r_nav {
    height: 1.6rem;
    line-height: 1.6rem;
    display: flex;
    justify-content: center;
    background: #FFD600;
  }
  .r_nav ul {
    display: flex;
    width: 89.33333rem;
    text-align: center;
  }
  .r_nav li {
    flex: 0 0 25%;
  }
  .r_nav li a{
    color: #555;
    font-size: 0.6rem;
  }
  .date {
    background-color: #f5f5f5;
    height: 1.5rem;
    line-height: 1.5rem;
  }
  .date span {
    margin-left: 1rem;
    font-size: 0.6rem;
    color: #000000;
    font-weight: 500;
    display: block;
    text-align: left;
  }
</style>
