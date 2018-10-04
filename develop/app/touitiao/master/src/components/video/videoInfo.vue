<template>
  <div class="videoInfoBox">
    <!--<goBack ref="backBtn"></goBack>-->
    <div class="backBox"><a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a></div>
    <div class="loading" v-if="loading">
      <loading></loading>
    </div>
    <scroll class="videoInfo_wrapper"
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
        <div class="videoPlayer">
          <!--<img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zx1494644343450.png">-->
          <!--<video :src="item.videoUrl" v-for="item in videoInfo.scCmsResourcesList" :poster="item.resourcesUrl"></video>-->
          <div class="chimee-container" ref="chimeeContainer">
            <video tabindex="-1" class="video" autoplay ref="video"></video>
          </div>
        </div>
        <div class="videoTitle">
          <h4>{{videoInfo.articleTitle}}</h4>
          <p>{{videoInfo.articleBrowser}}次播放</p>
        </div>
        <div class="showGood">
          <div class="left">
            <span class="iconfont icon-dianzanshu" @click="praise(videoInfo.articleId)" v-bind:class="{'red':isPraised==1}" ref="praiseNumber">&nbsp;{{videoInfo.praiseNumber}}</span>
            <!--<span class="iconfont icon-dianzan">&nbsp;{{videoInfo.retortNumber?videoInfo.retortNumber:0}}</span>-->
          </div>
          <div class="right">
            <span @click="toReport">举报</span>
          </div>
        </div>
        <div class="author">
          <div class="authorMsg" @click="toAuthorPage(videoInfo.scSysUser.id)">
            <img :src="videoInfo.scSysUser.userpic">
            <h5>{{videoInfo.scSysUser.username}}</h5>
            <p>{{videoInfo.releaseTime}}</p>
          </div>
          <div class="attention">
            <a href="javascript:;"
               @click="AttentionAndCancel(videoInfo.scSysUser.id)"
               v-if="isSubscribe==0"
               ref="AttentionBtn">
              <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
            </a>
            <a href="javascript:;"
               @click="AttentionAndCancel(videoInfo.scSysUser.id)"
               v-if="isSubscribe==1"
               ref="AttentionBtn">
              <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
            </a>
            <a href="javascript:;"
               v-if="hasConcern==0"
               @click="createCityAndCancel(videoInfo.scSysUser.id)"
               ref="hasConcernBtn">
              <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
            </a>
            <a href="javascript:;"
               v-if="hasConcern==1"
               @click="createCityAndCancel(videoInfo.scSysUser.id)"
               ref="hasConcernBtn">
              <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
            </a>
          </div>
        </div>
        <div class="similarVideo">
          <ul>
            <li v-for="(item,index) in videoInfo.recommendArticleList" :key="index" @click="toNewsInfo(item.articleId)">
              <a href="javascript:;">
                <div class="videoSummary">
                  <h4>{{item.articleTitle}}</h4>
                  <div class="otherMsg">
                    <span>{{item.scSysUser.username}}</span>
                    <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                    <span>{{item.releaseTime.substring(0,10)}}</span>
                  </div>
                </div>
                <div class="videoScreenshots">
                  <img :src="item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl">
                  <span
                    class="videoTime"
                    v-if="item.scCmsResourcesList[item.scCmsResourcesList.length-1].videoPlayTime">
                    {{item.scCmsResourcesList[item.scCmsResourcesList.length-1].videoPlayTime}}
                  </span>
                </div>
              </a>
            </li>
            <!--<li>-->
            <!--<a href="javascript:;">-->
            <!--<div class="videoSummary">-->
            <!--<h4>《李雷和韩梅梅》给新一代年轻人一部没有狗血、负面精神的电影。负面精神的电影。负面精神的电影。</h4>-->
            <!--<div class="otherMsg">-->
            <!--<span>铭说</span>-->
            <!--<span class="iconfont icon-xinxi">&nbsp;0</span>-->
            <!--<span>3个月前</span>-->
            <!--</div>-->
            <!--</div>-->
            <!--<div class="videoScreenshots">-->
            <!--<img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zxxmZkiD35EQPcBbAFWMrzE8Zi.jpg">-->
            <!--<span class="videoTime">06:00</span>-->
            <!--</div>-->
            <!--</a>-->
            <!--</li>-->
          </ul>
        </div>
        <!--<div class="videoComment">-->
        <!--<ul>-->
        <!--<p>评论1</p>-->
        <!--<li>-->
        <!--<div class="commenter">-->
        <!--<a href="javascript:;">-->
        <!--<img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/zxwy4A5EcJiKdaBPCjBQbJhT8H.jpg">-->
        <!--<span>铭说</span>-->
        <!--</a>-->
        <!--<a href="javascript:;">-->
        <!--<span class="iconfont icon-dianzanshu">&nbsp;0</span>-->
        <!--</a>-->
        <!--</div>-->
        <!--<div class="commentContent">-->
        <!--<p>1111</p>-->
        <!--<p><span>2017.11.28 16:52</span>&nbsp;&nbsp;<span>0条回复</span></p>-->
        <!--</div>-->
        <!--</li>-->
        <!--</ul>-->
        <!--</div>-->
        <!--<div class="toComment">-->
        <!--<input type="text" placeholder="我来说两句...">-->
        <!--<span class="iconfont icon-xinxi"></span>-->
        <!--<span class="iconfont icon-icon"></span>-->
        <!--<span class="iconfont icon-fenxiang"></span>-->
        <!--</div>-->
        <div class="comment">
          <comment ref="comment" :commentObj="commentObj" @agree="agree"></comment>
        </div>
      </div>
      <div class="loading-wrapper"></div>
    </scroll>
    <div class="mineComment" v-show="!maskShow">
      <input type="text" id="toComment" @click="showMask" placeholder="说点什么吧...">
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
    <div class="loginBox">
      <needLogin></needLogin>
    </div>
    <shareModule ref="videoInfoShareModule" :info="videoInfo" @toAuthorPage="toAuthorPagePause"></shareModule>
  </div>
</template>

<script>
  import qs from 'qs'
  import loading from '../common/loading.vue'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import needLogin from '../common/needLogin'
  import shareModule from '../common/shareModule'
  import ChimeeMobilePlayer from 'chimee-mobile-player'
  import chimeePluginMobileControlbar from 'chimee-plugin-mobile-controlbar'
  import comment from '../common/comment'
  // import goBack from '../common/goBack'
  ChimeeMobilePlayer.install(chimeePluginMobileControlbar);
  export default {
    components: {
      loading,
      // goBack,
      comment,
      scroll,
      needLogin,
      shareModule
    },
    data() {
      return {
        videoInfo: {},
        videoId: '',
        loading: true,
        isPraised: 0,
        isEnshrined: 0,
        isSubscribe: 0,
        hasConcern: 0,
        maskShow: false,
        commentContent: '',
        totalCommentNum: 0,
        commentObj:{},
        pageNo:1,
        lastRefreshTime:'',
        refreshDataLength:-1,
        isAjax:true,
        //记录视频插件是否已经加载过，避免点击关注按钮和筑城按钮时，视频插件重复加载，导致视频播放从头开始
        isRefreshVideo:true
        // to:''
      }
    },
    created: function () {
      this.videoId = this.$route.params.videoId;
      this.getVideoInfo(this.videoId);
    },
    methods: {
      getVideoInfo: function (id) {
        //路由动画完成后发送请求，渲染页面
        setTimeout(() => {
          this.loading = true;
          var data = {
            // cmd:'cms_new/querArticleDetails',
            cmd: 'cms_new/queryArticleDetail',
            data: JSON.stringify({"userId": sessionStorage.getItem('userId'), "articleId": id, "praiseUser": ""}),
            version: 1
          };
          var url = '/zxcity_restful/ws/rest';
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            this.videoInfo = res.data.data;
            this.loading = false;
            this.isEnshrined = res.data.data.isEnshrined;
            this.isSubscribe = res.data.data.scSysUser.isSubscribe;
            this.hasConcern = res.data.data.scSysUser.hasConcern;
            this.isPraised = res.data.data.isPraised;
            this.getCommentList(this.videoId)
          })
        }, 400)
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
          this.isRefreshVideo =false;
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
            this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu_selected@2x.png" style="width: 100%;">';
            this.isSubscribe = 1;
          } else if (this.isSubscribe == 1) {
            this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu@2x.png" style="width: 100%;">';
            this.isSubscribe = 0
          }
          this.isRefreshVideo =false;
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
            this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng_selected@2x.png" style="width: 100%;">';
            this.hasConcern = 1
          } else if (this.hasConcern == 1) {
            Toast('取消筑城成功');
            this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng@2x.png" style="width: 100%;">';
            this.hasConcern = 0
          }
          this.isRefreshVideo =false
        })
      },

      lookMoreComment: function () {
        // this.$refs.scroll.scrollTo(0, -this.to, 500);
        this.$refs.scroll.scrollToElement($('#title')[0], 500);
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
            "articleId": this.videoInfo.articleId
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
          $('#toComment').blur();
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
            articleId: this.videoInfo.articleId,
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
            this.getCommentList_1(this.videoId);
            this.commentContent = '';
            this.maskShow = false
          }
        })
      },
      toShare: function () {
        this.$refs.videoInfoShareModule.showShareBtns()
      },
      toReport: function () {
        this.$refs.videoInfoShareModule.toReport()
      },
      showLoginPage: function () {
        $('.loginBox').show();
        this.$refs.video.pause();
        setTimeout( () =>{
          $('.loginBox').css({'top': '0'});
        }, 0);
      },
      closeLoginPage: function () {
        this.$refs.video.play();
        $('.loginBox').css({'top': '100%'});
        setTimeout( () => {
          $('.loginBox').hide();
        }, 300);
      },
      toNewsInfo: function (articleId) {
        $(this.$refs.video)[0].pause();
        // 动态添加路由
        var p = new Date().getTime();
        this.$router.options.routes.push({//插入路由
          'name': 'videoInfo',
          'path': '/videoInfo/'+p+'/:videoId',
          'component':resolve => require(['./videoInfo'], resolve)//将组件用require引进来
        })
        this.$router.addRoutes(this.$router.options.routes);
        sessionStorage.setItem('router',JSON.stringify(this.$router.options.routes));
        this.$router.push({path: '/videoInfo/'+p+'/' + articleId});
        // this.getVideoInfo(articleId)
      },
      toAuthorPage: function (authorId) {
        this.$router.push({path: '/author/authorPage/homePage/' + authorId});
        this.$refs.video.pause()

      },
      toAuthorPagePause:function () {
        this.$refs.video.pause()
      },
      goBack:function () {
        this.$router.go(-1)
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
          this.getCommentList_1(this.videoId)
        })
      },
      loadMore:function () {
        this.pageNo++;
        this.getCommentList(this.videoId)
      },
      loadData:function () {
        this.isAjax = true;
        this.isRefreshVideo = false;
        this.pageNo = 1;
        this.getCommentList(this.videoId)
      },
      importChimeeVideo:function () {
        if ($(this.$refs.chimeeContainer).length != 0) {
          new ChimeeMobilePlayer({
            wrapper: $(this.$refs.chimeeContainer)[0],  // video dom容器
            src: this.videoInfo.scCmsResourcesList[0].videoUrl,
            autoplay: true,
            controls: true,
            playsInline: true,
            preload: true,
            x5VideoPlayerFullscreen: true,
            x5VideoOrientation: true,
            xWebkitAirplay: true,
            muted: false,
            // removeInnerPlugins: ['chimeeMobiControlbar', 'chimeeState'],
            plugin: [
              {
                name: chimeePluginMobileControlbar.name,
                majorColor: '#fff',
                hoverColor: '#fff',
                hideBarTime: 5000,
                barShowByMouse: 'move', // 控制条显示由， move 还是 enter/leave 来控制显示／隐藏
                children: {
                  play: {},
                  screen: {
                    bitmap: true,
                  },
                  currentTime: {},
                  totalTime: {},
                  progressBar: {},
                }
              }
            ],
          });
          //隐藏全屏按钮
          $($('#chimee-container')[1]).hide();
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.videoInfo_wrapper').height($(window).height() - $('.backBox').height() - $('.mineComment').height());
      })
    },
    updated: function () {
      this.$nextTick(function () {
        //配置chimee插件
        if(this.isRefreshVideo){
          this.importChimeeVideo()
        }
      })
    },
    directives: {
      "to-focus": function (el) {
        el.focus();
      }
    },
    /*watch: {
      $route: function (val, old) {
        // if (val.params.videoId && val.params.videoId !== this.videoId && old.name === 'videoInfo') {
        //   this.videoId = val.params.videoId;
        //   this.getVideoInfo(this.videoId)
        // }
      }
    }*/
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
    #toComment {
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

  .videoInfoBox {
    /*<!--margin-top:90/32rem;-->*/
    padding-top: 90/32rem;
  }

  .videoPlayer {
    width: 100%;
    height: 400/32rem;
    //margin-top: 90/32rem;
    position: relative;
    background-color: #000;
    video {
      width: 100%;
      height: 400/32rem;
    }
  }

  .videoTitle {
    width: 100%;
    padding: 24/32rem 20/32rem 0 20/32rem;
    h4 {
      font-size: 32/32rem;
      font-weight: 400;
      color: #333333;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
      -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
      -webkit-line-clamp: 2; /** 显示的行数 **/
      overflow: hidden; /** 隐藏超出的内容 **/
    }
    p {
      font-size: 22/32rem;
      color: #999999;
      margin-top: 20/32rem;
    }
  }

  .showGood {
    width: 100%;
    display: flex;
    padding: 0 20/32rem 0 10/32rem;
    margin-top: 20/32rem;
    color: #999999;
    .left {
      flex: 3;
      span {
        display: inline-block;
        padding: 10/32rem;
        font-size: 30/32rem;
        color: #787878;
        &::before {
          font-size: 32/32rem;
          vertical-align: middle;
        }
      }
      span:last-child {
        margin-left: 10/32rem;
      }
      .red {
        color: red;
      }
    }
    .right {
      flex: 1;
      text-align: right;
      font-size: 28/32rem;
      color: #787878;
      span {
        display: inline-block;
        padding: 10/32rem;
      }
    }
  }

  .author {
    width: 100%;
    display: flex;
    margin-top: 30/32rem;
    padding: 0 20/32rem;
    .authorMsg {
      flex: 3;
      img {
        float: left;
        width: 80/32rem;
        height: 80/32rem;
        border-radius: 50%;
        margin-right: 20/32rem;
      }
      h5 {
        font-size: 34/32rem;
        font-weight: 400;
        color: #3c3b3b;
      }
      p {
        font-size: 22/32rem;
        margin-top: 15/32rem;
        color: #787878;
      }
    }
    .attention {
      flex: 2;
      font-size: 20/32rem;
      text-align: center;
      a {
        display: inline-block;
        width: 114/32rem;
        height: 47/32rem;
        border-radius: 6/32rem;
        img {
          width: 114/32rem;
          height: 47/32rem;
        }
      }
    }
  }

  .similarVideo {
    padding: 0 20/32rem;
    margin-top: 90/32rem;
    ul {
      width: 100%;
      li:last-child {
        border-bottom: none;
      }
      li {
        width: 100%;
        border-bottom: 1/32rem solid #eee;
        padding: 20/32rem 0;
        a {
          display: flex;
          width: 100%;
          .videoSummary {
            flex: 3;
            margin-top: 10/32rem;
            position: relative;
            h4 {
              font-size: 32/32rem;
              font-weight: 600;
              color: #53537A;
              padding-right: 30/32rem;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
              -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
              -webkit-line-clamp: 2; /** 显示的行数 **/
              overflow: hidden; /** 隐藏超出的内容 **/
            }
            .otherMsg {
              width: 100%;
              height: 50/32rem;
              line-height: 50/32rem;
              font-size: 24/32rem;
              color: #a7a7a7;
              /*display: flex;*/
              position: absolute;
              bottom: 0;
              left: 0;
              span {
                /*flex: 1;*/
                float: left;
              }
              span:last-child {
                /*flex: 4;*/
                float: right;
                text-align: right;
                padding-right: 30/32rem;
              }
              span:first-child {
                float: left;
                margin-right: 20/32rem;
                /*flex: 3;*/
              }
            }
          }
          .videoScreenshots {
            flex: 1;
            position: relative;
            img {
              width: 167/32rem;
              height: 167/32rem;
              margin-top: 6/32rem;
              border-radius: 8/32rem;
            }
            .videoTime {
              position: absolute;
              width: 120/32rem;
              height: 46/32rem;
              line-height: 46/32rem;
              text-align: center;
              font-size: 26/32rem;
              color: #fff;
              background-color: #9189f2;
              border-radius: 8/32rem;
              bottom: 15/32rem;
              right: 20/32rem;
            }
          }
        }
      }
    }
  }

  .videoComment {
    p {
      padding: 20/32rem;
      font-size: 26/32rem;
      color: #999999;
    }
    ul {
      li {
        border-top: 1/32rem solid #cccccc;
        .commenter {
          width: 100%;
          display: flex;
          padding: 30/32rem 20/32rem;
          a:first-child {
            flex: 9;
            img {
              width: 60/32rem;
              height: 60/32rem;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 15/32rem;
            }
            span {
              font-size: 22/32rem;
              color: #9089EB;
            }
          }
          a:last-child {
            flex: 1;
            text-align: right;
            color: #666666;
            padding-top: 10/32rem;
            span {
              font-size: 30/32rem;
            }
          }
        }
        .commentContent {
          margin-left: 80/32rem;
          p {
            font-size: 24/32rem;
            line-height: 10/32rem;
          }
          p:first-child {
            color: #333333;
          }
        }
      }

    }

  }

  .toComment {
    width: 100%;
    height: 90/32rem;
    background-color: #f2f2f2;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 30/32rem;
    input {
      height: 50/32rem;
      width: 55%;
      background-color: #fff;
      outline: none;
      margin-top: 20/32rem;
      margin-right: 20/32rem;
      border-radius: 10/32rem;
      border: 1/32rem solid #cccccc;
      padding-left: 20/32rem;
      vertical-align: bottom;
    }
    span {
      display: inline-block;
      width: 11%;
      text-align: center;
      font-size: 40/32rem;
      color: #666666;
    }
    span:nth-of-type(2) {
      font-size: 50/32rem;
    }
  }

  .loading {
    position: relative;
    width: 100%;
    height: 93%;
    bottom: 0;
    left: 0;
    z-index: 1001;
  }

  .loginBox {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1003;
    display: none;
    transition: all .3s;
  }

  .backBox{
    width: 100%;
    height: 90/32rem;
    border-bottom: 1/32rem solid #eee;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1002;
    background-color: #fff;
    a{
      display: block;
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 36/32rem;
    }
  }
</style>
