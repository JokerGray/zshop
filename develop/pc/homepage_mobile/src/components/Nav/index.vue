<template>
  <section v-show="showNav">
    <div class="nav">
        <router-link class="logoContent" to="/">
            <img :src="imgSrc">
            <span>{{titleText}}</span>
        </router-link>
        <div class="iconContent">
            <a class="iconDownload" :href="downloadHref" v-show="!!downloadHref">APP下载</a>
            <span class="iconMenu" @click="toggleSildeBar()"></span>
        </div>
    </div>
    <div class="nav_sidebar" ref="sidebar" @click.self="toggleSildeBar()">
        <ul>
            <li v-for="(item, index) in navList" :key="index" :class="index == 0? 'active': ''">{{item}}</li>
        </ul>
    </div>
  </section>
</template>

<script>
const configList = {
  zhome: ['首页', '智享城市', '智大师', '智享店务', '智享后台'],
  zcity: ['脸圈', '全民炫', '约吧', '玩家挣钱', '圈子', '粉天地', '云店', '智享头条', '娱乐', '泡圈聊天'],
  zshop: ['首页', '销售篇', '前台服务篇', '员工操作篇', '店长管理篇'],
  zmaster: ['首页', '大师圈', '智经营', '直播', '云店', '店务'],
  zplatform: ['智享后台', '收银台', '后台功能', '+互联网平台管理系统', '智享城市']
}
const navTitleList = {
  zhome: ['智享城市', 'static/logo1.png'],
  zcity: ['智享城市', 'static/logo2.png'],
  zshop: ['智享店务', 'static/logo3.png'],
  zmaster: ['智大师', 'static/logo4.png'],
  zplatform: ['智享后台', 'static/logo5.png']
}
const urlList = {
  zcity: 'http://erweima.izxcs.com/erweima.php',
  zshop: 'http://erweima.izxcs.com/erweima_pad.php',
  zmaster: 'http://erweima.izxcs.com/erweima_zds.php'
}
export default {
  data () {
    return {
      navList: [],
      downloadHref: '',
      titleText: '智享城市 ',
      imgSrc: 'static/logo1.png',
      showNav: false,
      activeIndex: 0
    }
  },
  methods: {
    toggleSildeBar () {
      this.$refs.sidebar.classList.toggle('hideSidebar')
      // 确定菜单的激活项
      if (this.swiper) this.activeIndex = this.swiper.activeIndex
    }
  },
  props: {
    swiper: Object,
  },
  watch: {
    // 根据swiper，显隐菜单，修改菜单，修改下载链接等
    swiper (val, oldVal) {
      this.showNav = !!val
      if (!val) return
      let routerName = this.$route.name
      this.navList = configList[routerName]
      this.downloadHref = urlList[routerName]
      this.titleText = navTitleList[routerName][0]
      this.imgSrc = navTitleList[routerName][1]
      this.activeIndex = 0
    },
    activeIndex (val) {
        let _this = this
        let sidebar = this.$el.querySelector('.nav_sidebar')
        $(sidebar).find('li').eq(val).addClass('active').siblings().removeClass('active')
    }
  },
  mounted () {
    let sidebar = this.$el.querySelector('.nav_sidebar')
    let _this = this
    $(sidebar).on('click', 'li', function () {
        let index = $(this).index()
        _this.activeIndex = index
        sidebar.classList.remove('hideSidebar')
        setTimeout(function(){
            _this.swiper.slideTo(index)
        }, 180)
    })
  }
}
</script>

<style scoped lang="scss">
@function pxToRem($px) {
    @return ($px/1) * 0.01rem;
}
// 顶栏
.nav{
    position: fixed;
    display: block;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: pxToRem(88);
    line-height: 1;
    font-size: 16px;
    background-color: #fff;
    z-index: 999;
    box-sizing: border-box;
    box-shadow: 0 0 pxToRem(11) rgba(0,0,0,0.3);
}
.logoContent{
    display: inline-flex;
    padding-left: pxToRem(30);
    font-size: pxToRem(28);
    color: #333;
    justify-content: center;
    align-items: center;
}
.logoContent img, .logoContent span{
    display: inline-block;
    margin-left: pxToRem(5);
    line-height: pxToRem(88);
    vertical-align: middle;
    transition: all 0.2s ease-out;
}
.logoContent img{
    width: pxToRem(50);
    height: pxToRem(50);
}
.iconContent{
    display: inline-flex;
    height: 100%;
    padding-right: pxToRem(30);
    justify-content: center;
    align-items: center;
    float: right;
}
.iconDownload{
    display: inline-block;
    height: pxToRem(50);
    padding: 0 pxToRem(26);
    margin-right: pxToRem(25);
    font-size: pxToRem(26);
    color: #fff;
    line-height: pxToRem(45);
    background-color: #e84545;
    vertical-align: middle;
}
.iconMenu{
    display: inline-block;
    width: pxToRem(48);
    height: pxToRem(48);
    background: url(./img/menu.png) no-repeat;
    background-origin: center;
    background-size: 100%;
}
// 侧边栏
.nav_sidebar{
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    left: 0;
    top: -100%;
    padding-top: pxToRem(88);
    z-index: 998;
    background-color: rgba(0,0,0,0.12);
    transition: all 0.2s ease-out;
}
.hideSidebar{
    top: 0;
    z-index: 998;
    transform: translate3d(0, 0, 0);
}
.nav_sidebar ul{
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    text-align: center;
}
.nav_sidebar ul>li{
    display: block;
    font-size: pxToRem(30);
    line-height: pxToRem(80);
    color: #999;
    background-color: #fff;
    border-bottom: 1px solid #dadada;
    border-top: 1px solid #fff;
    box-sizing: border-box;
}
.nav_sidebar ul>li.active{
    color: #333;
    background-color: #f8f8f8;
}

</style>
