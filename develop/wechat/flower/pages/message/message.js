// pages/message/message.js
import util from '../../utils/util.js'
// import indexJson from './index.json'
var USER_URL = {
    GETCOMMENTLIST: 'newservice/findServiceVideoCommentList',//获取评论列表
    ADDCOMMENT: 'newservice/insertServiceVideoComment',//新增评论
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //绑定点击事件
    navigateToAll: function (e) {
        let url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var params ={
          page: "0",
          userId: "587",
          row: 1
      }
    //   addComment()
    var that = this;
      getCommentList(params).then((res) =>{
          if (res.data.code == 1 && res.data.data.length) {
              var datas = res.data.data
              that.setData({
                  commentList: datas[0]
              })
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
    //下拉刷新
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading() //在标题栏中显示加载
        //模拟加载
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1000);
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
function getCommentList(params){
    return util.reqAsync(USER_URL.GETCOMMENTLIST,params)
}
function addComment(){
   
    var params ={
        "videoId": "47",
        "userId": "587",
        "type": "0",
        "commentcontent": "评论内容"
    }
    console.log('新增评论', JSON.stringify(params), 'cmd', USER_URL.ADDCOMMENT)
    return util.reqAsync(USER_URL.ADDCOMMENT, params)
}