<template>
  <div ref="wrapper" style="background-color: #fff">
    <div class="content-bg better-scroll-container">  <!--如果需要调滚动内容的背景色，则改该节点的背景色-->
      <div> <!--不太需要，待优化-->
        <div v-show="showTopTips" class="pulldown-tip" ref="showTips" v-if="showTopTip">
          <i class="indexicon" :class="[pulldownTip.rotate]"></i>
          <span class="tip-content">{{pulldownTip.text}}</span>
          <p>最后更新：今天{{lastRefreshTime}}</p>
        </div>
        <div class="pullUp" v-if="refresh_ing"><span>正在刷新数据中...</span><p>最后更新:今天{{lastRefreshTime}}</p></div>
      </div>
      <slot></slot>
      <div class="bottomLoading" v-show="showBottomTips&&showBottomTips_1"><img :src="tipLoading" v-if="tipLoading"><span>{{bottomTips}}</span></div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll'
  import $ from 'jquery'
  export default {
    props: {
      /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
      probeType: {
        type: Number,
        default:1
      },
      /**
       * 点击列表是否派发click事件
       */
      click: {
        type: Boolean,
        default: true
      },
      /**
       * 是否开启横向滚动
       */
      scrollX: {
        type: Boolean,
        default: false
      },
      scrollY: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发滚动事件
       */
      listenScroll: {
        type: Boolean,
        default: true
      },
      /**
       * 列表的数据
       */
      data: {
        type: Array,
        default: null
      },
      /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
      pullup: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
      pulldown: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发列表滚动开始的事件
       */
      beforeScroll: {
        type: Boolean,
        default: true
      },
      /**
       * 当数据更新后，刷新scroll的延时。
       */
      refreshDelay: {
        type: Number,
        default: 20
      },
      /**
       * 当数据更新后，当前时间。
       */
      lastRefreshTime:{
        type:String,
        default:''
      },
      directionLockThreshold: {
        type: Number,
        default: 5
      },
      //上拉加载时返回数组的长度
      //loadMoreLength:'',
      //下拉刷新或者页面初次加载时返回数组的长度
      refreshDataLength:'',
      //控制上拉加载显示提示
      showBottomTips:{
        type: Boolean,
        default: true
      },
      rows: {
        type: Number,
        default: 10
      },
      totalNum:'',
      showTopTip:{
        type: Boolean,
        default: true
      }//控制下拉刷新显示提示
    },
    data() {
      return {
        loadingConnecting: false,
        pulldownTip: {
          text: '下拉可以刷新',     // 松开立即刷新
          rotate: 'iconfont icon-shangla-copy'    // icon-rotate
        },
        tipLoading:require('../../../static/images/Spinner.gif'),//下拉加载显示的图标
        bottomTips:'加载中...',//下拉加载显示的提示信息
        refresh_ing:false,
        showTopTips:true,
        // showBottomTips_1:false
      };
    },
    mounted() {
      // 保证在DOM渲染完毕后初始化better-scroll
      setTimeout(() => {
        this._initScroll()
      }, 20)

    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        // better-scroll的初始化
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX,
          // pullDownRefresh:{threshold:30,stop:30},
          // pullUpLoad:{threshold:0,txt:{more: '上拉加载更多', noMore: '没有更多数据了'}}
        });

        // 是否派发滚动事件
        if (this.listenScroll || this.pulldown || this.pullup) {
          let me = this;
          this.scroll.on('scroll', (pos) => {
            if (this.listenScroll) {
              me.$emit('scroll', pos);
            }

            if (this.pulldown) {
              // 下拉动作
              if (pos.y > 50) {
                this.pulldownTip = {
                  text: '松开立即刷新',
                  rotate: 'iconfont icon-shangla'
                }
              } else if(pos.y >5){
                this.showTopTips = true;
                this.pulldownTip = {
                  text: '下拉可以刷新',     // 松开立即刷新
                  rotate: 'iconfont icon-shangla-copy'    // icon-rotate
                }
              }
            }
            if (this.pullup) {
              // console.log(this.scroll.maxScrollY);
              // console.log(pos.y);
            }
          })
        }

        // 是否派发滚动到底部事件，用于上拉加载
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            // 滚动到底部
            if (this.scroll.y <= (this.scroll.maxScrollY + 150)&&this.scroll.y!==0) {
              this.$emit('scrollToEnd');
            }
          })
        }

        // 是否派发顶部下拉事件，用于下拉刷新
        if (this.pulldown) {
          this.scroll.on('touchEnd', (pos) => {
            // 下拉动作
            if (pos.y > 50) {
              setTimeout(() => {
                // 重置提示信息
                this.pulldownTip = {
                  text: '下拉刷新',     // 松开立即刷新
                  rotate: 'iconfont icon-shangla-copy'  // icon-rotate
                }
              },600);
              this.$emit('pulldown');
              this.showTopTips = false;
              this.refresh_ing = true;
              this.tipLoading = require('../../../static/images/Spinner.gif');
              this.bottomTips = '加载中...';
            }else{
              this.showTopTips = false;
            }
          });
        }

        // 是否派发列表滚动开始的事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }

        if (this.listenScroll) {
          let me = this;
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      disable() {
        // 代理better-scroll的disable方法
        this.scroll && this.scroll.disable()
      },
      enable() {
        // 代理better-scroll的enable方法
        this.scroll && this.scroll.enable()
      },
      refresh() {
        // 代理better-scroll的refresh方法
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        // 代理better-scroll的scrollTo方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        // 代理better-scroll的scrollToElement方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    created:function () {
      this.tipLoading = require('../../../static/images/Spinner.gif');
      this.bottomTips = '加载中...';
    },
    watch: {
      // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
      data(val,old) {
        setTimeout(() => {
          this.refresh();
          setTimeout(()=>{
            this.refresh_ing = false
          },500)
        }, this.refreshDelay);
        // 新数据和旧数据数量一样（并且数据额长度不等于每条数据返回的长度，避免连续刷新数据后，提示显示没有数据的情况），说明没有更多数据了
        // if(val.length===old.length&&val.length!==this.rows){
        //   this.bottomTips = '(*¯ω¯)别扯了，没有更多了';
        //   this.tipLoading = '';
        // }else{
        //   this.tipLoading = require('../../../static/images/Spinner.gif');
        //   this.bottomTips = '加载中...';
        // }
        // console.log(val.length,this.totalNum);
        if(val.length===this.totalNum&&val.length>0&&this.totalNum>0){
          this.bottomTips = '(*¯ω¯)别扯了，没有更多了';
          this.tipLoading = '';
        }
      },
      // loadMoreLength:function (val, old) {
      //   if(val==0){
      //     // this.bottomTips = '(*¯ω¯)别扯了，没有更多了';
      //     // this.tipLoading = '';
      //   }
      // },
      refreshDataLength:function (val, old) {
        if(val<this.rows){
          this.bottomTips = '';
          this.tipLoading = '';
          return
        }
        this.tipLoading = require('../../../static/images/Spinner.gif');
        this.bottomTips = '加载中...';
      }
    },
    computed:{
      showBottomTips_1:function () {
        if((this.refreshDataLength<this.rows)&&(this.refreshDataLength!=' ')){
          return false
        }else{
          return true
        }
      }
    }
  }
</script>
<style scoped type="text/less" lang="less">
  @cube-size: 10/32rem;
  .better-scroll-root {
    background-color: rgba(7, 17, 27, 0.7);
    .loading-pos, .pulldown-tip {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 35/32rem;
      color: #fcfcfc;
      text-align: center;
      z-index: 2000;
    }
    .loading-pos {
      background-color: rgba(7, 17, 27, 0.7);
    }
    .pulldown-tip {
      top: -50/32rem;
      height: 50/32rem;
      line-height: 50/32rem;
      z-index: 1;
    }
    .pull-icon {
      position: absolute;
      top: 0;
      left: 30%;
      color: #a5a1a1;
      font-size: 1.5em;
      transition: all 0.15s ease-in-out;
    }
    .pull-icon.icon-rotate {
      transform:rotate(180deg);
    }

    /*<!--.loading-container {-->*/
      /*<!--position: absolute;-->*/
      /*<!--height: @cube-size;-->*/
      /*<!--width: @cube-size;-->*/
      /*<!--left: 35%;-->*/
      /*<!--top: 50%;-->*/
      /*<!--transform: translate(-50%, -50%);-->*/
      /*<!--perspective: 40/32rem;-->*/
    /*<!--}-->*/
    /*<!--.loading-connecting {-->*/
      /*<!--line-height: 35/32rem;-->*/
    /*<!--}-->*/
    @keyframes rotate{
      0%{
        transform:rotateX(0deg) rotateY(0deg);
      }
      50%{
        transform:rotateX(360deg) rotateY(0deg);
      }
      100%{
        transform:rotateX(360deg) rotateY(360deg);
      }
    }
  }
  .pulldown-tip{
    width: 100%;
    position: absolute;
    top: -104/32rem;
    left: 0;
    text-align: center;
    padding: 10/32rem 0;
    line-height: 36/32rem;
    font-size: 24/32rem;
    /*animation: scale 0.3s;*/
  }
  .bottomLoading{
    width: 100%;
    height: 80/32rem;
    line-height: 80/32rem;
    text-align: center;
    color: #666666;
    font-size: 26/32rem;
    position: absolute;
    bottom: -80/32rem;
    left: 0;
    img{
      display: inline-block;
      width: 80/32rem;
      vertical-align: middle;
    }
  }
  .pullUp{
    text-align: center;
    font-size: 24/32rem;
    line-height: 36/32rem;
    padding: 10/32rem 0;
    background-color: transparent;
  }
  @keyframes scale {
    from{
      height: 0/32rem;
      transform: scale(0);
    }
    to{
      height: 90/32rem;
      transform: scale(1);
    }
  }
</style>
