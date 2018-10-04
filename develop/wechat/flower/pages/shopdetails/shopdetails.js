Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = wx.getStorageSync('itemShopdetails')
    this.setData({
      item:item
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  //点击后拨打电话
  bindtal:function(res){
    console.log('查看拨打电话',res);
    wx.makePhoneCall({
      phoneNumber: this.data.item.phoneService //仅为示例，并非真实的电话号码
    })
  },
  bindmap:function(res){
    console.log('查看地图，导航地图',this.data.item);
    //在这个地方判断，用户授权是否过期
    //请求当前经纬度
    // wx.getLocation({
    //   type:'wgs84',
    //   success: function(res) {
    //     console.log(res,'看看我的内容');
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     var speed = res.speed;
    //     var accuracy = res.accuracy;
    //     // console.log(latitude, latitude);
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       scale: 18,
    //       name:'13224654646546'
    //     })
    //   }
    // })
    wx.openLocation({
      latitude: this.data.item.latitude,
      longitude: this.data.item.longitude,
      scale: 12,
      address: this.data.item.address
    })


  },
  loolshopIn: function () {
  //  var shopId =  wx.getStorageSync('shopId')
    wx.navigateToMiniProgram({
      appId: 'wxd471bb4262ac7505',
      path: 'pages/index/index?shopId=' +this.data.item.id,
      extraData: {},
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
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