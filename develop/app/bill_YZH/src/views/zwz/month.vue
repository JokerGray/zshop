<template>
  <div class="month">
    <div class="m_main">
30
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
