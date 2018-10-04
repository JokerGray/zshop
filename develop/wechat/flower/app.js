//app.js
import util from './utils/util.js'

App({
  onLaunch: function () {
   
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //判断登录是否过期
    // 登录
    // wx.login({
      //   success: res => {
      //     //登录成功
      //     console.log('登录成功',res)
      //     var code = {'code':res.code};
      //     util.reqAsync('payBoot/wx/miniapp/flower/login',code).then(res=>{
      //       console.log('登录app', res.data.data.scSysUser)
      //       wx.setStorageSync('loginToken', res.data.data.loginToken);
      //       // 失败则跳到注册页
      //       if (res.data.code != 1) {
      //         loginFailed()
      //         wx.navigateTo({ url: '/pages/reg/reg' })
      //         return
      //       }
      //       // 未注册用户跳转到注册页面
      //       if (res.data.data.scSysUser == null) {
      //         wx.navigateTo({ url: '/pages/reg/reg' });
      //       }
      //       else {
      //         wx.setStorageSync('scSysUser', res.data.data.scSysUser);
      //       }
      //    }) 
      //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              } 
              res.userInfo.userId = 512;
                    // .success(res => {
                    //     console.log(res)
                    // }).fail(err => {
                    //     console.log(err)
                    // })
            }
          })
        }
      }
    })
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          console.log('获取当前的位置',res)
            var latitude = res.latitude
            var longitude = res.longitude
            var speed = res.speed
            var accuracy = res.accuracy
            var jd = {
                latitude: latitude,
                longitude: longitude
            }
            wx.setStorage({
                key: 'jd',
                data:jd
            })
        }
    })
  },
  globalData: {
    userInfo: null,
    systemInfo: wx.getSystemInfoSync(),
  }
})