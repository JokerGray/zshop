<template>
    <section>
      <div class="card" v-for='(service, i) in serviceList' :key="i">
        <div class="img-content">
          <img :src="service.imgUrl" alt="">
        </div>
        <div class="text-content">
          <span class="content">全身按摩精油身体推背通经络面部开背美容院</span>  
          <span class="money">￥198.00</span>
        </div>
      </div>

      <div class="card" v-if='serviceData'>
        <div class="img-content">
          <img src="../assets/商品1.jpg" alt="">
        </div>
        <div class="text-content">
          <span class="content">{{serviceData.serviceName}}</span>  
          <span class="money">￥{{serviceData.servicePrice}}</span>
        </div>
      </div>
    </section>
</template>

<script>
export default {
  components: {},
  data() {
      return {
          serviceList: [
            {'imgUrl' : '/static/img/service1.jpg'},
            {'imgUrl' : '/static/img/service2.jpg'},
            {'imgUrl' : '/static/img/service3.jpg'},
            {'imgUrl' : '/static/img/service4.jpg'},
            {'imgUrl' : '/static/img/service5.jpg'},
            {'imgUrl' : '/static/img/service6.jpg'},
            {'imgUrl' : '/static/img/service7.jpg'},
            {'imgUrl' : '/static/img/service8.jpg'},
            {'imgUrl' : '/static/img/service9.jpg'}
          ]
      };
  },
  props: {
    serviceData: Object
  }
}
</script>
<style scoped lang='scss'>
section{
    white-space: normal;
}
.card{
    display: inline-block;
    width: 15%;
    min-width: 180px;
    height: 32vh;
    min-height: 285px;
    border: 1px solid #eee;
    margin: 24px 2vw 0 0;
    vertical-align: top;

    .img-content{
      width: 100%;
      overflow: hidden;
      img{
        width: 100%;
    }
  }

  .text-content{
    position: relative;
    height: 14vh;
    padding: 10px 10px;
    box-sizing: border-box;
    font-size: 18px;
    color: #333;
    .content{
      font-size: 1rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .money{
      position: absolute;
      bottom: 20px;
      left: 10px;
      color: red;
    }
  }
}
</style>
