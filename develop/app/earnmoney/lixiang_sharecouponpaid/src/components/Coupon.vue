<!-- 卡片翻转效果 -->
<template>
    <section class="content-coupon">
        <div class="img">
            <img :src="coupon.couponPic" :alt="coupon.couponName" onerror="this.src='http://tsnrhapp.oss-cn-hangzhou.aliyuncs.com/services/userbg/default_bg.png'">
        </div>
        <div class="content-detail text-center">
            <h1 class="couponName ellipsis">{{coupon.couponName}}</h1>
            <div class="demand">{{eclipsisLines(coupon.couponDemand)}}</div>
            <h1 class="price">原价：{{parseFloat(coupon.couponOriginaPrice).toFixed(2)}}元</h1>
        </div>
    </section>
</template>
<script>
export default{
  props: {
    coupon: {
      type: Object,
      default: () => { return {} }
    }
  },
  methods: {
    // 只允许2行，目前为20字
    eclipsisLines (text) {
      if (text === null || text === undefined) return ''
      return text.length > 20 ? (text.substr(0, 20) + '…') : text
    }
  }
}
</script>
<style scoped lang="scss">
@import '../assets/common';

.content-coupon{
  display: block;
  padding: pxToRem(42) 0;
  background: url(../assets/wjzq_fxz_huangb.png) no-repeat;
  background-size: contain;
}
.content-coupon.turn {
  background: url(../assets/wjzq_fxz_huangb_fx.png) no-repeat;
  background-size: contain;
}
.img{
  display: flex;
  justify-content: center;
  align-items: center;
  width: pxToRem(464);
  height: pxToRem(416);
  margin: 0 auto;
  background-color: #eee;
}
.img img{
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
.content-detail{
  display: block;
  width: pxToRem(446);
  height: pxToRem(233);
  margin: 0 auto;
  background-color: #fff;
}
.couponName{
  display: block;
  padding: pxToRem(26) pxToRem(24) 0;
  font-size: pxToRem(44);
  color: #333;
}
.demand{
  display: block;
  margin: pxToRem(14) auto 0 auto;
  height: pxToRem(70);
  max-height: pxToRem(70);
  width: pxToRem(296);
  font-size: pxToRem(26);
  line-height: pxToRem(35);
  color: #666;
  overflow: hidden;
}
.price{
  display: block;
  margin: 0 auto;
  padding: pxToRem(14) 0 pxToRem(23);
  font-size: pxToRem(43);
  font-weight: 500;
  color: #555;
}
</style>
