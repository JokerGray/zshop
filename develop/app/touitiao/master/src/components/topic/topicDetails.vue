<template>
  <div>
    <div class="topicDetails_top">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <h4>专题详情</h4>
    </div>
    <scroll
      class="topicDetails_wrapper"
      :pulldown="true"
      :pullup="true"
      :data="moreHotTopic"
      :refreshDataLength="refreshDataLength"
      :lastRefreshTime="lastRefreshTime"
      :totalNum="totalNum"
      @pulldown="loadData"
      @scrollToEnd="loadMore">
      <div class="topicDetails_num">
        <div class="visited_num">
          <p>{{topicInfo.specialBrowser}}</p>
          <span>浏览</span>
        </div>
        <div class="comment_num">
          <p>{{topicInfo.commentNumber}}</p>
          <span>评论</span>
        </div>
      </div>
      <div class="topicDetails_content">
        <div class="title">基本信息</div>
        <div class="topic_name">
          <span>专题名称：</span><span>#{{topicInfo.scCmsSpecialName}}#</span>
        </div>
        <div class="topic_addr">
          <span>专题地区：</span><span>武汉</span>
        </div>
        <div class="topic_desc">
          <span>专题描述：</span><span>{{topicInfo.scCmsSpecialDescribe}}</span>
        </div>
      </div>
      <div class="topic_more">
        <div class="title">更多热门专题</div>
        <div class="recommend_topic">
          <ul>
            <li v-for="(item,index) in moreHotTopic" :key="index" @click="toTopicInfo(item.scCmsSpecialId)">
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
              <div class="recommend_topic_pic"><img :src="item.scCmsResourcesList[0].resourcesUrl"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-wrapper"></div>
    </scroll>

  </div>
</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import $ from 'jquery'

  export default {
    components:{
      scroll
    },
    data: function () {
      return {
        scCmsSpecialId: '',
        moreHotTopic: [],
        topicInfo: {},
        pageNo:1,
        refreshDataLength:'',
        lastRefreshTime:'',
        totalNum:''
      }
    },
    created: function () {
      this.scCmsSpecialId =  this.$route.params.scCmsSpecialId;
      this.getTopicInfo();
      this.getMoreTopicList()
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      getTopicInfo: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/getCmsSpecialResponse',
          data: JSON.stringify({
            "scCmsSpecialId": this.scCmsSpecialId
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          this.topicInfo = res.data.data;
        })
      },
      getMoreTopicList: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/getScCmsSpecials',
          data: JSON.stringify({
            "releaseCity": sessionStorage.getItem('cityCode'),
            "isHot": "1",
            "pagination": {
              "page": this.pageNo,
              "rows": 10
            },
            "isspecial": 0
          }),
          version: 1,
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if(this.pageNo===1){
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.refreshDataLength = res.data.data.length;
            this.totalNum = res.data.total;
            this.moreHotTopic = res.data.data;
          }else{
            this.moreHotTopic = this.moreHotTopic.concat(res.data.data)
          }
        })
      },
      toTopicInfo: function (scCmsSpecialId) {
        this.$router.push({path: '/topicInfo/' + scCmsSpecialId})
      },
      loadData:function () {
        this.pageNo = 1;
        this.getMoreTopicList()
      },
      loadMore:function () {
        this.pageNo++;
        this.getMoreTopicList()
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.topicDetails_wrapper').height($(window).height()-$('.topicDetails_top').height())
      })
    }
  }
</script>


<style scoped lang="less" type="text/less">
  .topicDetails_top {
    width: 100%;
    height: 90/32rem;
    background-color: #fff;
    border-bottom: 1/32rem solid #e5e5e5;
    position: relative;
    z-index: 1;
    a {
      position: absolute;
      top: 0;
      left: 0;
      width: 80/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      text-align: center;
      font-size: 36/32rem;
      color: #333333;
    }
    h4 {
      text-align: center;
      line-height: 90/32rem;
      font-size: 36/32rem;
      color: #333333;
      font-weight: 400;
    }
  }

  .topicDetails_num {
    width: 100%;
    height: 148/32rem;
    background-color: #fff;
    border-top: 20/32rem solid #f8f8f8;
    border-bottom: 20/32rem solid #f8f8f8;
    padding: 14/32rem 0;
    div {
      width: 50%;
      float: left;
      text-align: center;
      p {
        font-size: 30/32rem;
        color: #333333;
      }
      span {
        font-size: 24/32rem;
        color: #999999;
      }
    }
    .visited_num {
      border-right: 1/32rem solid #dddddd;
    }
  }

  .topicDetails_content {
    width: 100%;
    background-color: #fff;
    padding: 60/32rem  24/32rem 0rem 24/32rem;
    border-bottom: 20/32rem solid #f8f8f8;
    position: relative;
    .title {
      width: 100%;
      height: 60/32rem;
      line-height: 60/32rem;
      font-size: 30/32rem;
      color: #666666;
      padding: 0 24/32rem;
      position: absolute;
      top: 0;
      left: 0;
      &::before {
        position: absolute;
        top: 5/32rem;
        left: 0;
        content: '';
        width: 6/32rem;
        height: 50/32rem;
        background-color: #9172fa;
      }
    }
    .topic_name, .topic_addr, .topic_desc {
      padding: 20/32rem 0;
      border-top: 1/32rem solid #e5e5e5;
      span {
        font-size: 30/32rem;
        color: #333333;
        &:nth-of-type(1) {
          color: #666666;
        }
      }
    }
  }

  .topic_more {
    position: relative;
    padding-top: 60/32rem;
    .title {
      width: 100%;
      height: 60/32rem;
      line-height: 60/32rem;
      font-size: 30/32rem;
      color: #666666;
      padding: 0 24/32rem;
      position: absolute;
      top: 0;
      left: 0;
      &::before {
        position: absolute;
        top: 5/32rem;
        left: 0;
        content: '';
        width: 6/32rem;
        height: 50/32rem;
        background-color: #9172fa;
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
                span {
                  color: #5656fe;
                }
              }
              > span {
                float: right;
                font-size: 22/32rem;
                color: #999999;
                padding-top: 8/32rem;
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
              line-height: 35/32rem;
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
  }
</style>
