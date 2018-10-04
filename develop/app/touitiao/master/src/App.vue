<template>
  <div id="app" v-cloak>
    <navigator
      :is-main="isMain"
      :on-before-enter="onBeforeEnter"
      :onEnter="onEnter"
      :on-before-leave="onBeforeLeave"
      :on-leave="onLeave"
      :on-touch="onTouch"
      :swipe-back-edge-threshold="0.05"
      :swipe-back-release-threshold="0.5"></navigator>
    <header v-show="headerShow">
      <span v-show="titleShow" class="logo"></span>
      <div class="search">
        <input type="text" placeholder="请输入您想要的" class="search" @click="goSearch" ref="search">
      </div>
    </header>
    <!--<transition :name="transitionName">-->
    <!--<navigation>-->
    <!--<router-view></router-view>-->
    <!--</navigation>-->
    <!--</transition>-->

    <!--<transition>-->
    <!--<router-view></router-view>-->
    <!--</transition>-->
    <!--<keep-alive>-->
      <!--<router-view></router-view>-->
    <!--</keep-alive>-->

    <mt-tabbar fixed v-if="navBarShow">
      <mt-tab-item>
        <router-link to="/home">
          <span class="iconfont icon-shouye-copy"></span>
          <p>首页</p>
        </router-link>
      </mt-tab-item>
      <mt-tab-item>
        <router-link to="/video">
          <span class="iconfont icon-shipin"></span>
          <p>视频</p>
        </router-link>
      </mt-tab-item>
      <mt-tab-item>
        <router-link to="/topicHome">
          <span class="iconfont icon-zhuanti"></span>
          <p>专题</p>
        </router-link>

      </mt-tab-item>
      <mt-tab-item>
        <router-link to="/care">
          <span class="iconfont icon-guanzhu"></span>
          <p>关注</p>
        </router-link>

      </mt-tab-item>
      <mt-tab-item>
        <router-link to="/mine">
          <span class="iconfont icon-wodedangxuan1"></span>
          <p>我的</p>
        </router-link>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  import $ from 'jquery'
  import Vue from 'vue'
  import {Toast} from 'mint-ui'
  import { Tabbar, TabItem } from 'mint-ui';
  Vue.component(Tabbar.name, Tabbar);
  Vue.component(TabItem.name, TabItem);
  export default {
    data: function () {
      return {
        titleShow: true,
        headerShow: true,
        path: null,
        navBarShow: true
        // transitionName: null,
        //backShow: false,
      }
    },
    created: function () {
      //界面加载时判断返回按钮显示还是隐藏
      this.path = this.$route.path;
      this.isShowNavBar(this.$route.path);
    },
    methods: {
      isShowNavBar: function (path) {
        if (path == '/home' ||
          path == '/video' ||
          path == '/' ||
          path == '/topicHome') {
          this.headerShow = true
        } else {
          this.headerShow = false
        }
        if (path.indexOf('/pictures') !== -1 ||
          path.indexOf('/author/authorPage/homePage') !== -1 ||
          path.indexOf('/topicInfo') !== -1 ||
          path.indexOf('/topicDetails') !== -1 ||
          path.indexOf('/mine/mine-CollectionAndHistory') !== -1 ||
          path.indexOf('/mine/min-ewCode') !== -1 ||
          path.indexOf('/care/addCare') !== -1 ||
          path.indexOf('/mine/mine-attentionAndFans') !== -1 ||
          path.indexOf('/mine/mineArticleManage') !== -1 ||
          path.indexOf('/announcmentInfo') !== -1 ||
          path.indexOf('/writeArticle') !== -1 ||
          path.indexOf('/mine/mineQuestionManage') !== -1 ||
          path.indexOf('/editMyAnswer') !== -1 ||
          path.indexOf('/toAnswerPage') !== -1 ||
          path.indexOf('/newsInfo') !== -1 ||
          path.indexOf('/videoInfo') !== -1 ||
          path.indexOf('/answerInfo') !== -1 ||
          path.indexOf('/singleAnswer') !== -1 ||
          path.indexOf('/commentReplyInfo') !== -1 ||
          path.indexOf('/search') !== -1 ||
          path.indexOf('/friendUpdates') !== -1 ||
          path.indexOf('/voteInfo') !== -1 ||
          path.indexOf('/mine/mine-active') !== -1) {
          this.navBarShow = false
        } else {
          this.navBarShow = true;
        }
      },
      goSearch: function () {
        this.$refs.search.blur();
        this.$router.push({path: '/search'})
//        if(this.$route.path=='/home'){
//          this.$router.push({path:'/search'})
//        }
//        if(this.$route.path=='/video'){
//          this.$router.push({path:'/search'});
//        }
//        if(this.$route.path=='/topicHome'){
//          this.$router.push({path:'/search'});
//        }
      },
      //以下方法为路由动画方法
      isMain(route) {
        return route.path === '/home' ||
          route.path === '/video' ||
          route.path === '/topicHome' ||
          route.path === '/care' ||
          route.path === '/mine'
      },
      onTouch(enterEl, leaveEl, x, y) {
        const screenWidth = window.document.documentElement.clientWidth;
        const touchXRatio = x / screenWidth;
        enterEl.style.transition = 'none';
        leaveEl.style.transition = 'none';
        enterEl.style.transform = `translate(${touchXRatio * 100}%)`;
        leaveEl.style.transform = `translate(${touchXRatio * 50 - 50}%)`

      },
      onBeforeEnter(el, done) {
        const h = () => {
          done();
          el.removeEventListener('transitionend', h)
        }
        el.addEventListener('transitionend', h);
        el.style.transform = 'translateX(100%)';
        el.style.transition = 'all 0.3s'
      },
      onEnter(el, done) {
        const h = () => {
          done();
          el.removeEventListener('transitionend', h)
        };
        el.addEventListener('transitionend', h);
        el.style.transform = 'translateX(0%)';
        el.style.transition = 'all 0.3s'
      },
      onBeforeLeave(el, done) {
        if (el) {
          const h = () => {
            done();
            el.removeEventListener('transitionend', h)
          };
          el.addEventListener('transitionend', h);
          el.style.transform = 'translateX(0%)';
          el.style.transition = 'all 0.3s'
        }
      },
      onLeave(el, done) {
        if (el) {
          const h = () => {
            done();
            el.removeEventListener('transitionend', h)
          };
          el.addEventListener('transitionend', h);
          el.style.transform = 'translateX(-50%)';
          el.style.transition = 'all 0.4s'
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('body').height($(window).height());
        $('#app').height($(window).height())
      })
    },
    watch: {
      $route: function (newValue, old) {
        // this.path = old.path;
        this.isShowNavBar(newValue.path);
        // var to = newValue.path.split('/').length;
        // var from = old.path.split('/').length;
        // if (to >= from && to !== 2) {
        //   this.transitionName = 'fadeInRight'
        // } else if (to < from) {
        //   this.transitionName = 'fadeInLeft'
        // } else {
        //   this.transitionName = null
        // }
      }
    }
  }
</script>

<style type="text/less" lang="less">
  [v-cloak] {
    display: none;
  }

  #app {
    font-family: "微软雅黑";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    overflow: hidden;
    overflow-y: scroll;
  }

  header {
    width: 100%;
    height: 100/32rem;
    line-height: 100/32rem;
    padding: 0 20/32rem!important;
    background-color: #fff;
    color: #333;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    .logo {
      display: block;
      width: 156/32rem;
      height: 90/32rem;
      background: url("../static/images/logo.png") no-repeat center;
      background-size: 100%;
    }
    .search {
      position: fixed;
      top: 15/32rem;
      right: 26/32rem;
      z-index: 999;
      input {
        width: 470/32rem;
        height: 60/32rem;
        line-height: 60/32rem;
        outline: none;
        border-radius: 10/32rem;
        border: 2/32rem solid #ccc;
        margin-left: 50/32rem;
        padding-left: 20/32rem;
        font-size: 14/32rem;
        -webkit-appearance: none;
      }
    }
  }

  .mint-tabbar.is-fixed {
    z-index: 999;
    height: 100/32rem !important;
  }

  .mint-tabbar > .mint-tab-item.is-selected {
    background-color: #fff !important;
    color: #333 !important;
    p {
      padding-top: 15/32rem;
    }
    span {
      font-size: 34/32rem;
    }
  }

  .tabbar-active {
    color: #9171F9;
  }

 /** .fadeInRight-enter {
    position: relative;
    top: 0;
    right: -650/32rem;
    opacity: .6;
  }

  .fadeInRight-enter-to {
    position: relative;
    top: 0;
    right: 0;
    opacity: 1;
  }
  .fadeInRight-enter-active, .fadeInLeft-enter-active {
    transition: all .5s ease;
  }
  .fadeInLeft-enter {
    position: relative;
    top: 0;
    left: -650/32rem;
    opacity: .6;
  }
  .fadeInLeft-enter-to {
    position: relative;
    top: 0;
    left: 0;
    opacity: 1;
  }**/

</style>
