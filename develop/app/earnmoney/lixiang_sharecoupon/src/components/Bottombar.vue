<template>
  <section class="footer">
      <div class="lineContent">
          <span class="line"></span><span class="text">优惠券说明</span><span class="line"></span>
      </div>
      <p>1.下载智享城市APP。</p>
      <p>2.注册智享城市账号。</p>
      <p>3.进入玩家挣钱，分享赚板块。</p>
      <p>4.点击我的优惠券查看或使用已购买的优惠券。</p>
      <p>5.同时我们也会将优惠券信息通过短信发送到您的手机。</p>
      <p>6.优惠券超过使用时间还未使用，不予退款。  </p>
  </section>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '../assets/common';

.footer{
    display: block;
    background-color: #fff6e4;
    color: #333;
    margin: pxToRem(40) 0 pxToRem(20);
    padding: 0 pxToRem(24) pxToRem(34);
}
.lineContent{
    position: relative;
    text-align: center;
    span{
        display: inline-block;
        vertical-align: middle;
    }
    .line{
        height: 1px;
        width: 30%;
        background-color: #555;
    }
    .text{
        width: 40%;
        font-size: pxToRem(32);
        padding: pxToRem(28) 0;
        background-color: #fff6e4;
    }
}
p{
    line-height: 1.8;
    font-size: pxToRem(22);
    letter-spacing: 0;
}
</style>
