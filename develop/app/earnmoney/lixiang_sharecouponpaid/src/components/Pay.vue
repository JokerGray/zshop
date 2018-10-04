<!-- 卡片翻转效果 -->
<template>
    <section>
      <div class="content-pay" :class=" !!side ? '' : 'turn'">
        <div class="pay text-center" @click="pay">支付{{formatNo(coupon.couponPresenPrice)}}元</div>
        <p class="enjoy text-center">即可享用</p>
        <p class="sharedby">{{coupon.shareUserName}}赠送您的优惠券</p>
      </div>
    </section>
</template>
<script>
export default{
  props: {
    coupon: {
      type: Object,
      default: () => { return {} }
    },
    // true，正面
    side: {
      type: Boolean,
      default: true
    },
    payFunc: Function
  },
  methods: {
    pay () {
      if (this.payFunc) this.payFunc()
      console.log('支付')
    },
    formatNo (val) {
      var result = parseFloat(val).toFixed(2)
      return isNaN(result) ? '0.00' : result
    }
  }
}
</script>
<style scoped lang="scss">
@import '../assets/common';
.content-pay{
  display: block;
  padding-top: pxToRem(112);
  margin-top: pxToRem(-8);
  background: url(../assets/wjzq_fxz_chengb.png) no-repeat;
  background-size: contain;
}
.content-pay.turn{
    background: url(../assets/wjzq_fxz_chengb_fx.png) no-repeat;
    background-size: contain;
}
.pay{
  display: block;
  width: pxToRem(470);
  margin: 0 auto;
  padding: pxToRem(21) 0;
  border-radius: pxToRem(28);
  background-color: #fff;
  font-size: pxToRem(42);
  color: #ffb629;
  cursor: pointer;
}
.pay:active{
  transition: all 0.2s ease-in-out;
  color: #fff;
  background-color: lightgray;
}
.enjoy{
  display: block;
  padding-top: pxToRem(20);
  font-size: pxToRem(28);
  color: #fff;
}
.sharedby{
  display: block;
  padding: pxToRem(56) pxToRem(23) pxToRem(23.5) 0;
  font-size: pxToRem(24);
  color: #fff;
  text-align: right;
}
</style>
