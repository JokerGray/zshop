<template>
  <div>
    <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
    <a href="javascript:;" class="iconfont icon-shenglvehao" @click="showAuthorErCodeBtn"></a>
    <div class="btnMask" @click="closeAuthorErCodeBtn"></div>
    <div class="authorErCodeBtn" @click="toAuthorErCodePage(authorInfo.userId)"><span class="iconfont icon-erweima"></span><span>作家二维码</span></div>
    <div class="nav_1" ref="nav_1">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <div id="navAnimate1">
        <a href="javascript:;" :class="{'active':0==active}" @click="changeNav(0)">动态</a>
        <a href="javascript:;" :class="{'active':1==active}" @click="changeNav(1)">文章</a>
        <a href="javascript:;" :class="{'active':2==active}" @click="changeNav(2)">视频</a>
      </div>
    </div>
    <scroll class="active-wrapper"
            :pulldown="false"
            :pullup="true"
            :data="list"
            :refreshDataLength="refreshDataLength"
            :showBottomTips="showBottomTips"
            :showTopTip="false"
            @scroll="scroll"
            :probeType="probeType"
            :lastRefreshTime="lastRefreshTime"
            :totalNum="authorActiveTotalNum"
            @scrollToEnd="loadMore"
            @pulldown="loadData"
            ref="scroll">
      <div class="mineApp">
        <!--<div class="pullUp" v-if="refresh"><span>正在刷新数据中...</span><p>最后更新:今天{{lastRefreshTime}}</p></div>-->
        <div class="top">
          <!--<a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>-->
          <div class="myPageBg">
            <img :src="authorInfo.length!==0&&authorInfo.scSysUser&&authorInfo.scSysUser.userpic?authorInfo.scSysUser.userpic:require('../../../static/images/mrtx.png')">
            <div class="mast"></div>
          </div>
          <div class="myDesc">
            <img :src="authorInfo.length!==0&&authorInfo.scSysUser&&authorInfo.scSysUser.userpic?authorInfo.scSysUser.userpic:require('../../../static/images/mrtx.png')">
            <h4>{{authorInfo.length!==0&&authorInfo.scSysUser&&authorInfo.scSysUser.username?authorInfo.scSysUser.username:''}}</h4>
            <p>{{authorInfo.length!==0&&authorInfo.scSysUser&&authorInfo.scSysUser.signature?authorInfo.scSysUser.signature:''}}</p>
            <a href="javascript:;" class="pullBtn" v-show="pullBtn===1" @click="showRecommendAuthorBox(1)"><img :src="require('../../../static/images/news_2_icon_yuanjiaoxiala@2x.png')"></a>
            <a href="javascript:;" class="pullBtn" v-show="pullBtn===2" @click="showRecommendAuthorBox(2)"><img :src="require('../../../static/images/news_2_icon_yuanjiaoshangla@2x.png')"></a>
          </div>
          <div class="otherMsg" v-if="authorInfo.length!==0&&authorInfo.scSysUser">
            <router-link v-bind="{to:'/author/authorPage/homePage/ta-attentionAndFans/attention/'+authorInfo.scSysUser.id}">
              <span>{{authorInfo.followNum}}</span>
              <p>关注</p>
            </router-link>
            <router-link v-bind="{to:'/author/authorPage/homePage/ta-attentionAndFans/fans/'+authorInfo.scSysUser.id}">
              <span>{{authorInfo.enshrinedNum}}</span>
              <p>粉丝</p>
            </router-link>
            <router-link v-bind="{to:'/author/authorPage/homePage/ta-attentionAndFans/visitors/'+authorInfo.scSysUser.id}">
              <span>{{authorInfo.visitoredNum}}</span>
              <p>访客</p>
            </router-link>
          </div>
          <div class="recommendAuthorBox">
            <p>你可能还想关注</p>
            <scroll
              v-show="!noRecommendAuthor"
              class="recommendAuthorBox-wrapper"
              :pulldown="false"
              :pullup="false"
              :showBottomTips="false"
              :showTopTip="false"
              :scrollX="true">
              <ul>
                <li v-for="(item,index) in authorInfo.commendSubscriptionList" :key="index" @click="toAuthorInfo(item.scSysUser.id)">
                  <img :src="item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png')">
                  <h4>{{item.scSysUser.username}}</h4>
                  <p>{{item.scSysUser.signature}}</p>
                </li>
              </ul>
              <div class="loading-wrapper"></div>
            </scroll>
            <div class="noRecommendAuthorTips" v-show="noRecommendAuthor">暂无推荐哦</div>
          </div>
          <div class="attentionBtns">
            <a href="javascript:;" v-if="authorInfo.scSysUser&&authorInfo.scSysUser.hasConcern==0" @click="createCityAndCancel(authorInfo.scSysUser.id)"><img
              :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')"></a>
            <a href="javascript:;" v-if="authorInfo.scSysUser&&authorInfo.scSysUser.hasConcern==1" @click="createCityAndCancel(authorInfo.scSysUser.id)"><img
              :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')"></a>
            <a href="javascript:;" v-if="authorInfo.scSysUser&&authorInfo.scSysUser.isSubscribe==0" @click="AttentionAndCancel(authorInfo.scSysUser.id)"><img
              :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')"></a>
            <a href="javascript:;" v-if="authorInfo.scSysUser&&authorInfo.scSysUser.isSubscribe==1" @click="AttentionAndCancel(authorInfo.scSysUser.id)"><img
              :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')"></a>
          </div>
        </div>
        <div class="main">
          <div class="nav" id="nav">
            <div id="navAnimate" ref="navAnimate">
              <a href="javascript:;" :class="{'active':0==active}" @click="changeNav(0)">动态</a>
              <a href="javascript:;" :class="{'active':1==active}" @click="changeNav(1)">文章</a>
              <a href="javascript:;" :class="{'active':2==active}" @click="changeNav(2)">视频</a>
            </div>
          </div>
          <div class="content" ref="authorContent">
            <!--<mt-tab-container v-model="active" swipeable="swipeable">-->
            <!--<mt-tab-container-item id="1">-->
            <!---->
            <!--</mt-tab-container-item>-->
            <!--<mt-tab-container-item id="2">-->
            <!---->
            <!--</mt-tab-container-item>-->
            <!--<mt-tab-container-item id="3">-->
            <!---->
            <!--</mt-tab-container-item>-->
            <!--&lt;!&ndash;</mt-tab-container>&ndash;&gt;-->
            <!--<slide @sentPageNo="getPage" :navPage="active" ref="authorSlide">-->
            <!--<div>-->
            <!---->
            <!--</div>-->
            <!--<div>-->
            <!---->
            <!--</div>-->
            <!--<div>-->
            <!---->
            <!--</div>-->
            <!--</slide>-->
            <cube-slide :loop="false" :auto-play="false" :initial-index="active" ref="authorSlide" @change="getPage">
              <cube-slide-item>
                <div class="myDynamic">
                  <!--<li class="tmp1" v-for="(item,index) in list">{{item}}</li>-->
                  <dynamic :list="myActiveList" @toInfo="toInfo"></dynamic>
                </div>
                <div v-show="active_isNoDataZW" class="zwBox">
                  <noDataZW></noDataZW>
                </div>
              </cube-slide-item>
              <cube-slide-item>
                <newsListTemp :list="myArticleList" @toNewsInfo="toNewsInfo"></newsListTemp>
                <!--这个div主要是占位用的，避免直接跳到第三页时，第三页内容不显示-->
                <div style="width: 100%; height: 1px;" v-if="!article_isNoDataZW"></div>
                <div v-show="article_isNoDataZW" class="zwBox">
                  <noDataZW></noDataZW>
                </div>
              </cube-slide-item>
              <cube-slide-item>
                <ul class="myVideo">
                  <li v-for="(item,index) in myVideoList" :key="index" v-if="5==item.previewImgType">
                    <div class="tem5" v-if="5==item.previewImgType">
                    <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                      <div class="newsLeft">
                        <h4>{{item.articleTitle}}</h4>
                        <div class="newsBottom">
                          <div class="left">
                            <span>{{item.scCmsSubscription.subscriptionName}}</span>
                            <span class="iconfont icon-chakan">&nbsp;1260</span>
                            <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                          </div>
                          <div class="right">
                            <span>{{item.releaseTime.substring(0,10)}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="newsRight">
                        <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw166.png')}"/>
                        <!--<span class="videoTime">{{item.scCmsResourcesList[0].videoPlayTime}}</span>-->
                      </div>
                    </span>
                    </div>
                  </li>
                </ul>
                <!--<newsListTemp :list="myVideoList" @toNewsInfo="toNewsInfo"></newsListTemp>-->
                <div v-show="video_isNoDataZW" class="zwBox">
                  <noDataZW></noDataZW>
                </div>
              </cube-slide-item>
            </cube-slide>
          </div>
        </div>
        <!--<div class="bottomLoading" v-show="!isNoDataZW"><img :src="tipLoading">&nbsp;<span>{{bottomTips}}</span></div>-->
      </div>
      <div class="loading-wrapper"></div>
    </scroll>
    <div class="loading" v-if="loading">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <loading></loading>
    </div>
    <div class="loginBox">
      <needLogin></needLogin>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import dynamic from '../common/dynamic'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import noDataZW from '../common/noDataZW'
  import loading from '../common/loading'
  import needLogin from '../common/needLogin'
  import slide from '../common/slider'
  import {Indicator} from 'mint-ui'
  import newsListTemp from '../common/newsListTemp'

  export default {
    components: {
      dynamic,
      scroll,
      noDataZW,
      loading,
      needLogin,
      slide,
      newsListTemp
    },
    data: function () {
      return {
        active: 0,
        authorInfo: {},
        myArticleList: [],
        myVideoList: [],
        myActiveList: [],
        activePageNo: 1,
        articlePageNo: 1,
        videoPageNo: 1,
        probeType: 3,
        active_isNoDataZW: false,
        article_isNoDataZW: false,
        video_isNoDataZW: false,
        isAjax: true,
        lastRefreshTime: '',//最后刷新时间
        refreshDataLength: '',
        authorActiveTotalNum: '',
        showBottomTips: true,
        list: [],
        loading: true,
        authorId: '',
        flage: false,
        pullBtn:1,
        noRecommendAuthor:false
      }
    },
    created: function () {
      this.authorId = this.$route.params.authorId;
      this.getAuthorInfo();
    },
    methods: {
      changeNav: function (active) {
        this.active = active
      },
      getPage: function (val) {
        this.active = val
      },
      goBack: function () {
        this.$router.go(-1)
      },
      // 页面全部刷新时调用
      getAuthorInfo: function () {
        this.loading = true;
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/querySubscriptionDetail',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),//平台用户主键
            "byVisitUser": this.authorId//个人频道主键
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.authorInfo = res.data.data || [];
          this.authorInfo.commendSubscriptionList.length===0?this.noRecommendAuthor = true:this.noRecommendAuthor = false;
          this.getMyActiveList();
          // this.loading = false
        })
      },
      //局部刷新调用
      getAuthorInfo_1: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/querySubscriptionDetail',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),//平台用户主键
            "byVisitUser": this.authorId//个人频道主键
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.authorInfo = res.data.data;
          // this.loading = false
        })
      },
      getMyActiveList: function () {
        if (!this.isAjax) {
          // this.refresh = false;
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryCmsDynamicResponse',
          data: JSON.stringify({
            "userId": this.authorId,
            "pagination": {
              "page": this.activePageNo,
              "rows": 10
            }
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          Indicator.close();
          if (res.data.code != 1) {
            Toast(res.data.msg);
            this.loading = false;
            this.active_isNoDataZW = true;
            return;
          }
          if (this.activePageNo == 1) {
            // this.refresh = false;
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            if (res.data.data.length == 0) {
              this.active_isNoDataZW = true;
              this.isAjax = false;
              this.showBottomTips = false;
              this.loading = false;
              return
            } else {
              this.refreshDataLength = res.data.data.length;
              this.authorActiveTotalNum = res.data.total;
              this.myActiveList = [];
              this.myActiveList = res.data.data;
              this.active_isNoDataZW = false;
              this.showBottomTips = true;
              this.loading = false;
              this.list = this.myActiveList;
            }
          } else {
            this.myActiveList = this.myActiveList.concat(res.data.data);
            this.list = this.myActiveList;
            if (this.myActiveList.length === this.authorActiveTotalNum) {
              this.isAjax = false
            }
          }
        })
      },
      getMyArticleList: function () {
        if (!this.isAjax) {
          // this.refresh = false;
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryArticelListByUserId',
          data: JSON.stringify({
            // "releaseId": 77798,
            "releaseId": this.authorId,
            "pagination": {
              "page": this.articlePageNo,
              "rows": 10
            }
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.articlePageNo == 1) {
            // this.refresh = false;
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            if (res.data.data.length == 0) {
              this.article_isNoDataZW = true;
              this.isAjax = false;
              this.showBottomTips = false;
              return
            } else {
              this.refreshDataLength = res.data.data.length;
              this.authorActiveTotalNum = res.data.total;
              this.myArticleList = [];
              this.myArticleList = res.data.data;
              this.article_isNoDataZW = false;
              this.showBottomTips = true;
              this.list = this.myArticleList;
            }
          } else {
            this.myArticleList = this.myArticleList.concat(res.data.data);
            this.list = this.myArticleList;
            if (this.myArticleList.length === this.authorActiveTotalNum) {
              this.isAjax = false
            }
          }
        })
      },
      getMyVideoList: function () {
        if (!this.isAjax) {
          // this.refresh = false;
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryArticelVideoByUserId',
          data: JSON.stringify({
            // "releaseId": 77798,
            "releaseId": this.authorId,
            "pagination": {
              "page": this.videoPageNo,
              "rows": 10
            }
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          // 记录数据中是视频类型的数量
          var num = 0;
          Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.videoPageNo == 1) {
            // this.refresh = false;
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            // this.myVideoList = [];
            res.data.data.forEach((v, i) => {
              if (v.previewImgType == 5) {
                num++
              }
            });
            if (res.data.data.length == 0 || num == 0) {
              this.video_isNoDataZW = true;
              this.isAjax = false;
              this.showBottomTips = false;
              return
            }
            this.video_isNoDataZW = false;
            this.showBottomTips = true;
            this.authorActiveTotalNum = res.data.total;
            this.myVideoList = res.data.data;
            this.refreshDataLength = num;
            this.list = this.myVideoList;
          } else {
            this.myVideoList = this.myVideoList.concat(res.data.data);
            this.list = this.myVideoList;
            if (res.data.data.length == 0) {
              this.authorActiveTotalNum = this.myVideoList.length;
              this.isAjax = false
            }
          }
        })
      },
      scroll: function (pos) {
        if (pos.y <= 35) {
          this.$refs.scroll.isShowTips = false
        }
        if ($('#nav').offset().top < 0) {
          $('.nav_1').show();
          $('.nav_1').css({'opacity': 1});
          $('#navAnimate1').css({'left': '22%'});
          $('#navAnimate').css({'left': '22%'})

        } else {
          $('.nav_1').hide();
          $('.nav_1').css({'opacity': 0});
          $('#navAnimate1').css({'left': '0'});
          $('#navAnimate').css({'left': '0'})
        }
      },
      loadMore: function () {
        if (this.active == 0) {
          this.activePageNo++;
          this.getMyActiveList()
        } else if (this.active == 1) {
          this.articlePageNo++;
          this.getMyArticleList()
        } else if (this.active == 2) {
          this.videoPageNo++;
          this.getMyVideoList()
        }
      },
      loadData: function () {
        this.isAjax = true;
        if (this.active == 1) {
          this.activePageNo = 1;
          // this.refresh = true;
          this.getMyActiveList();
          this.list = this.myActiveList
        } else if (this.active == 2) {
          this.articlePageNo = 1;
          // this.refresh = true;
          this.getMyArticleList();
          this.list = this.myArticleList
        } else if (this.videoPageNo == 3) {
          this.videoPageNo = 1;
          // this.refresh = true;
          this.getMyVideoList();
          this.list = this.myVideoList
        }
      },
      toNewsInfo: function (id, type) {
        if (type == 0 || type == 1 || type == 2) {
          this.$router.push({path: '/author/authorPage/homePage/newsInfo/' + id})
        } else if (type == 3 || type == 4) {
          this.$router.push({path: '/author/authorPage/homePage/pictures/' + id})
        } else if (type == 5) {
          this.$router.push({path: '/author/authorPage/homePage/videoInfo/' + id})
        }
      },
      toInfo: function (type,articleId,previewImgType,authorId,cmsNewComment) {
        if (type == 1 || type == 2 || type == 3 || type == 5 || type == 6) {
          if (previewImgType == 0 || previewImgType == 1 || previewImgType == 2) {
            this.$router.push({path: '/author/authorPage/homePage/newsInfo/' + articleId})
          } else if (previewImgType == 3 || previewImgType == 4) {
            this.$router.push({path: '/author/authorPage/homePage/pictures/' + articleId})
          } else if (previewImgType == 5) {
            this.$router.push({path: '/author/authorPage/homePage/videoInfo/' + articleId})
          }
        } else if (type == 7) {
          this.$router.push({path: '/author/authorPage/homePage/' + authorId});
        } else if (type == 9) {
          if (previewImgType == 10) {
            this.$router.push({path: '/author/authorPage/homePage/answerInfo/' + articleId})
          }
        }else if (type == 15||type == 13||type == 14) {
          if (previewImgType == 12) {
            this.$router.push({path: '/author/authorPage/homePage/singleAnswer/' + articleId})
          }
        }else if(type == 4){
          this.$router.push({path: '/commentReplyInfo?info='+JSON.stringify(cmsNewComment)})
        }
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
        if (this.authorInfo.scSysUser.isSubscribe == 0) {
          data.cmd = 'cms_new/addUserAttention'
        } else if (this.authorInfo.scSysUser.isSubscribe == 1) {
          data.cmd = 'cms_new/cancelAttention'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.getAuthorInfo_1();
          // if (this.authorInfo.scSysUser.isSubscribe == 0) {
          //   // this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu_selected@2x.png" style="width: 100%;">';
          //   // this.isSubscribe = 1
          // } else if (this.authorInfo.scSysUser.isSubscribe == 1) {
          //   // this.$refs.AttentionBtn.innerHTML = '<img src="../../../static/images/news_2_icon_guanzhu@2x.png" style="width: 100%;">';
          //   // this.isSubscribe = 0
          // }
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
        if (this.authorInfo.scSysUser.hasConcern == 0) {
          data.cmd = 'cms_new/buildUser'
        } else if (this.authorInfo.scSysUser.hasConcern == 1) {
          data.cmd = 'cms_new/delBuildUser'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if (this.authorInfo.scSysUser.hasConcern == 0) {
            this.getAuthorInfo_1();
            Toast(res.data.msg);
            // this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng_selected@2x.png" style="width: 100%;">';
          } else if (this.authorInfo.scSysUser.hasConcern == 1) {
            this.getAuthorInfo_1();
            Toast('取消筑城成功');
            // this.$refs.hasConcernBtn.innerHTML = '<img src="../../../static/images/news_2_icon_zhucheng@2x.png" style="width: 100%;">';
          }
        })
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
      showAuthorErCodeBtn: function () {
        if (!this.flage) {
          $('.btnMask').fadeIn(300);
          $('.authorErCodeBtn').css({'transform': 'scale(1)'});
          this.flage = true
        } else {
          $('.btnMask').fadeOut(300);
          $('.authorErCodeBtn').css({'transform': 'scale(0)'});
          this.flage = false
        }
      },
      closeAuthorErCodeBtn: function () {
        $('.btnMask').fadeOut(300);
        $('.authorErCodeBtn').css({'transform': 'scale(0)'});
        this.flage = false
      },
      toAuthorErCodePage: function (authorId) {
        this.$router.push({path: '/mine/min-ewCode/' + authorId});
        $('.authorErCodeBtn').css({'transform': 'scale(0)'});
        $('.btnMask').fadeOut(300);
        this.flage = false
      },
      showRecommendAuthorBox:function (num) {
        if(num===1){
          this.pullBtn = 2;
          $('.recommendAuthorBox').slideDown(300);
          $('#nav').css({transform: 'translateY('+320/32+'rem)',backgroundColor: '#fff',transition:'transform,0.4s'});
        }else{
          this.pullBtn = 1;
          $('.recommendAuthorBox').slideUp(300);
          $('#nav').css({transform: 'translateY('+0+'rem)',backgroundColor: 'rgba(255, 255, 255, 0)',transition:'transform,0.4s'});
        }
      },
      toAuthorInfo:function (authorId) {
        this.pullBtn = 1;
        $('.recommendAuthorBox').slideUp(300);
        $('#nav').css({transform: 'translateY('+0+'rem)',backgroundColor: 'rgba(255, 255, 255, 0)',transition:'all,0.3s'});
        this.$router.push({path: '/author/authorPage/homePage/' + authorId});
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.active-wrapper').height($(window).height());
        $('.zwBox').height(($(window).height() - $('.mineApp .top').height()));
        setTimeout(() => {
          this.$refs.authorSlide.refresh()
        }, 100)
      });
    },
    updated: function () {
      this.$nextTick(function () {
        if ($($(this.$refs.authorContent).find('.cube-slide-item')[this.active]).height() !== 0) {
          $(this.$refs.authorContent).height($($(this.$refs.authorContent).find('.cube-slide-item')[this.active]).height());
        }
        //动态设置推荐关注作者容器的宽度
        var width = 0;
        $('.recommendAuthorBox ul li').each((i,v)=>{
          width+=$(v).outerWidth(true)
        })
        $('.recommendAuthorBox ul').width(width);
        $('.recommendAuthorBox .content-bg').width(width);
      })
    },

    watch: {
      active: function (val, old) {
        this.$refs.scroll.scrollTo(0, 0);
        Indicator.open('加载中...');
        this.refreshDataLength = 0;
        this.showBottomTips = false;
        this.$refs.nav_1.style.opacity = 0;
        this.$refs.navAnimate.style.left = 0;
        this.isAjax = true;
        if (val == 0) {
          this.avtive_isNoDataZW = false;
          this.activePageNo = 1;
          this.getMyActiveList();
          this.list = this.myActiveList;
        } else if (val == 1) {
          this.article_isNoDataZW = false;
          this.articlePageNo = 1;
          this.getMyArticleList();
          this.list = this.myArticleList;
        } else if (val == 2) {
          this.video_isNoDataZW = false;
          this.videoPageNo = 1;
          this.getMyVideoList();
          this.list = this.myVideoList;
        }
        //避免不停切换，导致上拉提示显示无数据状态
        this.list = []
      },
      $route: function (newValue, oldValue) {
        if (newValue.params.authorId && newValue.params.authorId !== this.authorId && newValue.path.indexOf('/author/authorPage/homePage/ta-attentionAndFans') == -1) {
          this.authorId = newValue.params.authorId;
          this.isAjax = true;
          this.activePageNo = 1;
          this.authorInfo = [];
          this.myActiveList = [];
          this.getAuthorInfo();
          //初始化导航栏
          this.$refs.scroll.scrollTo(0, 0);
          $('.nav_1').hide();
          $('.nav_1').css({'opacity': 0});
          $('#navAnimate1').css({'left': '0'});
          $('#navAnimate').css({'left': '0'});
        }
      },
    },
  }
</script>

<style scoped lang="less" type="text/less">
  .nav_1 {
    width: 100%;
    height: 90/32rem;
    /*<!--line-height: 90/32rem;-->*/
    position: fixed;
    z-index: 5;
    background-color: rgba(255, 255, 255, 0);
    top: 0;
    left: 0;
    background-color: #fff;
    /*display: none;*/
    opacity: 0;
    #navAnimate1 {
      position: absolute;
      left: 0;
      -webkit-transition: all .3s ease-out;
      -moz-transition: all .3s ease-out;
      -ms-transition: all .3s ease-out;
      -o-transition: all .3s ease-out;
      transition: all .3s ease-out;
      > a {
        font-size: 32/32rem;
        color: #999999;
        display: inline-block;
        width: 88/32rem;
        text-align: center;
        padding-bottom: 10/32rem;
        margin-right: 30/32rem;
        margin-top: 24/32rem;
        &.active {
          color: #9172fa;
          border-bottom: 4/32rem solid #9172fa;
        }
      }
    }
    .icon-fanhui {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 7;
      display: block;
      width: 90/32rem;
      height: 90/32rem;
      text-align: center;
      line-height: 90/32rem;
      font-size: 30/32rem;
    }
  }

  .zwBox {
    width: 100%;
    position: relative;
    top: -50/32rem;
    overflow: hidden;
    /deep/ .zw {
      width: 100%;
      top: 0;
      left: 0;
    }
    /deep/ .zwPic {
      width: 40% !important;
      height: 23% !important;
      top: 35% !important;
    }
    /deep/ .zwTips {
      width: 40% !important;
      height: 3% !important;
      top: 35% !important;
      left: 50% !important;
    }
  }

  .loading {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999999;
    .icon-fanhui {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 7;
      display: block;
      width: 90/32rem;
      height: 90/32rem;
      text-align: center;
      line-height: 90/32rem;
      font-size: 30/32rem;
    }
  }

  .icon-fanhui {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 7;
    display: block;
    width: 90/32rem;
    height: 90/32rem;
    text-align: center;
    line-height: 90/32rem;
    font-size: 30/32rem;
    color: #333333;
  }

  .icon-shenglvehao {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 8;
    display: block;
    width: 90/32rem;
    height: 90/32rem;
    text-align: center;
    line-height: 90/32rem;
    font-size: 36/32rem;
    color: #333333;
    font-weight: 700;
  }

  .btnMask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 736px;
    background-color: rgba(0, 0, 0, .2);
    z-index: 7;
    display: none;
  }

  .authorErCodeBtn {
    height: 66/32rem;
    line-height: 66/32rem;
    position: fixed;
    top: 90/32rem;
    right: 24/32rem;
    z-index: 7;
    background-color: #000;
    color: #fff;
    padding: 0  30/32rem 0 10/32rem;
    border-radius: 8/32rem;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -ms-transform: scale(0);
    -o-transform: scale(0);
    transform: scale(0);
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    -ms-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
    &::before {
      position: absolute;
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 20/32rem;
      border-color: transparent transparent #000 transparent;
      top: -35/32rem;
      right: 4/32rem;
    }
    span:nth-of-type(1) {
      font-size: 60/32rem;
      vertical-align: middle;
    }
    span:nth-of-type(2) {
      font-size: 26/32rem;
    }
  }

  .mineApp {
    /*position: relative;*/
    /*height: 100%;*/
    /*height: 736px;*/
    /*overflow: hidden;*/
    .top {
      width: 100%;
      height: 600/32rem;
      position: relative;
      top: 0;
      left: 0;
      .myPageBg {
        width: 100%;
        height: 604/32rem;
        position: absolute;
        z-index: 3;
        overflow: hidden;
        img {
          width: 100%;
          height: 600/32rem;
        }
        .mast {
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 1) 100%);
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .myDesc {
        width: 100%;
        height: 650/32rem;
        position: absolute;
        top: 0;
        z-index: 3;
        >img {
          display: block;
          width: 140/32rem;
          height: 140/32rem;
          border-radius: 50%;
          margin-top: 104/32rem;
          margin-left: 60/32rem;
        }
        h4 {
          font-size: 44/32rem;
          color: #333333;
          margin: 20/32rem 260/32rem 0 60/32rem;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 48/32rem;
        }
        p {
          font-size: 32/32rem;
          color: #999999;
          margin: 20/32rem 0 0 60/32rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          word-break: break-all;
          overflow: hidden;
          padding-right: 60/32rem;
          line-height: 40/32rem;
        }
        .pullBtn{
          position: absolute;
          width: 49/32rem;
          height: 41/32rem;
          top: 330/32rem;
          right: 24/32rem;
          z-index: 5;
          >img{
            display: inline-block;
            width: 49/32rem;
            height: 41/32rem;
          }
        }
      }
      .otherMsg {
        width: 100%;
        position: absolute;
        bottom: 100/32rem;
        left: 0;
        z-index: 3;
        a {
          display: inline-block;
          text-align: center;
          span {
            font-size: 40/32rem;
            color: #333333;
          }
          p {
            font-size: 24/32rem;
            color: #999999;
            margin-top: 5/32rem;
          }
          &:nth-of-type(1) {
            margin-left: 110/32rem;
          }
          &:nth-of-type(2) {
            margin: 0 163/32rem;
          }
        }
      }
      .attentionBtns {
        width: 100%;
        position: absolute;
        top: 270/32rem;
        right: 0;
        z-index: 3;
        text-align: right;
        padding-right: 30/32rem;
        a {
          display: inline-block;
          width: 114/32rem;
          height: 47/32rem;
          img {
            width: 100%;
          }
        }
      }
      .recommendAuthorBox{
        width: 100%;
        height: 320/32rem;
        background-color: #eeeeee;
        position: absolute;
        top: 525/32rem;
        left: 0;
        z-index: 5;
        display: none;
        padding: 0 24/32rem;
        overflow: hidden;
        overflow-x: scroll;
        >p{
          font-size: 26/32rem;
          color: #333333;
          margin-top: 15/32rem;
        }
        ul{
          padding-top: 10/32rem;
          padding-right: 24/32rem;
          height: 246/32rem;
          li{
            width: 190/32rem;
            height: 234/32rem;
            background-color: #fff;
            border-radius: 8/32rem;
            -webkit-box-shadow: -3/32rem -3/32rem 2/32rem 2/32rem #e5e5e5,3/32rem 3/32rem 2/32rem 2/32rem #e5e5e5;
            -moz-box-shadow: -3/32rem -3/32rem 2/32rem 2/32rem #e5e5e5,3/32rem 3/32rem 2/32rem 2/32rem #e5e5e5;
            box-shadow: -3/32rem -3/32rem 2/32rem 2/32rem #e5e5e5,3/32rem 3/32rem 2/32rem 2/32rem #e5e5e5;
            float: left;
            margin-right: 24/23rem;
            text-align: center;
            font-size: 0;
            &:last-of-type{
              margin-right: 0;
            }
            img{
              width: 81/32rem;
              height: 81/32rem;
              border-radius: 50%;
              margin-top: 20/32rem;

            }
            h4{
              font-size: 26/32rem;
              color: #333333;
              margin-top: 18/32rem;
              padding: 0 10/32rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
              line-height: 30/32rem;
            }
            >p{
              font-size: 20/32rem;
              color: #999999;
              margin-top: 20/32rem;
              padding: 0 18/32rem;
              text-align: center;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              line-height: 24/32rem;
            }
          }
        }
        /deep/.recommendAuthorBox-wrapper{
          background-color: transparent!important;
        }
        .noRecommendAuthorTips{
          text-align: center;
          font-size: 30/32rem;
          color: #333333;
          position: absolute;
          top: 40%;
          left: 50%;
          -webkit-transform: translate(-50%,50%);
          -moz-transform: translate(-50%,50%);
          -ms-transform: translate(-50%,50%);
          -o-transform: translate(-50%,50%);
          transform: translate(-50%,50%);
        }
      }
    }
    .main {
      width: 100%;
      position: relative;
      .nav {
        width: 100%;
        height: 90/32rem;
        /*<!--line-height: 90/32rem;-->*/
        position: absolute;
        z-index: 5;
        background-color: rgba(255, 255, 255, 0);
        //background-color: #fff;
        top: -90/32rem;
        left: 0;
        #navAnimate {
          position: absolute;
          left: 0;
          -webkit-transition: all .3s ease-out;
          -moz-transition: all .3s ease-out;
          -ms-transition: all .3s ease-out;
          -o-transition: all .3s ease-out;
          transition: all .3s ease-out;
          > a {
            font-size: 32/32rem;
            color: #999999;
            display: inline-block;
            width: 88/32rem;
            text-align: center;
            padding-bottom: 10/32rem;
            margin-right: 30/32rem;
            margin-top: 24/32rem;
            &.active {
              color: #9172fa;
              border-bottom: 4/32rem solid #9172fa;
            }
          }
        }
      }
      .content {
        width: 100%;
        .myDynamic {
          width: 100%;
          text-align: left;
        }

        .myVideo {
          width: 100%;
          text-align: left;
          li {
            padding: 36/32rem 20/32rem 0 20/32rem;
            .tem5 {
              background-color: #fff;
              > span {
                display: block;
                border-bottom: 1/32rem solid #EDEDED;
                padding-bottom: 20/32rem;
                overflow: hidden;
                .newsLeft {
                  width: 75%;
                  height: 166/32rem;
                  float: left;
                  position: relative;
                  h4 {
                    font-size: 32/32rem;
                    font-weight: 400;
                    color: #443C5B;
                    padding-right: 10/32rem;
                    text-align: justify;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    white-space: pre-wrap;
                  }
                  .newsBottom {
                    width: 100%;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    display: flex;
                    .left {
                      flex: 7;
                    }
                    .right {
                      flex: 3;
                      padding-right: 20/32rem;
                      text-align: right;
                    }
                    span {
                      font-size: 24/32rem;
                      color: #A6A6A6;
                    }
                  }
                }
                .newsRight {
                  width: 25%;
                  float: right;
                  text-align: right;
                  img {
                    width: 166/32rem;
                    height: 166/32rem;
                    display: inline-block;
                    border-radius: 6/32rem;
                  }
                  .videoTime {
                    position: absolute;
                    width: 121/32rem;
                    height: 46/32rem;
                    background-color: #9189f2;
                    border-radius: 8/32rem;
                    font-size: 26/32rem;
                    color: #ffffff;
                    text-align: center;
                    line-height: 46/32rem;
                    bottom: 34/32rem;
                    right: 30/32rem;
                  }
                }
              }
            }
          }
        }
        /deep/ .cube-slide-dots {
          display: none;
        }
        /deep/ .cube-slide-item {
          height: auto;
        }
      }
    }
  }

  .loginBox {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 8;
    transform: translateY(1320/32rem);
    display: none;
    transition: all .3s;
  }
</style>
