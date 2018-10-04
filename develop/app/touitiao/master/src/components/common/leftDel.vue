<template>
  <div class="left-delete">
    <div class="move"
         ref="move"
         @touchstart="_touchStart"
         @touchmove="_touchMove"
         @touchend="_touchEnd"
         :style="txtStyle">
      <slot></slot>
    </div>
    <div class="deleteIcon" :style="zIndex" @click.prevent="deleteItem(index)"><span>{{textTips}}</span></div>
  </div>
</template>

<script>
  import $ from "jquery"
  export default {
    props: {
      index: Number,
      textTips:String
    },
    data() {
      return {
        startX: 0,       //触摸位置
        moveX: 0,       //滑动时的位置
        disX: 0,       //移动距离
        txtStyle: '',
        delWidth: 400,
        top: '',
        zIndex: 'z-index:-1',
      }
    },
    methods: {
      init:function () {
        this.txtStyle = "transform:translateX(0rem);transition:all,.3s";
      },
      _touchStart: function (ev) {
        ev = ev || event;
        if (ev.touches.length == 1) {
          // 手指按下的时候记录按下的位置
          this.startX = ev.touches[0].clientX;
          // console.log(this.startX)
        }
      },
      _touchMove: function (ev) {
        ev = ev || event;
        if (ev.touches.length == 1) {
          // 滑动过程中的实时位置
          this.moveX = ev.touches[0].clientX;
          // 滑动过程中实时计算滑动距离
          this.disX = this.startX - this.moveX;
          // console.log('disX==>',this.disX)
          // 如果是向右滑动或者只是点击，不改变滑动位置
          if (this.disX < 0 || this.disX == 0) {
            // console.log('没有移动');
            this.txtStyle = "transform:translateX(0rem);transition:all,.3s";
          } else if (this.disX > 0) {
            // 如果是向左滑动，则实时给这个根元素一个向左的偏移-left，当偏移量到达固定值delWidth时，固定元素的偏移量为 delWidth
            this.txtStyle = "transform:translateX(-" + this.disX / 100 + "rem)";
            // console.log(this.disX/100,this.delWidth/100)
            if (this.disX/100 >= this.delWidth/100/3) {
              this.txtStyle = "transform:translateX(-" + this.delWidth/100 + "rem);transition:all,.3s";
              this.zIndex = "z-index:-1";
              // 一个列表项没有归位，又去另一个列表左滑时，没有归位的列表自动归位
              $(this.$refs.move).parent().parent().siblings().find('.move').css({'transform':'translateX(0)','transition':'all 0.3s'})
            }
          }
        }
      },
      _touchEnd: function (ev) {
        if (event.changedTouches.length == 1) {
          if(this.disX/100 < this.delWidth/100/3){
            this.txtStyle = "transform:translateX(-" + 0 + "rem);transition:all,.3s";
            this.zIndex = "z-index:" + -1;
          }
          this.startX = 0;
          this.zIndex = "z-index:" + -1 + "rem";
          // console.log(event.changedTouches[0].clientX)
          // 手指移动结束后的水平位置
          let endX = event.changedTouches[0].clientX;
          // 触摸开始与结束,手指移动的距离
          this.disX = this.startX - endX;
          //如果距离小于删除按钮的1/2，不显示删除按钮
        }
      },
      deleteItem: function (index) {
        this.$emit('deleteItem', index);
        this.txtStyle = "transform:translateX(0rem)";
      }
    }
  }
</script>

<style>
  .left-delete {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
  }

  .move {
    position: relative;
  }

  .deleteIcon {
    width: 4rem;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    /*background:url(./../../assets/main/4.png) no-repeat;*/
    /*background-size: contain;*/
    background-color: red;
    font-size: 0.8125rem;
    text-align: center;
    color: #fff;
  }
  .deleteIcon >span{
    position: absolute;
    width: 100%;
    top: 50%;
    right: 0;
    transform: translateY(-50%);

  }
</style>
