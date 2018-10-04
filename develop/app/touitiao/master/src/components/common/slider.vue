<template>
  <div class="slide" ref="slide">
    <div class="slide-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import { addClass } from '../../assets/js/dom.js'
  const COMPONENT_NAME = 'slide';
  export default {
    name: COMPONENT_NAME,

    props: {
      //自己添加的值
      navPage:{
        type: Number,
        default: 0
      },
      scrollX:{
        type:Boolean,
        default:true
      },
      directionLockThreshold: {
        type: Number,
        default: 5
      },
      loop: {
        type: Boolean,
        default: false
      },
      autoPlay: {
        type: Boolean,
        default: false
      },
      interval: {
        type: Number,
        default: 4000
      },
      showDot: {
        type: Boolean,
        default: false
        //不用
      },
      click: {
        type: Boolean,
        default: false
      },
      threshold: {
        type: Number,
        default: 0.3
      },
      speed: {
        type: Number,
        default: 400
      },
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0,
      }
    },
    created:function () {

    },
    mounted() {
      this.update();
      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
    activated() {
      if (!this.slide) {
        return
      }
      this.slide.enable();
      let pageIndex = this.slide.getCurrentPage().pageX;
      this.slide.goToPage(pageIndex, 0, 0);
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      this.slide.disable();
      clearTimeout(this.timer)
    },
    beforeDestroy() {
      this.slide.disable();
      clearTimeout(this.timer)
    },
    methods: {
      update() {
        if (this.slide) {
          this.slide.destroy()
        }
        this.$nextTick(() => {
          this.init()
        })
      },
      refresh() {
        this._setSlideWidth(true);
        this.slide.refresh();
      },
      prev() {
        this.slide.prev()
      },
      next() {
        this.slide.next()
      },
      //初始化
      init() {
        clearTimeout(this.timer);
        this.currentPageIndex = 0;
        setTimeout(()=>{
          this._setSlideWidth()
        },0);
        if (this.showDot) {
          this._initDots()
        }
        this._initSlide();
        if (this.autoPlay) {
          this._play()
        }
      },
      //设定宽度
      _setSlideWidth(isResize) {
        this.children = this.$refs.slideGroup.children;
        let width = 0;
        let slideWidth = this.$refs.slide.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slide-item');
          child.style.width = slideWidth + 'px';
          width += slideWidth
        }
        if (this.loop && !isResize) {
          width += 2 * slideWidth
        }
        this.$refs.slideGroup.style.width = width + 'px'
      },
      _initSlide() {
//        console.log(this.threshold)
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          probeType:3,
          directionLockThreshold:this.directionLockThreshold,
          snap: {
            loop: this.loop,
            threshold: this.threshold,
            speed: this.speed
          },
          bounce: true,
          click: this.click,
        });
        //滚动结束
        this.slide.on('scrollEnd', this._onScrollEnd);
        //触摸结束
        this.slide.on('touchEnd', () => {
          if (this.autoPlay) {
            this._play()
          }
        });

        //滚动开始之前
        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        });
        setTimeout(()=>{
          this.slide.goToPage(this.navPage,0,0);
        },100)
      },
      //滚动结束
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        this.$emit('sentPageNo',this.currentPageIndex);
        if (this.autoPlay) {
          this._play()
        }
      },
      //点标记
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      //播放
      _play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slide.next()
        }, this.interval)
      }
    },
    watch: {
      loop() {
        this.update()
      },
      autoPlay() {
        this.update()
      },
      speed() {
        this.update()
      },
      threshold() {
        this.update()
      },
      currentPageIndex(){

      },
      currentPageIndexS(){
        this.slide.goToPage(this.currentPageIndexS, 0, 400);
      }
    },
    computed:{
      currentPageIndexS:{
        get:function () {
//          console.log(this.$parent.active);
//          return this.$parent.active;
          return this.navPage;
        },
      }
    },
  }
</script>

<style lang="less" scoped type="text/less">
  .slide
  {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: #fff;
  }
  .slide-group
  {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    /*不换行*/
    white-space: nowrap;
  }
  .slide-item
  {
    /*height: 100%;*/
    float: left;
    box-sizing: border-box;
    overflow: hidden;
    /*内容居中*/
    /*text-align: center;*/
  }
  a
  {
    display: block;
    width: 100%;
    overflow: hidden;
    text-decoration: none;
  }
  img
  {
    display: block;
    width: 100%;
  }

</style>

