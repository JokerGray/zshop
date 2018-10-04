// pages/shop/shopSearch/shopSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      focus: false,
      inputValue: '',
      shopList:[
          {
              title: '智创工厂',
              address:'的地址在水电费第三方',
              id:1
          },
          {
              title: '智创分公司',
              address: '的地址在水电费第三方',
              id: 2
          },
          {
              title: '智创总共',
              address: '的地址在水电费第三方',
              id: 3
          }
      ]
  },
  //清除输入框
  reset:function(){
      this.setData({
          inputValue:''
      })
  },
  //监听输入框
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    //清空输入框并返回上一页面
    cancel: function (e) {
        this.setData({
            inputValue: ''
        })
        wx.navigateBack(); 
    },
    //新增店铺地址
  newshop:function(){
    wx.navigateTo({
      url: '../newshop/newshop?'+'newShop='+false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options,'传过的数据')
    var shopNameInp = wx.getStorageSync("shopNameInp")
    this.setData({
      inputValue: shopNameInp
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
    console.log(13);
    wx.removeStorageSync("shopNameInp");
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