<template>
  <div>
    <div class="header">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <div class="navTab">
        <span :class="{'active':0==active}" @click="changePage(0)">TA的关注</span>
        <span :class="{'active':1==active}" @click="changePage(1)">TA的粉丝</span>
        <span :class="{'active':2==active}" @click="changePage(2)">TA的访客</span>
      </div>
      <!--<a href="javascript:;" class="iconfont icon-jia add"></a>-->
    </div>
    <div class="content">
      <listTemp :active_temp="active" @changeActive="changePage"></listTemp>
    </div>
  </div>
</template>

<script>
  import listTemp from '../common/fansAndVisitorsListTemp'
  export default {
    components: {
      listTemp
    },
    data: function () {
      return {
        active: 0,
      }
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      changePage: function (index) {
        this.active = index;
      },
    },
  }
</script>

<style scoped lang="less" type="text/less">
  .header {
    width: 100%;
    height: 90/32rem;
    line-height: 90/32rem;
    padding: 0 30/32rem;
    border-bottom: 1/32rem solid #eee;
    position: relative;
    z-index: 1;
    background-color: #fff;
    a {
      float: left;
      width: 60/32rem;
      height: 90/32ren;
      font-size: 36/32rem;
      color: #787878;
    }
    /*.add {*/
    /*float: right;*/
    /*text-align: right;*/
    /*}*/
    .navTab {
      float: left;
      span {
        display: inline-block;
        height: 89/32rem;
        font-size: 34/32rem;
        color: #999999;
        //margin-right: 30/32rem;
        &.active {
          border-bottom: 4/32rem solid #464256;
          color: #464256;
        }
        &:nth-of-type(1) {
          margin-left: 20/32rem;
        }
        &:nth-of-type(2) {
          margin: 0 40/32rem;
        }
      }
    }
  }
</style>
