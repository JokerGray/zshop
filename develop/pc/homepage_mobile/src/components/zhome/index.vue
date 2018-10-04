<template>
  <section class="section">
    <swiper :options="swiperOption" class="swiper-box">
      <!-- 第一页 -->
      <swiper-slide class="swiper-item page1">
        <div>
          <img class="bgTitle hide" src="./img/web_home_shouye_zxcs.png">
          <div class="subtitle hide">智能经营 · 智慧生活</div>
          <div class="downIcon hide">下载APP</div>
        </div>
        <div class="bgBottom">
          <div class="hide">
            <img src="./img/web_home_zxcsLOGO.png">
            <p>智享城市</p>
            <div class="downContent"><a class="hideBtn" href="http://erweima.izxcs.com/erweima.php">下载</a></div>
          </div>
          <div class="hide">
            <img src="./img/web_home_zdsLOGO.png">
            <p>智大师</p>
            <div class="downContent"><a class="hideBtn" href="http://erweima.izxcs.com/erweima_zds.php">下载</a></div>
          </div>
          <div class="hide">
            <img src="./img/web_home_zxdwLOGO.png">
            <p>智享店务</p>
            <div class="downContent"><a class="hideBtn" href="http://erweima.izxcs.com/erweima_pad.php">下载</a></div>
          </div>
        </div>
      </swiper-slide>
      <!-- 第二页 -->
      <swiper-slide class="swiper-item page2">
        <img class="phoneImg hide" src="./img/web_home_zxcsAPP.png">
        <div class="title hide">智享城市APP</div>
        <p class="garyTitle hide">智能经营 智慧生活</p>
        <div class="iconContent">
          <span class="hide">IOS</span>
          <span class="hide">Android</span>
        </div>
        <div class="text hide">智享城市，是一款涵盖吃喝玩乐衣食住行全行业，集社交、媒体、商务、销售、管理、营销等功能于一体的综合性APP，打造实体+互联网新型商业模式，全面融合生产生活。</div>
        <div class="buttonContent">
          <router-link class="bgDetail hide" to="/zcity">查看详情</router-link>
          <a class="bgVideo hide" href="//docs.izxcs.com/player.html">视频教学</a>
        </div>
      </swiper-slide>
      <!-- 第三页 -->
      <swiper-slide class="swiper-item page3">
        <img class="phoneImg hide" src="./img/web_home_zdsAPP.png">
        <div class="title hide">智大师APP</div>
        <p class="garyTitle hide">人人都是经营大师</p>
        <div class="iconContent">
          <span class="hide">IOS</span>
          <span class="hide">Android</span>
        </div>
        <div class="text hide">智大师，智者的修炼空间,创业者的私家花园,优秀者的同一首歌。是一款经营者相互交流经营理念，管理哲学，让人人都可以成为经营大师的软件产品。提供时下最流行的直播平台为商家打造直播吸粉的网红经济，提供财务报表数据可视化消费趋势分析的智能化办公，轻松实现低人工成本远程监控门店事做“甩手”掌柜的终极目标。</div>
        <div class="buttonContent">
          <router-link class="bgDetail hide" to="/zmaster">查看详情</router-link>
          <a class="bgVideo hide" href="//docs.izxcs.com/zhidashi.html">视频教学</a>
        </div>
      </swiper-slide>
      <!-- 第四页 -->
      <swiper-slide class="swiper-item page4">
        <img class="phoneImg hide" src="./img/web_home_zxdw.png">
        <div class="title hide">智享店务</div>
        <p class="garyTitle hide">自助五屏 智能店务</p>
        <div class="iconContent">
          <span class="hide">IOS</span>
          <span class="hide">Android</span>
        </div>
        <div class="text hide">智享店务，是针对实体商家定向打造的一款智能经营管理系统，达到其店务流程智能化、消费流程智慧化的目的，是实体最全面的营销与运营管理平台，实现+互联网的完美转型。</div>
        <div class="buttonContent">
          <router-link class="bgDetail hide" to="/zshop">查看详情</router-link>
          <a class="bgVideo hide" href="http://docs.izxcs.com/pad.html">视频教学</a>
        </div>
      </swiper-slide>
      <!-- 第五页 -->
      <swiper-slide class="swiper-item page5">
        <img class="phoneImg hide" src="./img/web_home_zxht.png">
        <div class="title hide">智享后台</div>
        <p class="garyTitle hide">+互联网的供给侧改革</p>
        <div class="text hide">智享后台，基于SAAS云服务的的ERP流程管理和CRM大数据工具，帮助店面各岗位各职务的员工，权责分明的把所有经营事项数据化、智能化。</div>
        <div class="buttonContent">
          <router-link class="bgDetail hide" to="/zplatform">查看详情</router-link>
          <a class="bgVideo hide" href="//docs.izxcs.com/background.html">视频教学</a>
        </div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script>
export default {
  data () {
    return {
      swiperOption: {
        direction: 'vertical',
        mousewheelControl: true,
        height: window.innerHeight,
        onInit: this.swiperInit,
        onSlideChangeEnd: this.swiperEnd
      }
    }
  },
  methods: {
    swiperInit (swiper) {
      this.$parent.$data.swiper = swiper
      this.swiperEnd(swiper)
    },
    swiperEnd (swiper) {
      let index = swiper.activeIndex
      index == 0 ? this.page1Active() : this.pageActive(index);
    },
    // 第1页运动
    page1Active () {
      const page = $(this.$el).find('.swiper-item').eq(0)
      setTimeout(() => {page.find('.bgTitle').removeClass('hide').addClass('animated fadeInDown')}, 0)
      setTimeout(() => {page.find('.subtitle').removeClass('hide').addClass('animated fadeInRight')}, 250)
      setTimeout(() => {page.find('.downIcon').removeClass('hide').addClass('animated fadeInUp')}, 500)
      setTimeout(() => {page.find('.bgBottom>div').eq(0).removeClass('hide').addClass('animated bounceIn')}, 750)
      setTimeout(() => {page.find('.bgBottom>div').eq(1).removeClass('hide').addClass('animated bounceIn')}, 1000)
      setTimeout(() => {page.find('.bgBottom>div').eq(2).removeClass('hide').addClass('animated bounceIn')}, 1250)
    },
    // 第2、3、4、5页运动
    pageActive (index) {
      const page = $(this.$el).find('.swiper-item').eq(index)
      setTimeout(() => {page.find('.phoneImg').removeClass('hide').addClass('animated bounceIn')}, 0)
      setTimeout(() => {page.find('.title').removeClass('hide').addClass('animated fadeInDown')}, 250)
      setTimeout(() => {page.find('.garyTitle').removeClass('hide').addClass('animated fadeIn')}, 250)
      setTimeout(() => {page.find('.iconContent span').eq(0).removeClass('hide').addClass('animated fadeInLeft')}, 500)
      setTimeout(() => {page.find('.iconContent span').eq(1).removeClass('hide').addClass('animated fadeInRight')}, 500)
      setTimeout(() => {page.find('.text').removeClass('hide').addClass('animated zoomIn')}, 1000)
      setTimeout(() => {page.find('.buttonContent a').eq(0).removeClass('hide').addClass('animated zoomInDown')}, 1250)
      setTimeout(() => {page.find('.buttonContent a').eq(1).removeClass('hide').addClass('animated zoomInDown')}, 1500)
    }
  },
  mounted () {
    // 初始化
    $('.page1 .downIcon').click(function () {
      $('.page1 .downContent').toggle()
    })
  }
}
</script>

<style scoped lang="scss">
@import 'index.scss';
</style>
