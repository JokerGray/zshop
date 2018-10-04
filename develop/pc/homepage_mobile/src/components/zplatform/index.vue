<template>
  <section class="section">
    <swiper :options="swiperOption" class="swiper-box">
      <!-- 第一页 -->
      <swiper-slide class="swiper-item page1">
        <h1 class="hide">智享后台</h1>
        <div class="subtitle">
          <span class="hide">+互联网的供给侧改革</span>
        </div>
        <p class="hide">基于SAAS云服务的的ERP流程管理和CRM大数据工具</p>
        <p class="hide">帮助店面各岗位各职务的员工，权责分明的把所有经营事项数据化、智能化。</p>
        <div class="cardContent" ref="cardContent">
          <div>
            <img class="hide" src="./img/card_1.png">
            <img class="hide" src="./img/card_2.png">
          </div>
          <div>
            <img class="hide" src="./img/card_3.png">
            <img class="hide" src="./img/card_4.png">
          </div>
        </div>
      </swiper-slide>
      <!-- 第二页 -->
      <swiper-slide class="swiper-item page2">
        <div><span class="bigTitle hide">收银台</span></div>
        <p class="subtitle hide">借助智享城市SAAS云平台强大的数据存储和运算功能，和互联网时代的先进技术，使用智享店务后台管理系统，无需安装复杂的软件硬件，仅仅需要一个授权账号，就能开启您的智通经营之路。</p>
        <div class="counterBg hide">
          <img src="./img/counter.png">
        </div>
      </swiper-slide>
      <!-- 第三页 -->
      <swiper-slide class="swiper-item page3">
        <div class="bgSit hide"></div>
        <div><span class="bigTitle hide">智享后台的功能</span></div>
        <div class="textContent">
          <div class="content1">
            <h1 class="hide">全方位一体化的店务管理</h1>
            <div class="hide"><span>1、门店信息</span><span>2、商品信息</span></div>
            <div class="hide"><span>3、库存管理</span><span>4、商品渠道</span></div>
            <div class="hide"><span>5、预约服务</span><span>6、服务商品</span></div>
            <div class="hide"><span>7、设施设备</span><span>8、会员资料</span></div>
            <div class="hide"><span>9、促销活动</span><span>10、电子账单</span></div>
            <div class="hide"><span>11、教学操作视频</span><span></span></div>
          </div>
          <div class="line"></div>
          <div class="content2">
            <h1 class="hide">高效率智能化的员工管理</h1>
            <p class="hide">1、员工入职信息</p>
            <div class="hide">一键收录员工信息，整编流程规范化</div>
            <p class="hide">2、员工工资体系</p>
            <div class="hide">合理规划工资体系，员工薪资一目了然</div>
            <p class="hide">3、员工业绩</p>
            <div class="hide">专属打造门店独特的业绩系统</div>
            <p class="hide">4、团队信息</p>
            <div class="hide">有效的团队管理，打造有战斗力的团队</div>
            <div class="bgBox hide"></div>
          </div>
        </div>
      </swiper-slide>
      <!-- 第四页 -->
      <swiper-slide class="swiper-item page4">
        <div><span class="bigTitle hide">+互联网平台管理系统</span></div>
        <div class="subtitleContent">
          <div class="subtitle hide">APP板块一览无遗，实时管理不在话下</div>
          <div class="subtitle hide">后台店务实时更新，轻松了解门店产品</div>
        </div>
        <div class="phoneContent">
          <div class="phone1 hide"></div>
          <div class="phone2 hide"></div>
        </div>
        <div class="textContent hide">
          <h1 class="hide">APP板块</h1>
          <h3 class="hide">APP板块一览无遗，实时管理不在话下</h3>
          <h2 class="hide">通过智享后台管理系统，您可以在智享城市APP中构建属于商家的社交圈，定义商家的粉丝权益，创建商家专属粉丝团队。</h2>
          <h1 class="hide">店面平板展示端</h1>
          <h3 class="hide">后台店务实时更新，轻松了解门店产品</h3>
          <h2 class="hide">根据平板展示端推荐的页面，商家可清楚的了解到店面的信息，方便商家实时监控更新，同时也方便顾客直观地了解和购买门店商品及服务产品</h2>
        </div>
      </swiper-slide>
      <!-- 第五页 -->
      <swiper-slide class="swiper-item page5">
        <div><span class="bigTitle hide">智享城市</span></div>
        <div class="subtitle subtitle1 hide">——智能经营 智慧生活</div>
        <div class="subtitle subtitle2">
          <span class="hide">想您之所想</span>
          <span class="hide">及您之所及</span>
          <span class="hide">用心专注做服务</span>
        </div>
        <div class="subtitle subtitle3 hide">帮助您实现真正的智能化经营</div>
        <div class="imgContent hide">
          <img src="./img/bg_page5.png">
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
    // 加几个点击特效
    clickInit () {
      // 所有能动的，都会在运动后去掉对应特效
      this.$el.querySelectorAll('.hide').forEach(function (ele) {
        ele.addEventListener('animationend', (event) => {
          // $(event.target).removeClass('animated')
        })
      })
    },
    // 初始化时
    swiperInit (swiper) {
      this.$parent.swiper = swiper
      this.swiperEnd(swiper)
    },
    // 滚动结束事件
    swiperEnd (swiper) {
      let index = swiper.activeIndex
      this['page' + (index + 1) + 'Active'](index)
    },
    // 第1页运动
    page1Active (index) {
      const page = $(this.$el).find('.swiper-item').eq(index)
      setTimeout(() => {page.find('h1').removeClass('hide').addClass('animated fadeInDown')}, 0)
      setTimeout(() => {page.find('.subtitle span').eq(0).removeClass('hide').addClass('animated fadeInRight')}, 250)
      setTimeout(() => {page.find('.subtitle span').eq(1).removeClass('hide').addClass('animated fadeInRight')}, 500)
      setTimeout(() => {page.find('.subtitle span').eq(2).removeClass('hide').addClass('animated fadeInRight')}, 750)
      setTimeout(() => {page.find('p').eq(0).removeClass('hide').addClass('animated fadeInUp')}, 1000)
      setTimeout(() => {page.find('p').eq(1).removeClass('hide').addClass('animated fadeInUp')}, 1250)
      setTimeout(() => {page.find('.cardContent img').eq(0).removeClass('hide').addClass('animated fadeInLeft')}, 1500)
      setTimeout(() => {page.find('.cardContent img').eq(1).removeClass('hide').addClass('animated fadeInDown')}, 1750)
      setTimeout(() => {page.find('.cardContent img').eq(3).removeClass('hide').addClass('animated fadeInRight')}, 2000)
      setTimeout(() => {page.find('.cardContent img').eq(2).removeClass('hide').addClass('animated fadeInUp')}, 2250)
    },
    // 第2页运动
    page2Active (index) {
      const page = $(this.$el).find('.swiper-item').eq(index)
      setTimeout(() => {page.find('.bigTitle').removeClass('hide').addClass('animated fadeInDown')}, 0)
      setTimeout(() => {page.find('.subtitle').removeClass('hide').addClass('animated fadeInRight')}, 250)
      setTimeout(() => {page.find('.counterBg').removeClass('hide').addClass('animated fadeIn')}, 500)
      // 这里扯了个第三页的动画
      setTimeout(() => {$('.bgSit').removeClass('hide').addClass('animated fadeInUp')}, 750)
    },
    // 第3页运动
    page3Active (index) {
      const page = $(this.$el).find('.swiper-item').eq(index)
      setTimeout(() => {page.find('.bigTitle').removeClass('hide').addClass('animated fadeInDown')}, 0)
      setTimeout(() => {page.find('.content1 h1').removeClass('hide').addClass('animated fadeInRight')}, 250)
      setTimeout(() => {page.find('.content1 div').eq(0).removeClass('hide').addClass('animated fadeInUp')}, 500)
      setTimeout(() => {page.find('.content1 div').eq(1).removeClass('hide').addClass('animated fadeInUp')}, 600)
      setTimeout(() => {page.find('.content1 div').eq(2).removeClass('hide').addClass('animated fadeInUp')}, 700)
      setTimeout(() => {page.find('.content1 div').eq(3).removeClass('hide').addClass('animated fadeInUp')}, 800)
      setTimeout(() => {page.find('.content1 div').eq(4).removeClass('hide').addClass('animated fadeInUp')}, 900)
      setTimeout(() => {page.find('.content1 div').eq(5).removeClass('hide').addClass('animated fadeInUp')}, 1000)
      setTimeout(() => {page.find('.content2 h1').removeClass('hide').addClass('animated fadeInRight')}, 1200)
      setTimeout(() => {page.find('.content2 p').eq(0).removeClass('hide').addClass('animated fadeInUp')}, 1300)
      setTimeout(() => {page.find('.content2 div').eq(0).removeClass('hide').addClass('animated fadeInUp')}, 1400)
      setTimeout(() => {page.find('.content2 p').eq(1).removeClass('hide').addClass('animated fadeInUp')}, 1500)
      setTimeout(() => {page.find('.content2 div').eq(1).removeClass('hide').addClass('animated fadeInUp')}, 1600)
      setTimeout(() => {page.find('.content2 p').eq(2).removeClass('hide').addClass('animated fadeInUp')}, 1700)
      setTimeout(() => {page.find('.content2 div').eq(2).removeClass('hide').addClass('animated fadeInUp')}, 1800)
      setTimeout(() => {page.find('.content2 p').eq(3).removeClass('hide').addClass('animated fadeInUp')}, 1900)
      setTimeout(() => {page.find('.content2 div').eq(3).removeClass('hide').addClass('animated fadeInUp')}, 2000)
    },
    // 第4页运动
    page4Active (index) {
      const page = $(this.$el).find('.swiper-item').eq(index)
      setTimeout(() => {page.find('.bigTitle').removeClass('hide').addClass('animated fadeInDown')}, 0)
      setTimeout(() => {page.find('.textContent').removeClass('hide').addClass('animated fadeIn')}, 0)
      setTimeout(() => {page.find('.subtitle').removeClass('hide').addClass('animated fadeInRight')}, 250)
      setTimeout(() => {page.find('.phoneContent .phone1').removeClass('hide').addClass('animated fadeInLeft')}, 500)
      setTimeout(() => {page.find('.phoneContent .phone2').removeClass('hide').addClass('animated fadeInRight')}, 750)
      setTimeout(() => {page.find('.textContent').children().eq(0).removeClass('hide').addClass('animated fadeInUp')}, 1000)
      setTimeout(() => {page.find('.textContent').children().eq(1).removeClass('hide').addClass('animated fadeInUp')}, 1100)
      setTimeout(() => {page.find('.textContent').children().eq(2).removeClass('hide').addClass('animated fadeInUp')}, 1200)
      setTimeout(() => {page.find('.textContent').children().eq(3).removeClass('hide').addClass('animated fadeInUp')}, 1300)
      setTimeout(() => {page.find('.textContent').children().eq(4).removeClass('hide').addClass('animated fadeInUp')}, 1400)
      setTimeout(() => {page.find('.textContent').children().eq(4).removeClass('hide').addClass('animated fadeInUp')}, 1500)
    },
    // 第5页运动
    page5Active (index) {
      const page = $(this.$el).find('.swiper-item').eq(index)
      setTimeout(() => {page.find('.bigTitle').removeClass('hide').addClass('animated fadeInDown')}, 0)
      setTimeout(() => {page.find('.subtitle1').removeClass('hide').addClass('animated fadeInDown')}, 250)
      setTimeout(() => {page.find('.subtitle2 span').eq(0).removeClass('hide').addClass('animated fadeInRight')}, 500)
      setTimeout(() => {page.find('.subtitle2 span').eq(1).removeClass('hide').addClass('animated fadeInRight')}, 750)
      setTimeout(() => {page.find('.subtitle2 span').eq(2).removeClass('hide').addClass('animated fadeInRight')}, 1000)
      setTimeout(() => {page.find('.subtitle3').removeClass('hide').addClass('animated fadeInUp')}, 1250)
      setTimeout(() => {page.find('.imgContent').removeClass('hide').addClass('animated fadeIn')}, 1500)
    }
  },
  mounted () {
    this.clickInit()
  }
}
</script>

<style scoped lang="scss">
@import 'index.scss';
</style>
