<template>
  <div>
    <div class="hide">
      <div class="header">
        <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
        <span :class="{'active':cateType=='article'}" @click="changeType('article')">文章</span>
        <span :class="{'active':cateType=='announcement'}" @click="changeType('announcement')">公告</span>
      </div>
      <div class="listContent" v-show="!loading">
        <scroll
          v-show="cateType==='article'"
          class="collection-wrapper"
          ref="collectionWrapper"
          :data="myArticleList"
          :pulldown="true"
          :pullup="true"
          :refreshDataLength="refreshDataLength"
          :lastRefreshTime="lastRefreshTime"
          :totalNum="totalNum"
          @scrollToEnd="loadMore"
          @pulldown="loadData">
          <!--<div class="pullUp" v-if="refresh"><span>正在刷新数据中...</span>-->
          <!--<p>最后更新:今天{{lastRefreshTime}}</p></div>-->
          <ul>
            <!--<li class="pullUp" v-if="refresh"><span>正在刷新数据中...</span><p>最后更新:今天{{lastRefreshTime}}</p></li>-->
            <li v-for="(item,index) in myArticleList" :key="index" v-if="5!==item.imgType">
              <leftDel textTips="删除文章" @deleteItem="deleteItem(index,item.articleId)" :index="index" ref="leftDel">
                <div class="tem1" v-if="1==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                  <div class="newsLeft">
                    <h4>{{item.articleTitle}}</h4>
                    <div class="newsBottom">
                      <div class="left">
                        <span>{{item.scCmsSubscription.subscriptionName}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="newsRight">
                    <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw166.png')}"/>
                  </div>
                  <div class="articleDataBox">
                    <span>推荐{{item.forwardNumber}}</span>
                    <span>阅读{{item.articleBrowser}}</span>
                    <span>评论{{item.commentNum}}</span>
                  </div>
                  </span>
                </div>
                <div class="tem2" v-if="2==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                    <h4>{{item.articleTitle}}</h4>
                    <div class="newsImg">
                      <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                      <img v-lazy="{src:item.scCmsResourcesList[1].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                      <img v-lazy="{src:item.scCmsResourcesList[2].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                    </div>
                    <div class="newsBottom">
                      <div class="left">
                        <span>{{item.scCmsSubscription.subscriptionName}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                    <div class="articleDataBox">
                      <span>推荐{{item.forwardNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>评论{{item.commentNum}}</span>
                    </div>
                   </span>
                </div>
                <div class="tem3" v-if="3==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                    <h4>{{item.articleTitle}}</h4>
                    <div class="newsImg">
                      <img v-lazy="{src:item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl,loading:require('../../../static/images/zw750.png')}"/>
                      <span class="imgNum"><i></i>{{item.scCmsResourcesList.length-1}}图</span>
                    </div>
                    <div class="newsBottom">
                      <div class="left">
                        <span>{{item.scCmsSubscription.subscriptionName}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                    <div class="articleDataBox">
                      <span>推荐{{item.forwardNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>评论{{item.commentNum}}</span>
                    </div>
                  </span>
                </div>
                <div class="tem5" v-if="5==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                    <h4>{{item.articleTitle}}</h4>
                    <div class="newsImg">
                      <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw750.png')}"/>
                      <span class="playIcon"></span>
                      <span class="videoTime">{{item.scCmsResourcesList[0].videoPlayTime}}</span>
                    </div>
                    <div class="newsBottom">
                      <div class="left">
                        <span>{{item.scCmsSubscription.subscriptionName}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                    <div class="articleDataBox">
                      <span>推荐{{item.forwardNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>评论{{item.commentNum}}</span>
                    </div>
                  </span>
                </div>
                <div class="tem10" v-if="10==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                    <div class="newsLeft">
                      <h4>{{item.articleTitle}}</h4>
                      <div class="newsBottom">
                        <div class="left">
                          <span></span>
                          <span>{{item.scCmsSubscription.subscriptionName}}</span>
                          <!--<span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>-->
                          <!--<span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>-->
                          <span>{{item.answerNumber}}个回答</span>
                        </div>
                        <div class="right">
                          <span>{{item.releaseTime.substring(0,10)}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="newsRight">
                       <img
                         v-lazy="{src:item.scCmsResourcesList.length!==0?item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl:'',loading:require('../../../static/images/zw166.png')}"/>
                    </div>
                    <div class="articleDataBox">
                      <span>推荐{{item.forwardNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>评论{{item.commentNum}}</span>
                    </div>
                  </span>
                </div>
              </leftDel>
            </li>
            <!--<li class="bottomLoading" v-show="!loading"><img :src="tipLoading">&nbsp;<span>{{bottomTips}}</span></li>-->
          </ul>
          <div class="loading-wrapper"></div>
        </scroll>
        <scroll
          v-show="cateType==='announcement'"
          class="announcement-wrapper"
          ref="announcementWrapper"
          :data="myAnnouncementList"
          :pulldown="true"
          :pullup="true"
          :refreshDataLength="refreshDataLength_1"
          :lastRefreshTime="lastRefreshTime_1"
          :totalNum="totalNum_1"
          @scrollToEnd="loadMore"
          @pulldown="loadData">
          <ul>
            <li v-for="(item,index) in myAnnouncementList" :key="index" @click="toAnnouncmentInfo(item.scCmsNoticeId)">
              <h4>{{item.scCmsNoticeTitle}}</h4>
              <p>{{item.scCmsNoticeCreateTime}}</p>
            </li>
          </ul>
          <div class="loading-wrapper"></div>
        </scroll>
      </div>
      <loading v-if="loading"></loading>
      <div class="isNoData" v-show="isNoData">
        <noDataZW></noDataZW>
      </div>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import leftDel from '../common/leftDel'
  import scroll from '../common/BScroll'
  import loading from '../common/loading'
  import noDataZW from '../common/noDataZW'
  import $ from 'jquery'

  export default {
    components: {
      leftDel,
      scroll,
      loading,
      noDataZW
    },
    data: function () {
      return {
        cateType: 'article',
        myArticleList: null,
        myAnnouncementList: null,
        loading: true,
        lastRefreshTime: '',//最后刷新时间
        //refresh: false,//是否显示刷新提示
        isNoData: false,
        pageNo: 1,
        refreshDataLength: -1,
        totalNum: -1,
        isAjax: true,

        lastRefreshTime_1: '',
        pageNo_1:1,
        refreshDataLength_1: -1,
        totalNum_1: -2,
        isAjax_1: true,

      }
    },
    created: function () {
      this.getMyArticleList();
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      getMyArticleList: function () {
        if (!this.isAjax) {
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_back/selectAllArticle',
          data: JSON.stringify({
            "releaseId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo,
              "rows": "10"
            }
          })
        };
        if (this.cateType == 'history') {
          data.cmd = 'cms_new/queryArticleHistory'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if (this.pageNo == 1) {
            if (res.data.data.length == 0) {
              this.isNoData = true;
              this.loading = false;
              this.myArticleList = [];
              return
            }
            this.refreshDataLength = res.data.data.length;
            this.totalNum = res.data.total;
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.myArticleList = res.data.data;
            this.loading = false;
            this.isNoData = false
          } else {
            this.myArticleList = this.myArticleList.concat(res.data.data);
            if (this.myArticleList.length === this.totalNum) {
              this.isAjax = false
            }
          }
        })
      },
      getAnnouncementList: function () {
        if(!this.isAjax_1){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/selectNoticeList',
          data: JSON.stringify({
            userId: '0',
            pagination: {
              page: this.pageNo_1,
              rows: 5
            }
          })
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.pageNo_1 == 1) {
            if (res.data.data.length == 0) {
              this.isNoData = true;
              this.loading = false;
              this.myAnnouncementList = [];
              return
            }
            this.refreshDataLength_1 = res.data.data.length;
            this.totalNum_1 = res.data.total;
            this.lastRefreshTime_1 = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.myAnnouncementList = res.data.data;
            this.loading = false;
            this.isNoData = false
          } else {
            this.myAnnouncementList = this.myAnnouncementList.concat(res.data.data);
            if (this.myAnnouncementList.length === this.totalNum_1) {
              this.isAjax_1 = false
            }
          }
        })
      },
      changeType: function (type) {
        this.cateType = type;
        this.isNoData = false;
        if (this.cateType === 'article') {
          //使左滑删除按钮隐藏
          if(this.$refs.leftDel){
            this.$refs.leftDel.forEach((v, i) => {
              v.init()
            });
          }
          if(!this.myArticleList){
            this.loading = true;
            this.isAjax = true;
            this.pageNo = 1;
            this.refreshDataLength = -1;
            this.getMyArticleList();
          }else if(this.myArticleList.length===0){
            this.isNoData = true;
          }
          // this.$refs.collectionWrapper.scrollTo(0, 0, 0);
        } else if (this.cateType === 'announcement') {
          if(!this.myAnnouncementList){
            this.loading = true;
            this.isAjax_1 = true;
            this.pageNo_1 = 1;
            this.refreshDataLength_1 = -1;
            this.getAnnouncementList()
          }else if(this.myAnnouncementList.length===0){
            this.isNoData = true;
          }
        }
      },
      toNewsInfo: function (id, type) {
        if (type == 0 || type == 1 || type == 2) {
          this.$router.push({path: '/newsInfo/' + id})
        } else if (type == 3 || type == 4) {
          this.$router.push({path: '/pictures/' + id})
        } else if (type == 5) {
          this.$router.push({path: '/videoInfo/' + id})
        } else if (type == 10) {
          this.$router.push({path: '/answerInfo/' + id})
        }
      },
      loadMore: function () {
        if(this.cateType === 'article'){
          this.pageNo++;
          this.getMyArticleList()
        }else if(this.cateType === 'announcement'){
          this.pageNo_1++;
          this.getAnnouncementList()
        }
      },
      loadData: function () {
        if(this.cateType === 'article'){
          this.pageNo = 1;
          this.isAjax = true;
          this.getMyArticleList()
        }else if(this.cateType === 'announcement'){
          this.pageNo_1 = 1;
          this.isAjax_1 = true;
          this.getAnnouncementList()
        }
      },
      deleteArticle: function (index, articleId) {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_back/deleteArticle',
          data: JSON.stringify({
            "articleId": articleId
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          Toast(res.data.msg);
          this.myArticleList.splice(index, 1);
          if (this.list.length == 0) {
            this.isNoData = true
          }
        })
      },
      deleteItem: function (index, articleId) {
        this.deleteArticle(index, articleId)
      },
      toAnnouncmentInfo:function (id) {
        this.$router.push({path:'/announcmentInfo/'+id})
      }
    },

    mounted: function () {
      this.$nextTick(function () {
        $('.collection-wrapper').height($(window).height() - $('.header').height());
        $('.announcement-wrapper').height($(window).height() - $('.header').height());
        $('.isNoData').height($(window).height() - $('.header').height())
      })
    },
  }
</script>


<style scoped lang="less" type="text/less">
  .hide {
    height: 736px;
    overflow: hidden;
  }

  .header {
    width: 100%;
    height: 90/32rem;
    background-color: #fff;
    line-height: 90/32rem;
    top: 0;
    left: 0;
    border-bottom: 1/32rem solid #e5e5e5;
    position: absolute;
    z-index: 3;
    a {
      display: inline-block;
      width: 90/32rem;
      height: 90/32rem;
      text-align: center;
      font-size: 32/32rem;
      color: #787878;
      float: left;
    }
    span {
      font-size: 34/32rem;
      color: #999999;
      float: left;
      margin-left: 150/32rem;
      height: 88/32rem;
      &.active {
        border-bottom: 4/32rem solid #333;
        color: #333333;
      }
    }
  }

  .listContent {
    width: 100%;
    background-color: #fff;
    /*<!--height: 1140/32rem;-->*/
    padding-top: 90/32rem;
    .collection-wrapper {
      ul {
        padding-left: 0;
        margin: 0;
        background-color: #fff;
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
                    span {
                      padding: 0 10/32rem;
                    }
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
              padding-bottom: 20/32rem;
              overflow: hidden;
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
                  flex: 7;
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
              padding-bottom: 20/32rem;
              overflow: hidden;
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
                    margin-top: 10/32rem;
                    margin-left: 25/32rem;
                  }
                }
              }
              .newsBottom {
                display: flex;
                margin: 20/32rem 0;
                .left {
                  flex: 7;
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
              padding-bottom: 20/32rem;
              overflow: hidden;
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
                  flex: 7;
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
          .tem10 {
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
                    span {
                      padding: 0 10/32rem;
                      &:first-of-type {
                        display: inline-block;
                        width: 74/32rem;
                        height: 29/32rem;
                        background: url("../../../static/images/icon_wendabiaoqian_xiao@2x.png") no-repeat center;
                        -webkit-background-size: 100%;
                        background-size: 100%;
                        vertical-align: middle;
                      }
                    }
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
          .articleDataBox {
            width: 100%;
            height: 70/32rem;
            background-color: #d2d2d2;
            float: left;
            margin-top: 20/32rem;
            span {
              float: left;
              width: 33.3333%;
              height: 50/32rem;
              font-size: 26/32rem;
              text-align: center;
              line-height: 50/32rem;
              color: #ffffff;
              margin-top: 10/32rem;
              &:nth-of-type(2) {
                border-left: 1/32rem solid #fff;
                border-right: 1/32rem solid #fff;
              }
            }
          }
        }
      }
    }
    .announcement-wrapper {
      ul {
        padding: 0 24/32rem;
        li {
          padding: 40/32rem 0;
          border-bottom: 1/32rem solid #eee;
          h4 {
            font-size: 32/32rem;
            color: #333333;
            line-height: 36/32rem;
          }
          p {
            font-size: 28/32rem;
            color: #999999;
            margin-top: 30/32rem;
          }
        }
      }
    }

  }

  .isNoData {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 160/32rem;
    overflow: hidden;
    z-index: 0;
  }

</style>
