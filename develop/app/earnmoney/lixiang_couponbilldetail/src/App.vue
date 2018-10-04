<template>
  <div>

    <div class="info" ref="info">
      <h1 class="info-title" >分享【{{name}}】</h1>
      <table border="0" cellspacing="0" cellpadding="0">
        <tr><td><span class="circle times"></span></td><td>券被使用次数</td><td><span class="circle profit"></span></td><td>总收入</td></tr>
        <tr><td></td><td>{{num}}</td><td></td><td>¥ {{profit}}</td></tr>
      </table>
    </div>
    
    <div class="list-content" id="listContent" ref="listContent">
      <section class="list-item" v-for="item in list">
        <div class="img"></div>
        <div class="condition">
          <h1 class="condition-title">已完成</h1>
          <div class="condition-time">{{item.finishTime}}</div>
        </div>
        <div class="profit"><span>+</span>{{item.profit}}</div>
      </section>

      <mugen-scroll :handler="getDetail" :shouldHandle="shouldHandle" scroll-container="listContent">
        <div class="loading text-center" v-if="loading">加载中··· <span class="circle-spin"></span></div>
      </mugen-scroll>
    </div>

  </div>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll'

const ajax = require('@fdaciuk/ajax')
var request = ajax({
  headers: {
    apikey: sessionStorage.getItem('apikey') || 'test'
  }
})
const url = process.env.NODE_ENV === 'production' ? '/zxcity_restful/ws/rest' : 'api'
export default {
  name: 'app',
  components: {
    MugenScroll
  },
  data () {
    return {
      num: 0,
      profit: 0,
      name: '',
      list: [],
      page: 1,            // 分页，默认第1页
      loading: false,     // 是否显示loading样式
      shouldHandle: true  // 是否还需要加载数据
    }
  },
  methods: {
    loadMore () {
      console.log(1)
    },
    getDetail (page) {
      let couponId = this.getQueryString('couponId')
      let shareUserId = this.getQueryString('shareUserId')
      let params = {
        cmd: 'earnmoney/getshareProfitDetail',
        version: 2,
        data: `{
          couponId: ${couponId},
          shareUserId: ${shareUserId},
          selectBusiness: 3,
          pagination: {
            'page': ${this.page},
            'rows': 10
          }
        }`
      }
      this.loading = true
      this.shouldHandle = false
      let _this = this
      request.post(url, params).then(data => {
        _this.loading = false
        if (parseInt(data.code) === 1) {
          _this.list = _this.list.concat(data['data'])
          _this.shouldHandle = !(data.data.length < 10)
          _this.page += (data.data.length < 10) ? 0 : 1
        } else {
          _this.shouldHandle = true
          console.log(data.msg)
        }
      }).catch(err => {
        _this.shouldHandle = true
        _this.loading = false
        console.log(err)
      })
    },
    getQueryString (name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      let r = window.location.search.substr(1).match(reg)
      return r !== null ? decodeURI(r[2]) : null
    }
  },
  created () {
    this.profit = this.getQueryString('shareProfit')
    this.name = this.getQueryString('couponName')
    this.num = this.getQueryString('sharenum')
  },
  mounted () {
    this.$refs.listContent.style.height = document.body.clientHeight - this.$refs.info.clientHeight + 'px'
  }
}
</script>

<style lang="scss">
@import './assets/mobile.css';
@function pxToRem($px, $base: 26) {
    @return ($px/$base) * 1rem;
}
html,body{
  height: 100%;
  overflow: hidden;
}
// 券使用信息，上下通用
.info{
  display: block;
  background-color: #FFF;
  padding: pxToRem(14) 0;
  text-align: left;
  font-size: pxToRem(33);
  border-bottom: 1px solid #dadada;
  margin-bottom: pxToRem(4);
  box-shadow: 0 1px 4px #ccc;
}
.info .info-title{
  padding-left: pxToRem(30);
  border-bottom: 1px solid #dadada;
  font-size: pxToRem(33);
  color: #333333;
  text-align: left;
  font-weight: 500;
  height: pxToRem(90);
  line-height: pxToRem(90);
}
.info table{
  margin: pxToRem(14) 0 0 pxToRem(60);
  display: block;
}
.info table td{
  height: pxToRem(33);
  line-height: pxToRem(33);
  padding: pxToRem(12) 0
}
.info tr td:nth-child(even){
  width: 50%;
}
// 小圆点
.info .circle{
  display: inline-block;
  border-radius: 100%;
  height: pxToRem(33);
  width: pxToRem(33);
  vertical-align: middle;
  margin-right: pxToRem(33);
}
.circle.times{
  background-color: #ffd600;
}
.circle.profit{
  background-color: #ff7733;
}
.list-content{
  padding: 0 0 pxToRem(10) pxToRem(60);
  overflow: auto;
}
.list-item{
  display: block;
  height: pxToRem(120);
  padding-top: pxToRem(29);
  text-align: left;
  border-bottom: 1px solid #dadada;
}
.list-item .img{
  display: inline-block;
  width: pxToRem(62);
  height: pxToRem(62);
  background: url(assets/wjzq_mingxi_zhu.png) no-repeat;
  background-size: contain;
}
.list-item .condition{
  margin-left: pxToRem(16);
  display: inline-block;
}
.condition .condition-title{
  font-size: pxToRem(28);
  line-height: 1;
  color: #333;
  padding-bottom: pxToRem(10);
}
.condition .condition-time{
  font-size: pxToRem(26);
  line-height: 1;
  color: #999;
}
.list-item .profit{
  display: inline-block;
  font-size: pxToRem(38);
  line-height: 1;
  padding: pxToRem(10) pxToRem(33) 0 0;
  color: #333;
  float: right;
}
.profit span{
  padding-right: pxToRem(6)
}
// 加载数据
.loading{
  padding-top: pxToRem(10);
  font-size: pxToRem(35);
  color: #666;
}
@keyframes circle-spin{
  100%{transform:rotate(360deg)}
}
.circle-spin{
  display: inline-block;
  width: pxToRem(35);
  height: pxToRem(35);
  vertical-align: bottom;
  border-width: pxToRem(5);
  border-style: solid;
  border-color: transparent #ccc #ccc;
  border-radius: 100%;
  animation: circle-spin 1s infinite linear;
}
</style>
