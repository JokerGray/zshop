<template>
  <div class="yesterday">
    分享赚昨天
    <div class="y_main">

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
  .y_main {
    height: 13.06666rem;
  }
</style>
