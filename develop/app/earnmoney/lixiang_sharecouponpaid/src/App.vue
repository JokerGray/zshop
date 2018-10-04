<template>
  <div class="widthLimit">
    <Topbar></Topbar>
    <div class="tips ellipsis">您可以通过“截图”或“收藏”保存二维码界面，消费时使用！</div>

    <section class="content" id="content">
      <Card :toggle="cardToggle">
        <!--正面-->
        <div slot="front" >
          <div class="corner" @click="cardToggle = !cardToggle"><div class="frontTag"></div></div>
          <Coupon :coupon="coupon"></Coupon>
          <div id="book">
            <div><Pay :coupon="coupon" :side="true" id="pay"></Pay></div>
            <div style="background-color: orange"></div>
          </div>
          <div><div class="seal-img" id="seal"></div></div>
          <Paid :coupon="coupon" :side="true" id="paid" class="visibile_none"></Paid>
        </div>
        <!--反面-->
        <div slot="back">
          <div class="corner" @click="cardToggle = !cardToggle"><div class="backTag"></div></div>
          <Shop :coupon="coupon"></Shop>
          <div><div class="seal-img"></div></div>
          <Paid :coupon="coupon" :side="false"></Paid>
        </div>
      </Card>

      <Bottombar></Bottombar>
      
    </section>
    
  </div>
</template>

<script>
var ajax = require('@fdaciuk/ajax')
var request = ajax({
  headers: {
    apikey: 'test'
  }
})
const url = '/zxcity_restful/ws/rest'

import Card from './components/Card'
import Coupon from './components/Coupon'
import Shop from './components/Shop'
import Pay from './components/Pay'
import Paid from './components/Paid'
import Bottombar from './components/Bottombar'
import Topbar from './components/Topbar'

export default {
  name: 'app',
  components: {
    Card,
    Pay,
    Coupon,
    Shop,
    Paid,
    Bottombar,
    Topbar
  },
  data () {
    return {
      coupon: {},
      cardToggle: true
    }
  },
  methods: {
    // 进入页面获取数据
    getData () {
      let out_trade_no = window.getQueryString('out_trade_no')
      let isFree = window.getQueryString('isFree')
      var data = {
        cmd: 'earnmoney/getCouponshareInfo',
        version: 2,
        data: `{
          orderId: '${out_trade_no}'
        }`
      }
      if (isFree) {
        var shareUserId = window.getQueryString('shareUserId')
        var couponId = window.getQueryString('couponId')
        data = {
          cmd: 'earnmoney/getshareInfoDetail',
          version: 2,
          data: `{
            shareUserId: '${shareUserId}',
            couponId: '${couponId}'
          }`
        }
      }
      let _this = this
      let loadingIndex = window.loading()
      request.post(url, data).then(data => {
        window.layer.close(loadingIndex)
        if (parseInt(data.code) === 1) {
          _this.coupon = data.data
          // 根据情况选择serNo
          var serNo = data.data.serialNumber
          if (isFree) serNo = window.getQueryString('serNo')
          window.createQRcode(serNo)
          // 分享页面
          var interval = setInterval(function () {
            if (window.wx) {
              window.share(data)
              clearInterval(interval)
            }
          }, 50)
        } else {
          window.toast(data.msg || '数据请求失败！')
        }
      }).catch(() => {
        window.toast('网络异常，请稍后再试！')
      })
    },
    // 只允许2行，目前为20字
    eclipsisLines (text) {
      if (text === null || text === undefined) return ''
      return text.length > 20 ? (text.substr(0, 20) + '…') : text
    }
  },
  created () {
    window.sessionStorage.pay = 1
    let out_trade_no = window.getQueryString('out_trade_no')
    let isFree = window.getQueryString('isFree')
    if (isFree || out_trade_no) return this.getData()

    window.toast('支付失败！')
    // 失败后返回原界面
    // IOS无痕模式有问题
    try {
      let href = window.localStorage.href
      window.localStorage.href = ''
      if (href) window.location.href = href
    } catch (error) {}
  },
  mounted () {
    if (!window.checkIfFirstTimeOpen()) {
      document.getElementById('pay').style.display = 'none'
      document.getElementById('paid').style.visibility = 'visible'
    }
  }
}
</script>

<style>
html, body{
  overflow-x: hidden;
}
</style>
<style lang="scss" scoped>
@import './assets/mobile.css';
@import './assets/common';

.widthLimit{
  display: block;
  max-width: 750px;
  margin: 0 auto;
}
*{
  letter-spacing: pxToRem(1);
}
.tips{
  display: block;
  height: pxToRem(60);
  color: #333;
  font-size: pxToRem(22);
  line-height: pxToRem(60);
  background-color: #ffeac1;
  text-align: center;
}
.content{
  display: block;
  width: pxToRem(536);
  margin: 0 auto;
  padding: pxToRem(24) 0;
  user-select: none;
}
.visibile_none{
  visibility: hidden;
}
// 印章
.seal-img{
  position: absolute;
  width: pxToRem(182);
  height: pxToRem(166);
  top: pxToRem(622);
  margin-left: pxToRem(334);
  background: url(./assets/wjzq_fxz_zhangyi.png) no-repeat;
  background-size: contain;
  opacity: 0;
  transform: scale(4);
}
.seal-img.active{
  opacity: 1;
  transform: scale(1) translate3d(0, 0, 0);
  transition: all 1s ease-in;
}
.seal-img.show{
  opacity: 1;
  transform: scale(1);
}

// 切角
.corner{
  position: absolute;
  width: pxToRem(126);
  height: pxToRem(120);
  right: 0;
  background: url(assets/wjzq_lsj.png) no-repeat;
  background-size: contain;
  text-align: right;
}
.corner .frontTag{
  display: inline-block;
  width: pxToRem(36);
  height: pxToRem(43);
  margin: pxToRem(16) pxToRem(16) 0 0;
  background: url(assets/wjzq_fuli_baisedt.png) no-repeat;
  background-size: contain;
}
.corner .backTag{
  display: inline-block;
  width: pxToRem(43);
  height: pxToRem(38);
  margin: pxToRem(13) pxToRem(16) 0 0;
  background: url(assets/wjzq_fuli_fanhui.png) no-repeat;
  background-size: contain;
}
</style>
