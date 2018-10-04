<template>
  <div>
    <div class="singleAnswer-header">
      <a href="javascript:;" class="iconfont icon-fanhui back" @click="goBack"></a>
      <a href="javascript:;" class="iconfont icon-shenglvehao shareBtn" @click="showShareBtns"></a>
      <a href="javascript:;" class="nextAnswer" @click="nextAnswer">下一个回答</a>
    </div>
    <scroll
      class="singleAnswer-wrapper"
      ref="singleAnswerScroll"
      :pulldown="true"
      :pullup="true"
      :data="commentObj.scCmsCommentList"
      :lastRefreshTime="lastRefreshTime"
      :totalNum="totalCommentNum"
      :refreshDataLength="refreshDataLength"
      @scrollToEnd="loadMore"
      @pulldown="loadData">
      <div class="question">
        <div class="questionTitle">
          <i class="questionLabel"></i>&nbsp;<span>{{answerInfo.articleTitle}}</span>
        </div>
        <div class="questionBottom">
          <a href="javascript:;" class="answerBtn" @click="toAnswer"></a>
          <a href="javascript:;" class="toAnswer" @click="toAnswerInfo">{{answerInfo.answerNumber?answerInfo.answerNumber:0}}个回答<span class="iconfont icon-you"></span></a>
        </div>
      </div>
      <div class="answerContent">
        <div class="newsAuthor">
          <div class="left">
            <a href="javascript:;" @click="toAuthorPage(answerInfo.scSysUser.id)" v-if="answerInfo.scSysUser">
              <!--<img src="http://p3.pstatp.com/large/149d00049fdf3c4e14ca">-->
              <img :src="answerInfo.scSysUser.userpic?answerInfo.scSysUser.userpic:require('../../../static/images/mrtx.png')">
              <div>
                <p>{{answerInfo.scSysUser.username}}</p>
                <!--<p>夜晚不黑</p>-->
                <!--<p>2018.03.09 14:02</p>-->
                <p>{{answerInfo.releaseTime}}</p>
              </div>
            </a>
          </div>
          <div class="right">
            <a href="javascript:;"
               v-if="hasConcern==0"
               @click="createCityAndCancel(answerInfo.scSysUser.id)"
               ref="hasConcernBtn">
              <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
            </a>
            <a href="javascript:;"
               v-if="hasConcern==1"
               @click="createCityAndCancel(answerInfo.scSysUser.id)"
               ref="hasConcernBtn">
              <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
            </a>
            <a href="javascript:;"
               @click="AttentionAndCancel(answerInfo.scSysUser.id)"
               v-if="isSubscribe==0"
               ref="AttentionBtn">
              <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
            </a>
            <a href="javascript:;"
               @click="AttentionAndCancel(answerInfo.scSysUser.id)"
               v-if="isSubscribe==1"
               ref="AttentionBtn">
              <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
            </a>
          </div>
        </div>
        <div class="answerDetail" v-html="answerInfo.articleContent" ref="answerDetail"></div>
        <div class="isLike">
          <div class="fl">
            <span class="iconfont icon-dianzanshu" @click="praise(answerInfo.articleId)" v-bind:class="{'red':isPraised==1}" ref="praiseNumber">&nbsp;{{answerInfo.praiseNumber}}</span>
            <!--<span class="iconfont icon-dianzan" @click="retort">{{newsInfo.retortNumber?newsInfo.retortNumber:0}}</span>-->
          </div>
          <div class="fr" @click="toReport"><span>举报</span></div>
        </div>
        <div class="commentBox"><comment ref="comment" :commentObj="commentObj" @agree="agree"></comment></div>
      </div>
      <div class="loading-wrapper"></div>
    </scroll>
    <div class="pageBottom">
      <div class="mineComment" v-show="!maskShow">
        <input type="text" class="toComment" @click="showMask" placeholder="说点什么吧...">
        <span class="iconfont icon-xinxi" @click="lookMoreComment"><i class="badge">{{totalCommentNum}}</i></span>
      </div>
      <div class="mask" id="mask" @click="closeMask" v-show="maskShow"></div>
      <div class="commentArea" v-show="maskShow">
        <form action="#">
          <textarea placeholder="优质评论将会被优先展示" v-model.trim="commentContent" v-to-focus></textarea>
          <a href="javascript:;" class="sentComment" @click="sentComment" v-bind:class="{'color':commentContent!==''}">发送</a>
        </form>
      </div>
    </div>
    <div class="loginBox">
      <needLogin></needLogin>
    </div>
    <div class="loading" v-if="loading"><loading></loading></div>
    <shareModule ref="newsInfoShareModule" :info="answerInfo"></shareModule>
  </div>
</template>

<script>
  import qs from 'qs'
  import $ from 'jquery'
  import {Toast} from 'mint-ui'
  import {Indicator} from 'mint-ui'
  import comment from '../common/comment'
  import scroll from '../common/BScroll'
  import needLogin from '../common/needLogin'
  import shareModule from '../common/shareModule'
  import loading from '../common/loading'
  export default {
    components:{
      comment,
      scroll,
      needLogin,
      shareModule,
      loading
    },
    created:function () {
      this.articleId = this.$route.params.articleId;
      this.getAnswerInfo();
      this.getCommentList(this.articleId)
    },
    data:function () {
      return{
        answerInfo:{},
        isPraised: 0,
        isEnshrined: 0,//是否收藏
        isSubscribe: 0,//是否关注
        hasConcern: 0,//是否筑城
        maskShow: false,
        commentContent: '',
        totalCommentNum: 0,
        articleId:'',
        loading:true,
        lastRefreshTime:'',
        refreshDataLength:-1,
        commentObj:[],
        pageNo:1,
        isAjax:true
      }
    },
    methods:{
      goBack:function () {
        this.$router.go(-1)
      },
      getAnswerInfo:function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/queryQuestionDetail',
          data:JSON.stringify({
            "scCmsReadingDevicetype": "",
            "scCmsMacId": "",
            "userId": sessionStorage.getItem('userId'),
            "scCmsReadingDevice": "",
            "articleId": this.articleId
          })
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          this.answerInfo = res.data.data;
          this.isSubscribe= res.data.data.scSysUser.isSubscribe;
          this.hasConcern = res.data.data.scSysUser.hasConcern;
          this.loading = false
        })
      },
      nextAnswer:function () {
        if(!this.answerInfo.scCmsAnswer){
          Toast('提问数据异常，暂无法查看更多内容');
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/queryNextAnswerDetail',
          data:JSON.stringify({
            "scCmsReadingDevicetype": "",
            "scCmsMacId": "H5",
            "userId": sessionStorage.getItem('userId'),
            "scCmsReadingDevice": "",
            "scCmsAnswerArticleId": this.answerInfo.scCmsAnswer.scCmsAnswerArticleId,
            "scCmsQuestionArticleId":this.answerInfo.scCmsAnswer.scCmsQuestionArticleId
          })
        };
        Indicator.open();
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          Indicator.close();
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }else if(!res.data.data.scCmsAnswer){
            Toast('没有更多回答了');
            return
          }
          this.answerInfo = res.data.data;
          this.pageNo = 1;
          this.articleId = this.answerInfo.scCmsAnswer.scCmsAnswerArticleId;
          this.isAjax = true;
          this.$refs.singleAnswerScroll.scrollTo(0,0,0);
          this.getCommentList(this.articleId)
        })
      },
      praise: function (articleId) {
        if (!sessionStorage.getItem('userId')) {
          this.showLoginPage();
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/articlePraiseOrRetort',
          data: JSON.stringify({
            "praiseUser": sessionStorage.getItem('userId'),
            "praiseOrRetort": 1,
            "articleId": articleId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          this.isPraised = res.data.data.isPraised;
          if (res.data.data.isPraised == 0) {
            this.$refs.praiseNumber.innerText = this.$refs.praiseNumber.innerText * 1 - 1
          } else if (res.data.data.isPraised == 1) {
            this.$refs.praiseNumber.innerText = this.$refs.praiseNumber.innerText * 1 + 1
          }
        })
      },
      toAuthorPage: function (authorId) {
        this.$router.push({path: '/author/authorPage/homePage/' + authorId})
      },
      AttentionAndCancel: function (id) {
        if (!sessionStorage.getItem('userId')) {
          this.showLoginPage();
          return
        }
        var url = 'zxcity_restful/ws/rest';
        var data = {
          cmd: '',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),//平台用户主键
            "attentionUserId": id //其他用户主键
          }),
          version: 1
        };
        if (this.isSubscribe == 0) {
          data.cmd = 'cms_new/addUserAttention'
        } else if (this.isSubscribe == 1) {
          data.cmd = 'cms_new/cancelAttention'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if (this.isSubscribe == 0) {
            // this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu_selected@2x.png" style="width: 100%;">';
            this.isSubscribe = 1
          } else if (this.isSubscribe == 1) {
            // this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu@2x.png" style="width: 100%;">';
            this.isSubscribe = 0
          }
          Toast(res.data.msg);
        })
      },
      createCityAndCancel: function (id,) {
        if (!sessionStorage.getItem('userId')) {
          this.showLoginPage();
          return
        }
        var url = 'zxcity_restful/ws/rest';
        var data = {
          cmd: '',
          data: JSON.stringify({
            "buildId": id,
            "userId": sessionStorage.getItem('userId')
          })
        };
        if (this.hasConcern == 0) {
          data.cmd = 'cms_new/buildUser'
        } else if (this.hasConcern == 1) {
          data.cmd = 'cms_new/delBuildUser'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if (this.hasConcern == 0) {
            Toast(res.data.msg);
            // this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng_selected@2x.png" style="width: 100%;">';
            this.hasConcern = 1
          } else if (this.hasConcern == 1) {
            Toast('取消筑城成功');
            // this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng@2x.png" style="width: 100%;">';
            this.hasConcern = 0
          }
        })
      },
      toReport: function () {
        this.$refs.newsInfoShareModule.toReport()
      },
      getCommentList:function (articleId) {
        if(!this.isAjax){return}
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
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.commentObj = res.data.data;
            this.totalCommentNum = res.data.data.totalCount;
            this.refreshDataLength = res.data.data.scCmsCommentList.length
          }else if(this.pageNo>1){
            this.commentObj.scCmsCommentList = this.commentObj.scCmsCommentList.concat(res.data.data.scCmsCommentList);
            if(this.commentObj.scCmsCommentList.length===this.totalCommentNum){this.isAjax = false}
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
          this.commentObj = res.data.data;
          this.totalCommentNum = res.data.data.totalCount;
          this.refreshDataLength = res.data.data.scCmsCommentList.length
        })
      },
      lookMoreComment: function () {
        // this.$refs.scroll.scrollTo(0, -this.to, 500);
        this.$refs.singleAnswerScroll.scrollToElement($('#title')[0], 500);
      },
      // 收藏或者取消收藏
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
            "articleId": this.newsInfo.articleId
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
          setTimeout(() => {
            this.showLoginPage();
          }, 100);
          return
        }
        this.maskShow = true
      },
      showShareBtns: function () {
        this.$refs.newsInfoShareModule.showShareBtns()
      },
      sentComment: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
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
            // this.$refs.comment.getCommentList(this.answerInfo.articleId);
            this.getCommentList_1(this.answerInfo.articleId);
            this.commentContent = '';
            this.maskShow = false;
            this.isAjax = true
          }
        })
      },
      showLoginPage: function () {
        $('.loginBox').show();
        setTimeout(function () {
          $('.loginBox').css({'top': '0'});
        }, 0);
      },
      closeLoginPage: function () {
        $('.loginBox').css({'top': '100%'});
        setTimeout(function () {
          $('.loginBox').hide();
        }, 300);
      },
      toAnswerInfo:function () {
        if(!this.answerInfo.scCmsAnswer){
          Toast('提问数据异常，暂无法查看更多内容');
          return
        }
        this.$router.push({path:'/author/authorPage/homePage/answerInfo/'+this.answerInfo.scCmsAnswer.scCmsQuestionArticleId})

      },
      importVuePreview:function () {
        var imgs = this.$refs.answerDetail.querySelectorAll(" img");
        var list = [];
        // var index = -1;
        imgs.forEach((v, i) => {
          v.setAttribute('style', 'width:100%');
          //完成图片预览功能，集成vue-preview插件
          v.classList.add('preview-img');
          if (v.getAttribute('src').indexOf('file:') == -1) {
            list[i] = {
              w: window.innerWidth,
              h: v.height,
              src: v.getAttribute('src'),
            };
            //图片加载成功
            v.onload = function () {
              list[i] = {
                w: window.innerWidth,
                h: v.height,
                src: v.getAttribute('src'),
              };
            };
            // 图片加载失败
            v.onerror = function(){
              list[i] = {
                w: window.innerWidth,
                h: v.height,
                src: v.getAttribute('src'),
              };
            }
          } else {
            list[i] = {
              w: 750,
              h: 422,
              src: require('../../../static/images/zw750.png'),
            };
          }
          v.addEventListener('click', () => {
            //避免某些新闻详情页启用图片预览插件时奇怪报错
            if (list.length === 0) {
              return
            }
            this.$preview.open(i, list);
          })
        });
      },
      deBug_vuePreview:function () {
        this.timer = setInterval(function () {
          if ($('.pswp').attr('aria-hidden') == 'true' && $('.pswp').hasClass('pswp--open')) {
            $('.pswp').removeClass('pswp--open').
            removeClass('pswp--touch').
            removeClass('pswp--css_animation').
            removeClass('pswp--svg').
            removeClass('pswp--visible').
            removeClass('pswp--animated-in');
          }
        }, 1000)
      },
      loadMore:function () {
        this.pageNo++;
        this.getCommentList(this.articleId)
      },
      loadData:function () {
        this.isAjax = true;
        this.pageNo = 1;
        this.getCommentList(this.articleId)
      },
      agree:function (commentId, isPraise) {
        if(isPraise===1){
          Toast('已经赞过了');
          return;
        }
        if(!sessionStorage.getItem('userId')){
          this.showLoginPage();
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/addPraiseToCommentNew',
          data: JSON.stringify({
            "userImgUrl": sessionStorage.getItem('userPic'),
            "userId": sessionStorage.getItem('userId')||'',
            "userName": sessionStorage.getItem('userName'),
            "commentId":commentId
          }),
          version: 1
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          Toast(res.data.msg);
          this.getCommentList_1(this.articleId);
          this.isAjax = true
        })
      },
      toAnswer:function () {
        if(!sessionStorage.getItem('userId')){
          this.showLoginPage();
          return
        }
        if(sessionStorage.getItem('subscriptionId')&&sessionStorage.getItem('subscriptionId') === 'null'){
          Toast('当前版本只有作家才有权限回答问题，请前往http://writer.izxcs.com申请智享头条号');
          return
        }
        sessionStorage.setItem('questionInfo',JSON.stringify(this.answerInfo));
        this.$router.push({path:'/toAnswerPage'})
        // Toast('当前版本只有作家才有权限回答问题，请前往http://writer.izxcs.com申请智享头条号')
      },
    },
    mounted:function () {
      $('.singleAnswer-wrapper').height($(window).height()-$('.singleAnswer-header').height()-$('.mineComment').height());
      //解决部分新闻详情页中，退出图片预览后无法退出的问题
      this.deBug_vuePreview()
    },
    updated:function () {
      this.$nextTick(function () {
        //集成图片预览插件
        this.importVuePreview()

      })
    },
    directives: {
      "to-focus": function (el) {
        el.focus();
      }
    },
  }
</script>


<style scoped lang="less" type="text/less">
  .singleAnswer-header {
    width: 100%;
    height: 90/32rem;
    background-color: #fff;
    border-bottom: 1/32rem solid #dadada;
    position: relative;
    z-index: 1;
    .back{
      display: inline-block;
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 36/32rem;
      color: #464256;
    }
    .nextAnswer{
      float: right;
      width: 140/32rem;
      height: 46/32rem;
      line-height: 46/32rem;
      text-align: center;
      border: 1/32rem solid #999999;
      font-size: 22/32rem;
      color: #333333;
      margin-top: 22/32rem;
      margin-right: 20/32rem;
      border-radius: 4/32rem;
      background-color: #f8f8f8;
    }
    .shareBtn{
      float: right;
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 44/32rem;
      color: #666666;
    }
  }
  .question{
    width: 100%;
    height: 100%;
    border-bottom: 1/32rem solid #dadada;
    .questionTitle{
      width: 100%;
      height: 100%;
      padding: 24/32rem;
      .questionLabel{
        display: inline-block;
        width: 99/32rem;
        height: 40/32rem;
        background: url("../../../static/images/til_wenda@2x.png") no-repeat center;
        -webkit-background-size: 100%;
        background-size: 100%;
        vertical-align: text-top;
      }
      span{
        font-size: 44/32rem;
        color: #53537d;
        line-height: 50/32rem;
      }
    }
    .questionBottom{
      overflow: hidden;
      padding: 0 24/32rem 24/32rem 24/32rem;
      .answerBtn{
        float: left;
        width: 120/32rem;
        height: 46/32rem;
        background: url("../../../static/images/wendaxiangqing_icon_huida@2x.png") no-repeat center;
        -webkit-background-size: 100%;
        background-size: 100%;
      }
      .toAnswer{
        float: right;
        height: 46/32rem;
        line-height: 46/32rem;
        font-size: 28/32rem;
        color: #333333;
        span{
          font-size: 28/32rem;
          color: #333333;
        }
      }
    }
  }
  .answerContent{
    .newsAuthor {
      width: 100%;
      display: flex;
      padding: 30/32rem 20/32rem;
      .left {
        flex: 3;
        a {
          display: block;
          img {
            width: 80/32rem !important;
            height: 80/32rem;
            border-radius: 50%;
            float: left;
            margin-right: 30/32rem;
          }
          div {
            p {
              line-height: 40/32rem;
              font-size: 22/32rem;
              color: #787878;
            }
            p:nth-of-type(1) {
              font-size: 34/32rem;
              color: #3c3b3b;
            }
          }
        }
      }
      .right {
        flex: 2;
        a {
          display: inline-block;
          width: 114/32rem;
          height: 47/32rem;
          /*<!--font-size: 14/32rem;-->*/
          border-radius: 6/32rem;
          /*<!--line-height: 40/32rem;-->*/
          /*text-align: center;*/
          /*color: #fff;*/
          /*<!--margin: 0 5/32rem;-->*/
          img {
            width: 100%;
          }
        }
      }
    }
    .answerDetail{
      font-size: 36/32rem;
      color: #333333;
      line-height: 58/32rem;
      padding: 0 20/32rem;
    }
    .isLike {
      width: 100%;
      font-size: 30/32rem;
      color: #787878;
      margin-bottom: 20/32rem;
      margin-top: 35/32rem;
      overflow: hidden;
      div {
        span {
          padding: 15/32rem;
          &:before {
            font-size: 40/32rem;
          }
        }
      }
    }
    .commentBox{
      width: 100%;
      height: 100%;
      border-top: 20/32rem solid #f4f4f4;
    }
  }
  .pageBottom{
    .mineComment {
      width: 100%;
      height: 100/32rem;
      line-height: 90/32rem;
      background-color: #f4f4f4;
      border-top: 1/32rem solid #d8d8d8;
      padding: 0 20/32rem;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 0;
      .toComment {
        display: inline-block;
        width: 87%;
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
  .loginBox {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 2;
    display: none;
    transition: all .3s;
  }
  .loading{
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
  }
  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .red {
    color: red;
  }
</style>
