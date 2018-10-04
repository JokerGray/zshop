// pages/shop/addMedia/addMedia.js
import util from '../../../utils/util.js'
var Parser = require('../../../lib/dom-parser')
import QQMapWX from '../../../utils/qqmap-wx-jssdk.min.js'
var USER_URL = {
  OSS: 'https://wxappprod.izxcs.com/zxcity_restful/ws/oss/ossUpload',
  ADDMEDIA: 'newservice/insertServiceVideo', //新增视频
  NEWADDMEDIA:'newservice/insertServiceVideoNew'  // 新的新增视频接口
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopComment:[],
    showShop:false,
    userName:'',
    showAddshop: false,
    textarea: '',
    isGohome: 1,
    isGoshop: 1,
    isPartner: 1,
    url: '',
    status: false,
    height: '100%',
    width: '100%',
    userId: 0,
    longitude:'',   //经纬度
    latitude:'',    //经纬度
    percent:100 ,    //进度条
    disabled:true,   //控制发布按钮
    falg:false
  },

  navigateToAll: function(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  //关闭模态框
  showAddshop:function(){
    this.setData({
      showAddshop:false,
      shopChecked:false,
    })
  },
  //获取input里面的值
  userNameInput: function (e) {
    console.log(e, '有没有值')
    this.setData({
      userName: e.detail.value,
    })
  },
  //点击确定，发布商店的信息
  shopnamesend: function(res) {
      var judge = util.validStringType(this.data.userName, 'string-number-hanzi')
      if(this.data.userName.length==0){
        wx.showToast({
          title: '店铺名称不能为空',
          icon: 'none',
          duration: 1000
        })
      } else if (judge==false){
        wx.showToast({
          title: '不能包含特殊字符',
          icon: 'none',
          duration: 1000
        })
      }else{
        wx.setStorageSync("shopNameInp", this.data.userName)
        wx.navigateTo({
          url: '/pages/shop/shopSearch/shopSearch',
        })
      }
  },
  //点击发送，给视频页，
  sendShopVideo:function(){
    // console.log(123);
    this.setData({
      showShop:false,
      shopChecked:true
    })
  },
  //添加信息关闭模态框
  showCartList:function(){
    wx.removeStorageSync('showShop')
    // wx.removeStorageSync('shopNameInp')
    // wx.removeStorageSync('shopComment')
    this.setData({
      showShop:false
    })
  },
  //点击商店信息，发送到详情页面
  sendDetail: function (res) {
    // console.log('当前的信息，发送到详情页')
    // //如果想要把数据传递给下个页面，直接加到路径里面，就可以了
    // wx.navigateTo({
    //   url: '../addMedia/addMedia?' + this.data.addressName + this.data.showShop
    // })
  },
  //点击小三角关闭
  closenewshop: function () {
    this.setData({
      showShop: false
    })
  },
  //点击添加新的店铺
  newaddshop: function () {
    wx.navigateTo({
      url: '../../shop/newshop/newshop?'+'newshop='+true,
    })
  },
  //是否到店，是否找店，目前都是默认值
 
  // 当小程序初始化完成时，会触发onlaunch（全局触发一次）
  onlaunch:function(){
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取用户信息
    var scSysUser = wx.getStorageSync('scSysUser')
    console.log(scSysUser, '获取用户信息')
    this.setData({
      userID: scSysUser.id
    })

    //判断传入的参数，确实是点击的那个事件
    if (options.showShop !== undefined ){
      var flag = options.showShop === "true" ? true : false;
      // let showShop = wx.getStorageSync('showShop');
      let shopComment = wx.getStorageSync('shopComment');
      this.setData({
        showShop: flag,
        shopComment: shopComment
      })
    }

    //获取经纬度
    var lon = wx.getStorageSync('jd')
    this.setData({
      longitude:lon.longitude,
      latitude:lon.latitude
    })

    wx.request({
      url: "https://pv.sohu.com/cityjson?ie=utf-8",
      header: {
        'content-type': 'application/json',
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // console.log(res.data);
        //城市 //省份 videoProvince 省 videoCity 市 releaseAddress 地区
        //省
        var releaseAddress = res.data.split('"cname":')[1];
        releaseAddress = releaseAddress.substring(0, releaseAddress.length - 2)
        releaseAddress = releaseAddress.slice(2, releaseAddress.length - 1)
       
        if (releaseAddress =='CHINA'){
          that.setData({
            releaseAddress: '中国',
            releaseProvince: 0,
            releaseCity: 0
          })
        }else{
          //地区
          var releaseProvince = res.data.split('"cid":')[1];
          releaseProvince = releaseProvince.slice(2, 4)
          //市
          var releaseCity = res.data.split('"cid":')[1];
          releaseCity = releaseCity.slice(2, 6)
          that.setData({
            releaseAddress: releaseAddress,
            releaseProvince: releaseProvince,
            releaseCity: releaseCity
          })
        }

        console.log(releaseAddress, that.data.releaseProvince, that.data.releaseCity)
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('prew_video');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var qqmapsdk;
    // 实例化腾讯地图API核心类
    // qqmapsdk = new QQMapWX({
    //   key: 'WG5BZ-V6BCD-3QW4K-PMPIZ-PYKCF-X5FL5'//此处使用你自己申请的key
    // });
    // 腾讯地图调用接口
    // 调用接口
    // qqmapsdk.reverseGeocoder({
      //   location: {
      //     latitude: that.data.latitude,
      //     longitude: that.data.longitude
      //   },
      //   success: function (res) {
      //     if(res.status==0){
      //       console.log(res, '123');
      //       console.log(res.result.address_component.city);  //城市
      //       console.log(res.result.address_component.province); //武昌区
      //       console.log(res.result.address);  //中山路

      //       that.setData({
      //         releaseAddress: res.result.address,
      //         videoCity: res.result.address_component.city,
      //         videoProvince: res.result.address_component.province
      //       })


      //       // 省名称  videoProvince
      //       // 市名称  videoCity
      //       // 地址  releaseAddress =（省 + 市 + 区 + 街道号码
      //     }
      //   },
      //   fail: function (res) {
          
      //   },
      //   // complete: function (res) {
      //   //   console.log(res);
      //   // }
    // <script src="https://pv.sohu.com/cityjson?ie=utf-8" > </script>
    // });
    //获取当前的城市坐标
  

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function() {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {

  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getMinutes: function(times) {
    //将秒转换为分秒
    return Math.floor(times / 60) + ":" + (times % 60 / 100).toFixed(2).slice(-2)
  },
  chooseVideo: function(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url;
    var that = this;
    if (!url) {
      //选择视频
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: ['front', 'back'],
        success: function(res) {
          console.log('上传图片开始', res)

          that.setData({
            src: res.tempFilePath,
            url: '../mediaPreview/mediaPreview?width=' + res.width + '&height=' + res.height + '&src=' + res.tempFilePath,
            status: true,
            videoWidth: res.width,
            videoHeight: res.height,
            duration: that.getMinutes(res.duration)
          })

          if (res.height > res.width) {
            that.setData({
              // height: res.height / (750 / res.width) / 2 + 'rpx',
            })
          } else {
          }
          console.log('上传图片结束',that.data)
          console.log('上传图片结束', that.data.src, '哈哈哈哈哈哈哈哈哈哈')
          wx.showLoading({
            title: '正在上传请稍后',
            mask:true
          })
          that.oss();
        }
      })
    } else {
      //预览
      var videoContext = this.videoContext;
      // videoContext.seek(0);
      videoContext.stop();
      // videoContext.play();
      // videoContext.requestFullScreen();

      wx.navigateTo({
        url: url
      })
    }
  },
  bindTextAreaBlur: function(e) { //绑定描述输入信息
    this.setData({
      textarea: e.detail.value
    })
  },
  oss: function() {
    var _this = this;
    wx.request({
      url: USER_URL.OSS,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: res => {
        console.log(res);
        if (res.statusCode == 200) {
          _this.setData({
            accessid: res.data.accessid,
            policy: res.data.policy,
            signature: res.data.signature,
            uploadUrl: res.data.host,
            uploadUrlend: res.data.dir,
            expire: res.data.expire
          })
          _this.uploadAli()
        }
      }
    })
  }, //上传照片(阿里云)
  uploadAli: function() {
    var _this = this;
    var datas = this.data;
    var uploadKey = datas.uploadUrlend + '/' + datas.src.replace('wxfile://', '')
    wx.uploadFile({
      url: datas.uploadUrl,
      filePath: datas.src,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
      },
      formData: {
        'key': uploadKey,
        'policy': datas.policy,
        'OSSAccessKeyId': datas.accessid,
        'success_action_status': '201', //让服务端返回200,不然，默认会返回204
        'signature': datas.signature
      },
      success: res => {
        console.log('oss成功', res)
        if (res.statusCode == 201) {
          console.log('oss结束', res)
          var XMLParser = new Parser.DOMParser()
          var doc = XMLParser.parseFromString(res.data)
          var a = doc.getElementsByTagName('Location')['0'];
          // console.log(a.firstChild.nodeValue,'12346579854632132131321')
          _this.setData({
            srcoss: a.firstChild.nodeValue,
            percentNum:100
          })
          // console.log(_this.data);
          // console.log(1)
          //表示上传成功(可以在阿里云服务器查看上传的图片)
          if (_this.data.srcoss !== undefined) {
            _this.setData({
              disabled: false
            })
            wx.hideLoading();
          }
        }
      },
      fail: res => {
        console.log('oss失败', res)
      },
      complete: res => {
        console.log('oss完成失败的', res)
        // console.log(2)
      }
    })
  },
  //发布按钮
  release: function(e) {
    //节流阀
    if(this.data.falg){
      console.log(123);
      return false;
    }

    console.log('发布开始')
    var _this = this;
    var datas = this.data;
   
    // new新接口
    var newParams = {
      "videoIntroduce": datas.textarea,
      "coverUrl": datas.srcoss + '?x-oss-process=video/snapshot,t_0,f_png,w_0,h_0,m_fast',          // 封面
      "isPartner": "1",          //是否合作
      "videoUrl": datas.srcoss,         //视频地址
      "userId": this.data.userID,          //用户id
      "isGohome": "1",        //是否到家服务
      "videoHeight": datas.videoHeight || 100, //视频高度
      "videoWidth": datas.videoWidth || 200,       // 宽度
      "longitude": this.data.longitude,   //纬度
      "latitude": this.data.latitude,     //经度
      "isShowShop": "1" ,    ///是否关联云店0否1是
      // 'videoProvince': this.data.videoProvince,   //省
      // 'videoCity': this.data.videoCity,     //市
      'releaseAddress':this.data.releaseAddress,   //地区
      'releaseProvince': this.data.releaseProvince,
      'releaseCity': this.data.releaseCity    
    }
    console.log(newParams,'传送的数据')

    if (newParams.videoUrl == undefined && this.data.percentNum!== 100){
      wx.showToast({
        title: '发布失败',
        icon: 'success',
      })
    }else{
      util.reqAsync(USER_URL.NEWADDMEDIA, newParams).then(res => {
        console.log(newParams, '查看接口传入数据')
        if (res.data.code == 1) {
          console.log(res, '返回的数据')
          wx.showToast({
            title: '恭喜您发布成功',
            icon: 'success',
          })
          this.data.falg=true
          wx.switchTab({
              url: '../../index/index',
          })
        }
      })
    }
  },
})