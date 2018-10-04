// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options,'传过来的值');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //获取input里面的值
  userNameInput:function(e){
    console.log(e,'有没有值')
    this.setData({
      userName: e.detail.value,
    })
  },
  //点击发送按钮，确定发送，搜索店名
  shopnamesend:function(res){
    console.log('传入的参数', res,this.data.userName);
    //
    wx.navigateTo({
      url: './shopSearch/shopSearch',
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