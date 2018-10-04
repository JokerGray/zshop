<template>
  <div>
    <div class="commentReply-header">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <h4>详情</h4>
    </div>
    <scroll
      class="commentReply-wrapper"
      :pulldown="true"
      :pullup="true"
      :data="replyList"
      :lastRefreshTime="lastRefreshTime"
      :totalNum="totalNum"
      :refreshDataLength="refreshDataLength"
      @scrollToEnd="loadMore"
      @pulldown="loadData">
      <div class="comment-Box">
        <div class="AuthorInfo">
          <div class="Author-pic-name">
            <img :src="commentObj.userImgUrl">
            <span>{{commentObj.userName}}</span>
          </div>
          <div class="agree" @click="agree(commentObj.id , commentObj.isPraise,'comment')">
            <span class="iconfont icon-dianzanshu" :class="{'red':commentObj.isPraise===1}"></span>
            <span :class="{'red':commentObj.isPraise===1}">{{commentObj.praiseNumber}}</span>
          </div>
        </div>
        <div class="comment-content">
          <p>{{commentObj.commentComment}}</p>
        </div>
        <div class="comment-time"><p>{{commentObj.commentTime}}</p></div>
      </div>
      <div class="reply-box">
        <div class="title"><span>全部回复</span></div>
        <ul>
          <li v-for="(item,index) in replyList" :key="index" @click="toCommentReplyInfo(item)">
            <div class="AuthorInfo">
              <div class="Author-pic-name">
                <img :src="item.userImgUrl">
                <span>{{item.userName}}</span>
              </div>
              <div class="agree" @click.stop="agree(item.id,item.isPraise,'reply')">
                <span class="iconfont icon-dianzanshu" :class="{'red':item.isPraise===1}"></span>
                <span :class="{'red':item.isPraise===1}">{{item.praiseNumber}}</span>
              </div>
            </div>
            <div class="comment-content reply-content">
              <p>{{item.commentComment}}</p>
            </div>
            <div class="comment-time reply-time"><span>{{item.commentTime}}</span>&nbsp;&nbsp;<span>{{item.commentReplyNum}}条回复</span></div>
          </li>
        </ul>
      </div>
      <div class="loading-wrapper"></div>
    </scroll>
    <div class="writeComment-box">
      <input type="text" class="writeComment-btn" @click="showMask" placeholder="说点什么吧...">
      <a class="iconfont icon-dianzanshu" href="javascript:;" :class="{'red':commentObj.isPraise===1}" @click="agree(commentObj.id , commentObj.isPraise,'comment')"></a>
    </div>
    <div class="to-comment-box">
      <div class="mask" id="mask" @click="closeMask" v-show="maskShow"></div>
      <div class="commentArea" v-show="maskShow">
        <form action="#">
          <textarea placeholder="优质评论将会被优先展示" v-model.trim="commentContent" v-to-focus></textarea>
          <a href="javascript:;" class="sentComment" @click="sentComment" v-bind:class="{'color':commentContent!==''}">发送</a>
        </form>
      </div>
    </div>
    <div class="loading" v-if="loading"><loading></loading></div>
  </div>
</template>

<script>
  import qs from 'qs'
  import $ from 'jquery'
  import {Toast} from 'mint-ui'
  import {Indicator} from 'mint-ui'
  import scroll from '../common/BScroll'
  import loading from '../common/loading'
  export default {
    components:{
      scroll,
      loading
    },
    created:function () {
      this.commentObj = JSON.parse(this.$route.query.info)
      this.getCommentReplyInfo()
    },
    data:function () {
      return{
        commentObj:{},
        replyList:[],
        maskShow:false,
        commentContent:'',
        lastRefreshTime:'',
        totalNum:-1,
        refreshDataLength:-1,
        pageNo:1,
        isAjax:true,
        loading:true,
      }
    },
    methods:{
      goBack:function () {
        this.$router.go(-1)
      },
      getCommentReplyInfo:function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/selectTimeNewCmsComment',
          data:JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo,
              "rows": 10
            },
            "commentId": this.commentObj.id,
            "articleId": this.commentObj.articleId
          }),
          version: 1
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          if(this.pageNo===1){
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.totalNum = res.data.data.totalCount;
            this.refreshDataLength = res.data.data.scCmsCommentList.length;
            this.replyList = res.data.data.scCmsCommentList;
            this.loading = false
          }else if(this.pageNo>1){
            this.replyList = this.replyList.concat(res.data.data.scCmsCommentList);
            if(this.replyList.length===this.totalNum){
              this.isAjax = false
            }
          }
        })
      },
      getCommentReplyInfo_1:function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/selectTimeNewCmsComment',
          data:JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": 1,
              "rows": this.pageNo*10
            },
            "commentId": this.commentObj.id,
            "articleId": this.commentObj.articleId
          }),
          version: 1
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          this.totalNum = res.data.data.totalCount;
          this.refreshDataLength = res.data.data.scCmsCommentList.length;
          this.replyList = res.data.data.scCmsCommentList;
        })
      },
      agree:function (commentId,isPraise,type) {
        if(isPraise === 1){
          Toast('已经赞过了');
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/addPraiseToCommentNew',
          data:JSON.stringify({
            "userImgUrl": sessionStorage.getItem('userPic'),
            "userId": sessionStorage.getItem('userId'),
            "userName": sessionStorage.getItem('userName'),
            "commentId":commentId
          })
        }
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code===1){
            if(type==='comment'){
              this.commentObj.isPraise = 1;
              this.commentObj.praiseNumber+=1
            }else if(type==='reply'){
              this.getCommentReplyInfo_1();
              if(this.totalNum>=10){
                this.isAjax = true
              }
            }
          }else{
            Toast(res.data.msg)
          }
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
          setTimeout(() => {
            this.showLoginPage();
          }, 100);
          return
        }
        this.maskShow = true
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
            articleId: this.commentObj.articleId,
            commentComment: this.commentContent,
            parentReplyId: this.commentObj.id
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          } else {
            Toast(res.data.msg);
            // this.$refs.comment.getCommentList(this.newsInfo.articleId);
            this.getCommentReplyInfo_1()
            this.commentContent = '';
            this.maskShow = false;
            if(this.totalNum>=10){
              this.isAjax = true
            }
          }
        })
      },
      loadMore:function () {
        if(!this.isAjax){return}
        this.pageNo ++;
        this.getCommentReplyInfo()
      },
      loadData:function () {
        this.isAjax = true;
        this.pageNo = 1;
        this.getCommentReplyInfo()
      },
      toCommentReplyInfo:function (item) {
        this.$router.push({path: '/commentReplyInfo?info='+JSON.stringify(item)});
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.commentReply-wrapper').height($(window).height()-$('.commentReply-header').height()-$('.writeComment-box').height())
      })
    },
    directives: {
      "to-focus": function (el) {
        el.focus();
      }
    },
    watch:{
      $route:function (val, old) {
        if(val.fullPath&&val.fullPath!==old.fullPath&&val.name==='commentReplyInfo'){
          this.loading = true;
          this.pageNo = 1;
          this.replyList = [];
          this.commentObj = JSON.parse(this.$route.query.info)
          this.getCommentReplyInfo();
        }
      }
    }
  }
</script>


<style scoped lang="less" type="text/less">
  .commentReply-header{
    width: 100%;
    height: 90/32rem;
    line-height: 90/32rem;
    background-color: #fff;
    border-bottom: 1/32rem solid #e5e5e5;
    position: relative;
    z-index: 1;
    a{
      position: absolute;
      width: 90/32rem;
      height: 90/32rem;
      text-align: center;
      color: #333333;
      font-size: 36/32rem;
    }
    h4{
      text-align: center;
      font-size: 32/32rem;
      color: #333333;
    }
  }

  .comment-Box,.reply-box{
    width: 100%;
    height: 100%;
    border-bottom: 20/32rem solid #f8f8f8;
    padding-bottom: 50/32rem;
    .AuthorInfo{
      width: 100%;
      height: 74/32rem;
      line-height: 74/32rem;
      overflow: hidden;
      padding: 0 24/32rem;
      margin-top: 30/32rem;
      .Author-pic-name{
        float: left;
        img{
          width: 74/32rem;
          height: 74/32rem;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
          border-radius: 50%;
          float: left;
          vertical-align: middle;
        }
        span{
          font-size: 30/32rem;
          color: #9172fa;
          margin-left: 10/32rem;
        }
      }
      .agree{
        width: 90/32rem;
        height: 74/32rem;
        float: right;
        color: #666666;
        span{
          &:first-of-type{
            font-size: 36/32rem;
          }
        }
      }
    }
    .comment-content{
      width: 100%;
      height: 100%;
      padding: 0 24/32rem 0 108/32rem;
      margin-top: 30/32rem;
      font-size: 30/32rem;
      line-height: 40/32rem;
      color: #333333;
    }
    .comment-time{
      padding: 0 24/32rem 0 108/32rem;
      margin-top: 30/32rem;
      p{
        font-size: 28/32rem;
        color: #666666;
      }
      span{
        font-size: 28/32rem;
        color: #666666;
      }
    }
  }

  .reply-box{
    width: 100%;
    height: 100%;
    border-bottom: 0;
    .title{
      width: 100%;
      height: 90/32rem;
      line-height: 90/32rem;
      border-bottom: 1/32rem solid #e5e5e5;
      padding-left: 24/32rem;
      span{
        font-size: 30/32rem;
        color: #333333;
      }
    }
    ul{
      li{
        border-bottom: 1/32rem solid #e5e5e5;
        padding-bottom: 30/32rem;
      }
    }
  }

  .writeComment-box{
    width: 100%;
    height: 90/32rem;
    background-color: #f5f5f5;
    position: fixed;
    bottom: 0;
    left: 0;
    padding-left:24/32rem;
    input{
      display: inline-block;
      width: 80%;
      height: 60/32rem;
      //line-height: 60/32rem;
      border: 1/32rem solid #e5e5e5;
      background-color: #fff;
      margin-top: 15/32rem;
      font-size: 24/32rem;
      color: #999999;
      padding-left: 24/32rem;
      float: left;
      -webkit-appearance: none;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
    }
    a{
      display: inline-block;
      width: 10%;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 40/32rem;
      float: left;
      margin-left: 5%;
      color: #333333;
    }
  }

  .to-comment-box{
    .mask {
      width: 100%;
      height: 1500/32rem;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1000;
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
      z-index: 1001;
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
  }

  .loading{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 93%;
  }


  .red{
    color: red !important;
  }
</style>
