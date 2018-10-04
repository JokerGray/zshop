<template>
  <div class="commentBox" v-if="commentObj">
    <div class="title" id="title">
      <h4>评论{{commentObj.totalCount}}</h4>
    </div>
    <div class="commentContent">
      <ul>
        <li v-for="(item,index) in commentObj.scCmsCommentList" :key="index" @click="toCommentReplyInfo(item)">
          <div class="commentBy">
            <div class="commentByName">
              <img :src="item.userImgUrl?item.userImgUrl:require('../../../static/images/mrtx.png')" alt="">
              <span>{{item.userName}}</span>
            </div>
            <div class="likeComment">
              <span class="iconfont icon-dianzanshu" @click.stop="agree(item.id,item.isPraise)" :class="{'red':item.isPraise==1}">{{item.praiseNumber}}</span>
            </div>
          </div>
          <div class="content">
            <p>{{item.commentComment}}</p>
            <p><span>{{item.commentTime}}</span><span>{{item.commentReplyNum}}条回复&nbsp;></span></p>
          </div>
        </li>
        <!--<li>-->
          <!--<div class="commentBy">-->
            <!--<div class="commentByName">-->
              <!--<img src="http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/user/photos/0e7e8be7966d84e421e20b1a161d04fe.png" alt="">-->
              <!--<span>夜晚不黑</span>-->
            <!--</div>-->
            <!--<div class="likeComment">-->
              <!--<span class="iconfont icon-dianzanshu">56</span>-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="content">-->
            <!--<p>和我家3岁的猫先生看起来差不多啦！难道我家的猫也活了几十年了,哈哈哈哈哈哈哈哈哈</p>-->
            <!--<p><span>10-10&nbsp;14:48</span><span>110条回复&nbsp;></span></p>-->
          <!--</div>-->
        <!--</li>-->
      </ul>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  export default {
    props:['commentObj'],
    methods: {
      //获取评论列表
      getCommentList:function (articleId) {
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
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!=1){
            Toast(res.data.msg);
            return
          }
          if(this.pageNo===1){
            this.commentList = res.data.data;
            this.totalCommentNum = res.data.data.totalCount
          }else if(this.pageNo>1){
            this.commentList.scCmsCommentList = this.commentList.scCmsCommentList.concat(res.data.data.scCmsCommentList)
          }
        })
      },
      getCommentList_1:function (articleId) {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/selectTimeNewCmsComment',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": 1,
              "rows": this.pageNo*10
            },
            "commentId": 0,
            "articleId": articleId
          }),
          version: 1
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!=1){
            Toast(res.data.msg);
            return
          }
          this.commentList = res.data.data;
          this.totalCommentNum = res.data.data.totalCount
        })
      },
      // 评论点赞
      agree:function (commentId,isPraise) {
        this.$emit('agree',commentId,isPraise);
      },
      toCommentReplyInfo:function (item) {
        this.$router.push({path: '/commentReplyInfo?info='+JSON.stringify(item)})
      }
    },
  }
</script>

<style scoped lang="less" type="text/less">
  .commentBox{
    position: relative;
  }
  .title {
    width: 100%;
    height: 77/32rem;
    line-height: 77/32rem;
    font-size: 30/32rem;
    color: #787878;
    padding-left: 30/32rem;
    border-top: 1/32rem solid #eee;
    h4 {
      font-weight: 400;
    }
  }
  .commentContent {
    width: 100%;
    padding-bottom: 20/32rem;
    ul {
      background-color: #fff;
      li {
        padding: 0 30/32rem;
        border-top: 2/32rem solid #eee;
        .commentBy {
          width: 100%;
          height: 68/32rem;
          line-height: 68/32rem;
          margin-top: 18/32rem;
          .commentByName {
            float: left;
            img {
              width: 68/32rem;
              height: 68/32rem;
              border-radius: 50%;
              vertical-align: middle;
              display: inline-block;
            }
            span {
              font-size: 30/32rem;
              color: #9189f2;
            }
          }
          .likeComment {
            float: right;
            font-size: 30/32rem;
            color: #787878;
            span::before {
              font-size: 36/32rem;
            }
          }
        }
        .content {
          margin-top: 10/32rem;
          padding: 0 80/32rem;
          margin-bottom: 25/32rem;
          p:nth-of-type(1) {
            font-size: 30/32rem;
            color: #333333;
            line-height: 40/32rem;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
            -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
            -webkit-line-clamp: 2; /** 显示的行数 **/
            overflow: hidden; /** 隐藏超出的内容 **/
          }
          p:nth-of-type(2) {
            margin-top: 15/32rem;
            font-size: 24/32rem;
            padding: 10/32rem 0;
            color: #787878;
            span {
              margin-right: 30/32rem;
            }
          }
        }
      }
    }
  }
  .red{
    color: red;
  }
</style>
