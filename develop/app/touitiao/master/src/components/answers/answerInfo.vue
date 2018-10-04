<template>
  <div>
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <div class="backBox">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <span class="labelImg"></span>
      <span class="iconfont icon-shenglvehao shareBtn" @click="showShareBtns"></span>
    </div>
    <div id="newsContent">
      <!--<goBack ref="backBtn" @goBack="goBack"></goBack>-->
      <scroll class="newsInfo_wrapper"
              ref="scroll"
              :pulldown="true"
              :pullup="true"
              :data="answerList"
              :lastRefreshTime="lastRefreshTime"
              :totalNum="answerNum"
              :refreshDataLength="refreshDataLength"
              @scrollToEnd="loadMore"
              @pulldown="loadData">
        <div v-if="!loading">
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
                 v-if="newsInfo.scSysUser.hasConcern==0"
                 @click="createCityAndCancel(newsInfo.scSysUser.id,newsInfo.scSysUser.hasConcern)"
                 ref="hasConcernBtn">
                <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
              </a>
              <a href="javascript:;"
                 v-if="newsInfo.scSysUser.hasConcern==1"
                 @click="createCityAndCancel(newsInfo.scSysUser.id,newsInfo.scSysUser.hasConcern)"
                 ref="hasConcernBtn">
                <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
              </a>
              <a href="javascript:;"
                 @click="AttentionAndCancel(newsInfo.scSysUser.id,newsInfo.scSysUser.isSubscribe)"
                 v-if="newsInfo.scSysUser.isSubscribe==0"
                 ref="AttentionBtn">
                <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
              </a>
              <a href="javascript:;"
                 @click="AttentionAndCancel(newsInfo.scSysUser.id,newsInfo.scSysUser.isSubscribe)"
                 v-if="newsInfo.scSysUser.isSubscribe==1"
                 ref="AttentionBtn">
                <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
              </a>
            </div>
          </div>
          <div class="title">
            <h4>{{newsInfo.articleTitle}}</h4>
          </div>
          <div v-html="newsInfo.articleContent" id="content" ref="answerContent"></div>
          <div class="answerBox">
            <div class="answerLabel"><span>{{answerNum}}回答</span></div>
            <div class="answerList">
              <ul>
                <li v-for="(item,index) in answerList" :index="index">
                  <div class="answerAuthor">
                    <div>
                      <img :src="item.scSysUser.userpic">
                      <p>{{item.scSysUser.username}}</p>
                      <p>{{item.releaseTime}}</p>
                    </div>
                    <div>
                      <!--<a href="javascript:;"><img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')"></a>-->
                      <!--<a href="javascript:;"><img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')"></a>-->
                      <a href="javascript:;"
                         v-if="item.scSysUser.hasConcern==0"
                         @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)"
                         ref="hasConcernBtn">
                        <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
                      </a>
                      <a href="javascript:;"
                         v-if="item.scSysUser.hasConcern==1"
                         @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)"
                         ref="hasConcernBtn">
                        <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
                      </a>
                      <a href="javascript:;"
                         @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)"
                         v-if="item.scSysUser.isSubscribe==0"
                         ref="AttentionBtn">
                        <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
                      </a>
                      <a href="javascript:;"
                         @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)"
                         v-if="item.scSysUser.isSubscribe==1"
                         ref="AttentionBtn">
                        <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
                      </a>
                    </div>
                  </div>
                  <div class="answerContent" v-html="item.articleContent" @click="toSingleAnswer(item.articleId)">
                    <!--<p class="answerText">为什么要编写这个教程？因为我在学习Git的过程中，买过书，也在网上Google了一堆Git相关的文章和教程，但令人失望的是，这些教程不是难得令人发指，就是简单得一笔带过，或者，只支离破碎地介绍Git的某几个命令，还有直接从Git手册粘贴帮助文档的，总之，初学者很难找到一个由浅入深，学完后能立刻上手的Git教程</p>-->
                    <!--<img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zxEyWbJY7J5k3SGzP37WwZ3pjD.jpg">-->
                  </div>
                  <div class="answerAmount" @click="toSingleAnswer(item.articleId)">
                    <span><i class="iconfont icon-chakan1"></i>&nbsp;<span>{{item.articleBrowser}}</span></span>
                    <span><i class="iconfont icon-xinxi"></i>&nbsp;<span>{{item.commentNum}}</span></span>
                  </div>
                </li>
                <!--<li>-->
                  <!--<div class="answerAuthor">-->
                    <!--<div>-->
                      <!--<img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zxQTybcSBpiam444JEpyH6bckc.jpg">-->
                      <!--<p>夜晚不黑</p>-->
                      <!--<p>2018.03.09 03:32</p>-->
                    <!--</div>-->
                    <!--<div>-->
                      <!--<a href="javascript:;"><img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')"></a>-->
                      <!--<a href="javascript:;"><img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')"></a>-->
                    <!--</div>-->
                  <!--</div>-->
                  <!--<div class="answerContent">-->
                    <!--<p class="answerText">为什么要编写这个教程？因为我在学习Git的过程中，买过书，也在网上Google了一堆Git相关的文章和教程，但令人失望的是，这些教程不是难得令人发指，就是简单得一笔带过，或者，只支离破碎地介绍Git的某几个命令，还有直接从Git手册粘贴帮助文档的，总之，初学者很难找到一个由浅入深，学完后能立刻上手的Git教程</p>-->
                    <!--<img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zxEyWbJY7J5k3SGzP37WwZ3pjD.jpg">-->
                  <!--</div>-->
                  <!--<div class="answerAmount">-->
                    <!--<span><i class="iconfont icon-chakan1"></i>&nbsp;<span>1260</span></span>-->
                    <!--<span><i class="iconfont icon-xinxi"></i>&nbsp;<span>1260</span></span>-->
                  <!--</div>-->
                <!--</li>-->
              </ul>
            </div>
          </div>
        </div>
        <div class="loading-wrapper"></div>
      </scroll>
    </div>
    <div class="doSomeThing">
      <a href="javascript:;" @click="toCollection">
        <span class="iconfont icon-icon" v-if="isEnshrined === 0"></span>
        <span class="iconfont icon-shoucang11" style="color: #fe6869;" v-if="isEnshrined === 1"></span>
        <span v-if="isEnshrined === 0">加入收藏</span>
        <span v-if="isEnshrined === 1">已收藏</span>
      </a>
      <a href="javascript:;" @click="toAnswer">回答</a>
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
      scroll,
      needLogin,
      shareModule
    },
    data: function () {
      return {
        newsInfo: {},
        answerList:[],
        answerNum:0,
        loading: true,
        isEnshrined: 0,//是否收藏
        //isSubscribe: 0,//是否关注
       // hasConcern: 0,//是否筑城
        timer: '',
        pageNo:1,
        lastRefreshTime:'',
        refreshDataLength:-1,
        isAjax:true
      }
    },
    created: function () {
      this.loading = true;
      this.getNewsInfo(this.$route.params.articleId);
      this.getAnswerList()
    },
    methods: {
      goBack: function () {
        this.$router.go(-1);
        clearInterval(this.timer)
      },
      getNewsInfo: function (articleId) {
        setTimeout(() => {
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
            // this.isSubscribe = res.data.data.scSysUser.isSubscribe;
            // this.hasConcern = res.data.data.scSysUser.hasConcern;
          })
        }, 400)
      },
      getAnswerList:function () {
        if(!this.isAjax){return}
        var url = 'zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/queryAnswerList',
          data:JSON.stringify({
            "userId": sessionStorage.getItem("userId"),
            "pagination": {
              "page": this.pageNo,
              "rows": 10
            },
            "articleId": this.$route.params.articleId
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
            this.answerList = res.data.data;
            this.answerNum = res.data.total;
            this.refreshDataLength = res.data.data.length;
          }else if(this.pageNo>1){
            this.answerList = this.answerList.concat(res.data.data);
            if(this.answerList.length===this.answerNum){
              this.isAjax = false
            }
          }
        })
      },
      AttentionAndCancel: function (id,isSubscribe) {
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
        if (isSubscribe == 0) {
          data.cmd = 'cms_new/addUserAttention'
        } else if (isSubscribe == 1) {
          data.cmd = 'cms_new/cancelAttention'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.getNewsInfo(this.$route.params.articleId);
          this.getAnswerList();
          // if (this.isSubscribe == 0) {
          //   // this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu_selected@2x.png" style="width: 100%;">';
          //   this.isSubscribe = 1
          // } else if (this.isSubscribe == 1) {
          //   // this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu@2x.png" style="width: 100%;">';
          //   this.isSubscribe = 0
          // }
          Toast(res.data.msg);
        })
      },
      createCityAndCancel: function (id,hasConcern) {
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
        if (hasConcern == 0) {
          data.cmd = 'cms_new/buildUser'
        } else if (hasConcern == 1) {
          data.cmd = 'cms_new/delBuildUser'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.getNewsInfo(this.$route.params.articleId);
          this.getAnswerList()
          if (hasConcern == 0) {
            Toast(res.data.msg);
            // this.hasConcern = 1
            // this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng_selected@2x.png" style="width: 100%;">';
          } else if (hasConcern == 1) {
            Toast('取消筑城成功');
            // this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng@2x.png" style="width: 100%;">';
            // this.hasConcern = 0
          }
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
      showShareBtns: function () {
        this.$refs.newsInfoShareModule.showShareBtns()
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
      importVuePreview:function () {
        var imgs = this.$refs.answerContent.querySelectorAll("img");
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
      toSingleAnswer:function (articleId) {
        this.$router.push({path:'/singleAnswer/'+articleId})
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
        sessionStorage.setItem('questionInfo',JSON.stringify(this.newsInfo));
        this.$router.push({path:'/toAnswerPage'})
      },
      loadMore:function () {
        this.pageNo++;
        this.getAnswerList();
      },
      loadData:function () {
        this.pageNo = 1;
        this.isAjax = true;
        this.getAnswerList();
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.newsInfo_wrapper').height($(window).height() - $('.backBox').height()-$('.doSomeThing').height());

        //解决部分新闻详情页中，退出图片预览后无法退出的问题
        this.deBug_vuePreview()
      })
    },
    updated: function () {
      this.$nextTick(function () {
        if(this.$refs.answerContent) {
          //集成图片预览插件
          this.importVuePreview()
        }
      })
    },
    watch: {
      $route: function (val, old) {
        if (val.name !== 'answerInfo') {
          clearInterval(this.timer)
        }
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
    .labelImg{
      position: absolute;
      width: 99/32rem;
      height: 41/32rem;
      background: url("../../../static/images/til_wenda@2x.png") no-repeat center;
      -webkit-background-size: 100%;
      background-size: 100%;
      left: 50%;
      top:50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
    }
    .shareBtn{
      position: absolute;
      top:50%;
      right: 30/32rem;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
      font-size: 44/32rem;
      color: #666666;
    }
  }

  #newsContent {
    overflow: hidden;
    margin-top: 90/32rem;
    background-color: #fff;
    .title {
      font-size: 44/32rem;
      color: #53537d;
      margin: 0 20/32rem 20/32rem 20/32rem;
    }
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
    #content {
      padding: 0 20/32rem;
      line-height: 40/32rem;
      font-size: 28/32rem;
      color: #333333;
    }
    .answerBox{
      width: 100%;
      height: 100%;
      .answerLabel{
        width: 100%;
        height: 86/32rem;
        background-color: #fff;
        border-bottom: 1/32rem solid #dadada;
        border-top: 20/32rem solid #f8f8f8;
        line-height: 66/32rem;
        span{
          display: inline-block;
          width: 140/32rem;
          height: 65/32rem;
          text-align: center;
          font-size: 32/32rem;
          color: #fd6363;
          border-bottom: 3/32rem solid #fd6363;
          margin-left: 24/32rem;
        }
      }
      .answerList{
        width: 100%;
        height: 100%;
        ul{
          li{
            border-bottom: 20/32rem solid #f8f8f8;
            .answerAuthor{
              width: 100%;
              height: 100%;
              overflow: hidden;
              padding: 26/32rem 10/32rem 26/32rem 24/32rem;
              div:first-of-type{
                width: 60%;
                float: left;
                img{
                  width: 80/32rem;
                  height: 80/32rem;
                  border-radius: 50%;
                  float: left;
                  margin-right: 20/32rem;
                }
                p:first-of-type{
                  width: 100%;
                  font-size: 34/32rem;
                  color: #3c3b3b;
                  margin: 10/32rem 0;
                }
                p:last-of-type{
                  width: 100%;
                  font-size: 28/32rem;
                  color: #787878;
                }
              }
              div:last-of-type{
                width: 40%;
                float: left;
                padding-top: 10/32rem;
                a{
                  display: inline-block;
                  width: 114/32rem;
                  height: 47/32rem;
                  float: right;
                  margin-right: 14/32rem;
                  img{
                    width: 114/32rem;
                    height: 47/32rem;
                    display: inline-block;
                  }
                }
              }
            }
            .answerContent{
              width: 100%;
              height: 100%;
              padding: 0 24/32rem;
              .answerText{
                font-size: 28/32rem;
                color: #333333;
                line-height: 40/32rem;
                text-indent: 2em;
              }
              /deep/img{
                width: 351/32rem!important;
                height: 240/32rem!important;
                display: inline-block;
                margin-top: 20/32rem;
              }
            }
            .answerAmount{
              width: 100%;
              height: 100%;
              padding: 26/32rem 24/32rem;
              span{
                margin-right: 10/32rem;
                i{
                  font-size: 24/32rem;
                  color: #bdbdbd;
                }
                span{
                  font-size: 20/32rem;
                  color: #bdbdbd;
                }
              }
            }
          }
        }
      }
    }
  }

  .doSomeThing{
    width: 100%;
    height: 86/32rem;
    line-height: 86/32rem;
    background-color: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1/32rem solid #f6f6f6;
    a{
      display: inline-block;
      width: 257/32rem;
      height: 100%;
      text-align: center;
      &:first-of-type{
        float: left;
        span:first-of-type{
          font-size: 44/32rem;
          vertical-align: middle;
          margin-right: 10/32rem;
        }
        span:last-of-type{
          font-size: 28/32rem;
          color: #333333;
        }
      }
      &:last-of-type{
        float: right;
        background-color: #2fd7c6;
        color: #ffffff;
        font-size: 36/32rem;
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
