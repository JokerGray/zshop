<template>
  <div>
    <div class="cateBox" ref="cateBox">
      <div class="nav" v-for="(item,index) in cateList" :class="{active:index==active}" @click="changePage(index)" ref="nav">
        {{item.channelName}}
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    props: ['cateList', 'active'],
    methods: {
      changePage: function (index) {
        this.$emit('sent', index)
      },
      navAnimate:function (el,time) {
        var moveX = $(el).position().left + $(el).parent().scrollLeft();
        var pageX = document.documentElement.clientWidth;
        var blockWidth = $(el).width();
        var left = moveX - (pageX / 2) + (blockWidth / 2) + 30;
        $(this.$refs.cateBox).animate({"scrollLeft":left},time);
      }
    },
    mounted: function () {
      var that = this;
      $(function () {
        $(".nav").on("click", function(ev) {
          that.navAnimate(this,300)
        })
      });
    },
    watch: {
      active:function (value) {
        var navs = this.$refs.nav;
        this.navAnimate(navs[value],300)
      },
      $route:function () {
        var navs = this.$refs.nav;
        this.navAnimate(navs[this.active],0)
      }
    }
  }
</script>
<style scoped lang="less" type="text/less">
  .active {
    background-color: #8D73EE;
    color: #fff;
  }
  .cateBox {
    width: 100%;
    height: 90/32rem;
    overflow: hidden;
    white-space: nowrap;
    overflow-x: scroll;
    padding: 0 20/32rem;
    /*<!--padding: 0 60/32rem 0 10/32rem;-->*/
    background-color: #F7F7F7;
    padding-right: 70/32rem;
  }
  .cateBox::-webkit-scrollbar {
    display: none;
  }
  .nav {
    display: inline-block;
    padding: 0 20/32rem;
    margin: 22/32rem 5/32rem 0 5/32rem;
    height: 46/32rem;
    line-height: 46/32rem;
    font-size: 32/32rem;
    border-radius: 6/32rem;

  }
</style>
