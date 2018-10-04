<template>
    <section class="main-content">
      <el-container class="main-container" ref="mainContainer">
        <el-aside width="200px">
          <div class="menuList" ref="menuList">
            <div @click="toggleSlide(0)"><div><span>01</span><img src="./img/menu.png" alt="">店铺</div></div>
            <div @click="toggleSlide(1)"><div><span>02</span><img src="./img/menu.png" alt="">员工</div></div>
            <div class="active" @click="toggleSlide(2)"><div><span>03</span><img src="./img/menu.png" alt="">商品</div></div>
            <div @click="toggleSlide(3)"><div><span>04</span><img src="./img/menu.png" alt="">顾客</div></div>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <i class="el-icon-arrow-up disabled" @click="slideUp" ref="iconUp"></i>
            <i class="el-icon-arrow-down" @click="slideDown" ref="iconDown"></i>
            <i class="icon-left" @click="toggleMainContainer"></i>
            <swiper :options="swiperOption" ref="mySwiper">
              <swiper-slide>
                <el-row>
                  <el-col :span="8" v-for="(o) in 6" :key="o" :offset="2">
                    <el-card class="box-card">
                      <div slot="header">
                        <span>店铺录入页面</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                      </div>
                  </el-card>
                  </el-col>
                </el-row>
              </swiper-slide>
              <swiper-slide>
                <el-row>
                  <el-col :span="8" v-for="(o) in 6" :key="o" :offset="2">
                    <el-card class="box-card">
                      <div slot="header">
                        <span>员工录入页面</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                      </div>
                  </el-card>
                  </el-col>
                </el-row>
              </swiper-slide>

              <swiper-slide>
                <servicePage></servicePage>
              </swiper-slide>

              <swiper-slide>
                <el-row>
                  <el-col :span="8" v-for="(o) in 6" :key="o" :offset="2">
                    <el-card class="box-card">
                      <div slot="header">
                        <span>顾客录入页面</span>
                        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
                      </div>
                  </el-card>
                  </el-col>
                </el-row>
              </swiper-slide>
            </swiper>
          </el-main>
        </el-container>
      </el-container>

      <div class="aside-help" ref="sideContainer">
        <imgUpload></imgUpload>
        <router-link to="/0"><i class="el-icon-close"></i></router-link>
        <i class="icon-right" @click="toggleMainContainer"></i>
        <help></help>
      </div>
      
    </section>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import servicePage from './servicePage.vue'
import imgUpload from '../components/imgUpload.vue'
import help from '../components/help.vue'

export default {
  name: 'Entry',
  components: {
    swiper,
    swiperSlide,
    servicePage,
    help,
    imgUpload
  },
  data () {
    return {
      transitionName: 'bounce',
      swiperOption: {
        initialSlide: 2,
        direction: 'vertical',
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        noSwipingSelector: 'div',
        spaceBetween: '100%',
        speed: 2000
      },
      swiperSlides: [1, 2, 3, 4]
    }
  },
  methods: {
    slideUp () {
      this.swiper.slidePrev()
      this.$refs.iconUp.classList.toggle('disabled', this.swiper.activeIndex === 0)
      this.$refs.iconDown.classList.toggle('disabled', this.swiper.activeIndex === this.swiper.slides.length - 1)
      var menus = this.$refs.menuList.children
      for (let j = 0; j < menus.length; j++) {
        menus[j].classList.remove('active')
      }
      menus[this.swiper.activeIndex].classList.add('active')
    },
    slideDown () {
      this.swiper.slideNext()
      this.$refs.iconUp.classList.toggle('disabled', this.swiper.activeIndex === 0)
      this.$refs.iconDown.classList.toggle('disabled', this.swiper.activeIndex === this.swiper.slides.length - 1)
      var menus = this.$refs.menuList.children
      for (let j = 0; j < menus.length; j++) {
        menus[j].classList.remove('active')
      }
      menus[this.swiper.activeIndex].classList.add('active')
    },
    toggleMainContainer () {
      this.$refs.mainContainer.$el.classList.toggle('full-width')
      this.$refs.sideContainer.classList.toggle('hide')
    },
    toggleSlide (i) {
      this.swiper.slideTo(i)
      this.$refs.iconUp.classList.toggle('disabled', i === 0)
      this.$refs.iconDown.classList.toggle('disabled', i === this.swiper.slides.length - 1)
      var menus = this.$refs.menuList.children
      for (let j = 0; j < menus.length; j++) {
        menus[j].classList.remove('active')
      }
      menus[i].classList.add('active')
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  }
}
</script>

<style scoped lang="scss"  type="text/scss">
@mixin img_icon($w, $h) {
    display: inline-block;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: $w;
    height: $h;
}
.main-content{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

/* 左下角弹出进入中心展示 */
.bounce-enter, .bounce-leave-active{
  opacity: 0;
  transform: translate3d(-90%, 90%, 0) scale(0);
  transition: all 0.5s ease-out;
}
.bounce-leave-active{
  transition: all 0.5s ease-out;
}
.bounce-enter-to{
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  transition: all 0.5s ease-out;
}
// 整体
.el-container{
  height: 100%;
}
.main-container{
  background-color: #fff;
  margin-right: 280px;
  transition: margin 0.2s ease-in-out;
  &.full-width{
    margin-right: 0;

    .icon-left{
      transform: translate3d(0, 0, 0) rotateY(180deg);
      transition-delay: 0.2s;
    }
  }
}
// 左侧导航样式
.el-aside{
  background-color: #fff;
  max-height: 100%;
  overflow: auto;

  .el-menu-vertical{
    height: 100%;
  }
}
// 顶部标题
.el-header{
  position: relative;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  >span{
    padding-left: 2rem;
  }
}
// 主体
.el-main{
  position: relative;
  height: 100%;
  padding: 0;
  overflow: hidden;
}
// 右侧帮助文档
.aside-help{
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
  &.hide{
    transform: translate3d(100%, 0, 0);
  }
  h1{
    margin-top: 150px;
    font-size: 18px;
  }
  p{
    font-size: 13px;
    color: #666;
  }
}
// 主要的每个页面
.swiper-container{
  height: 100%;
  background-color: #d0f8ed;
  padding: 50px 50px 50px 0;
  box-sizing: border-box;
  background-color: #d0f8ed;
  background-image: url(./img/logo.png);
  background-position: center;
  background-repeat: no-repeat;
  .swiper-slide{
    height: 100%;
    background-color: #fff;
    border-top-right-radius: 8px;
    overflow: auto;
  }
}
// 自定义样式
.menuList{
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  >div{
    display: flex;
    align-items: center;
    min-height: 50px;
    text-align: center;
    font-size: 24px;
    border-bottom: 1px solid #00ccc0;
    cursor: pointer;
    color: #fff;
    background-color: #00aba2;
    overflow: hidden;
    transition: all 0.5s ease-in-out;
    &.active{
      flex: 1;
      background-color: #00ccc0;
      >div img{
        display: block;
        margin: 0 auto;
        height: auto;
        transform: scale(1);
      }
    }
    >div{
      flex: 1;
      text-align: center;
      >span{
        font-size: 36px;
        vertical-align: text-bottom;
        line-height: 1;
      }
      img{
        display: inline;
        height: 0;
        margin: 0;
        transform: scale(0);
        transition: all 0.2s ease-in-out;
        transition-delay: 0.2s;
      }
    }
  }
}
.box-card{
  margin-top: 2rem;
  user-select: none;
}
.el-icon-arrow-up, .el-icon-arrow-down, .el-icon-close{
  position: absolute;
  font-size: 32px;
  top: 0;
  left: 100px;
  z-index: 999;
  cursor: pointer;

  &.disabled{
    color: #999;
    cursor: no-drop;
  }
}
.el-icon-arrow-up, .el-icon-arrow-down{
  background-color: #828081;
  color: #eee !important;
  padding: 0 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.el-icon-arrow-down{
  top: inherit;
  bottom: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.icon-right, .icon-left{
  position: absolute;
  @include img_icon(28px, 50px);
  top: 88px;
  left: 0;
  background-image: url(./img/icon-right.png);
  z-index: 999;
  cursor: pointer;
}
.icon-left{
  left: inherit;
  right: 0;
  transform: translate3d(100%, 0, 0) rotateX(180deg);
  transition: all 0.2s ease-in-out;
}
.el-icon-close{
  right: 0;
  left: inherit;
  background-color: #eee;
}
</style>
