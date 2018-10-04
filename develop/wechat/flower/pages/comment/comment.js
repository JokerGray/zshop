// pages/comment/comment.js
var app = getApp();
import util from '../../utils/util.js'
var USER_URL = {
    // GETCOMMENTLIST: 'newservice/findServiceVideoCommentList',//获取评论列表
    ADDCOMMENT: 'newservice/insertServiceVideoComment',//新增评论
  GETCOMMENTLIST: 'newservice/findServiceVideoCommentListForMe',//新的评论---获取评论列表
}

Page({
   
  /**
   * 页面的初始数据
   */
  data: {
      page: 0,
      row: 10,
      userId:'',
      commentList:[],
      bottom:false,
      params:{
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
    //下拉刷新
    startPullDownRefresh:function(){
        // util.cusStartPullDownRefreh(this, app);
    },
    onPullDownRefresh: function () {
        console.log('下拉刷新开始')
        wx.showNavigationBarLoading() //在标题栏中显示加载
        //模拟加载
        this.setData({
            bottom:false
        })
        this.getCommentList()
        setTimeout(function(){
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        },1000)
    },
    onReachBottom: function () {
        console.log("上拉加载开始")
        var that = this;
        if (this.data.commentList.length%10 != 0){
            this.setData({
                bottom:true
            })
        }else{
            that.getCommentList()
        }
    },
    onLoad: function (options) {

      //获取用户信息
      var scSysUser = wx.getStorageSync('scSysUser')
      console.log(scSysUser, '获取用户信息')
      this.setData({
        userID: scSysUser.id
      })
      this.getCommentList()
    },
    getCommentList:function(){
        var that = this;
        var params = {
            page:this.data.page,
            row:this.data.row,
          userId: this.data.userID
        }
        util.reqAsync(USER_URL.GETCOMMENTLIST, params).then(res=>{
            console.log(res)
            if (res.data.code == 1 && res.data.data.length) {
                var datas = res.data.data;
                var pages = that.data.page += 1;
                this.setData({
                    //追加数据
                    commentList: that.data.commentList.concat(datas),
                    page: pages
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})