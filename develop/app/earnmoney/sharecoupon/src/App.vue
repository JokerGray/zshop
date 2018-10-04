<template>
  <section class="content">
    <div class="content-coupon">
      <img class="img" :src="coupon.couponPic" :alt="coupon.couponName">
      <div class="content-detail">
        <h1 class="couponName ellipsis">{{coupon.couponName}}</h1>
        <p class="demand">{{coupon.couponDemand}}</p>
        <h1 class="price">原价：{{coupon.couponOriginaPrice}}</h1>
      </div>
    </div>
    <div class="content-pay">
      <div class="pay" @click="pay">支付{{coupon.couponPresenPrice}}元</div>
      <p class="enjoy">即可享用</p>
      <p class="sharedby">{{coupon.shareUserName}}赠送您的优惠券</p>
    </div>
  </section>
</template>

<script>
var ajax = require('@fdaciuk/ajax')
const url = process.env.NODE_ENV === 'production' ? '/zxcity_restful/ws/rest' : 'api/'
export default {
  name: 'app',
  data () {
    return {
      coupon: {}
    }
  },
  methods: {
    getData () {
      let shareUserId = window.getQueryString('shareUserId')
      let couponId = window.getQueryString('couponId')
      let data = {
        cmd: 'earnmoney/getshareInfoDetail',
        version: 2,
        data: `{
          shareUserId: '${shareUserId}',
          couponId: '${couponId}'
        }`
      }
      let _this = this
      ajax().post(url, data).then(data => {
        if (data) _this.coupon = data.data
      }).catch(err => {
        console.log(err)
      })
    },
    pay () {
      window.webPay()
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style lang="scss">
@import './assets/mobile.css';
@charset "utf-8";
@function pxToRem($px, $base: 26) {
    @return ($px/$base) * 1rem;
}
.content{
  display: block;
  width: pxToRem(536);
  margin: 0 auto;
  padding: pxToRem(24) 0;
  user-select: none;
}
.content-coupon{
  display: block;
  padding: pxToRem(42) 0;
  background: url(./assets/wjzq_fxz_huangb.png) no-repeat;
  background-size: contain;
}
.img{
  display: block;
  width: pxToRem(464);
  height: pxToRem(416);
  margin: 0 auto;
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
  text-align: center;
}
.demand{
  display: block;
  margin: 0 auto;
  padding-top: pxToRem(14);
  height: pxToRem(70);
  width: pxToRem(296);
  font-size: pxToRem(26);
  color: #666;
  text-align: left;
}
.price{
  display: block;
  margin: 0 auto;
  padding: pxToRem(14) 0 pxToRem(23);
  font-size: pxToRem(43);
  font-weight: 500;
  color: #555;
  text-align: center;
}
.content-pay{
  display: block;
  padding-top: pxToRem(112);
  margin-top: pxToRem(-8);
  background: url(./assets/wjzq_fxz_chengb.png) no-repeat;
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
  text-align: center;
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
  text-align: center;
}
.sharedby{
  display: block;
  padding: pxToRem(56) pxToRem(23) pxToRem(23.5) 0;
  font-size: pxToRem(24);
  color: #fff;
  text-align: right;
}
</style>
