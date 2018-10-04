<template>
  <div id="sd">
      <titles :name="tname"></titles>
      <router></router>
  </div>
</template>

<script>
  import titles from '../../components/headr.vue'
  import router from '../../components/content.vue'
  export default {
      data(){
          return {
            tname:'分享赚账单详情'
          }
      },
      components:{
          titles,router
      }
  }
</script>
