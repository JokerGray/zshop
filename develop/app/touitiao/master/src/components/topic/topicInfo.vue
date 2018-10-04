<template>
  <div>
    <a href="javascript:;" class="iconfont icon-fanhui back_fixed" @click.stop="goBack"></a>
    <div class="topicInfo_navBar_1">
      <a href="javascript:;" class="iconfont icon-fanhui back" @click="goBack"></a>
      <div class="topic_nav_1">
        <a href="javascript:;" :class="{'active':active==0}" @click="changeNav(0,0,1001)">主页</a>
        <a href="javascript:;" :class="{'active':active==1}" @click="changeNav(1,1,1001)">热门</a>
        <a href="javascript:;" :class="{'active':active==2}" @click="changeNav(2,0,1002)">图集</a>
        <a href="javascript:;" :class="{'active':active==3}" @click="changeNav(3,0,1003)">视频</a>
      </div>
    </div>
    <scroll class="topicInfo_wrapper"
            ref="topicInfo_wrapper"
            :probeType="3"
            :data="list"
            :pulldown="true"
            :pullup="true"
            :showBottomTips="false"
            :lastRefreshTime="lastRefreshTime"
            @pulldown="loadData"
            @scrollToEnd="loadMore"
            @scroll="scroll">
      <div v-if="topicInfo.scCmsResourcesList">
        <div class="topic_author" @click="toTopicDetails(scCmsSpecialId)">
          <div class="page_bg"><img :src="topicInfo.scCmsResourcesList[0].resourcesUrl"></div>
          <div class="author_info">
            <img :src="topicInfo.scCmsResourcesList[0].resourcesUrl">
            <div>
              <h4>#{{topicInfo.scCmsSpecialName}}#</h4>
              <p><span>浏览{{topicInfo.specialBrowser}}</span>&nbsp;&nbsp;<span>讨论{{topicInfo.commentNumber}}</span></p>
            </div>
          </div>
        </div>
        <div class="topic_nav">
          <a href="javascript:;" :class="{'active':active==0}" @click="changeNav(0,0,1001)">主页</a>
          <a href="javascript:;" :class="{'active':active==1}" @click="changeNav(1,1,1001)">热门</a>
          <a href="javascript:;" :class="{'active':active==2}" @click="changeNav(2,0,1002)">图集</a>
          <a href="javascript:;" :class="{'active':active==3}" @click="changeNav(3,0,1003)">视频</a>
        </div>
        <div class="topic_dsc" v-if="active==0">
          <p>专题描述：{{topicInfo.scCmsSpecialDescribe}}</p>
        </div>
        <div class="topic_content">
          <newsListTemp :list="list" @toNewsInfo="toNewsInfo"></newsListTemp>
          <div class="bottomLoading" v-if="bottomLoading">{{bottomLoadingTips}}</div>
        </div>
      </div>
      <div class="loading-wrapper"></div>
    </scroll>
    <div class="noDataZW" v-if="list.length==0"><noDataZW></noDataZW></div>
    <div class="loading" v-if="loading">
      <a href="javascript:;" class="iconfont icon-fanhui back" @click="goBack"></a>
      <loading></loading>
    </div>
  </div>

</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import noDataZW from '../common/noDataZW'
  import loading from '../common/loading'
  import $ from 'jquery'
  import scroll from '../common/BScroll'
  import { Indicator } from 'mint-ui'
  import newsListTemp from '../common/newsListTemp'
    export default {
    components:{
      noDataZW,
      loading,
      scroll,
      newsListTemp
    },
      data:function () {
        return{
          list:[],
          active:0,
          topicInfo:{},
          scCmsSpecialId:'',
          loading:true,
          isHot:0,
          articleType:1001,
          pageNo:1,
          bottomLoading:false,
          lastRefreshTime:'',
          bottomLoadingTips:'正在努力加载中...',
          isAjax:true
          // routerShow:false
        }
      },
      created:function () {
        this.topicInit()
      },
      methods:{
        topicInit:function () {
          this.scCmsSpecialId = this.$route.params.scCmsSpecialId;
          this.getTopicInfo();
          this.getTopicArticle();
        },
        goBack:function () {
          this.$router.go(-1)
        },
        changeNav:function (index,isHot,articleType) {
          Indicator.open('加载中...');
          this.pageNo = 1;
          this.isAjax = true;
          this.active = index;
          this.isHot = isHot;
          this.articleType = articleType;
          this.bottomLoadingTips = '正在努力加载中...';
          this.$refs.topicInfo_wrapper.scrollTo(0,0,300);
          $('.topicInfo_navBar_1').hide();
          this.getTopicArticle()
        },
        getTopicInfo:function () {
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd:'cms_new/getCmsSpecialResponse',
            data:JSON.stringify({
              "scCmsSpecialId": this.scCmsSpecialId
            })
          };
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            if(res.data.code!==1){
              Toast(res.data.msg);
              return
            }
            this.topicInfo = res.data.data;
          })
        },
        getTopicArticle:function (isHot,articleType) {
          if(!this.isAjax){return}
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd:'cms_new/getScCmsArticles',
            data:JSON.stringify({
              "pagination": {
                "page": this.pageNo,
                "rows": "10"
              },
              "scCmsSpecialId": this.scCmsSpecialId,
              "articleType": this.articleType,
              "isHot": this.isHot,
            })
          };
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            Indicator.close();
            if(res.data.code!==1){
              Toast(res.data.msg);
              return
            }else if(this.pageNo==1){
              if(res.data.data.length<10){
                this.bottomLoading = false
              }else{
                this.bottomLoading = true
              }
              this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
              this.list = [];
              this.list = res.data.data;
              this.loading = false;
            }else if(this.pageNo>1){
              if(res.data.data.length==0){
                // this.bottomLoading = true;
                this.isAjax = false
                this.bottomLoading = true;
                this.bottomLoadingTips = '(*¯ω¯)别扯了，没有更多了';
                return
              }
              this.list = this.list.concat(res.data.data);
            }
          })
        },
        scroll:function (pos) {
          if($('.topic_author').height()<-pos.y){
            $('.topicInfo_navBar_1').show()
          }else{
            $('.topicInfo_navBar_1').hide()
          }
        },
        loadData:function () {
          this.isAjax = true;
          this.pageNo = 1;
          this.getTopicArticle()
        },
        loadMore:function () {
          this.pageNo++;
          this.getTopicArticle()
        },
        toNewsInfo: function (id, type) {
          if (type == 0 || type == 1 || type == 2) {
            this.$router.push({path: '/newsInfo/' + id})
          } else if (type == 3 || type == 4) {
            this.$router.push({path: '/pictures/' + id})
          } else if (type == 5) {
            this.$router.push({path: '/videoInfo/' + id})
          }
        },
        toTopicDetails:function (scCmsSpecialId) {
          this.$router.push({path: '/topicDetails/' + scCmsSpecialId})
        }
      },
      mounted:function () {
        this.$nextTick(function () {
          $('.loading').height($(window).height());
          $('.topicInfo_wrapper').height($(window).height())
        })
      },
      watch: {
        $route: function (newValue, oldValue) {
          if(newValue.name === 'topicInfo'&&oldValue.name ==='topicDetails'){
            this.topicInit()
          }

          //   if (newValue.name === 'newsInfo' || newValue.name === 'newsSearch' || newValue.name === 'videoInfo' || newValue.name === 'pictures') {
        //     this.routerShow = true;
        //     $('.topicInfo_wrapper').fadeOut(400);
        //     $('.nav_1').fadeOut(400)
        //   } else {
        //     this.routerShow = false;
        //     $('.topicInfo_wrapper').fadeIn(600);
        //     $('.nav_1').fadeIn(600)
        //   }
        }
      }
    }
</script>

<style scoped lang="less" type="text/less">
  .back_fixed{
    position: absolute;
    top: 0;
    left: 0;
    width: 80/32rem;
    height: 80/32rem;
    text-align: center;
    line-height: 80/32rem;
    color: #ffffff;
    font-size: 36/32rem;
    z-index: 1;
  }
  .topic_author{
    width: 100%;
    height: 338/32rem;
    position: relative;
    .page_bg{
      width: 100%;
      height: 338/32rem;
      &::before{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        background-color: rgba(14, 14, 14, 0.4);
        z-index: 1;
      }
      img{
        width: 100%;
        height: 338/32rem;
        /*<!-- -webkit-filter: blur(3/32rem); !* Chrome, Opera *!-->*/
        /*<!-- -moz-filter: blur(3/32rem);-->*/
        /*<!-- -ms-filter: blur(3/32rem);-->*/
        /*<!--filter: blur(3/32rem);-->*/
      }
    }
    .author_info{
      width: 100%;
      height: 141/32rem;
      position: absolute;
      bottom: 50/32rem;
      left: 0;
      padding-left: 20/32rem;
      z-index: 1;
      img{
        width: 141/32rem;
        height: 141/32rem;
        border-radius: 8/32rem;
      }
      >div{
        width: 100%;
        height: 100%;
        position: absolute;
        padding-left: 181/32rem;
        top: 0;
        left: 0;
        h4{
          font-size: 36/32rem;
          color: #ffffff;
          font-weight: 400;
        }
        p{
          font-size: 26/32rem;
          color: #ffffff;
          margin-top: 30/32rem;
        }
      }
    }
  }
  .topic_nav,.topic_nav_1{
    width: 100%;
    height: 80/32rem;
    background-color: #fff;
    padding: 0 138/32rem;
    border-bottom: 1/32rem solid #e5e5e5;
    a{
      display: inline-block;
      height: 100%;
      line-height: 80/32rem;
      font-size: 34/32rem;
      color: #999999;
      margin-left: 55/32rem;
      &:nth-of-type(1){
        margin-left: 0;
      }
      &.active{
        color: #333333;
        border-bottom: 4/32rem solid #9189f2;
      }
    }
  }
  .topic_dsc{
    width: 100%;
    max-height: 204/32rem;
    background-color: #fff;
    border-top: 24/32rem solid #f8f8f8;
    border-bottom: 24/32rem solid #f8f8f8;
    padding: 20/32rem 24/32rem;
    p{
      font-size: 30/32rem;
      color: #333333;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      word-break: break-all;
      overflow: hidden;
      line-height: 32/32rem;
    }
  }
  .noDataZW{
    width: 100%;
    height: 62.87%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    overflow: hidden;
    /deep/.zw{
      /deep/.zwPic{
        top: 35%;
      }
      /deep/.zwTips{
        top:35%;
      }
    }
  }
  .loading{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 2;
    .back{
      position: absolute;
      top: 0;
      left: 0;
      width: 80/32rem;
      height: 80/32rem;
      text-align: center;
      line-height: 80/32rem;
      color: #333333;
      font-size: 36/32rem;
      z-index: 1;
    }
  }
  .topicInfo_navBar_1{
    width: 100%;
    height: 80/32rem;
    position: fixed;
    background-color: #fff;
    top: 0;
    left: 0;
    z-index: 2;
    display: none;
    .back{
      position: absolute;
      top: 0;
      left: 0;
      width: 80/32rem;
      height: 80/32rem;
      text-align: center;
      line-height: 80/32rem;
      color: #333333;
      font-size: 36/32rem;
      z-index: 1;
    }
  }
</style>
