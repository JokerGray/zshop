<template>
    <div>
      <div class="header"><h4>{{headerTitle}}</h4></div>
    </div>
</template>

<script>
    export default {
      props:['headerTitle']
    }
</script>
<style scoped lang="less" type="text/less">
  .header{
    width: 500/32rem;
    height: 88/32rem;
    text-align: center;
    line-height: 88/32rem;
    font-size: 36/32rem;
    color: #131313;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
  }
</style>
