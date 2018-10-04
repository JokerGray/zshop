<template>
    <servicePage class="main"></servicePage>
</template>
<script>
import servicePage from '../../views/servicePage.vue'

export default {
  components: {
    servicePage
  },
  data () {
    return{
      menuIndex: 0
    }
  }
}
</script>
<style scoped lang="scss">
.main{
    position: relative;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 4px 8px 0px rgba(153, 153, 153, 0.5);
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow: auto;
} 
</style>
