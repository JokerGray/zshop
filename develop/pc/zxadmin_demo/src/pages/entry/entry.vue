<template>
  <section class="entry-content">
    <el-container class="main-container" ref="mainContainer">
      <el-aside width="200px" v-if="!showPackCardForm">
        <eMenu ref="menu"></eMenu>
      </el-aside>
      <el-container class="main-bg" ref="mainBg">
        <div v-if="!showPackCardForm" class="shaft"></div>
        <el-main class="main-page">
          <i v-if="!showPackCardForm" class="el-icon-arrow-up" @click="slideTo('up')" ref="iconUp"></i>
          <i v-if="!showPackCardForm" class="el-icon-arrow-down" @click="slideTo('down')" ref="iconDown"></i>
          <i class="icon-left" @click="toggleHelp"></i>
          <transition :name="animateName">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>

    <div class="aside-help" ref="help">
      <router-link to="/home"><i class="icon-close"></i></router-link>
      <i class="icon-right" @click="toggleHelp"></i>
      <help></help>
    </div>
  </section>
</template>
<script>
  import eMenu from './eMenu'
  import help from '../../components/help'

  export default {
    components: {
      eMenu,
      help,
    },
    data() {
      return {
        showPackCardForm: false,
        animateName: 'page',
        path:['/entry/shop','/entry/staff','/entry/goods','/entry/customer']
      }
    },
    methods: {
      slideTo(val) {
        let index = this.$route.name;
        val === 'up'? index-- : index++
        if(index>=0&&index<=3){
          this.$router.push({path:this.path[index]});
          this.$refs.menu.toggleMenu(index)
        }
      },
      toggleHelp() {
        this.$refs.mainBg.$el.classList.toggle('full-width')
        this.$refs.help.classList.toggle('hide')
      }
    },
    updated() {
      let p = '/entry/packCard';
      let p1 = '/entry/pc';
      this.showPackCardForm = this.$route.path == p || this.$route.path == p1
    },
    mounted() {
      let p = '/entry/packCard';
      let p1 = '/entry/pc';
      this.showPackCardForm = this.$route.path == p || this.$route.path == p1
    },
    watch: {
      $route (val, old) {
        if (val.name > old.name) {
          this.animateName = "page";
        }else if(val.name < old.name){
          this.animateName = "ePage";
        }
        console.log(val.name)
        if(this.$refs.iconUp) this.$refs.iconUp.classList.toggle('disabled', val.name == 0)
        if(this.$refs.iconDown) this.$refs.iconDown.classList.toggle('disabled', val.name == 3)
      }
    }
  }
</script>
<style scoped lang="scss">
  @mixin img_icon($w, $h) {
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: $w;
    height: $h;
  }

  .entry-content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }

  .el-aside, .main-container, .main-bg {
    height: 100%;
  }

  .main-bg {
    position: relative;
    padding: 0;
    margin: 0 280px 0 0;
    background: #d0f8ed url(./img/logo.png) no-repeat center;
    transition: all 0.2s ease-in-out;
    .main-page {
      position: relative;
      height: 100%;
      padding: 48px 44px 48px 0;
      overflow: hidden;
      box-sizing: border-box;
    }
    &.full-width {
      margin-right: 0;
      .icon-left {
        transform: translate3d(0, 0, 0) rotateY(180deg);
        transition-delay: 0.2s;
      }
    }
  }

  // 右侧帮助文档
  .aside-help {
    position: absolute;
    display: block;
    width: 280px;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #f8f8f8;
    box-sizing: border-box;
    box-shadow: 5px 5px 5px #ccc;
    transition: all 0.2s ease-in-out;
    &.hide {
      transform: translate3d(100%, 0, 0);
    }
    .icon-close {
      z-index: 999;
      position: absolute;
      top: 0;
      right: 0;
      @include img_icon(51px, 51px);
      background-image: url(./img/shrink.png);
      cursor: pointer;
    }
  }

  .el-icon-arrow-up, .el-icon-arrow-down {
    z-index: 999;
    position: absolute;
    padding: 0 8px;
    top: 0;
    left: 100px;
    font-size: 32px;
    background-color: #828081;
    color: #eee !important;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    cursor: pointer;

    &.disabled {
      color: #999;
      cursor: no-drop;
    }
  }

  .el-icon-arrow-down {
    top: inherit;
    bottom: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
.shaft{
  position: absolute;
  top: 0;
  left: 120px;
  width: 10px;
  height: 100%;
  background-color: #bee1d7;
}
  .icon-right, .icon-left {
    z-index: 999;
    position: absolute;
    @include img_icon(28px, 50px);
    top: 88px;
    left: 0;
    background-image: url(./img/icon-right.png);
    cursor: pointer;
  }

  .icon-left {
    left: inherit;
    right: 0;
    transform: translate3d(100%, 0, 0) rotateX(180deg);
    transition: all 0.2s ease-in-out;
  }

  //页面出入效果
  .page-enter {
    transform: translate3d(0, 120%, 0);
  }
  .page-enter-active{
    transition: all 0.5s ease-out;
    transition-delay: .5s;
  }
  .page-enter-to {
    transform: translate3d(0, 0, 0);
  }
  .page-leave {
    transform: translate3d(0, 0, 0);
  }
  .page-leave-active {
    transition: all 0.5s ease-out;
  }
  .page-leave-to {
    transform: translate3d(0, -120%, 0);
  }
  .ePage-enter{
    transform: translateY(-207%);
  }
  .ePage-enter-active{
    transition: all 0.5s ease-out;
    transition-delay: .5s;
  }
  .ePage-enter-to{
    transform: translateY(0);
  }
  .ePage-leave{
    transform: translateX(0);
  }
  .ePage-leave-active{
    transition: all 0.5s ease-out;
  }
  .ePage-leave-to{
    transform: translateY(120%);
  }
</style>
