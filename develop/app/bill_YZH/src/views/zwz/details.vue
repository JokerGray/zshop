<template>
  <div id="details">
      <titles :name="name"></titles>
      <contents></contents>
  </div>
</template>

<script>
  import contents from '../../components/content.vue'
  import titles from '../../components/headr.vue'
  export default {
      name: 'details',
      components:{
        contents,titles
      },
      data(){
        return {
          name:'转文赚账单详情'
        }
      },
  }
</script>

<style scoped>
  #details {
    width: 100%;
    font-family: "copperplate gothic bold";
    font-weight: 500;
  }
</style>
