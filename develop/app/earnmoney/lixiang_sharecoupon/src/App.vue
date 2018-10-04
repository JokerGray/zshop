<template>
<div>
  <Topbrowser ref="topbrowser"></Topbrowser>
  <Topbar></Topbar>

  <section class="content">
      <Card :toggle="cardToggle">
        <!--正面-->
        <div slot="front" >
          <div class="corner" @click="cardToggle = !cardToggle"><div class="frontTag"></div></div>
          <Coupon :coupon="coupon"></Coupon>
          <Pay :coupon="coupon" :side="true" :payFunc="showLayerFunc"></Pay>
        </div>
        <!--反面-->
        <div slot="back">
          <div class="corner" @click="cardToggle = !cardToggle"><div class="backTag"></div></div>
          <Shop :coupon="coupon"></Shop>
          <Pay :coupon="coupon" :side="false" :payFunc="showLayerFunc"></Pay>
        </div>
      </Card>

    <modal v-show="showLayer">
      <div class="pay-layer text-center" slot="content">
        <p class="text">购买成功后序列号将以短信形式发送给您</p>
        <div ref="myForm" autocomplete="off">
          <input type="hidden" name="merchantId"  v-model="myForm.merchantId">
          <input type="hidden" name="subject"     v-model="myForm.couponName">
          <input type="hidden" name="totalFee"    v-model="myForm.couponPresenPrice"> 
          <input type="hidden" name="body"        v-model="myForm.couponDemand">
          <input type="hidden" name="rechargeModular" v-model="myForm.rechargeModular">
          <input type="hidden" name="originalPrice"  v-model="myForm.couponOriginaPrice">
          <input type="hidden" name="shareUserId" v-model="myForm.shareUserId">

          <input type="hidden" name="baseCouponId" v-model="myForm.baseCouponId">
          <input type="hidden" name="relationNo" v-model="myForm.couponId">
          <input type="hidden" name="serNo" ref="serNo">
          <input type="hidden" name="shopAddress" v-model="myForm.shopAddress">
          <!-- 需要输入的 -->
          <input ref="cellphone" name="userPhone" v-model.number="cellphone" class="cellphone text-center" placeholder="请输入手机号" type="text" maxlength="11" autocomplete="off" @blur="windowScrollTop">
          <!-- 验证码 -->
          <div v-if="myForm.couponType == 2">
            <input v-model="captcha" name="captcha" class="captcha cellphone" placeholder="请输入验证码" type="text" maxlength="6" @blur="windowScrollTop">
            <div ref="captchaBtn" class="btn captchaBtn" :class="isError ? '' : 'active'" @click="getCaptcha">获取验证码</div>
          </div>
          <p class="tips" :style="{visibility: isError ? 'visible' : 'hidden'}">请输入正确格式的手机号！</p>

          <div class="white-bg">
            <div class="btn" :class="isError ? '' : 'active'" @click="pay">确定支付{{parseFloat(coupon.couponPresenPrice).toFixed(2)}}元</div>
          </div>
        </div>
      </div>
    </modal>

    <Bottombar></Bottombar>
  </section>
</div>
</template>

<script>
// ajax
const ajax = require('@fdaciuk/ajax')
const request = ajax({
  headers: {
    apikey: 'test'
  }
})
const url = '/zxcity_restful/ws/rest'

// 以下提示
const loading = () => {
  if (!window.layer) return
  window.layer.open({shadeClose: false, type: 2, content: '加载中...'})
}
const hideLoading = () => {
  if (!window.layer) return
  window.layer.closeAll('loading')
}
const toast = (text) => {
  if (!window.layer) return window.alert(text)
  window.layer.open({
    content: text, skin: 'msg', time: 3
  })
}

import Topbar from './components/Topbar'
import Modal from './components/Modal'
import Card from './components/Card'
import Pay from './components/Pay'
import Coupon from './components/Coupon'
import Shop from './components/Shop'
import Bottombar from './components/Bottombar'
import Topbrowser from './components/Topbrowser'

export default {
  name: 'app',
  components: {
    Topbar,
    Modal,
    Card,
    Pay,
    Coupon,
    Shop,
    Bottombar,
    Topbrowser
  },
  data () {
    return {
      coupon: {},
      showTips: false,
      showLayer: false,
      cellphone: '',
      isError: false,
      btnDisabled: false,
      cardToggle: true,
      myForm: {
        rechargeModular: '0803'
      },
      captcha: '',
      timerLoading: false
    }
  },
  watch: {
    cellphone (val, oldVal) {
      var reg = new RegExp(/^1[0-9]{10}$/)
      this.isError = val.length === 0 ? false : !reg.test(val)
    },
    // 显示弹出层，弹出层位置需要改变
    showLayer (val, oldVal) {
      document.body.style.overflow = val ? 'hidden' : 'auto'
      window.showScroll = val
      if (val) {
        window.scrollTo(0, 0)
      }
    },
    // 定时器开始，会在一分后取消计时
    timerLoading (val, oldVal) {
      if (val) this.setCaptchaTimer()
    }
  },
  methods: {
    // 失去焦点后，页面恢复
    windowScrollTop () {
      window.scrollTo(0, 0)
    },
    fail_load () {
      return window.layer.open({
        'type': 1,
        'content': '<div class="pic"><i></i></div><p class="text">网络连接失败</p><div class="link_a"><a href="">点击重新加载</a></div>',
        'style': 'color:#fff;background-color:#fff;letter-spacing: 1px;width:100%;height:100%',
        'shade': 'background-color:rgba(0,0,0,0.1)'
      })
    },
    getData () {
      let shareUserId = window.getQueryString('shareUserId')
      let couponId = window.getQueryString('couponId')
      // form中的参数
      this.myForm.shareUserId = shareUserId
      this.myForm.couponId = couponId
      // ajax请求参数
      var params = {}
      params['cmd'] = 'earnmoney/getshareInfoDetail'
      params['version'] = 2
      params['data'] = JSON.stringify({
        shareUserId: shareUserId,
        couponId: couponId
      })

      let _this = this
      loading()
      request.post(url, params).then((data) => {
        hideLoading()
        if (parseInt(data.code) === 1) {
          _this.coupon = data.data
          // form中的参数
          _this.myForm = Object.assign(_this.myForm, data.data)
          // 若为优惠券，则检测浏览器版本
          if (parseInt(data.data.couponType) === 1) this.checkBrowser()
          // 分享页面
          var interval = setInterval(function () {
            if (window.wx) {
              window.share(data)
              clearInterval(interval)
            }
          }, 50)
        } else {
          toast(data.msg)
        }
      }).catch(() => {
        this.fail_load()
      })
    },
    // 只允许2行，目前为20字
    eclipsisLines (text) {
      if (text === null || text === undefined) return ''
      return text.length > 20 ? (text.substr(0, 20) + '…') : text
    },
    // 显示输入层
    showLayerFunc () {
      // 先检测券能否使用
      if (!this.checkStatus()) return
      // 当前票券为优惠券，且在微信浏览器中打开，则弹出
      if (parseInt(this.myForm.couponType) === 1 && this.checkBrowser()) return
      this.showLayer = true
    },
    // 按钮不可重复点击，手机号格式错误点击无效
    // 若当前类型为免费券，则直接调用后台接口
    pay () {
      if (this.btnDisabled) return
      if (this.isError) return
      if (this.cellphone.length === 0) {
        this.isError = true
        this.$refs.cellphone.focus()
        return
      }
      if (parseInt(this.myForm.couponType) === 2) {
        this.checkCaptcha()
        return
      }
      this.getCouponOrder()
    },
    // 获取serNo
    getCouponOrder () {
      this.btnDisabled = true
      let shareUserId = window.getQueryString('shareUserId')
      let couponId = window.getQueryString('couponId')
      let userPhone = this.cellphone

      let params = {}
      params['cmd'] = 'earnmoney/getCouponOrder'
      params['version'] = 2
      params['data'] = JSON.stringify({
        shareUserId: shareUserId,
        couponId: couponId,
        userPhone: userPhone
      })

      let _this = this
      try {
        window.sessionStorage.pay = 1
        window.localStorage.href = window.location.href
      } catch (error) {}

      loading()
      request.post(url, params).then((data) => {
        _this.btnDisabled = false
        hideLoading()
        if (parseInt(data.code) === 1) {
          _this.$refs.serNo.value = data.data.serNo
          _this.toPayPage()
        } else {
          toast(data.msg)
        }
      }).catch(() => {
        _this.btnDisabled = false
        hideLoading()
        this.fail_load()
      })
    },
    // 获取数据，跳转支付页面
    toPayPage () {
      let params = {}
      params['cmd'] = 'shareEarnAlipayAppH5Pay/shareEarnPayData'
      params['version'] = 2
      var obj = {}
      var arr = this.$refs.myForm.querySelectorAll('input[name]')
      for (var i = 0; i < arr.length; i++) {
        obj[arr[i].name] = arr[i].value
      }
      params['data'] = JSON.stringify(obj)
      request.post(url, params).then((data) => {
        if (parseInt(data.code) === 1) {
          document.write(data.data)
        } else {
          toast(data.msg)
        }
      })
    },
    // 验证码定时等待样式
    setCaptchaTimer () {
      var time = 60
      var captchaBtn = this.$refs.captchaBtn
      var _this = this
      // 60s后停止
      var interval = setInterval(function () {
        if (time < 2) {
          // 清除定时器
          clearInterval(interval)
          _this.timerLoading = false
          captchaBtn.innerHTML = '获取验证码'
          return
        }
        time--
        captchaBtn.innerHTML = '重新发送(' + time + 's)'
      }, 1000)
    },
    // 获取验证码
    getCaptcha () {
      if (this.cellphone.length === 0) {
        this.isError = true
        this.$refs.cellphone.focus()
        return
      }
      if (this.isError) return
      // 若当前还在等待，则不进行下一步操作
      if (this.timerLoading) {
        return toast('验证码在一分钟内不可重复发送！')
      }
      let params = {}
      params['cmd'] = 'earnmoney/sendEarnMoneyMessage'
      params['version'] = 2
      params['data'] = JSON.stringify({
        phone: this.cellphone
      })
      this.captcha = ''
      loading()
      request.post(url, params).then((data) => {
        hideLoading()
        if (parseInt(data.code) === 1) {
          this.timerLoading = true
        }
        toast(data.msg)
      }).catch(() => {
        hideLoading()
        this.fail_load()
      })
    },
    // 校验验证码
    checkCaptcha () {
      if (this.captcha.length === 0) return toast('请输入验证码！')
      let params = {}
      params['cmd'] = 'earnmoney/getFreeCoupon'
      params['version'] = 2
      params['data'] = JSON.stringify({
        couponId: this.myForm.couponId,
        shareUserId: this.myForm.shareUserId,
        userPhone: this.cellphone,
        randomcode: this.captcha
      })
      loading()
      var _this = this
      request.post(url, params).then((data) => {
        hideLoading()
        if (parseInt(data.code) === 1) {
          var serNo = data.data.serNo
          window.location.href = 'paid/index.html?isFree=1&couponId=' + _this.myForm.couponId + '&shareUserId=' + _this.myForm.shareUserId + '&serNo=' + serNo
        }
        toast(data.msg)
      }).catch(() => {
        hideLoading()
        this.fail_load()
      })
    },
    // 检测当前浏览器是否微信浏览器，是，true
    checkBrowser () {
      var result = window.navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1
      this.$refs.topbrowser.$el.classList[result ? 'add' : 'remove']('active')
      return result
    },
    // 检测优惠券类型，2为已下架，3为已删除，4为已过期
    checkStatus () {
      var msg = ['', '', '下架', '删除', '过期']
      var result = this.myForm.couponStatus && parseInt(this.myForm.couponStatus) === 1
      if (!result) {
        toast('该商品已' + msg[this.myForm.couponStatus] + '！无法使用！')
      }
      return result
    }
  },
  mounted () {
    this.getData()
    // 点击不再消失
    // this.$refs.topbrowser.$el.onclick = function () {
    //   this.classList.toggle('active')
    // }
  }
}
</script>

<style lang="scss">
@import './assets/mobile.css';
@import './assets/common';
.content{
  display: block;
  width: pxToRem(536);
  margin: 0 auto;
  padding: pxToRem(24) 0;
  user-select: none;
}

.pay-layer{
  display: block;
  width: pxToRem(611);
  height: auto;
  padding-top: pxToRem(480);
  margin: 0 auto;
  background: url(assets/wjzq_fxz_futc.png) no-repeat;
  background-size: contain;

  .text{
    font-size: pxToRem(22);
    color: #999;
  }

  .cellphone, .btn{
    display: block;
    width: pxToRem(500);
    height: pxToRem(80);
    margin: 0 auto;
    border-radius: pxToRem(10);
    font-size: pxToRem(26);
    line-height: pxToRem(80);
    color: #666;
    background-color: #f0f0f0;
  }

  .cellphone{
    margin-top: pxToRem(18);
    outline: none;
    border: none;
    padding: 0 pxToRem(10);
  }
  .cellphone::placeholder{
    text-align: center;
  }

  .captcha, .captchaBtn{
    display: inline-block;
    width: pxToRem(240);
    text-align: center;
  }
  .captchaBtn.active{
    background-color: #ffa500;
  }

  .tips{
    display: block;
    width: pxToRem(500);
    height: pxToRem(46);
    margin: 0 auto;
    font-size: pxToRem(16);
    line-height: pxToRem(46);
    color: #fa3d58;
  }

  .btn{
    cursor: no-drop;
  }
  .btn:active{
    transition: all 0.2s ease-in-out;
    background-color: #cc5e26;
  }
  .btn.active{
    color: #fff;
    background-color: #e2692b;
    cursor: pointer;
  }
}
.white-bg{
  background-color: #fff;
  padding-bottom: pxToRem(40);
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

.layui-m-layercont{
    font-family:"微软雅黑";

    .pic{
        display: flex;
        align-items:center;
        justify-content: center;
        i{
            margin-top: pxToRem(200);
            display: block;
            width: pxToRem(246);
            height: pxToRem(289);
            background: url('assets/wjzq_konbai_wlsb@2x.png') no-repeat;
            background-size: contain;
        }
    }
    .text{
        margin:pxToRem(28) 0; 
        color:#999;
        font-size: pxToRem(38);
        text-align: center;
    }
    .link_a{
        display: flex;
        align-items:center;
        justify-content: center;
        a{
            font-size: pxToRem(30);
            color:#fd9d0a;
            text-decoration: none;
            border-bottom:1px solid #fd9d0a;
        } 
    } 
}
</style>
