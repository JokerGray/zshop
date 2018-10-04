<template>
    <div class="backTemp">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
    </div>
</template>

<script>
    export default {
      methods:{
        goBack: function () {
          this.$router.go(-1);
          this.$emit('goBack')
        },
      },
      data:function () {
        return{
          show:true
        }
      }

    }
</script>


<style scoped lang="less" type="text/less">
  .backTemp{
    width: 100%;
    height: 90/32rem;
    line-height: 90/32rem;
    padding: 0 20/32rem;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    border-bottom: 1/32rem solid #e5e5e5;
    .icon-fanhui{
      display: block;
      width: 90/32rem;
      height: 90/32rem;
      font-size: 40/32rem;
      color: #333333;
    }
  }

</style>
