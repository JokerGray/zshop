<!--
  标题组件：
-->

<template>
  <div class="title">
      <i @click="$router.go(-1)">&lt;</i>
      <span>{{name}}</span>
  </div>
</template>

<script>

export default {
  name: 'hello',
  props:{
      name
  },
  data(){
      return {
         // name:'标题',
      }
  },

}
</script>

<style scoped>
  .title {
    height: 2rem;
    line-height: 2rem;
    font-size: 0.8rem;
    display: flex;
    justify-content: space-between;
    text-align: center;
  }
  .title i {
    font-size: 0.8rem;
    width: 7%;
  }
  .title span {
    width: 93%;
    font-size: 0.8rem;
  }
</style>
