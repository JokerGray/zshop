<template>
  <el-row type='flex' justify='space-between' class='goods_items_box' :gutter='0'>
    <el-col :span='5' class='goods_items' v-for='(index) in dataList' :key='index'>
      <img src='./img/goods.jpg' alt=''>
      <div class='goods_items_text'>
        <p>头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤,</p>
        <h3>&yen;198.00</h3>
      </div>
    </el-col>
  </el-row>

</template>

<script type='text/ecmascript-6'>
//  :md='4' :sm='5' :xs='8'
//  v-for='(index,list) in dataList' :key='index'
export default {
  data () {
    return {
      dataList: [
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title:
            '头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title:
            '头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1头道汤1',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        },
        {
          title: '头道汤',
          price: '198',
          img: './img/goods.jpg'
        }
      ]
    }
  },
  components: {}
}
</script>
<style lang='scss' type='text/scss'>
$eff: #efefef;
@mixin ell() {
  overflow: hidden;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods_items_box {
  margin-top: 40px;
  /*div.goods_items:nth-child(5n){*/
  /*margin-right: 0;*/
  /*float: right;*/
  /*}*/
}
.goods_items {
  box-sizing: border-box;
  margin-right: 33px;
  float: left;
  /*margin-top: 40px;*/
  /*width:100%;*/
  width: 200px;
  /*height: 310px;*/
  margin-bottom: 24px;
  border: 1px solid $eff;
  img {
    width: 100%;
    height: auto;
  }
  &_text {
    padding: 10px;
  }
  p {
    padding: 0;
    margin: 0;
    display: inline-block;
    height: 42px;
    line-height: 20px;
    overflow: hidden;
    font-size: 18px;
    width: 100%;
  }
  h3 {
    padding: 0;
    margin: 0;
    line-height: 44px;
    color: #ff0001;
  }
}
</style>
