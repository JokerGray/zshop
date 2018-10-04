<template>
  <div>
    <!--<transition name="fadeInRight">-->
      <!--<router-view v-show="routerShow"></router-view>-->
    <!--</transition>-->
    <scroll class="topicHome_wrapper" :showTopTip="false" :showBottomTips="false">
      <div class="hot_topic">
        <ul>
          <li v-for="(item,index) in hotTopicList" :key="index" @click="toTopicInfo(item.scCmsSpecialId)">
            <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw703.png')}">
            <div class="item_top">
              <span>#{{item.scCmsSpecialName}}#</span>
              <i>{{item.articleNumber}}篇文章</i>
            </div>
            <div class="item_bottom">
              <p>{{item.scCmsSpecialDescribe}}</p>
            </div>
            <div class="item_mask"></div>
          </li>
          <!--<li>-->
          <!--<img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/aZWeHNCxbfGKkinWKTjaNSCmGjK4x5Cm.jpg">-->
          <!--<div class="item_top">-->
          <!--<span>#美食#</span>-->
          <!--<i>512篇文章</i>-->
          <!--</div>-->
          <!--<div class="item_bottom">-->
          <!--<p>收到就好可视对地方规定发给对方</p>-->
          <!--</div>-->
          <!--<div class="item_mask"></div>-->
          <!--</li>-->
        </ul>
      </div>
      <div class="recommend_topic">
        <ul>
          <li v-for="(item,index) in recommendTopicList" :key="index" @click="toTopicInfo(item.scCmsSpecialId)">
            <div class="recommend_topic_desc">
              <div class="topic_name">
                <p><span>#</span>{{item.scCmsSpecialName}}<span>#</span></p>
                <span>{{item.articleNumber}}篇文章</span>
              </div>
              <div class="topic_title">
                <h4>{{item.scCmsSpecialDescribe}}</h4>
              </div>
              <div class="topic_other_msg">
                <span class="iconfont icon-chakan1">&nbsp;{{item.specialBrowser}}</span>
                <span class="iconfont icon-xinxi">&nbsp;{{item.commentNumber}}</span>
                <span>{{item.scCmsSpecialCreateTime}}</span>
              </div>
            </div>
            <div class="recommend_topic_pic"><img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw166.png')}"></div>
          </li>
          <!--<li>-->
          <!--<div class="recommend_topic_desc">-->
          <!--<div class="topic_name">-->
          <!--<p><span>#</span>武汉美食<span>#</span></p>-->
          <!--<span>7篇文章</span>-->
          <!--</div>-->
          <!--<div class="topic_title">-->
          <!--<h4>卡萨丁垃圾费喀纳斯卡萨丁垃圾费喀纳斯</h4>-->
          <!--</div>-->
          <!--<div class="topic_other_msg">-->
          <!--<span class="iconfont icon-chakan1">&nbsp;1260</span>-->
          <!--<span class="iconfont icon-xinxi">&nbsp;1260</span>-->
          <!--<span>2018-01-25 10:27</span>-->
          <!--</div>-->
          <!--</div>-->
          <!--<div class="recommend_topic_pic"><img src="http://zxcity-app.oss-cn-hangzhou.aliyuncs.com/user-dir/aZWeHNCxbfGKkinWKTjaNSCmGjK4x5Cm.jpg"></div>-->
          <!--</li>-->
        </ul>
      </div>
      <div class="loading-wrapper"></div>
    </scroll>
    <div class="loading" v-if="loading"><loading></loading></div>
  </div>
</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import $ from 'jquery'
  import loading from '../common/loading'
  export default {
    components:{
      scroll,
      loading
    },
    created: function () {
      this.getHotTopList();
      this.getRecommendTopicList();

      if(this.$route.name==='newsInfo'||this.$route.name==='topicSearch'||this.$route.name==='videoInfo'||this.$route.name==='pictures'){
        this.routerShow = true;
        this.$nextTick(function () {
          $('.hot_topic').hide();
          $('.recommend_topic').hide();
        })
      }
    },
    data: function () {
      return {
        hotTopicList:[],
        recommendTopicList:[],
        // routerShow: false,
        loading:true
      }
    },
    methods:{
      getHotTopList:function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/getScCmsSpecials',
          data: JSON.stringify({
            "releaseCity": sessionStorage.getItem('cityCode'),
            "isHot": "1",
            "pagination": {
              "page": "1",
              "rows": 10
            },
            "isspecial": 1
          }),
          version: 1,
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          this.hotTopicList = res.data.data;
        })

      },
      getRecommendTopicList:function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/getScCmsSpecials',
          data: JSON.stringify({
            "releaseCity": sessionStorage.getItem('cityCode'),
            "isHot": "1",
            "pagination": {
              "page": "1",
              "rows": 10
            },
            "isspecial": 0
          }),
          version: 1,
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          this.recommendTopicList = res.data.data;
          this.loading = false
        })

      },
      toTopicInfo:function (scCmsSpecialId) {
        this.$router.push({path:'/topicInfo/'+scCmsSpecialId})
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.topicHome_wrapper').height($(window).height()-$('header').height()-$('.mint-tabbar').height()-10)
      })
    },
    watch:{
      $route: function (newValue, oldValue) {
        // if (newValue.name === 'newsInfo'||newValue.name === 'topicSearch'||newValue.name==='videoInfo'||newValue.name==='pictures') {
        //   this.routerShow = true;
        //   $('.hot_topic').fadeOut(400);
        //   $('.recommend_topic').fadeOut(400)
        // } else {
        //   this.routerShow = false;
        //   $('.hot_topic').fadeIn(600);
        //   $('.recommend_topic').fadeIn(600)
        // }
      }
    }
  }
</script>


<style scoped lang="less" type="text/less">
  .hot_topic {
    width: 100%;
    /*<!--height: 300/32rem;-->*/
    background-color: #f8f8f8;
    margin-top: 100/32rem;
    padding: 20/32rem 12/32rem 0 12/32rem;
    ul {
      overflow: hidden;
      li {
        width: 341/32rem;
        height: 260/32rem;
        border-radius: 8/32rem;
        position: relative;
        float: left;
        margin: 0 11/32rem 20/32rem 11/32rem;
        img {
          width: 341/32rem;
          height: 260/32rem;
          border-radius: 8/32rem;
        }
        .item_top {
          width: 100%;
          height: 68/32rem;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          span {
            float: left;
            width: 131/32rem;
            height: 68/32rem;
            background: url("../../../static/images/news_2_icon_theme_orange@2x.png") no-repeat center;
            -webkit-background-size: 131/32rem 68/32rem;
            background-size: 131/32rem 68/32rem;
            color: #ffffff;
            text-align: center;
            line-height: 50/32rem;
            font-size: 28/32rem;
          }
          i {
            float: right;
            font-style: normal;
            font-size: 22/32rem;
            color: #eeeeee;
            padding-right: 14/32rem;
            padding-top: 10/32rem;
          }
        }
        .item_bottom {
          position: absolute;
          bottom: 10/32rem;
          left: 0;
          padding: 0 24/32rem;
          z-index: 1;
          p {
            font-size: 30/32rem;
            color: #ffffff;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
            overflow: hidden;
            line-height: 35/32rem;
          }
        }
        .item_mask {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, .4);
          -webkit-border-radius: 8/32rem;
          -moz-border-radius: 8/32rem;
          border-radius: 8/32rem;
          z-index: 0;

        }
        &:nth-of-type(1) {

        }
      }
    }
  }

  .recommend_topic {
    width: 100%;
    ul {
      li {
        width: 100%;
        height: 230/32rem;
        position: relative;
        border-top: 1/32rem solid #e5e5e5;
        .recommend_topic_desc {
          width: 100%;
          height: 230/32rem;
          position: absolute;
          padding-right: 240/32rem;
          padding-left: 24/32rem;
          .topic_name {
            overflow: hidden;
            margin-top: 20/32rem;
            p {
              font-size: 34/32rem;
              color: #53537d;
              float: left;
              font-weight: 700;
              width: 79%;
              span {
                color: #5656fe;
              }
            }
            > span {
              float: right;
              font-size: 22/32rem;
              color: #999999;
              padding-top: 8/32rem;
              width: 21%;
              text-align: center;
            }
          }
        }
        .recommend_topic_pic {
          width: 191/32rem;
          height: 191/32rem;
          margin-top: 20/32rem;
          margin-right: 24/32rem;
          float: right;
          img {
            width: 191/32rem;
            height: 191/32rem;
            border-radius: 4/32rem;
          }
        }
        .topic_title {
          font-size: 30/32rem;
          color: #53537d;
          margin-top: 20/32rem;
          h4 {
            font-weight: 400;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            word-break: break-all;
            overflow: hidden;
            line-height: 34/32rem;
          }
        }
        .topic_other_msg {
          width: 100%;
          display: flex;
          color: #999999;
          font-size: 24/32rem;
          position: absolute;
          bottom: 10/32rem;
          padding-right: 240/32rem;
          span:nth-of-type(1) {
            flex: 1;
            font-size: 24/32rem;
          }
          span:nth-of-type(2) {
            flex: 1;
            text-align: left;
            font-size: 24/32rem;
          }
          span:nth-of-type(3) {
            flex: 3;
            text-align: center;
          }
        }
      }
    }
  }

  .loading{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
</style>
