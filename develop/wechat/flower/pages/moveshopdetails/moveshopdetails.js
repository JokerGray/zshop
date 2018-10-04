import util from '../../utils/util.js'
var MOHE_URL = {
 
  MOHE_COMMENT: 'newservice/findServiceVideoCommentListByVideoId',
  GETENSHRINEVIDEO: 'newservice/findVideoEnshrineListForProgram', //收藏列表
  INSERTVIDEOFLLOW: 'newservice/insertServiceVideoFollow', //关注
  DELFOLLOW: 'newservice/deleteServiceVideoFollow', //取消关注
  CONLLECT: 'newservice/insertVideoEnshrine', //收藏视频
  DELCONLLECT: 'newservice/delVideoEnshrine', //取消收藏
  // LOOKUPSHOP: 'newservice/findVideoShopByUserId', //查看店铺
  LOOKUPSHOP: 'shop/getMercartIdShopList', // 新的查看店铺
  ADD_COMMENT: 'newservice/insertServiceVideoComment',//新增评论接口
  VIDEOFORPROGRAM:"newservice/selectServiceVideoForProgram " //视频详情接口
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoId:0,           //视频id
    userId:0,            //用户id
    longitude:0,         //经纬度
    latitude:0,
    items: [],          //视频数据
    replycomment: [],   //评论数据
    scrollTop: 0, //评论滚动的距离
    focusTrue: false, //是否聚焦
    bottomBox: true, //解决手机问题 
    bottomInput:false,  
    InpValue: '',
    LookShopItem:[],   //查看店铺
    itemsArr:[],
    latitude:30.55386,
    longitude: 114.31599
  },
  /**
  * 生命周期函数--监听页面加载
  */

  onLoad: function (options) {
    console.log('我是否会在次加载，我详情页面中的',options);
    // console.log(options,'我是传递过来的值')
    //1,一进来就判断是否登录
   
    var sharedetails = options.sharedetails=='true'?true:false
    wx.setStorageSync('sharedetails', sharedetails)
    wx.setStorageSync('options', options)
    var scSysUser = wx.getStorageSync('scSysUser');
    if (scSysUser){
      this.setData({
        UserID: scSysUser.id
      })
    }
    var that = this;
    var infoFollow;
    if (options.infoFollow !== undefined || options.infoFollow=="false"){
       infoFollow = options.infoFollow == "false" ? false : true
    }else{
      infoFollow=true
    }
    if (this.data.UserID == Number(options.userid)){
      infoFollow=false
      // console.log('我是判断当前ID 是否等于 传入ID')
    }
    this.setData({
      userId:options.userid,
      videoId: options.videoId,
      infoFollow: infoFollow,
      options: options,
      latitude: options.latitude,
      longitude: options.longitude
    })
    //获取经纬度
    // wx.getLocation({
      //   type: 'wgs84',
      //   success: function (res) {
      //     console.log('获取当前的位置', res)
      //      var latitude = res.latitude
      //      var longitude = res.longitude
      //     var speed = res.speed
      //     var accuracy = res.accuracy
      //     that.setData({
      //       latitude: latitude,
      //       longitude: longitude
      //     })
      //   }
    // })
    // console.log()
    //获取当前视频
    this.gainvideo(options);
    //获取当前评论
    this.gaincomment(options);
   
  },

  //方法获取当前视频；
  gainvideo: function (options){
    //1,获取视频
    var par = {
      "userId": this.data.UserID,   //当前用户ID
      "serviceVideoId": options.videoId,
      "longitude": this.data.longitude,
      "latitude": this.data.latitude
    }
    util.reqAsync(MOHE_URL.VIDEOFORPROGRAM, par).then(res => {
      //获取当前时间
      //
      var timestamp = new Date().getTime();
      if (res.data.code == 1) {
        console.log(res.data.data.scServiceVideo)

        var timeSpanStr = util.formatMsgTime(timestamp, res.data.data.scServiceVideo.createTime) //时间
        res.data.data.scServiceVideo.timeSpanStr = timeSpanStr;  //时间

        var distance = util.distance(res.data.data.scServiceVideo.distance, res.data.data.scServiceVideo.videoCity)   //新家
        res.data.data.scServiceVideo.distance = distance;                    //新家    
        this.data.itemsArr.push(res.data.data.scServiceVideo)
        this.setData({
          itemsArr: this.data.itemsArr
        })
      }
    })
  },  

  //获取当前评论
  gaincomment: function (options){
    //2,获取评论
    let params = {
      "page": "0",
      "userId": this.data.UserID,      //当前用户的ID
      "videoId": options.videoId,
      "row": "50"
    }
    util.reqAsync(MOHE_URL.MOHE_COMMENT, params).then(res => {
      console.log(params, 'ddd')
      if (res.data.code == 1) {
        console.log(res.data.data, '我是获取的数据');
        this.setData({
          replycomment: res.data.data,
        })
      }
    })
  },


  //点击关注
  userinfoFollowMe: function (e) {
  
    //判断是否登录
    util.checkWxLogin().then((res) => {
      var that =this;
      console.log(res,'我是proimse,这是别人的数据');
      var scSysUser = wx.getStorageSync('scSysUser');
      that.setData({
        UserID: scSysUser.id
      })
      var params = {
        "concernId": that.data.userId,   //对象ID
        "followId": 1,
        "videoId": that.data.videoId,
        "userId": that.data.UserID
      }
      var arr = that.data.itemsArr;
      if (arr[0].myConcern) {
        arr[0].myConcern = false;
        util.reqAsync(MOHE_URL.DELFOLLOW, params).then(res => {
          console.log(res, '取消成功')
        })
      } else {
        arr[0].myConcern = true;
        util.reqAsync(MOHE_URL.INSERTVIDEOFLLOW, params).then(res => {
          console.log(res, '新增成功')
        })
      }
      that.setData({
        itemsArr: arr
      })
    })

  },

  //点击查看店铺
  lookshopdiv: function (e) {
    // console.log(e)
    var that =this;
    let params = {
      page: "0",
      userId:e.currentTarget.dataset.user,
      row: "8"
    };
    //查看店铺
    util.reqAsync(MOHE_URL.LOOKUPSHOP, params).then(res => {
      if (res.data.code == 1) {
        console.log('店铺查询成功', res.data.data)
        this.setData({
          LookShopItem: res.data.data,
          showCartList: true,
          aaaa: false,
          bottomBox:false
        })
      }
    })
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  //启动动画
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },

  //关闭动画
  fadeDown: function () {
    this.animation.translateY(350).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  //灰色背景点击关闭关联店铺
  showCartList: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画
    setTimeout(function () {
      that.setData({
        showCartList: false,
        showCommentCartList: false,
        bottomBox: true
      })
    },
      720)
  },

  //点击进入店铺
  loolshopIn:function(e){
    // wx.setStorageSync('shopId', e.currentTarget.dataset.id)
   
    wx.navigateToMiniProgram({
      appId: 'wxd471bb4262ac7505',
      path: 'pages/index/index?shopId=' + e.currentTarget.dataset.id,
      extraData: {},
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) { //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo');
    // console.log(this.videoContext, '看看我都有什么值');
  },
  //点击播放
  videoPlay: function (e) {
    // console.log(e, '点击播放视频');
    // this.data.existName = e.currentTarget.dataset.id;
    this.setData({
      aaaa: true,
      curr_id: e.currentTarget.dataset.id,
    })
    // this.videoContext.play()
  },

  //点击分享
  bottomImgthree: function(e) {

  },
  //input失去焦点
  commentblur:function(){
    this.setData({
      bottomBox:true,
      bottomInput:false
    })
  },
  //评论回复
  replyComment: function (e) {
    console.log(e,'我是回复的');
    var that = this;
    util.checkWxLogin().then((res) => {
      var scSysUser = wx.getStorageSync('scSysUser');
      that.setData({
        UserID: scSysUser.id
      })
      var commentId = 0;
      if (e.currentTarget.dataset.id) {
        commentId = e.currentTarget.dataset.id
      } else {
        commentId: 0
      }
      wx.setStorageSync('replyC', e.currentTarget.dataset.reply);
      that.setData({
        bottomBox: false,
        scrollTop: 250,
        focusTrue: true,
        bottomInput: true,
        commentId: commentId
      })
    })
  },
  //点击完成触发 发送评论
  bindOnclick: function (e) {
    var replyC = wx.getStorageSync('replyC')
    // console.log(this.data.item,'我是要的什么值')
    // console.log(replyC,'我是几')
    //判断如果返回的是1,那么就是回复
    if (replyC == 1) {
      // console.log('我是回复')
      var paramsReply = {
        "userId": this.data.UserID,  //当前评论的用户id, 必填
        "type": 1,  //类型0评论1回复，必填
        "videoId": this.data.videoId, //视频Id，必填
        "commentId": this.data.commentId, // type = 1时必填,对象的id
        "commentcontent": e.detail.value//必填
      }
      // console.log(paramsReply, '回复数据')
      util.reqAsync(MOHE_URL.ADD_COMMENT, paramsReply).then(res => {
        // console.log(res.data.code, '新增评论')
        if (res.data.code == 1) {
          // console.log(res.data.data, '我是评论成功')
          // console.log('视频新增成功')
          // replycomment:res.data.data
          var paramsComment = {
            page: 0,
            userId: this.data.UserID,
            videoId: this.data.videoId,
            row: 50
          };
          //查看评论
          util.reqAsync(MOHE_URL.MOHE_COMMENT, paramsComment).then(res => {
            // console.log(res.data.data)
            if (res.data.code == 1) {
              this.setData({
                replycomment: res.data.data,
                commentlength: res.data.data.length,
                scrollTopComment: 0,
                inputReply: ''
              })
              wx.removeStorageSync('replyC')
            }
          })
        }
      })
    } else {

      // 获取头像
      var params = {
        "userId": this.data.UserID, //用户id, 必填
        "type": 0, //类型0评论1回复，必填
        "videoId": this.data.videoId, //视频Id，必填
        // "commentId": "587", //回复Id，type = 1时必填,对象的id
        "commentcontent": e.detail.value //必填
      }
      console.log(params)
      util.reqAsync(MOHE_URL.ADD_COMMENT, params).then(res => {
        // console.log(res.data.code, '新增评论')
        if (res.data.code == 1) {
          // console.log('视频新增成功')
          // replycomment:res.data.data
          var paramsComment = {
            page: 0,
            userId: this.data.UserID,
            videoId: this.data.videoId,
            row: 8
          };
          //查看评论
          util.reqAsync(MOHE_URL.MOHE_COMMENT, paramsComment).then(res => {
            // console.log(res.data.data)
            if (res.data.code == 1) {
              this.setData({
                replycomment: res.data.data,
                commentlength: res.data.data.length,
                scrollTopComment: 0,
                inputReply: ''
              })
            }
          })
        }
      })
    }

  },
  // 点击后，进入 店铺 详情
  onShopdetails: function (e) {
    console.log(e.currentTarget.dataset.item, 1);
    wx.setStorageSync('itemShopdetails', e.currentTarget.dataset.item)
   
    if (this.data.LookShopItem[e.currentTarget.dataset.index].address == null) {
      wx.showToast({
        title: '该店铺已经下线',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.navigateTo({
        url: '../shopdetails/shopdetails'
      })
    }
  },

  //收藏
  collectA: function () {
    var that = this;
    util.checkWxLogin().then((res) => {
      var scSysUser = wx.getStorageSync('scSysUser');
      that.setData({
        UserID: scSysUser.id
      })
      var arr = that.data.itemsArr;
      let collect = arr[0].collection;
      let userId = that.data.UserID;
      let serviceVideoIds = arr[0].id;
      //取消收藏
      if (collect) {
        arr[0].collection = false
        let params = {
          userId: userId,
          serviceVideoIds: [serviceVideoIds]
        }
        //取消收藏
        util.reqAsync(MOHE_URL.DELCONLLECT, params).then(res => {
          console.log(res, '取消收藏成功')
        })
      } else {
        let params = {
          userId: userId,
          serviceVideoId: serviceVideoIds,
          //   concernId: e.target.dataset.userid
        }
        arr[0].collection = true
        //新增收藏
        util.reqAsync(MOHE_URL.CONLLECT, params).then(res => {
          console.log(res, '新增收藏成功')
        })
      }
      that.setData({
        itemsArr: arr
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  onPullDownRefresh: function() {
    
    //获取当前视频
    // this.gainvideo(this.data.options);
    //获取当前评论
    // this.gaincomment(this.data.options);
    // setTimeout(function () {
    //   // complete
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    // console.log(this.data.userId);
    // console.log(this.data.videoId)
    // console.log(this.data.itemsArr[0],'123');
    let lon = wx.getStorageSync('jd')
    let latitude = lon.latitude;
    let longitude = lon.longitude;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log()
    }
    return {
      title: '更多精彩视频尽在[' + this.data.itemsArr[0].userName+ ']的个人主页' + '点击查看！',
      path: "pages/moveshopdetails/moveshopdetails?userId=" + this.data.UserID + '&videoId=' + this.data.videoId + '&sharedetails=' + true + '&latitude=' + latitude + '&longitude=' + longitude,
      imageUrl: this.data.itemsArr[0].coverUrl,
      success: function (res) { }
    }
  }
})