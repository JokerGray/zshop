var app = getApp()
// pages/reg/reg.js
import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneModel: false,
    time: 0,
    msg: '获取验证码',
    phoneNum: '',
    yzCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('我是reg 注册页面')
    var sharedetails = wx.getStorageSync('sharedetails')
    var optionsName = wx.getStorageSync('options');
    // console.log(sharedetails);
    // console.log(options);

    if (sharedetails){
      this.setData({
        sharedetails: sharedetails,
        optionsName: optionsName
      })
    }

    console.log(this.data.sharedetails)
    console.log(this.data.optionsName)
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  getCode: function () {
    var reg = /^1(3|4|5|7|8|9)\d{9}$/;
    if (!reg.test(this.data.phoneNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    }
    var _this = this;
    util.reqAsync('payBoot/wx/miniapp/captcha',
      {
        phone: _this.data.phoneNum,
        loginToken: wx.getStorageSync('loginToken')
      }).then((res) => {
        console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '验证码发送成功',
            icon: 'none'
          })
          this.setData({
            time: 60
          })
          var time = setInterval(function () {
            _this.setData({
              time: _this.data.time -= 1
            })
            if (_this.data.time <= 0) {
              _this.setData({
                msg: '重新获取'
              })
              clearInterval(time)
            }
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
  },
  phoneBlur: function (e) {
    console.log(e)
    var num = e.detail.value;
    this.setData({
      phoneNum: e.detail.value
    })

  },
  codeBlur: function (e) {
    this.setData({
      yzCode: e.detail.value
    })
  },
  sureLogin: function () {
    console.log(1111)
    var reg = /^1(3|4|5|7|8|9)\d{9}$/;
    if (!reg.test(this.data.phoneNum)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return;
    }
    if (!this.data.yzCode) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return;
    }
    var _this = this;
    util.reqAsync('payBoot/wx/miniapp/checkCode', {
      phone: _this.data.phoneNum,
      loginToken: wx.getStorageSync('loginToken'),
      captcha: _this.data.yzCode,
    }).then((res) => {
      if (res.data.code == 1) {
        wx.setStorageSync('scSysUser', res.data.data.scSysUser);
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        // console.log(this.data.options)
        if (this.data.sharedetails){
          let lon = wx.getStorageSync('jd')
          let latitude = lon.latitude;
          let longitude = lon.longitude;
          setTimeout(function () {
            wx.reLaunch({
              url: '../moveshopdetails/moveshopdetails?userid=' + that.data.optionsName.userid + '&videoId=' + that.data.optionsName.videoId + '&infoFollow=' + that.data.optionsName.infoFollow + '&latitude=' + latitude + '&longitude=' + longitude
            })
            
          }, 500)
          wx.removeStorageSync('sharedetails')
          wx.removeStorageSync('options')
            // ? userid = " + userid + '&videoId=' + videoId + '&infoFollow=' + infoFollow +'&sharedetails='+true,
        }else{
          setTimeout(function () {
            wx.switchTab({
              url: '../index/index'
            })
          }, 500)
        }
       
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }
    }).catch((err) => {

    })

  },
  // 手机号登录
  phoneLogin: function () {
    this.setData({
      phoneModel: true
    })
  },
  closePhonemodel: function (e) {
    console.log(e)
    // e.stopPropagation()
    this.setData({
      phoneModel: false,
      msg: '获取验证码',
    })
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e,'点击允许');
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      // wx.showLoading({ title: '登陆中，请稍候……', mask: true })
      // 根据手机号 登陆绑定/注册 智享城市app账户
      util.reqAsync('payBoot/wx/miniapp/phone', {
        loginToken: wx.getStorageSync('loginToken'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
        .then(res => {
          wx.hideLoading()
          console.log(res);
          if (res.data.code == 1) {
            console.log(res.data.data,'获取到的值');
            wx.setStorageSync('scSysUser', res.data.data.scSysUser);
          }
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          if (this.data.sharedetails) {
            let lon = wx.getStorageSync('jd')
            let latitude = lon.latitude;
            let longitude = lon.longitude;
            setTimeout(function () {
              wx.reLaunch({
                url: '../moveshopdetails/moveshopdetails?userid=' + that.data.optionsName.userid + '&videoId=' + that.data.optionsName.videoId + '&infoFollow=' + that.data.optionsName.infoFollow + '&latitude=' + latitude + '&longitude=' + longitude
              })
            }, 500)
            wx.removeStorageSync('sharedetails')
            wx.removeStorageSync('options')
          } else {
            setTimeout(function () {
              wx.switchTab({
                url: '../index/index'
              })
            }, 500)
          }
          // setTimeout(function () {
          //   wx.switchTab({
          //     url: '../index/index'
          //   })
          // }, 500)
        })
        .catch((err) => {
          wx.hideLoading()
          wx.showToast({ title: '登陆失败，请稍后再试……', icon: 'none' })
        })
    } else {
      console.log(e)
      // if (e.detail.errMsg == "getPhoneNumber:fail user deny" || e.detail.errMsg=="getPhoneNumber:cancel to bind phone"){
      // let _this = this;
      // setTimeout(function () {
      //   _this.setData({
      //     modal: true
      //   })
      // }, 500)
      // }else{
      // }  
    }
  },
  cancel: function () {
    this.setData({
      modal: false
    })
  }
})