<template>
    <section class="content">
      <img class="img" :src="img_src" :alt="title">
      <div class="detail">
        <div class="detail-content">
          <div class="title">{{title}}</div>
          <div class="description">{{description}}</div>
          <div class="price">{{price}}</div>
        </div>
      </div>
      <img class="seal" :class="hasPaid ? 'active' : ''" src="../assets/wjzq_fxz_zhangyi.png" alt="">
    </section>
</template>

<script>
export default {
  data () {
    return {
      img_src: 'static/wjzq_fxz_tupian.png',
      title: '三胖餐饮店',
      description: '100元免费体验到店看书,提供免费下午茶',
      price: '原价:150元'
    }
  },
  props: {
    hasPaid: Boolean
  },
  methods: {
    sealed (e) {
      if (e.propertyName === 'transform') this.$parent.sealed()
    }
  },
  mounted () {
    this.$el.querySelector('.seal').addEventListener('transitionend', this.sealed)
  }
}
</script>

<style scoped lang="scss">
@import '../assets/common';
.content{
  width: pxToRem(536);
  margin: 0 auto;
  padding: pxToRem(42) pxToRem(36);
  background: url(../assets/wjzq_fxz_huangb.png) no-repeat bottom;
  background-size: contain;
  margin-bottom: pxToRem(-10);
  overflow: hidden;
}
.img{
  display: block;
  margin: 0 auto;
  width: 100%;
  height: pxToRem(416);
}
.detail{
  display: block;
  width: pxToRem(446);
  padding: pxToRem(26) 0 pxToRem(23) 0;
  margin: 0 auto;
  background-color: #FFFFFF;
}
.detail-content{
  width: pxToRem(296);
  margin: 0 auto;
}
.detail .title{
  font-size: pxToRem(45);
  font-family: "PingFang SC Medium", Arial, PingFang SC, Microsoft YaHei, sans-serif;
  font-weight: 400;
  color: #333;
  text-align: center;
}
.detail .description{
  font-size: pxToRem(26);
  font-family: "PingFang SC Regular", Arial, PingFang SC, Microsoft YaHei, sans-serif;
  color: #666;
  text-align: left;
  max-height: pxToRem(70);
  overflow-y: auto;
}
.detail .price{
  font-size: pxToRem(44);
  font-family: "PingFang SC Heavy", Arial, PingFang SC, Microsoft YaHei, sans-serif;
  color: #555;
  text-align: center;
}
.seal{
  position: absolute;
  display: block;
  float: right;
  z-index: -1;
  width: pxToRem(182);
  height: pxToRem(166);
  opacity: 0;
  transform: scale(4);
  margin: pxToRem(-93) 0 0 pxToRem(298);
}
.seal.active{
  z-index: 99;
  opacity: 1;
  transform: scale(1);
  transition: all 1s ease-in;
}
</style>
