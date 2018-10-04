<template>
  <div>
    <div class="hide">
      <div class="header">
        <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
        <h4>收藏/历史</h4>
      </div>
      <div class="tabNav">
        <a href="javascript:;" :class="{'active':cateType=='Collection'}" @click="changeType('Collection')">我的收藏</a>
        <a href="javascript:;" :class="{'active':cateType=='history'}" @click="changeType('history')">阅读历史</a>
      </div>
      <div class="listContent" v-show="!loading">
        <scroll
          class="collection-wrapper"
          ref="collectionWrapper"
          :data="list"
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
            <li v-for="(item,index) in list" :key="index" v-if="5!==item.imgType">
              <leftDel :textTips="textTips" @deleteItem="deleteItem(index,item.articleId)" :index="index" ref="leftDel">
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
               <img v-lazy="{src:item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl,loading:require('../../../static/images/zw166.png')}"/>
            </div>
          </span>
                </div>
              </leftDel>
            </li>
            <!--<li class="bottomLoading" v-show="!loading"><img :src="tipLoading">&nbsp;<span>{{bottomTips}}</span></li>-->
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
        cateType: 'Collection',
        list: [],
        textTips: '',
        loading: true,
        lastRefreshTime: '',//最后刷新时间
        //refresh: false,//是否显示刷新提示
        isNoData: false,
        pageNo: 1,
        refreshDataLength:'',
        totalNum:'',
        isAjax:true
      }
    },
    created: function () {
      this.collectionAndHistoryInit()
    },
    methods: {
      collectionAndHistoryInit:function () {
        this.cateType = this.$route.params.cate;
        if (this.cateType == 'Collection') {
          this.textTips = '取消收藏'
        } else if (this.cateType == 'history') {
          this.textTips = '删除记录'
        }
        this.getList();
      },
      goBack: function () {
        this.$router.go(-1)
      },
      getList: function () {
        if(!this.isAjax){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryCollectArtilcelList',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
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
              return
            }
            this.refreshDataLength = res.data.data.length;
            this.totalNum = res.data.total;
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.list = res.data.data;
            this.loading = false;
            this.isNoData = false
          } else {
            this.list = this.list.concat(res.data.data);
            if(this.list.length === this.totalNum){this.isAjax = false}
          }
        })
      },
      changeType: function (type) {
        this.list = [];
        this.refreshDataLength = -1;
        this.$refs.collectionWrapper.scrollTo(0,0,0);
        this.cateType = type;
        this.pageNo = 1;
        this.loading = true;
        this.isNoData = false;
        this.isAjax = true;
        //使左滑删除按钮隐藏
        this.$refs.leftDel.forEach((v,i)=>{
          v.init()
        });
        this.getList();
        if (this.cateType == 'Collection') {
          this.textTips = '取消收藏'
        } else if (this.cateType == 'history') {
          this.textTips = '删除记录'
        }
      },
      toNewsInfo: function (id, type) {
        if (type == 0 || type == 1 || type == 2) {
          this.$router.push({path: '/newsInfo/' + id})
        } else if (type == 3 || type == 4) {
          this.$router.push({path: '/pictures/' + id})
        } else if (type == 5) {
          this.$router.push({path: '/videoInfo/' + id})
        } else if(type == 10){
          this.$router.push({path: '/answerInfo/' + id})
        }
      },
      loadMore: function () {
        this.pageNo++;
        this.getList()
      },
      loadData: function () {
        this.pageNo = 1;
        this.isAjax = true;
        this.getList()
      },
      cancelCollection:function (index,articleId) {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/ArticleCollection',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "articleId":articleId
          })
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!=1){
            Toast(res.data.msg);
            return
          }
          if(res.data.data.isEnshrined==0){
            Toast('取消收藏成功');
            this.list.splice(index,1);
            if(this.list.length==0){
              this.isNoData = true
            }
          }
        })
      },
      delHistory:function (index,articleId) {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/delArticleHistory',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "articleId":articleId
          })
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          if(res.data.code!=1){
            Toast(res.data.msg);
            return
          }else if(res.data.code==1){
            Toast('删除记录成功');
            this.list.splice(index,1)
          }
        })
      },
      deleteItem:function (index,articleId) {
        if (this.cateType == 'Collection') {
          this.cancelCollection(index,articleId)
        } else if (this.cateType == 'history') {
          this.delHistory(index,articleId)
        }
      },
      },

    mounted: function () {
      this.$nextTick(function () {
        $('.collection-wrapper').height($(window).height() - $('.header').height() - $('.tabNav').height());
        $('.isNoData').height($(window).height() - $('.header').height() - $('.tabNav').height())
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
      position: absolute;
      width: 90/32rem;
      height: 90/32rem;
      text-align: center;
      font-size: 32/32rem;
      color: #787878;
    }
    h4 {
      text-align: center;
      font-size: 36/32rem;
      color: #333333;
    }
  }

  .tabNav {
    /*<!--margin-top: 90/32rem;-->*/
    width: 100%;
    height: 77/32rem;
    line-height: 77/32rem;
    text-align: center;
    border-bottom: 1/32rem solid #f2f2f2;
    background-color: #fff;
    position: absolute;
    top: 90/32rem;
    left: 0;
    z-index: 3;
    a {
      display: inline-block;
      height: 76/32rem;
      font-size: 32/32rem;
      color: #333333;
      margin: 0 38/32rem;
      &.active {
        border-bottom: 4/32rem solid #9172fa;
      }
    }
  }

  .listContent {
    width: 100%;
    background-color: #fff;
    /*<!--height: 1140/32rem;-->*/
    padding-top: 167/32rem;
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
                  span{
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
                    &:first-of-type{
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
