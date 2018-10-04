<!-- 卡片翻转效果 -->
<template>
    <section class="content-shop">
        <div class="bg">
          <section>
            <h2 class="title">{{coupon.couponName}}</h2>
            <div class="content-price">
              <span class="present">¥ {{parseFloat(coupon.couponPresenPrice || 0).toFixed(2)}}</span>
              <span class="original">原价 {{parseFloat(coupon.couponOriginaPrice|| 0).toFixed(2)}}</span>
            </div>

            <div class="content-contact">
              <div class="location">
                <div class="tag"></div>
                <div class="text">{{coupon.shopAddress}}</div>
              </div>
              <div class="cellphone">
                <div class="tag"></div>
                <div class="text">{{coupon.servicePhone}}</div>
              </div>
            </div>
          </section>
          <div class="content-img">
            <img src="../assets/wjzq_fuli_hbzhanweu.png" alt="">
          </div>
        </div>
    </section>
</template>
<script>
export default{
  props: {
    coupon: Object
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

.content-shop{
  display: block;
  padding: pxToRem(42) pxToRem(36);
  background: url(../assets/wjzq_fxz_huangb_fx.png) no-repeat;
  background-size: contain;
}
.content-shop .bg{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: pxToRem(46) 0 pxToRem(44);
  height: pxToRem(649);
  background-color: #fff;
}
.title{
  display: block;
  padding: pxToRem(0) pxToRem(46) pxToRem(20);
  font-size: pxToRem(30);
  font-weight: 600;
  color: #333;
  text-align: left;
  line-height: 1.2;
}
// 价格
.content-price{
  display: block;
  margin: 0 pxToRem(38) 0 pxToRem(37);
  padding: 0 0 pxToRem(20) pxToRem(9);
  border-bottom: 1px solid #dadada;
}
.present{
  margin-right: pxToRem(20);
  font-size: pxToRem(28);
  font-weight: 500;
  color: #f95402;
  text-align: left;
}
.original{
  font-size: pxToRem(22);
  color: #999;
  text-decoration: line-through;
}
// 联系方式，地址等
.content-contact{
  padding: pxToRem(20) pxToRem(46);
}
.location{
  display: flex;
}
.location .tag{
  display: inline-block;
  width: pxToRem(22);
  height: pxToRem(26);
  background: url(../assets/wjzq_fuli_ditu.png) no-repeat;
  background-size: contain;
}
.location .text, .cellphone .text{
  flex: 1;
  padding-left: pxToRem(20);
  font-size: pxToRem(22);
  color: #999;
  letter-spacing: pxToRem(2);
  line-height: 1.2;
}
.cellphone{
  display: flex;
  padding-top: pxToRem(20);
}
.cellphone .tag{
  display: inline-block;
  width: pxToRem(24);
  height: pxToRem(24);
  background: url(../assets/wjzq_fuli_dh.png) no-repeat;
  background-size: contain;
}
// 店铺图片，置于底部
.content-img{
  display: flex;
  align-items: center;
  justify-content: center;
  width: pxToRem(390);
  height: pxToRem(273);
  margin: 0 auto;
  text-align: center;
}
.content-img img{
  max-width: 100%;
  max-height: 100%;
}
</style>
