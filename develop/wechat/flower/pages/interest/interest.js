//index.js
import util from '../../utils/util.js'
// import indexJson from './index.json'
var MOHE_URL = {
  // QUERYVIDEO: 'newservice/findNewServiceVideoListForProgram', //首页数据查询
  QUERYVIDEO: 'newservice/findNewServiceVideoListByUserIdForProgram', //视频查询
  // MOHE_COMMENT: 'newservice/findServiceVideoCommentList', //视频评论查询列表接口
  MOHE_COMMENT:'newservice/findServiceVideoCommentListByVideoId',  // 评论查询
  GETENSHRINEVIDEO: 'newservice/findVideoEnshrineListForProgram', //收藏列表
  INSERTVIDEOFLLOW: 'newservice/insertServiceVideoFollow', //关注
  DELFOLLOW: 'newservice/deleteServiceVideoFollow', //取消关注
  CONLLECT: 'newservice/insertVideoEnshrine', //收藏视频
  DELCONLLECT: 'newservice/delVideoEnshrine', //取消收藏
  LOOKUPSHOP: 'shop/getMercartIdShopList', //查看店铺
  ADD_COMMENT: 'newservice/insertServiceVideoComment', //新增评论接口
  GETUSER: 'newservice/getServiceUserInfo',          //个人信息查询    
   LOOKPOWDER: 'newservice/findServiceVideoFollowListForFollow', //个人页的粉丝和关注查询
  GETFANSLIST: 'newservice/findServiceVideoFollowListForFans',//获取粉丝列表
}
//获取应用实例
const app = getApp()
Page({
  data: {
    page: 1,
    bottom: false,
    scrollTop: 100, //滚动的初始值
    commentlength: 0,
    aaaa: true,       //视频图片的框框
    existName: 0,
    userName: '', //发布商品input 的除拾值
    showAddshop: false, //发布视频
    showCommentCartList: false, //评论
    showCartList: false, //查看店铺
    AlruserinfoFolloww: false, //已经关注
    userinfoFolloww: true, //没有关注
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [],
    replycomment: [], //回复评论
    LookShopItem: [], //查看店铺
    sharedateilsArr: [], //分享 
    onselfUserId:0,       // 初始化的时候用户ID
    onselId:0,             //个人用户的id
    oneselfFollow:false ,     //关注 与 已关注
    idx:1         //滚动
  },

  onLoad: function (e) {
    
    console.log(e,'我是什么住')
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
    //获取id
    var scSysUser = wx.getStorageSync('scSysUser');
    this.setData({
      UserID: scSysUser.id
    })
    this.data.onselfUserId = e.userId;   //用户ID
    this.data.onselId = e.onselfId;  //当前视频的id吧
    this.data.oneselfFollow = e.myConcern;   //是否关注
    var oneselfFollow = this.data.oneselfFollow == 'true' ? true : false
    this.setData({
      oneselfFollow: oneselfFollow
    })
    //用户信息查询
    let params = {
      userId: this.data.onselfUserId,
      queryUserId: this.data.onselfUserId
    }
    var that = this;
    util.reqAsync(MOHE_URL.GETUSER, params).then(res => {
      // console.log(res.data)
      if (res.data.code == 1) {
        var datas = res.data.data;
        var userData = datas.scSysUser;
        that.setData({
          dataData: datas,
          userData: userData
        })
      }
    })
    console.log(this.data.oneselfFollow)
    
    // this.setData({
    //   oneselfFollow: this.data.oneselfFollow
    // })

    //获取自己的数据
    this.getUpVideo(this.data.onselfUserId)
  },
  onShow:function(e){
    //个人关注
    var paramsfans = {
      "userId": this.data.onselfUserId, //用户Id，必填
      // "queryUserId": "2232", //登录用户Id，选填
      "page": "0", //分页数，起始0，必填
      "row": "10" //行数，必填
    }
    //个人关注
    this.UserConcern(paramsfans);

    //个人粉丝
    this.UserPowder(paramsfans);
  },
  //方法1，个人关注
  UserConcern: function (paramsfans) {
    util.reqAsync(MOHE_URL.LOOKPOWDER, paramsfans).then(res => {
      if (res.data.code == 1) {
        console.log(res.data.data.length)
        this.setData({
          followLength: res.data.data.length
        })
      }
    })
  },
  //方法2 个人粉丝
  UserPowder: function (paramspowder) {
    util.reqAsync(MOHE_URL.GETFANSLIST, paramspowder).then(res => {
      if (res.data.code == 1) {
        this.setData({
          userpowderlength: res.data.data.length
        })
      }
    })
  },
  //滚轮滑动
  scroll: function (e) {
    // console.log(e, '滚动');
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    // var idx = this.data.idx - 1;
    if ((e.scrollTop - 300) > (550 * this.data.idx)) {
      // console.log(123)
      // this.videoContext.pause();
      this.setData({
        aaaa:false
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //进店，查看店铺详情
  lookshopIn: function (res) {
    console.log('查看店铺，详情参数' + res)
    wx.navigateTo({
      url: '../shopdetails/shopdetails',
    })
  },
  //点击评论
  collectComment: function (e) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 200)
    console.log(e,'userID','获取的当前视频的id，和用户')
    var userId = e.currentTarget.dataset.userid;  //用户userid
    var videoId = e.currentTarget.dataset.id;     //视频id
    wx.setStorageSync('userIdIndex', userId)
    wx.setStorageSync('videoIdIndex', videoId)
    var params = {
      page:0,
      userId:userId,
      videoId:videoId,
      row:50
    }
    util.reqAsync(MOHE_URL.MOHE_COMMENT,params).then(res=>{
      console.log(params,'ddd')
      if(res.data.code==1){
        this.setData({
          replycomment: res.data.data,
          commentlength: res.data.data.length,
          showCommentCartList: true,
           aaaa: false
        })
      }
    })
  },
  //评论回复
  replyComment: function (e) {
    console.log(e,'131323121');
    wx.setStorageSync('replyC', e.currentTarget.dataset.reply);
    wx.setStorageSync('itemreply', e.currentTarget.dataset.itemreply);
    this.setData({
      focusReply: true,
      scrollTopComment: 5000
    })
  },

  //点击完成触发 发送评论
  bindOnclick: function (e) {

    var replyC = wx.getStorageSync('replyC')
    var itemreply = wx.getStorageSync('itemreply')
    console.log(itemreply,'看看看看看看看看看看')
    //判断如果返回的是1,那么就是回复
    if (replyC == 1) {
      console.log('我是回复')
      var paramsReply = {
        "userId": this.data.UserID,  //用户id, 必填
        "type": 1,  //类型0评论1回复，必填
        "videoId": itemreply.videoId, //视频Id，必填
        "commentId": itemreply.id, //回复Id，type = 1时必填
        "commentcontent": e.detail.value//必填
      }
      console.log(paramsReply, '回复数据')
      util.reqAsync(MOHE_URL.ADD_COMMENT, paramsReply).then(res => {
        // console.log(res.data.code, '新增评论')
        if (res.data.code == 1) {
          console.log(res.data.data, '我是评论成功')
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
            console.log(res.data.data,'查看评论后的数据')
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

    } else {
      // 获取头像
      //获取时间戳
      // console.log(e);
      console.log('我是评论')
      var videoId = wx.getStorageSync('videoIdIndex'); // 视频id
      var userId = wx.getStorageSync('userIdIndex'); //用户id
      var params = {
        "userId": this.data.UserID, //用户id, 必填
        "type": 0, //类型0评论1回复，必填
        "videoId": videoId, //视频Id，必填
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
            // console.log(this.data.replycomment, '查看评论数据')
          })
        }
      })
    }

  },
  //最终的收藏
  collectA: function (e) {
    console.log(e,'123')
    var that = this;
    var arr = this.data.items;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == e.target.dataset.id) {
        if (arr[i].collection) {
          var params = {
              // userId:e.currentTarget.dataset.userid,
              serviceVideoIds: [e.target.dataset.id],
            userId: this.data.UserID
              // queryUserId: this.data.UserID
          }
          // arr[i].collection = false;
          //   DELCONLLECT 取消收藏
          //取消收藏
          util.reqAsync(MOHE_URL.DELCONLLECT, params).then(res => {
            console.log(res, '取消收藏成功')
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
            serviceVideoId: e.target.dataset.id,
            userId: this.data.UserID
          }

          // arr[i].collection = true;
          //新增收藏
          util.reqAsync(MOHE_URL.CONLLECT, params).then(res => {
            console.log(res, '新增收藏成功')
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
  //点击查看店铺详情
  lookshopdiv: function (res) {
    var that = this;
    var params = {
      page: "0",
      userId: this.data.onselfUserId,
      row: "8"
    };
    //查看店铺
    util.reqAsync(MOHE_URL.LOOKUPSHOP, params).then(res => {
      if (res.data.code == 1) {
        console.log('店铺查询成功')
        if(res.data.data.length>0){
          this.setData({
            LookShopItem: res.data.data,
            showCartList: true,
            aaaa: false
          })
        }
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
  //点击 已关注
  userinfoFollowMe: function (e) {
    console.log(this.data.oneselfFollow,'false 为关注')
    //取消关注
    if (this.data.oneselfFollow){
      //取消关注
      var params = {
        "followId": "1",  //主键Id，必填
        "userId": this.data.UserID,    //用户Id，必填
        "videoId": this.data.onselId,     //视频Id，必填
        "concernId": this.data.onselfUserId //对象Id，必填
      }
      util.reqAsync(MOHE_URL.DELFOLLOW, params).then(res => {
        console.log(res,'取消关注成功')
      })
      this.setData({
        oneselfFollow:false
      })
    }else{  //新增关注
      //新增关注
      var params = {
        "concernId": this.data.onselfUserId,     //对象ID
        "userId": this.data.UserID,
        "videoId": this.data.onselId,
        "followObligate": "test"
      };
      util.reqAsync(MOHE_URL.INSERTVIDEOFLLOW, params).then(res => {
        console.log(res,'新增关注成功')
      })
      this.setData({
        oneselfFollow: true
      })
    }
  },
  //点击后，进入到视频详情
  // onClickMoveDetails: function () {
  //   wx.navigateTo({
  //     url: '/pages/moveshopdetails/moveshopdetails',
  //   })
  // },
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
        showCommentCartList: false
      })
    },
      720)
  },
  //处理  video 遮挡层
  onReady: function (e) { //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo');
  },
  //点击按钮，显示播放
  videoPlay: function (e) {
    console.log(e, '点击播放视频');
    // this.data.existName = e.currentTarget.dataset.id;
    this.setData({
      aaaa: true,
      curr_id: e.currentTarget.dataset.id,
      idx:e.currentTarget.dataset.idx
    })
    // this.videoContext.play()
  },
  //我是第二次点击播放
  videoTwoPlay: function (e) {
    // this.setData({
    //   aaaa: true
    // })
    // this.videoContext.play();
  },
  //下拉刷新（在上面刷新）
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    // this.setData({
    //   bottom: false
    // })
    this.getUpVideo(this.data.onselfUserId);
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  /**
 * 页面上拉（在下面啦）触底事件的处理函数
 */
  onReachBottom: function (e) {
    console.log("到底啦", e);
    var that = this;
    if (this.data.items.length % 10 != 0) {
      this.setData({
        bottom: true
      })
    } else {
      // getCommentList()
      this.getVideoComment();
    }
  },
  //下拉刷新，调用这个请求 数据的视频
  getVideoComment: function () {
    var that = this;
    var lon = wx.getStorageSync('jd');
    var params = {
      "userId": this.data.onselfUserId, //用户Id，选填
      "page": that.data.page, // 分页数，起始0，必填
      "row": 10, //行数，必填
      "longitude": lon.longitude, //经度，必填
      "latitude": lon.latitude, //纬度，必填
      'queryUserId': that.data.UserID
    }
    util.reqAsync(MOHE_URL.QUERYVIDEO, params).then(res => {
      console.log(res.data.data, '查看查询视频的数据');
      console.log(params, '123')
      if (res.data.code == 1) {
        for (var i = 0; i < res.data.data.length; i++) {
          var timeSpanStr = util.formatMsgTime(res.data.data[i].modifyTime, res.data.data[i].createTime)
          res.data.data[i].timeSpanStr = timeSpanStr;
          var distance = util.distance(res.data.data[i].distance, res.data.data[i].videoCity)   //新家
          res.data.data[i].distance = distance;                    //新家
        }
        var datas = res.data.data;
        var pages = that.data.page += 1;
        this.setData({
          //数据追加
          items: this.data.items.concat(datas),
          page: pages
        })
      }
    })
  },
  //上拉刷新
  getUpVideo: function (onselfUserId) {
    console.log(onselfUserId,'123')
    var that = this;
    var lon = wx.getStorageSync('jd');
    var params = {
      "userId": onselfUserId, //用户Id，选填
      "page": 0, // 分页数，起始0，必填
      "row": 10, //行数，必填
      "longitude": lon.longitude, //经度，必填
      "latitude": lon.latitude, //纬度，必填
      'queryUserId': that.data.UserID
    }
    util.reqAsync(MOHE_URL.QUERYVIDEO, params).then(res => {
      console.log(res.data.data, '查看查询视频的数据');
      console.log(params, '123');
      //获取当前的时间撮
      var timestamp = new Date().getTime();
      if (res.data.code == 1) {
        for (var i = 0; i < res.data.data.length; i++) {
          var timeSpanStr = util.formatMsgTime(timestamp, res.data.data[i].createTime)
          res.data.data[i].timeSpanStr = timeSpanStr;
          var distance = util.distance(res.data.data[i].distance, res.data.data[i].videoCity)   //新家
          res.data.data[i].distance = distance;                    //新家
        }
        var data = res.data.data;
        // Array.prototype.push.apply(datas, that.data.items)
        this.setData({
          //数据追加
          items: data
        })
      }
    })
  },
  //点击 消息框
  navigateToAll: function (e) {
    let url = e.target.dataset.url;
    console.log(url + '&userID=' + this.data.onselfUserId ,'获取地址')
    wx.navigateTo({
      url: url + '&userID=' + this.data.onselfUserId
    })
  },
  // 点击后，进入店铺详情
  onShopdetails: function (e) {
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
  loolshopIn: function (e) {


    wx.setStorageSync('shopId', e.currentTarget.dataset.id)
    console.log(e)
    if (this.data.LookShopItem[e.currentTarget.dataset.index].address == null) {
      wx.showToast({
        title: '该店铺已经下线',
        icon: 'none',
        duration: 1000
      })
    } else {
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
  //点击分享
  onShareAppMessage: function (res) {
    console.log(res,'数据')
    var userid = res.target.dataset.userid;
    var videoId = res.target.dataset.id;
    let lon = wx.getStorageSync('jd')
    let latitude = lon.latitude;
    let longitude = lon.longitude;
    
    console.log(this.data.userData)
    if (res.from === 'button') {
      console.log()
    }
    return {
      title: '更多精彩视频尽在[' + this.data.userData.username + ']的视频详情页' + '点击查看！',
      path: "pages/moveshopdetails/moveshopdetails?userid=" + userid + '&videoId=' + videoId + '&infoFollow=' + true + '&latitude=' + latitude + '&longitude=' + longitude + '&sharedetails=' + true,
      imageUrl: this.data.userData.videoUrl,
      success: function (res) {}
    }
  }
})

// path: "pages/moveshopdetails/moveshopdetails?userid=" + userid + '&videoId=' + videoId + '&infoFollow=' + infoFollow + '&sharedetails=' + true + '&latitude=' + latitude + '&longitude=' + longitude,
