// pages/shop/mediaPreview/mediaPreview.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
        src: '',
        status:true,
        id:'',
        myvideo:'height:100%;margin-top:0',
        img:'top:48vh',
        heng:true,
    },
    startOrStop() {
        let s = this.data.status
        console.log(s);
        if (s){
            this.videoCtx.pause();
            this.setData({
                status: false
            })
        }else{
            this.videoCtx.play();
            this.setData({
                status: true
            })
        }
    },
    play(){
        this.videoCtx.pause();
        this.setData({
            status: false
        })
    },
    pause(){
        this.videoCtx.play();
        this.setData({
            status: false
        })
    },
    ended() {
        this.setData({
            status: false
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'是否有我要的数据')
      this.setData({
          src: options.src
      })
      console.log(options.width)
      console.log(options.height)
      if (options.width > options.height){
          this.setData({
              heng:true
          })
      }else{
          this.setData({
              heng: false
          })
      }
     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
    
  onReady: function () {
      this.videoCtx = wx.createVideoContext('myVideo');
      this.setData({
          id: this.videoCtx.webviewId
      })
      console.log(this.videoCtx)
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