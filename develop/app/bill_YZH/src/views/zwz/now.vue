<template>
  <div class="now">
    今天
    <div class="n_main">

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
  .n_main {
    height: 13.06666rem;
  }
</style>
