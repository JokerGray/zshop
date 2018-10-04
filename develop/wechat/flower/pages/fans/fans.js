
// pages/fans/fans.js
import util from '../../utils/util.js'
var USER_URL={
    GETFOLLOWLIST:'newservice/findServiceVideoFollowListForFollow',//获取关注列表
  GETFANSLIST:'newservice/findServiceVideoFollowListForFans',//获取粉丝列表
  DELFOLLOW: 'newservice/deleteServiceVideoFollow', //取消关注
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userID: 0,
      page: 0,
      row: 20,
      commentList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //获取关注列表
getFollowList: function(type){
     var that = this;
     var params = {
       userId: type.userID,
      //  queryUserId: this.data.userID,
        page: this.data.page,
        row: this.data.row,
     }
  if (type.type == 1){
         //获取关注列表
         util.reqAsync(USER_URL.GETFOLLOWLIST, params).then(res => {
             if (res.data.code == 1 && res.data.data.length) {
                 console.log(res)
                //  var datas = res.data.data;
                //  var pages = that.data.page += 1;
                 that.setData({
                   commentList: res.data.data
                     //追加数据
                    //  commentList: that.data.commentList.concat(datas),
                    //  page: pages
                 })
             }
         })
     }else{
         //获取粉丝列表
         util.reqAsync(USER_URL.GETFANSLIST, params).then(res => {

           if(res.data.code==1){
             this.setData({
               commentList:res.data.data
             })
           }
         })
     }
  },
    
  onLoad: function (options) {
    // console.log(options,'123');
      wx.setNavigationBarTitle({
          title: options.name
      })
      this.getFollowList(options);
  },

  //userinfoFollowMe 关注列表，已经关注，只有取消关注
  userinfoFollowMe:function(){
    
    console.log('我是点击的了关注')

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