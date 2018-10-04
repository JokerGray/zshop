<template>
  <div class="careApp">
    <div class="header" ref="header">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <form @submit="submit" action="javascript:;">
        <input type="search" placeholder="搜索你想要的" @click="toSearchAuthor" class="searchContent" v-model="keyWord" @input="input">
      </form>
      <span class="del iconfont icon-shanchu" @click="clearKeyWord"></span>
      <span class="iconfont icon-sousuo1"></span>
      <i class="cancel" @click="cancel">取消</i>
    </div>
    <div class="allCare" v-show="!authorSearchBoxShow">
      <scroll class="careCate"
              ref="careCate"
              :showTopTip="false"
              :showBottomTips="false">
        <ul>
          <!--<li class="active">推荐</li>-->
          <li v-for="(item,index) in cateList"
              :key="index"
              :class="{active:index==itemIndex}"
              ref="cateItem"
              @click="changeCateType(index,item.channelId)">
            {{item.channelName}}
          </li>
          <!--<li>国际</li>-->
        </ul>
        <div class="loading-wrapper"></div>
      </scroll>
      <scroll class="careList"
              :data="list"
              :pulldown="true"
              :pullup="true"
              :refreshDataLength="refreshDataLength"
              :lastRefreshTime="lastRefreshTime"
              :totalNum="addCareTotalNum"
              :rows="rows"
              @scrollToEnd="loadMore"
              @pulldown="loadData">
        <ul>
          <li v-for="(item,index) in list" :key="index">
            <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),
            loading:require('../../../static/images/zw166.png'),
            error:require('../../../static/images/mrtx.png')}"
            @click="toAuthorPage(item.userId)">
            <div  @click="toAuthorPage(item.userId)">
              <h4>{{item.scSysUser.username}}</h4>
              <p>{{item.enshrinedNum}}人关注</p>
            </div>
            <div>
              <a href="javascript:;"
                v-if="item.scSysUser.isSubscribe==0"
                @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)">
                <img src="../../../static/images/news_2_icon_guanzhu@2x.png">
              </a>
              <a href="javascript:;"
                v-if="item.scSysUser.isSubscribe==1"
                @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)">
                <img src="../../../static/images/news_2_icon_guanzhu_selected@2x.png">
              </a>
              <a href="javascript:;"
                v-if="item.scSysUser.hasConcern==0"
                @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)">
                <img src="../../../static/images/news_2_icon_zhucheng@2x.png">
              </a>
              <a href="javascript:;"
                 v-if="item.scSysUser.hasConcern==1"
                 @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)">
                <img src="../../../static/images/news_2_icon_zhucheng_selected@2x.png">
              </a>
            </div>
          </li>
          <!--<li>-->
          <!--<img src="../../../static/images/3.jpg" alt="">-->
          <!--<div>-->
          <!--<h4>烘焙教室</h4>-->
          <!--<p>3.6万人关注</p>-->
          <!--</div>-->
          <!--<div>-->
          <!--<a href="javascript:;"><img src="../../../static/images/news_2_icon_guanzhu@2x.png" alt=""></a>-->
          <!--<a href="javascript:;"><img src="../../../static/images/news_2_icon_zhucheng@2x.png" alt=""></a>-->
          <!--</div>-->
          <!--</li>-->
        </ul>
        <div class="loading-wrapper"></div>
      </scroll>
      <div class="loading" v-if="loading"><loading></loading></div>
      <div class="noDataZW" v-if="noDataZW"><noDateZW></noDateZW></div>
    </div>
    <div class="authorSearchBox" v-if="authorSearchBoxShow"><searchAuthor ref="authorSearchBox" :keyWord="keyWord"></searchAuthor></div>
  </div>
</template>

<script>
  import scroll from '../common/BScroll.vue'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import $ from 'jquery'
  import loading from '../common/loading'
  import noDateZW from '../common/noDataZW'
  import searchAuthor from './searchAuhtor'

  export default {
    components: {
      scroll,
      loading,
      noDateZW,
      searchAuthor
    },
    data: function () {
      return {
        cateList: [],
        itemIndex: 0,
        list: [],
        channelId: 1001,
        pageNo: 1,
        isAjax:true,//判断是否需要加载数据，避免页面无数据滑动页面时发送ajax请求
        lastRefreshTime: '',
        // isShowRefreshTips:false,//是否显示刷新时的提示信息
        refreshDataLength: '',
        addCareTotalNum:'',
        rows:15,
        loading:true,
        noDataZW:false,
        keyWord:'',
        authorSearchBoxShow:false
      }
    },
    created: function () {
      this.refreshDataLength = 0;
      this.getCateList();
      this.getList(this.channelId)
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      clearKeyWord:function () {
        this.keyWord = ''
      },
      changeCateType: function (index, channelId) {
        //避免重复点击，重复加载
        if(this.itemIndex === index){
          return
        }
        this.list = [];
        this.refreshDataLength = 0;
        this.itemIndex = index;
        this.channelId = channelId;
        this.pageNo = 1;
        this.noDataZW = false;
        this.loading = true;
        this.isAjax = true;
        this.getList(channelId);
        if(index<5){
          this.$refs.careCate.scrollTo(0,0,300)
        }else if(index>=this.$refs.cateItem.length-5){
          this.$refs.careCate.scrollTo(0,-this.$refs.cateItem.length*this.$refs.cateItem[0].offsetHeight+(document.documentElement.offsetHeight-this.$refs.header.offsetHeight)+6,300)
        }else{
          this.$refs.careCate.scrollTo(0,-(index-5)*this.$refs.cateItem[0].offsetHeight,300)
        }
      },
      getCateList: function () {
        var data = {
          cmd: 'cms_back/selectAllChannel',
          // data: JSON.stringify({"videoChannel": 1}),
          data: JSON.stringify({'videoChannel': 0}),
          version: 1,
        };
        this.$axios.post('/zxcity_restful/ws/rest', qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.cateList = res.data.data
          // this.recommendChannel = res.data.data.slice(10)
          //将获取的我的分类列表数据和推荐分类列表数据存到sessionStorage中，让子组件addCate可以获取到
          // sessionStorage.setItem('newsMyChannel',JSON.stringify(this.cateList))
          // sessionStorage.setItem('newsRecommendChannel',JSON.stringify(this.recommendChannel))
          // for (var i = 0; i < this.cateList.length; i++) {
          //   this.cateId.push(this.cateList[i].channelId)
          // }
          // this.getNewsList(this.cateId)
        })
      },
      getList: function (channelId) {
        if(!this.isAjax){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          // cmd: 'cms_new/querArticleDetails',
          cmd: 'cms_new/querySubscriptionListByType',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo,
              "rows": this.rows
            },
            "typeId": channelId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
          if (this.pageNo == 1) {
            if(res.data.data.length==0){
              this.loading = false;
              this.noDataZW = true
            }
            this.refreshDataLength = res.data.data.length;
            this.addCareTotalNum = res.data.total;
            this.list = res.data.data;
            this.loading = false
          } else {
            //this.loadMoreLength = res.data.data.length;
            this.list = this.list.concat(res.data.data);
            if(this.list.length === this.addCareTotalNum){this.isAjax = false}
          }
        })
      },
      getList_1: function (channelId) {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          // cmd: 'cms_new/querArticleDetails',
          cmd: 'cms_new/querySubscriptionListByType',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": 1,
              "rows": this.rows*this.pageNo
            },
            "typeId": channelId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          this.refreshDataLength = res.data.data.length;
          this.addCareTotalNum = res.data.total;
          this.list = res.data.data;
        })
      },
      AttentionAndCancel: function (id, isSubscribe) {
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
          this.getList_1(this.channelId);
          Toast(res.data.msg);
        })

      },
      createCityAndCancel: function (id, hasConcern) {
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
          this.getList_1(this.channelId);
          if (hasConcern == 0) {
            Toast(res.data.msg);
          } else if (hasConcern == 1) {
            Toast('取消筑城成功');
          }
        })
      },
      loadMore:function () {
        this.pageNo ++;
        this.getList(this.channelId)
      },
      loadData:function () {
        this.pageNo = 1;
        this.isAjax = true;
        this.getList(this.channelId)
      },
      toSearchAuthor:function () {
        this.authorSearchBoxShow = true;
        $('.searchContent').css('width','80%');
        $('.cancel').fadeIn(300);
        $('.del').fadeIn(300)
      },
      cancel:function () {
        this.authorSearchBoxShow = false;
        $('.del').hide();
        $('.cancel').fadeOut(200);
        $('.searchContent').css('width','88%');
        this.keyWord = ''
      },
      submit:function () {
        $('.searchContent').blur();
        this.$refs.authorSearchBox.submit(this.keyWord);
      },
      toAuthorPage:function (authorId) {
        this.$router.push({path:'/author/authorPage/homePage/'+authorId})
      },
      input:function () {
        if(this.keyWord===''){
          this.$refs.authorSearchBox.showAssociationSearch = false;
          this.$refs.authorSearchBox.$refs.associationSearch.resultList = [];
        }else{
          this.$refs.authorSearchBox.showAssociationSearch = true;
          this.$refs.authorSearchBox.$refs.associationSearch.init(this.keyWord)
        }
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.careList').height($(window).height()-$('.header').height());
        $('.careCate').height($(window).height()-$('.header').height());
      })
    },
  }
</script>

<style scoped lang="less" type="text/less">
  .careApp {
    width: 100%;
    height:100%;
    background-color: #fff;
  }

  .header {
    width: 100%;
    height: 86/32rem;
    border-bottom: 1/342rem solid #e5e5e5;
    position: relative;
    z-index: 1;
    background-color: #fff;
    a {
      display: inline-block;
      width: 75/32rem;
      height: 86/32rem;
      font-size: 36/32rem;
      text-align: center;
      line-height: 86/32rem;
      float: left;
    }
    input {
      width: 88%;
      height: 60/32rem;
      border: 1/32rem solid #e5e5e5;
      outline: none;
      -webkit-appearance:none;
      border-radius: 8/32rem;
      float: left;
      margin-top: 13/32rem;
      padding-left: 60/32rem;
      -webkit-transition: width .3s;
      -moz-transition: width .3s;
      -ms-transition: width .3s;
      -o-transition: width .3s;
      transition: width .3s;
      font-size: 24/32rem;
      &::-webkit-search-cancel-button {
        display: none;
      }
    }
    .icon-sousuo1 {
      position: absolute;
      font-size: 30/32rem;
      top: 28/32rem;
      left: 94/32rem;
      color: #999999;
    }
    .cancel{
      position: absolute;
      top: 0;
      right: 0;
      width: 80/32rem;
      height: 86/32rem;
      line-height: 86/32rem;
      font-style: normal;
      font-size: 28/32rem;
      text-align: center;
      display: none;
    }
    .del{
      position: absolute;
      top: 28/32rem;
      right: 90/32rem;
      font-size: 36/32rem;
      color: #bfbfbf;
      display: none;
    }
  }

  .allCare {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .careCate {
      width: 149/32rem;
      float: left;
      ul {
        width: 100%;
        li {
          width: 100%;
          height: 117/32rem;
          line-height: 117/32rem;
          text-align: center;
          font-size: 30/32rem;
          color: #333333;
          background-color: #f6f6f6;
          &.active {
            color: #ff8b6f;
            background-color: #fff;
          }
        }
      }
    }
    .careList {
      width: 100%;
      padding-left: 149/32rem;
      ul {
        padding: 0 22/32rem;
        li {
          width: 100%;
          height: 117/32rem;
          border-bottom: 1/32rem solid #e5e5e5;
          > img {
            width: 74/32rem;
            height: 74/32rem;
            margin-top: 22/32rem;
            float: left;
          }
          div:nth-of-type(1) {
            width: 220/32rem;
            height: 100%;
            float: left;
            margin-left: 20/32rem;
            h4 {
              width: 100%;
              font-size: 28/32rem;
              color: #333333;
              margin-top: 28/32rem;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            p {
              font-size: 24/32rem;
              color: #999999;
              margin-top: 10/32rem;
            }
          }
          div:nth-of-type(2) {
            float: right;
            height: 100%;
            width: 242/32rem;
            > a {
              float: left;
              width: 114/32rem;
              height: 47/32rem;
              margin-top: 36/32rem;
              &:nth-of-type(2) {
                margin-left: 10/32rem;
              }
              > img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
    .loading{
      width: 80%;
      height:93%;
      position: absolute;
      right: 0;
      bottom: 0;
    }
    .noDataZW{
      position: absolute;
      width: 80%;
      height: 93%;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }
  }

  .authorSearchBox{
    position: absolute;
    width: 100%;
    height:92%;
    bottom: 0;
    left: 0;
    background-color: #fff;
    //display: block;
  }
</style>
