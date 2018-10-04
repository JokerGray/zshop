// pages/shop/newshop/newshop.js
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressNameI:'东沙大厦',
    showShop: false,
    addressName:'湖北省武汉市武昌区中北路122号',
    userNameShop:'',
    useraddShop:'',
    shopComment:[],
    shopObj:{},
    newShop:false
  },
  //点击按钮获取，地图地址
  bindmap:function(){
    console.log('调用地图获取当前的位置名称');
    var that = this;
    //获取当前的地理位置、速度
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res,'地图')
        var latitude = res.latitude
        var longitude = res.longitude
        // 打开地图选择位置。
        wx.chooseLocation({
          success: function (res) {
            console.log(res,'zui')
            console.log(res.address);
            var namej = res.address;
            var nameI =res.name;
            that.setData({
              addressName:namej,
              addressNameI:nameI
            })
          }
        })
      }
    })
  },
  //获取店铺名称的名字
  userNameShop:function(e){
    console.log('我是名字')
    this.setData({
      userNameShop: e.detail.value
    })
  },
  //获取店铺的详细地址
  useraddShop:function(e){
    console.log('我是店铺',e);
    this.setData({
      useraddShop: e.detail.value
    })
  },
  //点击确定，添加新的店铺
  confirmShop:function(e){
    var judgeShop = util.validStringType(this.data.useraddShop, 'string-number-hanzi')  //店铺
    var judgeName = util.validStringType(this.data.userNameShop, 'string-number-hanzi')  //名字
    
    if (this.data.useraddShop.length<=0){
      wx.showToast({
        title: '店铺名称不能为空',
        icon: 'none',
        duration: 1000
      })
    } else if (this.data.userNameShop.length <= 0){
      wx.showToast({
        title: '店铺地址不能为空',
        icon: 'none',
        duration: 1000
      })
    }else if(judgeName==false&&judgeShop==false){
      wx.showToast({
        title: '不能包含特殊字符',
        icon: 'none',
        duration: 1000
      })
    }else{
      var that = this;
      // wx.setStorageSync("useraddShop", this.data.useraddShop);
      // wx.setStorageSync("userNameShop", this.data.addressName + this.data.userNameShop);
      // console.log(this.data.addressName);
      let newshop = that.data.newShop;
      console.log(newshop);
      var flag = newshop === "false" ? false : true;
      // var flag = newshop === "true" ? true : false;
      if (flag){
        let shopComment = wx.getStorageSync('shopComment')
        that.data.shopObj.useraddShop = that.data.useraddShop;
        that.data.shopObj.userNameShop = that.data.addressName + that.data.userNameShop;
        shopComment.push(that.data.shopObj)
        wx.setStorageSync('shopComment', shopComment) 
        wx.navigateTo({
          url: '/pages/shop/addMedia/addMedia?' + 'showShop='+true, 
        success:function(){
          wx.setStorageSync('showShop', true)
          wx.setStorageSync('shopComment', shopComment)
        }
      })
      }else{
        let shopComment =[];
        that.data.shopObj.useraddShop = that.data.useraddShop;
        that.data.shopObj.userNameShop = that.data.addressName + that.data.userNameShop;
        console.log(that.data.shopObj)
        shopComment = shopComment.concat(that.data.shopObj)
        console.log(shopComment)
        wx.setStorageSync('shopComment',shopComment)
        wx.navigateTo({
        url: '/pages/shop/addMedia/addMedia?'+'showShop='+ true, 
        success:function(){
          // wx.setStorageSync('showShop', true)
          wx.setStorageSync('shopComment', shopComment)
        }
      })
        console.log('测试')
      }

      // wx.navigateTo({
      //   url: '/pages/shop/addMedia/addMedia', 
      //   success:function(){
      //     wx.setStorageSync('showShop', true)
      //     wx.setStorageSync('shopComment', that.data.shopComment)
      //   }
      // })
    }
  },
  //点击小三角关闭
  closenewshop:function(){
    this.setData({
      showShop: false
    })
  },
  //点击添加新的店铺
  // newaddshop:function(){
  //   wx.navigateTo({
  //    url: '../../shop/newshop/newshop',
  //   })
  // },
  //点击后面的黑框关闭
  // showCartList:function(){
  //   console.log(123);
  //   this.setData({
  //     showShop:false
  //   })
  // },
  // //点击商店信息，发送到详情页面
  // sendDetail:function(res){
  //   console.log('当前的信息，发送到详情页')
  //   //如果想要把数据传递给下个页面，直接加到路径里面，就可以了
  //   wx.navigateTo({
  //     url: '../addMedia/addMedia?' +this.data.addressName +this.data.showShop
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options,'ddddddddddddddddddddddddd');
    console.log(options.newShop)
    that.data.newShop = options.newShop;
    // console.log(that.data.newshop);
    //获取当前的地理位置、速度
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res, '地图')
        var latitude = res.latitude
        var longitude = res.longitude
        // 打开地图选择位置。
        // wx.chooseLocation({
        //   success: function (res) {
        //     // console.log(res,'zui')
        //     // console.log(res.address);
        //     var namej = res.address;
        //     that.setData({
        //       addressName: namej
        //     })
        //   }
        // })
      }
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      userNameShop:'',
      useraddShop:''
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})