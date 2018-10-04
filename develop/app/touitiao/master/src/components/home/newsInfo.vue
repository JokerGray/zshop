<template>
  <div>
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <div class="backBox"><a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a></div>
    <div id="newsContent">
      <!--<goBack ref="backBtn" @goBack="goBack"></goBack>-->
      <scroll
        class="newsInfo_wrapper"
        ref="scroll"
        :pulldown="true"
        :pullup="true"
        :data="commentObj.scCmsCommentList"
        :lastRefreshTime="lastRefreshTime"
        :totalNum="totalCommentNum"
        :refreshDataLength="refreshDataLength"
        @scrollToEnd="loadMore"
        @pulldown="loadData">
        <div v-if="!loading">
          <div class="title">
            <h4>{{newsInfo.articleTitle}}</h4>
          </div>
          <div class="newsAuthor">
            <div class="left">
              <a href="javascript:;" @click="toAuthorPage(newsInfo.scSysUser.id)">
                <img :src="newsInfo.scSysUser.userpic?newsInfo.scSysUser.userpic:require('../../../static/images/mrtx.png')">
                <div>
                  <p>{{newsInfo.scSysUser.username}}</p>
                  <p>{{newsInfo.releaseTime}}</p>
                </div>
              </a>
            </div>
            <div class="right">
              <a href="javascript:;"
                 v-if="hasConcern==0"
                 @click="createCityAndCancel(newsInfo.scSysUser.id)"
                 ref="hasConcernBtn">
                <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
              </a>
              <a href="javascript:;"
                 v-if="hasConcern==1"
                 @click="createCityAndCancel(newsInfo.scSysUser.id)"
                 ref="hasConcernBtn">
                <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
              </a>
              <a href="javascript:;"
                 @click="AttentionAndCancel(newsInfo.scSysUser.id)"
                 v-if="isSubscribe==0"
                 ref="AttentionBtn">
                <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
              </a>
              <a href="javascript:;"
                 @click="AttentionAndCancel(newsInfo.scSysUser.id)"
                 v-if="isSubscribe==1"
                 ref="AttentionBtn">
                <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
              </a>
            </div>
          </div>
          <div v-html="newsInfo.articleContent" id="content"></div>
          <div class="isLike">
            <div class="fl">
              <span class="iconfont icon-dianzanshu" @click="praise(newsInfo.articleId)" v-bind:class="{'red':isPraised==1}" ref="praiseNumber">&nbsp;{{newsInfo.praiseNumber}}</span>
              <!--<span class="iconfont icon-dianzan" @click="retort">{{newsInfo.retortNumber?newsInfo.retortNumber:0}}</span>-->
            </div>
            <div class="fr" @click="toReport"><span>举报</span></div>
          </div>
          <div class="similarNews">
            <ul>
              <li v-for="(item,index) in newsInfo.recommendArticleList" :key="index" @click="toNewsInfo(item.articleId,item.previewImgType)">
                <div class="left">
                  <h4>{{item.articleTitle}}</h4>
                  <div class="newsMsg">
                    <div class="fl">
                      <span>{{item.scSysUser.username}}</span>&nbsp;
                      <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                    </div>
                    <div class="fr"><span>{{item.releaseTime.substring(0,10)}}</span></div>
                  </div>
                </div>
                <div class="right"><img :src="item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl"></div>
              </li>
              <!--<li>-->
              <!--<div class="left">-->
              <!--<h4>什么时内容化设计？设计师问什么关注内容？通过设计师的手段提高内容体验？阿里设设设设设设设设设设设设</h4>-->
              <!--<div class="newsMsg">-->
              <!--<div class="fl">-->
              <!--<span>夜晚不黑</span>-->
              <!--<span class="iconfont icon-xinxi">1260</span>-->
              <!--</div>-->
              <!--<div class="fr"><span>2017.12.19</span></div>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="right"><img src="../../../static/images/3.jpg"></div>-->
              <!--</li>-->
            </ul>
          </div>
          <!--<div class="ad-box">-->
          <!--<div class="outAd">-->
          <!--<h4>什么时内容化设计？设计师问什么关注内容？通过设计师的手段提高内容体验？阿里设设设设</h4>-->
          <!--<div class="adPic">-->
          <!--<img src="../../../static/images/3.jpg" alt="">-->
          <!--<img src="../../../static/images/3.jpg" alt="">-->
          <!--<img src="../../../static/images/3.jpg" alt="">-->
          <!--</div>-->
          <!--<p>[云店广告]</p>-->
          <!--</div>-->
          <!--</div>-->
          <div class="comment">
            <comment ref="comment" :commentObj="commentObj" @agree="agree"></comment>
          </div>
        </div>
        <div class="loading-wrapper"></div>
      </scroll>
      <div class="mineComment" v-show="!maskShow">
        <input type="text" class="toComment" @click="showMask" placeholder="说点什么吧...">
        <span class="iconfont icon-xinxi" @click="lookMoreComment"><i class="badge">{{totalCommentNum}}</i></span>
        <span class="iconfont" @click="toCollection" id="collection" v-bind:class="{'icon-icon':isEnshrined==0,'icon-shoucang11':isEnshrined==1,'red':isEnshrined==1}"></span>
        <span class="iconfont icon-fenxiang" @click="showShareBtns" id="shareBtn"></span>
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
    <shareModule ref="newsInfoShareModule" :info="newsInfo"></shareModule>
  </div>
</template>

<script>
  import qs from 'qs'
  import loading from '../common/loading.vue'
  import comment from '../common/comment'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import $ from 'jquery'
  import needLogin from '../common/needLogin'
  import shareModule from '../common/shareModule'
  // import goBack from '../common/goBack'
  export default {
    components: {
      loading,
      // goBack,
      comment,
      scroll,
      needLogin,
      shareModule
    },
    data: function () {
      return {
        newsInfo: {},
        loading: true,
        isPraised: 0,
        isEnshrined: 0,
        isSubscribe: 0,
        hasConcern: 0,
        maskShow: false,
        commentContent: '',
        totalCommentNum: 0,
        timer: '',
        commentObj:{},
        pageNo:1,
        lastRefreshTime:'',
        refreshDataLength:-1,
        isAjax:true
        // to: '',
      }
    },
    created: function () {
      this.getNewsInfo(this.$route.params.articleId);
      // this.totalCommentNum = this.$refs.comment.totalCommentNum;
    },
    methods: {
      goBack: function () {
        this.$router.go(-1);
        clearInterval(this.timer)
      },
      getNewsInfo: function (articleId) {
        setTimeout(() => {
          this.loading = true;
          var data = {
            cmd: 'cms_new/queryArticleDetail',
            //cmd: 'cms_back/queryArticleById',
            data: JSON.stringify({
              "userId": sessionStorage.getItem('userId') || '',
              "articleId": articleId,
              "praiseUser": ""
            }),
            version: 1
          };
          var url = '/zxcity_restful/ws/rest';
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            this.newsInfo = res.data.data;
            this.loading = false;
            this.isEnshrined = res.data.data.isEnshrined;
            this.isSubscribe = res.data.data.scSysUser.isSubscribe;
            this.hasConcern = res.data.data.scSysUser.hasConcern;
            this.isPraised = res.data.data.isPraised;
            this.getCommentList(articleId);
          })
        }, 400)
      },
      //文章点赞或者取消点赞
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
          this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
          if(this.pageNo===1){
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
          this.refreshDataLength = res.data.data.scCmsCommentList.length;
          this.isAjax = true
        })
      },
      lookMoreComment: function () {
        // this.$refs.scroll.scrollTo(0, -this.to, 500);
        this.$refs.scroll.scrollToElement($('#title')[0], 500);
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
      sentComment: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          // cmd: 'cms_new/addFirstCmsComment',
          cmd: 'cms_new/addCmsComment',
          data: JSON.stringify({
            userId: sessionStorage.getItem('userId'),
            userName: sessionStorage.getItem('userName'),
            userImgUrl: sessionStorage.getItem('userPic'),
            articleId: this.newsInfo.articleId,
            commentComment: this.commentContent,
            parentReplyId: '0'
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          console.log(res);
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          } else {
            Toast(res.data.msg);
            // this.$refs.comment.getCommentList(this.newsInfo.articleId);
            this.getCommentList_1(this.newsInfo.articleId);
            this.commentContent = '';
            this.maskShow = false;
          }
        })
      },
      showShareBtns: function () {
        this.$refs.newsInfoShareModule.showShareBtns()
      },
      toReport: function () {
        this.$refs.newsInfoShareModule.toReport()
      },
      toAuthorPage: function (authorId) {
        this.$router.push({path: '/author/authorPage/homePage/' + authorId})
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
      toNewsInfo: function (articleId, previewImgType) {
        if (previewImgType == '1' || previewImgType == '2') {
          // 动态添加路由
          var p = new Date().getTime();
          this.$router.options.routes.push({//插入路由
            'name': 'newsInfo',
            'path': '/newsInfo/' + p + '/:articleId',
            'component': resolve => require(['./newsInfo'], resolve)//将组件用require引进来
          });
          this.$router.addRoutes(this.$router.options.routes);
          this.$router.push({path: '/newsInfo/' + p + '/' + articleId});
        } else if (previewImgType == '3') {
          this.$router.push({path: '/pictures/' + articleId});
        } else if (previewImgType == '5') {
          this.$router.push({path: '/videoInfo/' + articleId});
        }
        // this.getNewsInfo(articleId)
      },
      agree:function (commentId,isPraise) {
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
          this.getCommentList_1(this.newsInfo.articleId)
        })
      },
      loadMore:function () {
        this.pageNo++;
        this.getCommentList(this.newsInfo.articleId)
      },
      loadData:function () {
        this.isAjax = true;
        this.pageNo = 1;
        this.getCommentList(this.newsInfo.articleId)
      },
      importVuePreview:function () {
        var imgs = document.querySelectorAll("#content img");
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
              // src: require('../../../static/images/zw750.png'),
              src: v.getAttribute('src')
            };
          }
          // if( v.width>1 && v.height>1){
          //   list.push({
          //     w: window.innerWidth,
          //     h: v.height,
          //     src: v.getAttribute('src'),
          //   })
          // }else{
          //   list.push({
          //     w: window.innerWidth,
          //     h: window.innerHeight/2,
          //     src: v.getAttribute('src'),
          //   })
          // }
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
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.newsInfo_wrapper').height($(window).height() - $('.backBox').height() - $('.mineComment').height());

        //解决部分新闻详情页中，退出图片预览后无法退出的问题
        // this.deBug_vuePreview()
      })
    },
    updated: function () {
      this.$nextTick(function () {
        //集成图片预览插件
        // this.importVuePreview()
      })
    },
    watch: {
      $route: function (val, old) {
        if (val.name !== 'newsInfo') {
          clearInterval(this.timer)
        }
        // if (val.params.articleId && val.params.articleId !== this.articleId && old.name === 'newsInfo') {
        //   this.articleId = val.params.articleId;
        //   this.getNewsInfo(this.articleId)
        // }
      },
    },
    directives: {
      "to-focus": function (el) {
        el.focus();
      }
    },
    // computed:{
    //   articleId:function () {
    //     return this.$route.params.articleId
    //   }
    // }
  }
</script>

<style scoped lang="less" type="text/less">
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

  .loading {
    width: 100%;
    height: 93%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1001;
  }

  .backBox {
    width: 100%;
    height: 90/32rem;
    border-bottom: 1/32rem solid #eee;
    position: fixed;
    top: 0;
    left: 0;
    a {
      display: block;
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 36/32rem;
    }
  }

  #newsContent {
    overflow: hidden;
    margin-top: 90/32rem;
    background-color: #fff;
    .title {
      font-size: 44/32rem;
      color: #53537d;
      margin: 20/32rem 20/32rem 0 20/32rem;
    }
    .newsAuthor {
      width: 100%;
      display: flex;
      margin: 50/32rem 20/32rem;
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
    #content {
      padding: 0 20/32rem;
      line-height: 50/32rem;
      /deep/video{
        /deep/&::-internal-media-controls-download-button {
          display:none;
        }
        /deep/&::-webkit-media-controls-enclosure {
          overflow:hidden;
        }
        /deep/&::-webkit-media-controls-panel {
          width: calc(125%);
        }
      }
      /deep/iframe{
        width: 100%;
        /deep/#mod_player{
          /deep/.tenvideo_player{
            width: 100% !important;
            margin: 0 !important;
          }
        }
      }
      /deep/img{
        width: 100%;
      }
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
    .ad-box {
      width: 100%;
      height: 486/32rem;
      border-top: 20/32rem solid #f4f4f4;
      border-bottom: 20/32rem solid #f4f4f4;
      padding: 30/32rem 20/32rem;
      .outAd {
        width: 100%;
        height: 386/32rem;
        border: 1/32rem solid #eee;
        padding: 0 20/32rem;
        h4 {
          font-size: 32/32rem;
          color: #443d5c;
          margin: 20/32rem 0;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 2; /** 显示的行数 **/
          overflow: hidden; /** 隐藏超出的内容 **/
        }
        .adPic {
          width: 100%;
          height: 210/32rem;
          img {
            width: 210/32rem;
            height: 210/32rem;
            border-radius: 8/32rem;
            float: left;
            &:nth-last-of-type(2) {
              margin: 0 18/32rem;
            }
          }
        }
        p {
          font-size: 22/32rem;
          color: #9172fa;
          margin-top: 20/32rem;
        }
      }
    }
    .similarNews {
      width: 100%;
      padding: 0 20/32rem;
      ul {
        width: 100%;
        li {
          width: 100%;
          height: 226/32rem;
          border-bottom: 1/32rem solid #eeeeee;
          position: relative;
          .left {
            height: 226/32rem;
            width: 100%;
            padding-right: 167/32rem;
            padding-top: 30/32rem;
            position: absolute;
            left: 0;
            top: 0;
            h4 {
              font-size: 32/32rem;
              color: #53537d;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
              -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
              -webkit-line-clamp: 3; /** 显示的行数 **/
              overflow: hidden; /** 隐藏超出的内容 **/
            }
            .newsMsg {
              width: 100%;
              padding-right: 167/32rem;
              overflow: hidden;
              position: absolute;
              bottom: 30/32rem;
              left: 0;
              span {
                font-size: 24/32rem;
                color: #a7a7a7;
              }
              div:nth-of-type(2) {
                margin-right: 60/32rem;
              }
            }
          }
          .right {
            width: 167/32rem;
            height: 226/32rem;
            position: absolute;
            right: 0;
            top: 30/32rem;
            img {
              border-radius: 8/32rem;
              width: 167/32rem;
              height: 167/32rem;
            }

          }
          &:last-of-type {
            border: none;
          }

        }
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
