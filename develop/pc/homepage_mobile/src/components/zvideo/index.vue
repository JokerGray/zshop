<template>
  <section class="section">
    <div class="header">
        <div id="zcity"     @click="changeType($event)" class="active"><span>智享城市APP</span></div>
        <div id="zmaster"   @click="changeType($event)"><span>智大师APP</span></div>
        <div id="zshop"     @click="changeType($event)"><span>智享店务</span></div>
        <div id="zplatform" @click="changeType($event)"><span>智享后台</span></div>
    </div>
    <img class="banner" src="./img/web_spjx_banner.png">
    <div class="videoContent">
      <div class="content" v-for="video in videoList" :key="video.videoUrl" v-if="video.type == type"  @click="showAlert(video.videoUrl)">
        <div class="video">
          <img :src="video.coverUrl">
          <div class="cover"></div>
        </div>
        <div class="text">{{video.text}}</div>
      </div>
      <simplert :useRadius="true" :useIcon="true"  ref="simplert"></simplert>
      <simplert :useRadius="true" :useIcon="false" ref="correct"></simplert>
      <simplert :useRadius="true" :useIcon="true" ref="fail"></simplert>
    </div>
  </section>
</template>
<script>
import Simplert from 'vue2-simplert'
export default {
  components: {
    Simplert
  },
  data () {
    return {
      videoList: [
        {type: 'zcity', coverUrl: '/static/app_lq.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/lianquan.mp4', text: '脸圈版块操作视频'},
        {type: 'zcity', coverUrl: '/static/app_qz.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/quanzi.mp4', text: '圈子版块操作视频'},
        {type: 'zcity', coverUrl: '/static/app_qmx.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/quanminxuan.mp4', text: '全民炫板块操作视频'},
        {type: 'zcity', coverUrl: '/static/app_wjzq.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/wanjiazhengqian.mp4', text: '玩家挣钱板块操作视频'},
        {type: 'zcity', coverUrl: '/static/app_yb.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/yueba.mp4', text: '约吧板块操作视频'},
        {type: 'zcity', coverUrl: '/static/app_zc.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/zhucheng.mp4', text: '筑城版块操作视频'},
        {type: 'zcity', coverUrl: '/static/app_fx.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/faxian.mp4', text: '发现版块视频'},
        {type: 'zcity', coverUrl: '/static/app_ftd.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/fentiandi.mp4', text: '粉天地版块视频'},
        {type: 'zcity', coverUrl: '/static/app_yd.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/app/yundian.mp4', text: '云店板块视频'},
        {type: 'zmaster', text: '暂无视频教程~'},
        {type: 'zshop', coverUrl: '/static/shop_pad.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/pad/fivescreen.mp4', text: '自助点餐下单'},
        {type: 'zplatform', coverUrl: '/static/platform_jgzz.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/manager-organization.mp4', text: '机构组织操作视频'},
        {type: 'zplatform', coverUrl: '/static/platform_zwgz.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/manager-headship.mp4', text: '职务工资操作视频'},
        {type: 'zplatform', coverUrl: '/static/platform_cxhd.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/manager-activity.mp4', text: '促销活动操作'},
        {type: 'zplatform', coverUrl: '/static/platform_sssb.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/manager-equipment.mp4', text: '设施设备操作视频'},
        {type: 'zplatform', coverUrl: '/static/platform_dwgw.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/cashier-outshop.mp4', text: '收银台之店外购物视频'},
        {type: 'zplatform', coverUrl: '/static/platform_yygl.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/cashier-reservation.mp4', text: '收银台之预约管理操作视频'},
        {type: 'zplatform', coverUrl: '/static/platform_mdxd.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/cashier-order.mp4', text: '收银台订单之门店下单'},
        {type: 'zplatform', coverUrl: '/static/platform_fxz.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/app-sharebill.mp4', text: 'APP管理-分享赚'},
        {type: 'zplatform', coverUrl: '/static/platform_ftd.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/app-fansteam.mp4', text: 'APP管理-粉团队'},
        {type: 'zplatform', coverUrl: '/static/platform_ftdhd.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/app-fansactivity.mp4', text: 'APP管理-粉团队活动'},
        {type: 'zplatform', coverUrl: '/static/platform_qbz.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/app-taskearn.mp4', text: 'APP管理-抢标赚'},
        {type: 'zplatform', coverUrl: '/static/platform_wjzq.png', videoUrl: 'http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/video/teach/manager/app-turntable.mp4', text: 'APP管理-玩家挣钱'},
      ],
      type: 'zcity'
    }
  },
  methods: {
    changeType ($event) {      
      let dom = $event.target;
      dom = dom.tagName == 'SPAN' ? $(dom).parent(): $(dom)
      this.type = dom.attr('id')
      dom.addClass('active').siblings().removeClass('active')
    },
    showAlert (videoUrl) {
      let _this = this
      if(!videoUrl) {
        return _this.failalert('暂无视频！')
      }
      var pwd = document.getElementById('password')
      if (pwd) pwd.value = ''
      let obj = {
        title: '请输入密码！',
        message: '<input id="password" type="password" class="pwd">',
        type: 'info',
        useConfirmBtn: true,
        customCloseBtnText: '取消',
        customCloseBtnClass: 'btn-alert cancle',
        customConfirmBtnText: '确定',
        customConfirmBtnClass: 'btn-alert confirm',
        onConfirm: function () {
          var val = document.getElementById('password').value
          var validate = val === 'jtnrhdzxsh'
          !validate ? _this.failalert() : _this.successalert(videoUrl)
        }
      }
      this.$refs.simplert.openSimplert(obj)
    },
    failalert (msg) {
      if (!msg) msg = '密码错误，请重新输入！'
      let obj = {
        type: 'error',
        title: msg,
        customCloseBtnText: '确定',
        customCloseBtnClass: 'btn-alert confirm'
      }
      this.$refs.fail.openSimplert(obj)
    },
    successalert (videoUrl) {
      var sHtml =`
            <video id="videoShow" src="${videoUrl}" width="100%" height="100%" autoplay="autoplay">
              您的浏览器不支持 HTML5 video 标签~
            </video>
      `
      let obj = {
        customClass: 'correctContent',
        message: sHtml,
        customCloseBtnText: '关闭',
        customCloseBtnClass: 'btn-alert confirm',
        onOpen: function () {
          // var interval = setInterval(function(){
          //   var videoShow = document.getElementById('videoShow')
          //   if(!videoShow) return;
          //   videoShow.play();
          //   clearInterval(interval)
          // }, 50)
        },
        onClose: function () {
           var videoShow = document.getElementById('videoShow')
           videoShow.pause()
           videoShow.parentElement.removeChild(videoShow )
        }
      }
      this.$refs.correct.openSimplert(obj)
    }
  },
  mounted () {
    this.$parent.swiper = null
    let type = this.$route.params.type
    if (!!type) $(this.$el).find('#' + type).click()
  }
}
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
<style>
/* 弹出窗口 */
.simplert--shown .simplert__content{
  max-width: 500px;
}
input.pwd{
  display: block;
  width: 100%;
  height: 50px;
  padding: 6px 12px;
  margin: 6px 0;
  font-size: 24px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
input.pwd:focus{
  border-color: #66afe9;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
}
.btn-alert{
    display: inline-block;
    margin: 0 1em;
    padding: 10px 20px 15px;
    cursor: pointer;
    text-align: center;
    color: #fff;
    border: none;
    outline: none;
    background-color: #068ac9;
    -webkit-appearance: none;
    font-size: 24px;
    border-radius: 4px;
}
.btn-alert.cancle{
  background-color: #d9534f;
}
.correctContent .simplert__content{
  width: 100%;
  max-width: 100%;
}
</style>
