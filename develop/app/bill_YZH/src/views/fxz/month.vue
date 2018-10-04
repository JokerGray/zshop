<template>
  <div class="month">
    分享赚本月
    <div class="m_main">

    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    mounted(){

    },
    beforeRouteEnter(to,from,next){
      next();
    }
  }
</script>

<style scoped>
  .m_main {
    height: 13.06666rem;
  }
</style>
