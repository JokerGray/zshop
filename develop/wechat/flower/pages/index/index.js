//index.js
import util from '../../utils/util.js'
var MOHE_URL = {
  QUERYVIDEO: 'newservice/findNewServiceVideoListForProgram', //首页数据查询
  MOHE_COMMENT: 'newservice/findServiceVideoCommentListByVideoId',//视频id评论查询列表接口
  GETENSHRINEVIDEO: 'newservice/findVideoEnshrineListForProgram', //收藏列表
  INSERTVIDEOFLLOW: 'newservice/insertServiceVideoFollow', //关注
  DELFOLLOW: 'newservice/deleteServiceVideoFollow', //取消关注
  CONLLECT: 'newservice/insertVideoEnshrine', //收藏视频
  DELCONLLECT: 'newservice/delVideoEnshrine', //取消收藏
  ADD_COMMENT: 'newservice/insertServiceVideoComment', //新增评论接口
  LOOKUPSHOP: 'shop/getMercartIdShopList' // 新的查看店铺
}
//获取应用实例
const app = getApp()
Page({
  data: {
    page: 0,
    bottom: false, //底部加载
    scrollTop: 100, //滚动的初始值
    commentlength: 0, //弹出框保存的条数
    aaaa: true, //视频图片的框框
    existName: 0, //查看详情 ？？？
    userName: '', //发布商品input 的除拾值
    showAddshop: false, //发布视频
    showCommentCartList: false, //评论
    showCartList: false, //查看店铺
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [],        //整个内容的数组
    replycomment: [], //回复评论
    LookShopItem: [], //查看店铺
    sharedateilsArr: [], //分享 
    animationData: '', //动画
    animationComment:'', //评论动画
    scrolltopHeight:300,        //存储的字，滚动的高度计算高度
    idx:1,
    UserID:0,       //用户最终的ID   
    infoFollow:true,
    homepage:1 ,  //每次请求的数据，首页数据 
  },
  onLoad: function(e) {
    // console.log('在次跳转到页面会不会刷新页面');
    util.checkWxLogin().then((res) => {
      // var scSysUser = wx.getStorageSync('scSysUser');
      // this.setData({
      //   UserID: scSysUser.id
      // })
      // //首页视频查询加载
      // // this.getUpVideo(this.data.page);
      // this.getUpVideo();
      var scSysUser = wx.getStorageSync('scSysUser');
      this.setData({
        UserID: scSysUser.id
      })
    })

    // this.getVideoComment(this.data.homepage);
   
    //请求
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 1000)
  },
  onShow: function () {
    var that = this;
   
    setTimeout(function(){
      that.getUpVideo();
    },1000)
    
  },
  //点击头像进入个人中心
  bindViewTap: function(e) {
    var onselfUserId = e.currentTarget.dataset.userid;
    var onselfId = e.currentTarget.dataset.id;
    var myConcern = e.currentTarget.dataset.myconcern;
    wx.navigateTo({
      url: '../interest/interest?userId=' + onselfUserId + '&' + 'onselfId=' + onselfId + '&' + 'myConcern=' + myConcern
    })
  },
  //点击完成触发 发送评论
  bindOnclick: function(e) {

    var replyC = wx.getStorageSync('replyC')
    var itemreply = wx.getStorageSync('itemreply')
    console.log(itemreply,'我是什么ID')
    //判断如果返回的是1,那么就是回复
    if(replyC==1){
      console.log('我是回复')
      var paramsReply = {
        "userId": this.data.UserID,  //用户id, 必填
        "type": 1,  //类型0评论1回复，必填
        "videoId": itemreply.videoId, //视频Id，必填
        "commentId": itemreply.id, //回复Id，type = 1时必填
        "commentcontent": e.detail.value//必填
      }
      console.log(paramsReply,'回复数据')
      util.reqAsync(MOHE_URL.ADD_COMMENT, paramsReply).then(res => {
        // console.log(res.data.code, '新增评论')
        if (res.data.code == 1) {
          console.log(res.data.data,'我是评论成功')
          // console.log('视频新增成功')
          // replycomment:res.data.data
          var paramsComment = {
            page: 0,
            userId: itemreply.userId,
            videoId: itemreply.videoId,
            row: 50
          };
          //查看评论
          util.reqAsync(MOHE_URL.MOHE_COMMENT, paramsComment).then(res => {
            console.log(res.data.data,'我是回复后来的数据')
            if (res.data.code == 1) {
              this.setData({
                replycomment: res.data.data,
                commentlength: res.data.data.length,
                scrollTopComment: 0,
                inputReply: ''
              })
              wx.removeStorageSync('replyC')
            }
            // console.log(this.data.replycomment, '查看评论数据')
          })
        }
      })

    }else{

      // 获取头像
      //获取时间戳
      var videoId = wx.getStorageSync('userIdIndex'); // 视频id
      var userId = wx.getStorageSync('videoIdIndex'); //用户id
      var params = {
        "userId": this.data.UserID, //用户id, 必填
        "type": 0, //类型0评论1回复，必填
        "videoId": videoId, //视频Id，必填
        // "commentId": "587", //回复Id，type = 1时必填,对象的id
        "commentcontent": e.detail.value //必填
      }
      // console.log(params)
      util.reqAsync(MOHE_URL.ADD_COMMENT, params).then(res => {
        if (res.data.code == 1) {
          var paramsComment = {
            page: 0,
            userId: userId,
            videoId: videoId,
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
            }
          })
        }
      })
    }

  },
  
  //滚轮滑动
  scroll: function(e) {   
  },
  onPageScroll: function(e) { // 获取滚动条当前位置
   
    // var heigihtListAll;
    // var widthList =0 , heigihtList=0,k=0,j=0 ,z=0;

    // if (this.data.items.length>0){
    //   for (var i = 0; i < this.data.idx; i++) {

    //     if (this.data.items[i].videoWidth >= 960) {
    //       j++
    //     }
    //     if (this.data.items[i].videoHeight >= 960) {
    //       k++
    //     }
    //     if (this.data.items[i].videoWidth < 960 && this.data.items[i].videoHeight < 960) {
    //       z++
    //     }
    //   }
    //   heigihtListAll = j * 420 + k * 620 + z * 420
    // }
   
    // console.log(j,k);
    // console.log(heigihtListAll,'我的值');
    // console.log(e.scrollTop,'我是值')r
    // console.log(heigihtListAll)
    // console.log(k,j,z)
    // console.log(this.data.items.length)
    // console.log(this.data.idx)
    // if ((e.scrollTop) > heigihtListAll) {
    //       // console.log(123)
    //       this.setData({
    //         aaaa: false
    //       })
    // }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
 //点几空白进入视频详情
  userDetailed:function(e){
    // console.log(e,'急急急')
    let userid = e.currentTarget.dataset.userid;
    let videoId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let infoFollow = this.data.items[index].infoFollow;

    let lon = wx.getStorageSync('jd')
    let latitude = lon.latitude;
    let longitude = lon.longitude;

    // console.log(userid,'我是点击空白的地方')
    wx.navigateTo({
      url: "../moveshopdetails/moveshopdetails?userid=" + userid + '&videoId=' + videoId + '&infoFollow=' + infoFollow + '&latitude=' + latitude + '&longitude=' + longitude
    })
  },

  //点击 已关注
  userinfoFollowMe: function(e) {
    var that = this;
    console.log(e, '我是关注')
    let userId = this.data.UserID; // 自己ID
    let videoId = e.currentTarget.dataset.id; //视频ID
    let concernId = e.currentTarget.dataset.userid;     //（对象ID）ID 他人ID  
    let params = {}
    var arr = this.data.items;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == e.target.dataset.id) {
        if (arr[i].myConcern) {
          params = {
            "followId": 1, //主键Id，必填
            "userId": userId, //用户Id，必填
            "videoId": videoId,  //视频Id，必填
            "concernId": concernId //对象Id，必填
          }
          util.reqAsync(MOHE_URL.DELFOLLOW, params).then(res => {
             if(res.data.code==1){
               var listData = that.data.items;
               for (var i = 0; i < listData.length; i++) {
                 if (concernId == listData[i].userId) {
                   listData[i].myConcern = false;
                 }
               }
               that.setData({
                 items: listData
               })
             }else{
               wx.showToast({
                 title: '关注失败',
               })
             }
          })
        } else {
          params = {
            userId: userId,
            videoId: videoId,
            concernId: concernId,
            followObligate: "test"
          }
          //新增关注
          util.reqAsync(MOHE_URL.INSERTVIDEOFLLOW, params).then(res => {

            if(res.data.code==1){
              var listData = that.data.items;
              for (var i = 0; i < listData.length; i++) {
                if (concernId == listData[i].userId) {
                  listData[i].myConcern = true;
                }
              }
              that.setData({
                items: listData
              })
            }else{
              wx.showToast({
                title: '关注失败',
              })
            }
          })
        }
        break
      }
    }
    this.setData({
      items: arr
    })
  },
  //点击评论
  collectComment: function(e) {
    wx.removeStorageSync('replyC')
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)

    var userId = e.currentTarget.dataset.id; // 视频id
    var videoId = e.currentTarget.dataset.userid; //用户id 用户id
    wx.setStorageSync('userIdIndex', userId) //视频id
    wx.setStorageSync('videoIdIndex', videoId)
    var params = {
      page: 0,
      userId: videoId, //用户id
      videoId: userId, //视频id
      row: 50
    };
    util.reqAsync(MOHE_URL.MOHE_COMMENT, params).then(res => {
      // console.log(params, 'ddd')
      if (res.data.code == 1) {
        this.setData({
          replycomment: res.data.data,
          commentlength: res.data.data.length,
          showCommentCartList: true,
          aaaa: false,
          focusReply:false
        })
      }
    })
  },
  //评论回复
  replyComment: function(e) {
    // console.log(e);
    wx.setStorageSync('replyC', e.currentTarget.dataset.reply);
    wx.setStorageSync('itemreply', e.currentTarget.dataset.itemreply);
    // console.log(this.);
    this.setData({
      focusReply: true,
      scrollTopComment:10000
    })

  },
  //最终的收藏
  collectA: function(e) {
    console.log(e, '我是收藏');
    var that = this;
    // let userId = e.currentTarget.dataset.userid;
    let userId = this.data.UserID;
    let serviceVideoIds = e.currentTarget.dataset.id;
    var arr = this.data.items;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == serviceVideoIds) {
        if (arr[i].collection) {
          var params = {
            // userId: e.currentTarget.dataset.userid,
            // serviceVideoIds: [serviceVideoIds],
            // queryUserId: userId

            userId: userId,
            serviceVideoIds: [serviceVideoIds],
            // queryUserId: e.currentTarget.dataset.userid
            //   concernId: e.target.dataset.userid
          }
          // arr[i].collection = false;
          //   DELCONLLECT 取消收藏
          //取消收藏
          util.reqAsync(MOHE_URL.DELCONLLECT, params).then(res => {
            // console.log(res, '取消收藏成功')
            if (res.data.code == 1) {

              var listData = that.data.items;
              for (var i = 0; i < listData.length; i++) {
                if (e.target.dataset.id == listData[i].id) {
                  listData[i].collection = false;
                }
              }
              that.setData({
                items: listData
              })
            } else {
              wx.showToast({
                title: '关注失败',
              })
            }
          })
        } else {
          var params = {
  
            serviceVideoId: serviceVideoIds,
            userId: userId
            // serviceVideoIds: [serviceVideoIds],
          }
          // arr[i].collection = true;
          //新增收藏
          util.reqAsync(MOHE_URL.CONLLECT, params).then(res => {
            // console.log(res, '新增收藏成功')
            if (res.data.code == 1) {
              var listData = that.data.items;
              for (var i = 0; i < listData.length; i++) {
                if (e.target.dataset.id == listData[i].id) {
                  listData[i].collection = true;
                }
              }
              that.setData({
                items: listData
              })
            } else {
              wx.showToast({
                title: '关注失败',
              })
            }

          })
        }
        break
      }
    }
    this.setData({
      items: arr
    })
  },
  //启动动画
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  //点击查看店铺详情
  lookshopdiv: function(e) {
    var that = this;
    var paramsLookShop = {
      page: "0",
      userId: e.currentTarget.dataset.userid,
      row: "8"
    };
    wx.setStorageSync('lookShop', e.currentTarget.dataset.userid)
    //查看店铺
    util.reqAsync(MOHE_URL.LOOKUPSHOP, paramsLookShop).then(res => {
      if (res.data.code == 1) {
        that.setData({
          LookShopItem: res.data.data,
          showCartList: true,
          aaaa: false,
        })
      }
    })
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画
    }, 200)
  },
  // 点击后，进入店铺详情
  onShopdetails:function(e){
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
  //打开另一个小程序
  loolshopIn:function(e){
    wx.setStorageSync('shopId', e.currentTarget.dataset.id)
    console.log(e)
    if(this.data.LookShopItem[e.currentTarget.dataset.index].address == null){
      wx.showToast({
        title: '该店铺已经下线',
        icon: 'none',
        duration: 1000
      })
    }else{
      wx.navigateToMiniProgram({
        appId: 'wxd471bb4262ac7505',
        path: 'pages/index/index?shopId=' + e.currentTarget.dataset.id,
        extraData: {},
        envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
    }
  },


  //点击文字内容-进入到视频详情，
  onDetailed:function(e){
    // wx.setStorageSync("dataItem", e.currentTarget.dataset.item)
    // wx.navigateTo({
    //   url: '/pages/moveshopdetails/moveshopdetails'
    // })
  },
  //关闭动画
  fadeDown: function() {
    this.animation.translateY(350).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  //灰色背景点击关闭关联店铺
  showCartList: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画
    setTimeout(function() {
        that.setData({
          showCartList: false,
          showCommentCartList:false
        })
      },
    720)  
  },
  //点击发布的遮挡层
  showAddshop: function() {
    this.setData({
      showAddshop: false
    })
  },
  //处理  video 遮挡层
  onReady: function(e) { //创建视频上下文对象
    // this.videoContext = wx.createVideoContext('myVideo');
  },
  //点击按钮，显示播放
  videoPlayClick: function(e) {
    
    this.setData({
      aaaa: true,
      curr_id: e.currentTarget.dataset.id,
      idx: e.currentTarget.dataset.idx+1,
      suspendId:e.currentTarget.dataset.idx
    })
    // this.videoContext = wx.createVideoContext('myVideo');
    // this.VideoContext.play()
  },
  //点击，显示发布
  publishvideo: function() {
    // console.log('我是发布页面');
    wx.removeStorageSync('showShop');
    wx.navigateTo({
      url: '../shop/addMedia/addMedia',
    })
  },
  bottomImgthree: function(e) {
    // console.log(e.currentTarget.dataset.id);
  },
  //下拉刷新（在上面刷新）
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    this.getUpVideo();
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  /**
   * 页面上拉（在下面啦）触底事件的处理函数this.data.datas.length==0
   */
  onReachBottom: function(e) {
    
    var that = this;
    if (this.data.items.length % 10 != 0) {
      this.setData({
        bottom: true
      })
    } else {
      this.getVideoComment(this.data.homepage);
    }
  },
  //下拉刷新，调用这个请求 数据的视频
  getVideoComment: function(homepage) {
    var that = this;
    var lon = wx.getStorageSync('jd');
    var params = {
      "userId": this.data.UserID, //用户Id，选填
      "page": homepage, // 分页数，起始0，必填
      "row": 10, //行数，必填
      "longitude": lon.longitude, //经度，必填
      "latitude": lon.latitude //纬度，必填
    }
    var userfollow = wx.getStorageSync('scSysUser');
    util.reqAsync(MOHE_URL.QUERYVIDEO, params).then(res => {
      //获取当前的时间撮
      var timestamp = new Date().getTime();
      if (res.data.code == 1 &&res.data.data.length>0) {
        for (var i = 0; i < res.data.data.length; i++) {
          var timeSpanStr = util.formatMsgTime(timestamp, res.data.data[i].createTime)
          var distance = util.distance(res.data.data[i].distance, res.data.data[i].videoCity)   //新家
          res.data.data[i].timeSpanStr = timeSpanStr;  
          res.data.data[i].distance = distance;                    //新家    
          var s = userfollow.id;          
          var b = res.data.data[i].userId;
          if (s == b) {
            res.data.data[i].infoFollow = false
          }else{
            res.data.data[i].infoFollow = true;
          }
        }
        var datas = res.data.data;
        var page = homepage += 1;
        // console.log(datas);
        this.setData({
          //数据追加
          items: this.data.items.concat(datas),
          homepage: page,
        })
      }else{
        that.setData({
          bottom:true
        })
      }
    })
  },
  //上拉刷新
  getUpVideo: function () {
      var that = this;
      var lon = wx.getStorageSync('jd');
      // console.log(lon,'我是传入的地址 ')
      var params = {
        "userId": this.data.UserID, //用户Id，选填
        "page": 0, // 分页数，起始0，必填
        "row": 10, //行数，必填
        "longitude": lon.longitude, //经度，必填
        "latitude": lon.latitude //纬度，必填
      }
      util.reqAsync(MOHE_URL.QUERYVIDEO, params).then(res => {
        // console.log(res.data.data, '查看查询视频的数据');
        //获取当前的时间撮
        var timestamp = (new Date()).valueOf();
        if (res.data.code == 1) {
          for (var i = 0; i < res.data.data.length; i++) {
            var timeSpanStr = util.formatMsgTime(timestamp, res.data.data[i].createTime)
            var distance = util.distance(res.data.data[i].distance, res.data.data[i].videoCity)   //新家
            res.data.data[i].distance = distance;                    //新家
            res.data.data[i].timeSpanStr = timeSpanStr;                    //发布时间
            var s = this.data.UserID;
            var b = res.data.data[i].userId;
            if (s==b){
              res.data.data[i].infoFollow = false
            }else{
              res.data.data[i].infoFollow = true;
            }
          }
          var data = res.data.data;
          // Array.prototype.push.apply(datas, that.data.items)
          this.setData({
            //数据追加
            items: data,
            homepage:1
          })
        }
      })
  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    this.setData({
      showCommentCartList:false,
      showCartList:false,
      aaaa:false
    })
  },
  //点击分享
  onShareAppMessage: function(res) {
    // console.log(res);
    var _this = this;
    //判断点击的那个按钮
    // console.log(res.target.dataset.id)
    var dataId = res.target.dataset.id;
    var dataItmes = _this.data.items;
    var infoFollow = dataItmes[res.target.dataset.index].infoFollow;
    let lon = wx.getStorageSync('jd')
    let latitude = lon.latitude;
    let longitude = lon.longitude;
    // console.log(infoFollow)
    for (var i = 0; i < dataItmes.length; i++) {
      if (dataId == dataItmes[i].id) {
        var dataItem = dataItmes[i].userName;
        var userid = dataItmes[i].userId
        var videoId = dataItmes[i].id
        var userPic = dataItmes[i].coverUrl
      }
    }
    console.log(this.data.UserID, videoId, userid);
    // console.log(dataItem)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(infoFollow)
    }
    return {
      title: '更多精彩视频尽在[' + dataItem + ']的个人主页' + '点击查看！',
      path: "pages/moveshopdetails/moveshopdetails?userid=" + userid + '&videoId=' + videoId + '&infoFollow=' + infoFollow + '&sharedetails=' + true + '&latitude=' + latitude + '&longitude=' + longitude,
      imageUrl: userPic,
      success: function(res) {}
    }
  }
})
