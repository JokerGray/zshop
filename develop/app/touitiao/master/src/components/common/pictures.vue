<template>
  <div>
    <div class="loading" v-if="loading">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <loading></loading>
    </div>
    <div v-if="!loading">
      <div class="header">
        <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
        <!--<span class="shareBtn iconfont icon-shenglvehao"></span>-->
        <img :src="imgList.userAuthorImg?imgList.userAuthorImg:require('../../../static/images/mrtx.png')" class="anchorPhoto" @click="toAuthorPage(imgList.userId)">
      </div>
      <swipe class="my-swipe" :auto="0" :show-indicators="false" :continuous="false">
        <swipe-item class="slide" v-for="(item,index) in imgList.scCmsResourcesList" :key="index" v-if="item.resourcesType=='image'">
          <img :src="item.resourcesUrl" alt="">
          <div class="picDsc">
            <span class="pageNo">{{index+1}}/<sub>{{imgList.scCmsResourcesList.length-1}}</sub></span>
            <h4>{{item.resourcesRemarks}}</h4>
          </div>
        </swipe-item>
      </swipe>
      <div class="mineComment" v-show="!maskShow">
        <input type="text" class="toComment" @click="showMask" placeholder="说点什么吧...">
        <span class="iconfont icon-xinxi" @click="lookMoreComment"><i class="badge">{{totalCommentNum}}</i></span>
        <span class="iconfont" @click="toCollection" id="collection" v-bind:class="{'icon-icon':isEnshrined==0,'icon-shoucang11':isEnshrined==1,'red':isEnshrined==1}"></span>
        <span class="iconfont icon-fenxiang" @click="toShare"></span>
      </div>
      <div class="mask" id="mask" @click="closeMask" v-show="maskShow"></div>
      <div class="commentArea" v-show="maskShow">
        <form action="#">
          <textarea placeholder="优质评论将会被优先展示" id="commentContent" v-model.trim="commentContent" v-to-focus></textarea>
          <a href="javascript:;" class="sentComment" @click="sentComment" v-bind:class="{'color':commentContent!==''}">发送</a>
        </form>
      </div>
    </div>
    <div class="loginBox">
      <needLogin></needLogin>
    </div>
    <div class="commentList">
      <div class="title">
        <a href="javascript:;" class="iconfont icon-fanhui" @click="closeCommentList"></a>
        <h4>评论列表</h4>
      </div>
      <scroll class="pictures_wrapper"
              ref="scroll"
              :pulldown="true"
              :pullup="true"
              :data="commentObj.scCmsCommentList"
              :lastRefreshTime="lastRefreshTime"
              :totalNum="totalCommentNum"
              :refreshDataLength="refreshDataLength"
              @scrollToEnd="loadMore"
              @pulldown="loadData">
        <comment ref="comment" :commentObj="commentObj" @agree="agree"></comment>
      </scroll>
      <div class="comment_button"><input @click="showMask" placeholder="说点什么吧..."></div>
      <div class="noDataZW" v-if="totalCommentNum==0?true:false">
        <noDataZW></noDataZW>
      </div>
    </div>
    <shareModule :info="imgList" ref="pictureShareModule"></shareModule>
  </div>
</template>
<script>
  import loading from './loading'
  import {Swipe, SwipeItem} from 'vue-swipe';
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import $ from 'jquery'
  import needLogin from '../common/needLogin'
  import comment from '../common/comment'
  import noDataZW from '../common/noDataZW'
  import shareModule from '../common/shareModule'
  import scroll from '../common/BScroll'

  export default {
    components: {
      'loading': loading,
      'swipe': Swipe,
      'swipe-item': SwipeItem,
      needLogin,
      comment,
      noDataZW,
      shareModule,
      scroll
    },
    created: function () {
      this.articleId = this.$route.params.articleId;
      this.getPictures(this.articleId);
      this.getCommentList(this.articleId);
    },
    data: function () {
      return {
        imgList: [],
        loading: true,
        articleId: '',
        maskShow: false,
        commentContent: '',
        totalCommentNum: 0,
        isEnshrined: 0,
        commentObj: {},
        pageNo: 1,
        lastRefreshTime: '',
        refreshDataLength: -1,
        isAjax: true
        // isSubscribe: 0,
        // hasConcern: 0,
      }
    },
    directives: {
      "to-focus": function (el) {
        el.focus();
      }
    },
    methods: {
      getPictures: function (articleId) {
        this.loading = true;
        setTimeout(() => {
          var data = {
            cmd: 'cms_new/querArticleDetails',
            data: JSON.stringify({"userId": "1", "articleId": articleId}),
            version: 1
          };
          var url = '/zxcity_restful/ws/rest';
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            if (res.data.code != 1) {
              Toast(res.data.msg);
              return
            }
            this.imgList = res.data.data;
            this.loading = false
          })
        }, 300)
      },
      goBack: function () {
        this.$router.go(-1)
      },
      getCommentList: function (articleId) {
        if (!this.isAjax) {
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/selectTimeNewCmsComment',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo,
              "rows": 10
            },
            "commentId": 0,
            "articleId": articleId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
          if (this.pageNo === 1) {
            this.commentObj = res.data.data;
            this.totalCommentNum = res.data.data.totalCount;
            this.refreshDataLength = res.data.data.scCmsCommentList.length
          } else if (this.pageNo > 1) {
            this.commentObj.scCmsCommentList = this.commentObj.scCmsCommentList.concat(res.data.data.scCmsCommentList);
            if (this.commentObj.scCmsCommentList.length === this.totalCommentNum) {
              this.isAjax = false
            }
          }
        })
      },
      getCommentList_1: function (articleId) {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/selectTimeNewCmsComment',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": 1,
              "rows": this.pageNo * 10
            },
            "commentId": 0,
            "articleId": articleId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.commentObj = res.data.data;
          this.totalCommentNum = res.data.data.totalCount;
          this.refreshDataLength = res.data.data.scCmsCommentList.length;
          this.isAjax = true;
        })
      },
      lookMoreComment: function () {
        this.showCommentList();
        // $('.commentBox').css('height',$(window).height()-2.15*$('.backTemp').height())
        // $('html, body').animate({
        //   scrollTop: $('#title').offset().top - $('#title').height()
        // }, 1000);
      },
      toCollection: function () {
        if (!sessionStorage.getItem('userId')) {
          this.showLoginPage();
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/ArticleCollection',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "articleId": this.articleId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if (res.data.data.isEnshrined == 0) {
            Toast('取消收藏成功')
          } else {
            Toast('收藏成功')
          }
          this.isEnshrined = res.data.data.isEnshrined
        })
      },
      closeMask: function (e) {
        if (e.target.className == 'mask') {
          this.maskShow = false
        }
      },
      showMask: function () {
        if (!sessionStorage.getItem('userId')) {
          $('.toComment').blur();
          this.showLoginPage();
          return
        }
        this.maskShow = true;
      },
      sentComment: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          // cmd: 'cms_new/addFirstCmsComment',
          cmd: 'cms_new/addCmsComment',
          data: JSON.stringify({
            userId: sessionStorage.getItem('userId'),
            userName: sessionStorage.getItem('userName'),
            userImgUrl: sessionStorage.getItem('userPic'),
            articleId: this.articleId,
            commentComment: this.commentContent,
            parentReplyId: '0'
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          } else {
            Toast(res.data.msg);
            // this.$refs.comment.getCommentList(this.articleId);
            this.isAjax = true;
            this.getCommentList_1(this.articleId);
            this.commentContent = '';
            this.maskShow = false;
          }
        })
      },
      toShare: function () {
        this.$refs.pictureShareModule.showShareBtns()
      },
      showCommentList: function () {
        $('.commentList').show();
        setTimeout(function () {
          $('.commentList').css({'transform': 'translateX(0)'});
        }, 0);
      },
      closeCommentList: function () {
        $('.commentList').css({'transform': 'translateX(100%)'});
        setTimeout(function () {
          $('.commentList').hide();
        }, 300);
      },
      showLoginPage: function () {
        $('.loginBox').show();
        setTimeout(function () {
          $('.loginBox').css({'transform': 'translateY(0)'});
        }, 0);
      },
      closeLoginPage: function () {
        var height = $(window).height();
        $('.loginBox').css({'transform': 'translateY(' + height + 'px)'});
        setTimeout(function () {
          $('.loginBox').hide();
        }, 300);
      },
      toAuthorPage: function (authorId) {
        this.$router.push({path: '/author/authorPage/homePage/' + authorId})
      },
      agree: function (commentId, isPraise) {
        if (isPraise === 1) {
          Toast('已经赞过了');
          return;
        }
        if (!sessionStorage.getItem('userId')) {
          this.showLoginPage();
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/addPraiseToCommentNew',
          data: JSON.stringify({
            "userImgUrl": sessionStorage.getItem('userPic'),
            "userId": sessionStorage.getItem('userId') || '',
            "userName": sessionStorage.getItem('userName'),
            "commentId": commentId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          Toast(res.data.msg);
          this.getCommentList_1(this.articleId);
          this.isAjax = true
        })
      },
      loadMore: function () {
        this.pageNo++;
        this.getCommentList(this.articleId)
      },
      loadData: function () {
        this.isAjax = true;
        this.pageNo = 1;
        this.getCommentList(this.articleId)
      },
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.pictures_wrapper').height($(window).height() - $('.title').height() - $('.comment_button').height())

      })
    },
    updated: function () {
      this.$nextTick(function () {
        $('.pictures_wrapper').height($(window).height() - $('.title').height() - $('.comment_button').height());
        //防止滑动图片描述文字时，图片也跟着滑动
        if(document.querySelectorAll('.my-swipe h4').length!==0){
          document.querySelectorAll('.my-swipe h4').forEach(function (v, index) {
            v.addEventListener('touchmove',function () {
              event.stopPropagation()
            })
          })
        }
      })
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .loading {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    a {
      position: absolute;
      top: 0;
      left: 0;
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 36/32rem;
    }
  }

  .header {
    width: 100%;
    height: 90/32rem;
    position: fixed;
    top: 0;
    left: 0;
    color: #fff;
    z-index: 1001;
    padding-right: 30/32rem;
    a {
      float: left;
      width: 90/32rem;
      height: 100%;
      line-height: 90/32rem;
      color: #ffffff;
      font-size: 36/32rem;
      text-align: center;
    }
    .anchorPhoto {
      float: right;
      width: 64/32rem;
      height: 64/32rem;
      border-radius: 50%;
      margin-top: 20/32rem;
    }
    .shareBtn {
      float: right;
      width: 100/32rem;
      height: 100%;
      line-height: 90/32rem;
      text-align: center;
      font-size: 36/32rem;
    }
  }

  .my-swipe {
    width: 100%;
    /*<!--height: 1330/32rem;-->*/
    color: #fff;
    font-size: 30px;
    text-align: center;
    background-color: #000;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }

  .slide {
    width: 100%;
    height: 100%;
    img {
      position: relative;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
    .picDsc {
      width: 100%;
      /*<!--height: 240/32rem;-->*/
      background-color: rgba(0, 0, 0, 0.4);
      position: fixed;
      bottom: 100/32rem;
      left: 0;
      z-index: 1001;
      .pageNo {
        width: 96/32rem;
        font-size: 30/32rem;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.4);
        sub {
          font-size: 20/32rem;
          vertical-align: baseline;
        }
      }
      h4 {
        position: absolute;
        width: 100%;
        padding-left: 116/32rem;
        bottom: 0;
        font-size: 32/32rem;
        line-height: 40/32rem;
        font-weight: 400;
        padding-right: 30/32rem;
        text-align: left;
        overflow: hidden;
        overflow-y: scroll;
        max-height: 240/32rem;
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
  }

  .mineComment {
    width: 100%;
    height: 100/32rem;
    line-height: 90/32rem;
    padding: 0 20/32rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1001;
    .toComment {
      display: inline-block;
      width: 400/32rem;
      height: 60/32rem;
      outline: none;
      border-radius: 8/32rem;
      border: 1/32rem solid #d8d8d8;
      padding-left: 20/32rem;
      background-color: #fff;
      float: left;
      margin-top: 20/32rem;
      font-style: normal;
      font-size: 20/32rem;
      line-height: 60/32rem;
      color: #999999;
      -webkit-appearance: none;
    }
    span {
      font-size: 50/32rem;
      color: #787878;
      padding: 15/32rem;
      margin-left: 10/32rem;
      vertical-align: middle;
      &:nth-of-type(1) {
        position: relative;
        .badge {
          position: absolute;
          width: 50/32rem;
          height: 25/32rem;
          border-radius: 25/32rem;
          font-size: 20/32rem;
          font-style: normal;
          color: #fffefe;
          line-height: 25/32rem;
          text-align: center;
          background-color: #ff8b6f;
          top: 10/32rem;
          left: 40/32rem;
        }
      }

    }
    .red {
      color: #ff4d3d;
    }

  }

  .mask {
    width: 100%;
    height: 1500/32rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1002;
    background-color: rgba(0, 0, 0, .5);
    /*display: none;*/
  }

  .commentArea {
    width: 100%;
    height: 320/32rem;
    background-color: #f2f2f2;
    padding: 0 30/32rem;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1002;
    textarea {
      width: 100%;
      margin-top: 20/32rem;
      height: 180/32rem;
      outline: none;
      padding: 10/32rem;
      border-width: 1/32rem;
      border-color: #e6e6e6;
      resize: none;
      -webkit-appearance: none;
      border-radius: 0;
    }
    .sentComment {
      float: right;
      width: 140/32rem;
      height: 50/32rem;
      line-height: 50/32rem;
      text-align: center;
      background-color: #c3c3c3;
      color: #fff;
      font-size: 26/32rem;
      border-radius: 6/32rem;
      margin-top: 40/32rem;
    }
    .color {
      background-color: #ff8f29;
    }
  }

  .loginBox {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1003;
    transform: translateY(1320/32rem);
    display: none;
    transition: all .3s;
  }

  .commentList {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: #f2f2f2;
    z-index: 1001;
    -webkit-transform: translateX(100%);
    -moz-transform: translateX(100%);
    -ms-transform: translateX(100%);
    -o-transform: translateX(100%);
    transform: translateX(100%);
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    display: none;
    padding-top: 90/32rem;
    .title {
      width: 100%;
      height: 90/32rem;
      position: fixed;
      top: 0;
      left: 0;
      background-color: #fff;
      z-index: 1002;
      border-bottom: 1/32rem solid #e5e5e5;
      a {
        position: absolute;
        width: 80/32rem;
        height: 90/32rem;
        line-height: 90/32rem;
        text-align: center;
        color: #666666;
        font-size: 36/32rem;
      }
      h4 {
        text-align: center;
        line-height: 90/32rem;
        color: #333333;
      }
    }
    .comment_button {
      width: 100%;
      height: 80/32rem;
      position: fixed;
      bottom: 0;
      left: 0;
      background-color: #f7f7f7;
      padding: 15/32rem 30/32rem;
      input {
        display: block;
        width: 100%;
        height: 50/32rem;
        line-height: 50/32rem;
        font-size: 24/32rem;
        border: 1/32rem solid #b5b5b5;
        border-radius: 6/32rem;
        padding-left: 20/32rem;
        color: #666666;
        -webkit-appearance: none;
      }

    }
    .noDataZW {
      width: 100%;
      height: 93%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
</style>
