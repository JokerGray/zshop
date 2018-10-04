<template>
  <div style="overflow:hidden;">
    <div class="tabBar">
      <a href="javascript:;" :class="{'active':1001==typeCode}" @click="changeType(1001)">综合</a>
      <a href="javascript:;" :class="{'active':1003==typeCode}" @click="changeType(1003)">视频</a>
      <a href="javascript:;" :class="{'active':1002==typeCode}" @click="changeType(1002)">图集</a>
      <a href="javascript:;" :class="{'active':1000==typeCode}" @click="changeType(1000)">用户</a>
    </div>
    <!--<searchSynthesis :typeCode="typeCode" :keyWord="keyWord"></searchSynthesis>-->
    <scroll
      class="wrapper"
      ref="searchResultWrapper"
      :data="article_List"
      :pulldown="true"
      :pullup="true"
      :refreshDataLength="refreshDataLength"
      :lastRefreshTime="lastRefreshTime"
      :totalNum="searchTotalNum"
      @scrollToEnd="loadMore"
      @pulldown="loadData">
      <div class="searchResultTemp">
        <div class="canAttention" v-if="author">
          <div class="attentionContent">
            <ul>
              <li v-for="(item,index) in author" :key="index" v-if="item.scSysUser">
                <div class="fansImg" @click="toAuthorPage(item.userId)">
                  <img
                    v-lazy="{src:item.scSysUser&&item.scSysUser.userpic!==null?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
                </div>
                <div class="fansDsc" @click="toAuthorPage(item.userId)">
                  <h4 v-html="item.subscriptionName?item.subscriptionName:item.scSysUser.username"></h4>
                  <p>{{item.enshrinedNum}}人关注</p>
                </div>
                <div class="fansOperating">
                  <a href="javascript:;" @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)" v-if="item.scSysUser.isSubscribe==0">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
                  </a>
                  <a href="javascript:;" @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)" v-if="item.scSysUser.isSubscribe==1">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
                  </a>
                  <a href="javascript:;" v-if="item.scSysUser.hasConcern==0" @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)">
                    <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
                  </a>
                  <a href="javascript:;" v-if="item.scSysUser.hasConcern==1" @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)">
                    <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="resultList" v-show="article_List.length">
          <ul>
            <li v-for="(item,index) in article_List" :key="index">
              <div class="template">
                <span @click="toNewsInfo(item.articleId,item.previewImgType)">
                  <div class="newsLeft">
                    <h4 v-html="item.articleTitle"></h4>
                    <div class="newsBottom">
                      <div class="left">
                        <span :style="{color:item.scSysUser.username===keyWord?'#9172fa':''}">{{item.scSysUser?item.scSysUser.username:'智享城市'}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.visitorNum?item.visitorNum:0}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="newsRight">
                    <!--<img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:'/src/assets/images/zw166.png'}"/>-->
                    <img
                      v-lazy="{src:item.scCmsResourcesList.length!==0?item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png')}"
                      alt="">
                    <span class="videoTime" v-if="5==item.previewImgType">{{item.scCmsResourcesList[0].videoPlayTime}}</span>
                    <span class="imgsNum" v-if="3==item.previewImgType||4==item.previewImgType"><i></i>{{item.scCmsResourcesList.length-1}}图</span>
                  </div>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--<div class="loaded" v-show="loaded">-->
      <!--<loading v-if="loaded"></loading>-->
      <!--</div>-->
      <!--<div v-show="isNoData" class="isNoData">-->
      <!--<noDataZW></noDataZW>-->
      <!--</div>-->
      <div class="loading-wrapper"></div>
    </scroll>
    <div v-show="loaded" class="loaded">
      <loading v-if="loaded"></loading>
    </div>
    <div v-show="isNoData" class="isNoData">
      <noDataZW></noDataZW>
    </div>
    <div class="loginBox">
      <needLogin></needLogin>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import loading from '../common/loading'
  import noDataZW from '../common/noDataZW'
  import scroll from '../../components/common/BScroll.vue'
  import $ from 'jquery'
  import needLogin from '../common/needLogin'

  export default {
    props: ['keyWord'],
    created: function () {
      this.getSearchResult()
    },
    components: {
      loading,
      noDataZW,
      scroll,
      needLogin
    },
    data: function () {
      return {
        typeCode: '1001',
        pageNo: 1,
        author: [],//作家搜索结果
        article_List: [],//文章搜索结果
        loaded: true,//加载数据时显示loading
        isNoData: true,//无数据时显示站位图
        //isAjax:true,//判断是否需要加载数据，避免页面无数据滑动页面时发送ajax请求
        lastRefreshTime: '',
        // isShowRefreshTips:false,//是否显示刷新时的提示信息
        refreshDataLength: '',
        searchTotalNum: '',
        isCare: -1,
        itemIndex: -1,
        isAjax: true
      }
    },
    methods: {
      getSearchResult: function () {
        if (!this.isAjax) {
          return
        }
        var data = {
          cmd: 'cms_new/querySearchArticleOrUser',
          data: JSON.stringify({
            "keyword": this.keyWord,
            "userId": sessionStorage.getItem('userId') || '',
            "releaseCity": sessionStorage.getItem('cityCode'),
            "typeCode": this.typeCode,//1003视频 1001综合 1002图集 1000用户
            "pagination": {
              "page": this.pageNo,
              "rows": 10,
            }
          }),
          version: 1
        };
        this.$axios.post('zxcity_restful/ws/rest', qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (res.data.data.subscription) {
            res.data.data.subscription.forEach((v, i) => {
              v.subscriptionName = v.subscriptionName.replace(this.keyWord, '<b style="color: #9172fa;">' + this.keyWord + '</b>')
            })
          }
          if (res.data.data.articleList) {
            res.data.data.articleList.forEach((v, i) => {
              v.articleTitle = v.articleTitle.replace(this.keyWord, '<span style="color: #9172fa;">' + this.keyWord + '</span>')
            })
          }
          if (this.pageNo == 1) {
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.refreshDataLength = res.data.data.articleList.length;
            this.searchTotalNum = res.data.total;
            if ((this.typeCode == '1001' && res.data.data.subscription !== null) || (this.typeCode == '1001' && res.data.data.articleList.length !== 0)) {
              this.author = [];
              this.article_List = [];
              this.author = res.data.data.subscription;
              this.article_List = res.data.data.articleList;
              setTimeout(() => {
                this.loaded = false;
                this.isNoData = false
              }, 0);
              // this.isShowRefreshTips = false
            } else if (this.typeCode == '1002' && res.data.data.articleList.length !== 0) {
              this.author = null;
              this.article_List = [];
              this.article_List = res.data.data.articleList;
              this.loaded = false;
              this.isNoData = false
              // this.isShowRefreshTips = false
            } else if (this.typeCode == '1003' && res.data.data.articleList.length !== 0) {
              this.author = null;
              this.article_List = [];
              this.article_List = res.data.data.articleList;
              setTimeout(() => {
                this.loaded = false;
                this.isNoData = false
              }, 0);
              // this.isShowRefreshTips = false
            } else if (this.typeCode == '1000' && res.data.data.subscription !== null) {
              this.author = [];
              this.article_List = [];
              this.author = res.data.data.subscription;
              setTimeout(() => {
                this.loaded = false;
                this.isNoData = false
              }, 0);
              // this.isShowRefreshTips = false
            } else {
              this.loaded = false;
              this.isNoData = true;
              // this.isAjax = false
              return
            }
          } else {
            this.article_List = this.article_List.concat(res.data.data.articleList);
            if (this.article_List.length === this.searchTotalNum) {
              this.isAjax = false
            }
          }
        })
      },
      changeType: function (typeCode) {
        if (this.keyWord == '') {
          Toast('搜索内容不能为空');
          return
        }
        this.isAjax = true;
        this.author = [];
        // this.article_List = [];
        this.loaded = true;
        this.typeCode = typeCode;
        this.pageNo = 1;
        // this.loaded = true
        // this.isAjax = true
        this.$refs.searchResultWrapper.scrollTo(0, 0, 0);
        this.getSearchResult();
        this.refreshDataLength = this.article_List.length
      },
      toNewsInfo: function (id, type) {
        if (type == 0 || type == 1 || type == 2) {
          this.$router.push({'path': '/newsInfo/' + id})
        } else if (type == 5) {
          this.$router.push({'path': '/videoInfo/' + id})
        } else if (type == 3 || type == 4) {
          this.$router.push({'path': '/pictures/' + id})
        }
      },
      AttentionAndCancel: function (id, isSubscribe) {
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
          this.getSearchResult();
          Toast(res.data.msg);
        })

      },
      createCityAndCancel: function (id, hasConcern) {
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
          this.getSearchResult();
          if (hasConcern == 0) {
            Toast(res.data.msg);
          } else if (hasConcern == 1) {
            Toast('取消筑城成功');
          }
        })
      },
      loadMore: function () {
        this.pageNo++;
        this.getSearchResult()
      },
      loadData: function () {
        this.pageNo = 1;
        this.isAjax = true;
        this.getSearchResult()
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
      toAuthorPage: function (authorId) {
        this.$router.push({path: '/author/authorPage/homePage/' + authorId})
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        var height = $(window).height() - $('.header').height() - $('.tabBar').height();
        $('.wrapper').height(height);
        $('.loaded').height(height);
        $('.isNoData').height(height);
      })
    },
  }
</script>

<style scoped type="text/less" lang="less">
  .tabBar {
    width: 100%;
    height: 81/32rem;
    border-bottom: 1/32rem solid #e5e5e5;
    line-height: 81/32rem;
    padding-left: 30/32rem;
    background-color: #fff;
    position: fixed;
    top: 88/32rem;
    left: 0;
    z-index: 1;
    a {
      float: left;
      width: 94/32rem;
      height: 46/32rem;
      line-height: 46/32rem;
      text-align: center;
      border-radius: 6/32rem;
      font-size: 28/32rem;
      color: #53537d;
      margin-right: 94/32rem;
      margin-top: 17/32rem;
      &:last-of-type {
        margin-right: 0;
      }
      &.active {
        background-color: #9172fa;
        color: #fff;
      }
    }
  }

  .wrapper {
    height: 1060/32rem;
  }

  .searchResultTemp {
    /*<!--margin-top: 169/32rem;-->*/
    /*<!--margin-bottom: 90/32rem;-->*/
    background-color: #fff;
    .attentionContent {
      border-top: 20/32rem solid #f7f7f7;
      ul {
        margin-top: 30/32rem;
        li {
          overflow: hidden;
          padding: 0 30/32rem 20/32rem 30/32rem;
          margin-top: 20/32rem;
          border-bottom: 1/32rem solid #e5e5e5;
          .fansImg {
            float: left;
            img {
              display: block;
              width: 74/32rem;
              height: 74/32rem;
            }
          }
          .fansDsc {
            float: left;
            margin-left: 30/32rem;
            width: 320/32rem;
            h4 {

              font-size: 28/32rem;
              color: #333333;
            }
            p {
              font-size: 24/32rem;
              color: #999999;
              margin-top: 15/32rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

            }
          }
          .fansOperating {
            margin-top: 10/32rem;
            float: left;
            a {
              display: inline-block;
              width: 114/32rem;
              height: 47/32rem;
              float: left;
              img {
                display: block;
                width: 100%;
              }
              &:nth-of-type(2) {
                margin-left: 14/32rem;
              }
            }
          }
        }
      }
    }

    .resultList {
      border-top: 20/32rem solid #f7f7f7;
      ul {
        padding: 0 24/32rem;
        li {
          margin-top: 30/32rem;
          .template {
            > span {
              display: block;
              border-bottom: 1/32rem solid #EDEDED;
              padding-bottom: 30/32rem;
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
                position: relative;
                img {
                  width: 166/32rem;
                  height: 166/32rem;
                  display: inline-block;
                  border-radius: 6/32rem;
                }
                .videoTime, .imgsNum {
                  position: absolute;
                  width: 120/32rem;
                  height: 46/32rem;
                  line-height: 46/32rem;
                  font-size: 26/32rem;
                  text-align: left;
                  color: #fff;
                  background-color: #9189f2;
                  border-radius: 8/32rem;
                  bottom: 15/32rem;
                  right: 15/32rem;
                  i {
                    float: left;
                    width: 24/32rem;
                    height: 24/32rem;
                    background: url("../../../static/images/news_2_icon_grop@2x.png") no-repeat center;
                    -webkit-background-size: 24/32rem 24/32rem;
                    background-size: 24/32rem 24/32rem;
                    margin-left: 20/32rem;
                    margin-right: 10/32rem;
                    margin-top: 12/32rem;
                  }
                }
                .videoTime {
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }

  .loaded, .isNoData {
    width: 100%;
    position: absolute;
    top: 169/32rem;
    left: 0;
    overflow: hidden;
    z-index: 1;
  }

  .isNoData {
    z-index: 0;
  }

  .loginBox {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    transform: translateY(1320/32rem);
    display: none;
    transition: all .3s;
  }
</style>
