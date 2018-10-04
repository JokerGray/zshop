<!-- 卡片翻转效果 -->
<template>
    <section class="content-paid" :class=" !!side ? '' : 'turn'">
      <div class="content-qrcode">
        <div class="qrcode"></div>
        <div class="content-seller">
           <div class="seller">商家<br>扫一扫</div>
           <div class="text">美券即刻享</div>
        </div>
      </div>
      <div class="content-number">{{formatSerialNumber()}}</div>
    </section>
</template>
<script>
export default{
  props: {
    coupon: {
      type: Object,
      default: () => { return {} }
    },
    side: {
      type: Boolean, // true，正面
      default: true
    },
    payFunc: Function
  },
  methods: {
    formatSerialNumber () {
      let isFree = window.getQueryString('isFree')
      let serNo = this.coupon.serialNumber
      if (isFree) serNo = window.getQueryString('serNo')
      if (!serNo) return 'No Data !'
      let reg = new RegExp(/\S{4,4}/g)
      return serNo.match(reg).join(' ')
    }
  }
}
</script>
<style>
.qrcode img{
  max-width: 100%;
  max-height: 100%;
}
</style>
<style scoped lang="scss">
@import '../assets/common';
.content-paid{
  display: block;
  padding-top: pxToRem(37);
  margin-top: pxToRem(-8);
  background: url(../assets/wjzq_fxz_fh.png) no-repeat;
  background-size: contain;
}
.content-paid.turn{
  background: url(../assets/wjzq_fxz_fh_fx.png) no-repeat;
  background-size: contain;
}
// 二维码和文字说明
.content-qrcode{
  display: flex;
  padding-bottom: pxToRem(25);
}
.qrcode{
  margin-left: pxToRem(65);
  width: pxToRem(216);
  height: pxToRem(216);
}
.content-seller{
  flex: 1;
  padding-left: pxToRem(30);
}
.content-seller .seller{
  display: flex;
  width: pxToRem(153);
  height: pxToRem(153);
  background-color: #fff;
  border-radius: 100%;
  font-size: pxToRem(36);
  color: #f65035;
  line-height: 1.5;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.content-seller .text{
  display: block;
  padding-top: pxToRem(35);
  font-size: pxToRem(30);
  color: #333;
  text-align: left;
}
// 序列号
.content-number{
  display: block;
  padding: pxToRem(18) 0;
  border-top: 1px dashed #dadada;
  font-size: pxToRem(32);
  color: #333;
  text-align: center;
}
</style>
