<template>
  <div>
    <headr :name="name"></headr>
    <contents></contents>
  </div>
</template>

<script>
  import headr from '../../components/headr.vue'
  import contents from '../../components/content.vue'
  export default {
      components:{
          headr,contents
      },
      data(){
          return {
              name:'分享赚账单详情'
          }
      }
  }
</script>
