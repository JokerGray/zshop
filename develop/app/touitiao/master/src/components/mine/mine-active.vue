<template>
  <div>
    <a href="javascript:;" class="iconfont icon-fanhui backBtn" @click="goBack"></a>
    <div class="nav1" ref="nav1">
      <!--<a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>-->
      <div id="mine_navAnimate1">
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
            :totalNum="totalNum"
            :showTopTip="false"
            @scroll="scroll"
            :probeType="3"
            :lastRefreshTime="lastRefreshTime"
            @scrollToEnd="loadMore"
            @pulldown="loadData"
            ref="activeScroll">
      <div class="mineApp">
        <div class="top" ref="mineTop">
          <div class="myPageBg" v-if="myActiveList[0]">
            <img :src="myActiveList[0].scSysUser.userpic">
            <div class="mast"></div>
          </div>
          <div class="myDesc" v-if="myActiveList[0]">
            <img :src="myActiveList[0].scSysUser.userpic">
            <h4>{{myActiveList[0].scSysUser.username}}</h4>
            <p></p>
          </div>
        </div>
        <div class="main">
          <div class="nav" id="mine_nav">
            <div id="mine_navAnimate" ref="mine_navAnimate">
              <a href="javascript:;" :class="{'active':0==active}" @click="changeNav(0)">动态</a>
              <a href="javascript:;" :class="{'active':1==active}" @click="changeNav(1)">文章</a>
              <a href="javascript:;" :class="{'active':2==active}" @click="changeNav(2)">视频</a>
            </div>
          </div>
          <div class="mine-content" ref="mineContent">
            <cube-slide @change="getPage" :loop="false" :auto-play="false" :initial-index="active" ref="minActiveSlide">
              <cube-slide-item>
                <div class="myDynamic">
                  <dynamic :list="myActiveList" @toInfo="toInfo"></dynamic>
                </div>
                <div v-show="myDynamicNoDataZW" class="zwBox">
                  <noDataZW></noDataZW>
                </div>
              </cube-slide-item>
              <cube-slide-item>
                <newsListTemp :list="myArticleList" @toNewsInfo="toNewsInfo"></newsListTemp>
                <div v-show="myArticleNoDataZW" class="zwBox">
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
                <div v-show="myVideoNoDataZW" class="zwBox">
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
    <!--<div class="mine-cubeScroll" style="background-color:#fff;">-->
      <!--<cube-scroll :data="list" :options="options" @pulling-down="loadData"  @pulling-up="loadMore" ref="mineScroll" @scroll="scroll" :listenScroll="true">-->
        <!---->
      <!--</cube-scroll>-->
    <!--</div>-->
    <div class="loading" v-if="loading">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <loading></loading>
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
  import slide from '../common/slider.vue'
  import { Indicator } from 'mint-ui'
  import newsListTemp from '../common/newsListTemp'
  export default {
    components: {
      dynamic,
      scroll,
      noDataZW,
      loading,
      slide,
      newsListTemp
    },
    data: function () {
      return {
        active: 0,
        myArticleList: [],
        myVideoList: [],
        myActiveList: [],
        activePageNo:1,
        articlePageNo: 1,
        videoPageNo: 1,
        myDynamicNoDataZW: false,
        myArticleNoDataZW: false,
        myVideoNoDataZW: false,
        isAjax:true,
        lastRefreshTime:'',//最后刷新时间
        refreshDataLength:'',
        totalNum:'',
        list:[],
        loading:true,
        showBottomTips:true
      }
    },
    created: function () {
      this.getMyActiveList();
    },
    methods: {
      changeNav: function (active) {
        this.active = active
      },
      getPage:function (val) {
        this.active = val;
      },
      goBack: function () {
        this.$router.go(-1)
      },
      getMyActiveList: function () {
        if(!this.isAjax){
          // this.refresh = false;
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryCmsDynamicResponse',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.activePageNo,
              "rows": 10
            }
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          Indicator.close();
          if(res.data.code!=1){
            Toast(res.data.msg);
            return;
          }
          if(this.activePageNo == 1){
            // this.refresh = false;
            this.lastRefreshTime = (new Date().getHours()>=10?new Date().getHours():('0'+new Date().getHours()))+':'+(new Date().getMinutes()>=10?new Date().getMinutes():('0'+new Date().getMinutes()));
            if (res.data.data.length==0) {
              this.myDynamicNoDataZW = true;
              this.showBottomTips = false;
              this.loading = false;
              return
            }else{
              this.refreshDataLength = res.data.data.length;
              this.totalNum = res.data.total;
              this.myActiveList = [];
              this.myActiveList = res.data.data;
              this.myDynamicNoDataZW = false;
              this.showBottomTips = true;
              this.loading = false;
              this.list = this.myActiveList;
            }
          }else{
            this.myActiveList = this.myActiveList.concat(res.data.data);
            this.list = this.myActiveList;
            if(this.myActiveList.length === this.totalNum){
              this.isAjax = false
            }
          }
        })
      },
      getMyArticleList: function () {
        if(!this.isAjax){
          // this.refresh = false;
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryArticelListByUserId',
          data: JSON.stringify({
            // "releaseId": 77798,
            "releaseId": sessionStorage.getItem('userId'),
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
            this.myArticleList = [];
            // this.refresh = false;
            this.lastRefreshTime = (new Date().getHours()>=10?new Date().getHours():('0'+new Date().getHours()))+':'+(new Date().getMinutes()>=10?new Date().getMinutes():('0'+new Date().getMinutes()));
            if (res.data.data.length == 0) {
              this.myArticleNoDataZW = true;
              this.showBottomTips = false;
              return
            }else{
              // if(res.data.total <= 10){
              //   this.bottomTips = '已全部加载完毕！';
              //   this.tipLoading = '';
              // }
              this.refreshDataLength = res.data.data.length;
              this.totalNum = res.data.total;
              this.myArticleList = res.data.data;
              this.myArticleNoDataZW = false;
              this.showBottomTips = true;
              this.list = this.myArticleList;
            }
          } else {
            this.myArticleList = this.myArticleList.concat(res.data.data);
            this.list = this.myArticleList;
            if(this.myArticleList.length === this.totalNum){this.isAjax = false}
          }
        })
      },
      getMyVideoList: function () {
        if(!this.isAjax){
          // this.refresh = false;
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryArticelVideoByUserId',
          data: JSON.stringify({
            // "releaseId": 77798,
            "releaseId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.videoPageNo,
              "rows": 10
            }
          })
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          var num = 0;
          Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.videoPageNo == 1) {
            this.myVideoList = [];
            // this.refresh = false;
            this.lastRefreshTime = (new Date().getHours()>=10?new Date().getHours():('0'+new Date().getHours()))+':'+(new Date().getMinutes()>=10?new Date().getMinutes():('0'+new Date().getMinutes()));
            res.data.data.forEach((v, i) => {
              if (v.previewImgType == 5) {
                num++
              }
            });
            if (res.data.data.length == 0||num == 0) {
              this.myVideoNoDataZW = true;
              this.isAjax = false;
              this.showBottomTips = false;
              return
            }
            this.myVideoNoDataZW = false;
            this.showBottomTips = true;
            this.refreshDataLength = num;
            this.totalNum = res.data.total;
            this.myVideoList = res.data.data;
            this.list = this.myVideoList;
          } else {
            this.myVideoList = this.myVideoList.concat(res.data.data);
            this.list = this.myVideoList;
            if(res.data.data.length==0){
              this.totalNum = this.myVideoList.length;
            }
            if(this.myArticleList.length === this.totalNum){this.isAjax = false}
          }
        })
      },
      scroll: function (pos) {
        // if (pos.y <= 35) {
        //   // this.$refs.scroll.isShowTips = false
        // }
        if ($('#mine_nav').offset().top <= 0) {
          $('.nav1').css('opacity', 1);
          $('#mine_navAnimate1').css({'left': '22%'});
          $('#mine_navAnimate').css({'left': '22%'})
        } else {
          $('.nav1').css('opacity', 0);
          $('#mine_navAnimate1').css({'left': '0'});
          $('#mine_navAnimate').css({'left': '0'})
        }
      },
      loadMore: function () {
        if(this.active == 0){
          this.activePageNo++;
          this.getMyActiveList()
        }else if(this.active == 1){
          this.articlePageNo++;
          this.getMyArticleList()
        }else if(this.videoPageNo == 2){
          this.videoPageNo++;
          this.getMyVideoList()
        }
      },
      loadData: function () {
        this.isAjax = true;
        if(this.active == 0){
          this.activePageNo = 1;
          // this.refresh = true;
          this.getMyActiveList();
          this.list = this.myActiveList
        }else if(this.active == 1){
          this.articlePageNo = 1;
          // this.refresh = true;
          this.getMyArticleList();
          this.list = this.myArticleList
        }else if(this.videoPageNo == 2){
          this.videoPageNo = 1;
          // this.refresh = true;
          this.getMyVideoList();
          this.list = this.myVideoList
        }
      },
      toNewsInfo:function (id, type) {
        if (type == 0 || type == 1 || type == 2) {
          this.$router.push({path: '/newsInfo/' + id})
        } else if (type == 3 || type == 4) {
          this.$router.push({path: '/pictures/' + id})
        } else if (type == 5) {
          this.$router.push({path: '/videoInfo/' + id})
        }
      },
      toInfo:function (type, articleId, previewImgType, authorId,cmsNewComment) {
        if(type==1||type==2||type==3||type==5||type==6){
          if(previewImgType==0||previewImgType==1||previewImgType==2){
            this.$router.push({path:'/newsInfo/'+articleId})
          }else if(previewImgType==3||previewImgType==4){
            this.$router.push({path:'/pictures/'+articleId})
          }else if(previewImgType==5){
            this.$router.push({path:'/videoInfo/'+articleId})
          }
        }else if(type==7){
          this.$router.push({path:'/author/authorPage/homePage/'+authorId})
        }else if (type == 12) {
          if (previewImgType == 10) {
            this.$router.push({path: '/answerInfo/' + articleId})
          }
        }else if(type == 4){
          this.$router.push({path: '/commentReplyInfo?info='+JSON.stringify(cmsNewComment)})
        }else if (type == 15||type == 13||type == 14) {
          if (previewImgType == 12) {
            this.$router.push({path: '/author/authorPage/homePage/singleAnswer/' + articleId})
          }
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.active-wrapper').height($(window).height());
        $('.zwBox').height(($(window).height()-$(this.$refs.mineTop).height()));
        setTimeout(()=>{
          this.$refs.minActiveSlide.refresh()
        },100);
      });
    },
    updated: function () {
      // 重置mineContent高度
      if($($(this.$refs.mineContent).find('.cube-slide-item')[this.active]).height()!==0){
        $(this.$refs.mineContent).height($($(this.$refs.mineContent).find('.cube-slide-item')[this.active]).height());
      }
    },
    watch: {
      active: function (val, old) {
        Indicator.open('加载中...');
        this.$refs.activeScroll.scrollTo(0,0,0);
        this.showBottomTips = false;
        this.isAjax = true;
        this.refreshDataLength = -1;
        this.$refs.nav1.style.opacity = 0;
        this.$refs.mine_navAnimate.style.left = 0;
        if (val == 0) {
          // this.isNoDataZW = false;
          this.activePageNo = 1;
          this.getMyActiveList();
          this.list = this.myActiveList
        } else if (val == 1) {
          // this.isNoDataZW = false;
          this.articlePageNo = 1;
          this.getMyArticleList();
          this.list = this.myArticleList
        } else if (val == 2) {
          // this.isNoDataZW = false;
          this.videoPageNo = 1;
          this.getMyVideoList();
          this.list = this.myVideoList
        }
      },
    },
  }
</script>

<style scoped lang="less" type="text/less">
  .backBtn {
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

  .nav1 {
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
    #mine_navAnimate1 {
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
    top: 0;
    overflow: hidden;
   /deep/.zw{
      width: 100%;
      /*position: absolute;*/
      /*top: 50%;*/
      /*left: 50%;*/
    }
    /deep/.zwPic{
      position: absolute;
      width: 40%;
      height: 24%;
      top: 35% !important;
    }
    /deep/.zwTips{
      position: absolute;
      width: 40%;
      height: 3%;
      top: 35% !important;
      left: 50%;
    }
  }

  .loading{
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

  .mineApp {
    .top{
      width: 100%;
      height: 510/32rem;
      position: relative;
      top: 0;
      left: 0;
      .myPageBg {
        width: 100%;
        height: 514/32rem;
        position: absolute;
        z-index: 3;
        overflow: hidden;
        img {
          width: 100%;
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
        height: 510/32rem;
        position: absolute;
        top: 0;
        z-index: 3;
        img {
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
          margin: 20/32rem 0 0 60/32rem;
          font-weight: 400;
        }
        p {
          font-size: 32/32rem;
          color: #999999;
          margin: 20/32rem 0 0 60/32rem;
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
        top: -90/32rem;
        left: 0;
        #mine_navAnimate {
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
      .mine-content {
        width: 100%;
        .myDynamic {
          width: 100%;
          text-align: left;
          .tmp1 {
            width: 100%;
            height: 200/32rem;
            /*background-color: red;*/
          }
        }
        .myArticle {
          width: 100%;
          padding-left: 0;
          margin: 0;
          background-color: #fff;
          text-align: left;
          /*<!--padding-top: 100/32rem;-->*/
          li {
            padding: 36/32rem 20/32rem 0 20/32rem;
            .tem1 {
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
                }
              }
            }
            .tem2 {
              background-color: #fff;
              > span {
                display: block;
                border-bottom: 1/32rem solid #EDEDED;
                h4 {
                  font-size: 32/32rem;
                  font-weight: 400;
                  color: #443C5B;
                  text-align: justify;
                }
                .newsImg {
                  overflow: hidden;
                  font-size: 0;
                  margin: 20/32rem 0;
                  img {
                    width: 220/32rem;
                    height: 220/32rem;
                    display: inline-block;
                    border-radius: 6/32rem;
                  }
                  img:nth-of-type(2) {
                    margin: 0 20/32rem;
                  }
                }
                .newsBottom {
                  margin-bottom: 20/32rem;
                  display: flex;
                  .left {
                    flex: 8;
                  }
                  .right {
                    flex: 2;
                  }
                  span {
                    font-size: 24/32rem;
                    padding: 0 10/32rem;
                    color: #A6A6A6;
                  }
                }
              }
            }
            .tem3 {
              background-color: #fff;
              > span {
                display: block;
                border-bottom: 1/32rem solid #EDEDED;
                h4 {
                  font-size: 32/32rem;
                  font-weight: 400;
                  color: #443C5B;
                  text-align: justify;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                }
                .newsImg {
                  width: 100%;
                  margin-top: 20/32rem;
                  position: relative;
                  img {
                    width: 703/32rem;
                    height: 394/32rem;
                    display: block;
                    border-radius: 6/32rem;
                  }
                  .imgNum {
                    position: absolute;
                    width: 121/32rem;
                    height: 46/32rem;
                    background-color: #9189f2;
                    border-radius: 8/32rem;
                    font-size: 26/32rem;
                    color: #ffffff;
                    line-height: 46/32rem;
                    bottom: 24/32rem;
                    right: 20/32rem;
                    i {
                      float: left;
                      width: 24/32rem;
                      height: 24/32rem;
                      background: url("../../../static/images/news_2_icon_grop@2x.png") no-repeat center;
                      -webkit-background-size: 24/32rem 24/32rem;
                      background-size: 24/32rem 24/32rem;
                      margin-right: 10/32rem;
                      margin-left: 25/32rem;
                      margin-top: 10/32rem;
                    }
                  }
                }
                .newsBottom {
                  display: flex;
                  margin: 20/32rem 0;
                  .left {
                    flex: 8;
                  }
                  .right {
                    flex: 2;
                    text-align: right;
                  }
                  span {
                    font-size: 24/32rem;
                    padding: 0 10/32rem;
                    color: #A6A6A6;
                  }
                }
              }
            }
            .tem5 {
              background-color: #fff;
              > span {
                display: block;
                border-bottom: 1/32rem solid #EDEDED;
                h4 {
                  font-size: 32/32rem;
                  font-weight: 400;
                  color: #443C5B;
                  text-align: justify;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                }
                .newsImg {
                  width: 100%;
                  margin-top: 20/32rem;
                  position: relative;
                  img {
                    width: 703/32rem;
                    height: 394/32rem;
                    display: block;
                    border-radius: 6/32rem;
                  }
                  .playIcon {
                    position: absolute;
                    width: 90/32rem;
                    height: 90/32rem;
                    background-color: rgba(0, 0, 0, 0.6);
                    background-image: url(../../../static/images/news_2_publish_record_play@2x.png);
                    background-size: 90/32rem 90/32rem;
                    background-position: center center;
                    border-radius: 50%;
                    z-index: 2;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
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
                    bottom: 24/32rem;
                    right: 20/32rem;
                  }
                }
                .newsBottom {
                  display: flex;
                  margin: 20/32rem 0;
                  .left {
                    flex: 8;
                  }
                  .right {
                    flex: 2;
                    text-align: right;
                  }
                  span {
                    font-size: 24/32rem;
                    padding: 0 10/32rem;
                    color: #A6A6A6;
                  }
                }
              }
            }
          }

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
      }
    }
    /*去除轮播图的dots*/
    /deep/ .cube-slide-dots {
      display: none;
    }
    /deep/ .cube-slide-item{
      height: auto;
    }
  }

</style>
