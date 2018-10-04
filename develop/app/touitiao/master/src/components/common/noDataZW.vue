<template>
    <div class="zw">
      <img :src="require('../../../static/images/noDataPic.png')" class="zwPic">
      <img :src="require('../../../static/images/noDataTips.png')" class="zwTips">
    </div>
</template>

<script>
  import $ from 'jquery'
    export default {
      mounted:function () {
        $('.zw').height($(window).height())
      }
    }
</script>


<style scoped lang="less" type="text/less">
  .zw{
    width: 100%;
    background-color: #fff;
    position: absolute;
    top: 0;
    .zwPic{
      width: 45%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-100%);
    }
    .zwTips{
      width: 35%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,150%);
    }
  }

</style>
