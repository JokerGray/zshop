<template>
  <div>
    <slide @sentPageNo="getPage" :navPage="active" ref="authorAttention">
      <div>
        <scroll class="attention-wrapper"
                :pulldown="pulldown"
                :pullup="pull"
                :data="MyAttentionList"
                :refreshDataLength="refreshDataLength"
                :lastRefreshTime="lastRefreshTime"
                :totalNum="attentionTotalNum"
                @scrollToEnd="loadMore"
                @pulldown="loadData">
          <div class="attentionContent">
            <ul>
              <li v-for="(item,index) in MyAttentionList" :key="index">
                <div class="attentionImg" @click="toAuthorPage(item.id)">
                  <img v-bind="{src:item.userpic||require('../../../static/images/mrtx.png')}">
                </div>
                <div class="attentionDsc" @click="toAuthorPage(item.id)">
                  <h4>{{item.username}}</h4>
                  <p>{{item.attentionNum}}人关注</p>
                </div>
                <div class="fansOperating">
                  <a href="javascript:;"
                     v-if="item.isSubscribe==0"
                     @click="AttentionAndCancel(item.id,item.isSubscribe,index)">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
                  </a>
                  <a href="javascript:;"
                     v-if="item.isSubscribe==1"
                     @click="AttentionAndCancel(item.id,item.isSubscribe,index)">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
                  </a>
                  <span v-if="item.hasConcern==0"
                        @click="createCityAndCancel(item.id,item.hasConcern,index)">
                      <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
                    </span>
                  <span v-if="item.hasConcern==1"
                        @click="createCityAndCancel(item.id,item.hasConcern,index)">
                      <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
                    </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="loading-wrapper"></div>
        </scroll>
        <div class="noDataZW" v-if="attentionNoDataZW"><noDataZW></noDataZW></div>
        <!--<div class="loading" v-if="attentionLoading"><loading></loading></div>-->
      </div>
      <div>
        <scroll class="fans-wrapper"
                :pulldown="pulldown"
                :pullup="pull"
                :data="myFansList"
                :refreshDataLength="refreshDataLength_1"
                :lastRefreshTime="lastRefreshTime_1"
                :totalNum="fansTotalNum"
                @scrollToEnd="loadMore"
                @pulldown="loadData">
          <div class="fansContent">
            <ul>
              <li v-for="(item,index) in myFansList" :key="index">
                <div class="fansImg" @click="toAuthorPage(item.id)">
                  <img v-bind="{src:item.userpic||require('../../../static/images/mrtx.png')}">
                </div>
                <div class="fansDsc" @click="toAuthorPage(item.id)">
                  <h4>{{item.username}}</h4>
                  <p>{{item.attentionNum}}人关注</p>
                </div>
                <div class="fansOperating">
                  <a href="javascript:;"
                     v-if="item.isSubscribe==0"
                     @click="AttentionAndCancel(item.id,item.isSubscribe,index)">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
                  </a>
                  <a href="javascript:;"
                     v-if="item.isSubscribe==1"
                     @click="AttentionAndCancel(item.id,item.isSubscribe,index)">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
                  </a>
                  <span v-if="item.hasConcern==0"
                        @click="createCityAndCancel(item.id,item.hasConcern,index)">
                      <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
                    </span>
                  <span v-if="item.hasConcern==1"
                        @click="createCityAndCancel(item.id,item.hasConcern,index)">
                      <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
                    </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="loading-wrapper"></div>
        </scroll>
        <div class="noDataZW_1" v-if="fansNoDataZW"><noDataZW></noDataZW></div>
        <!--<div class="loading_1" v-if="fansLoading"><loading></loading></div>-->
      </div>
      <div>
        <scroll class="visitors-wrapper"
                :pulldown="pulldown"
                :pullup="pull"
                :data="myVisitorsList"
                :refreshDataLength="refreshDataLength_2"
                :lastRefreshTime="lastRefreshTime_2"
                :totalNum="visitorsTotalNum"
                @scrollToEnd="loadMore"
                @pulldown="loadData">
          <div class="fansContent">
            <ul>
              <li v-for="(item,index) in myVisitorsList" :key="index">
                <div class="fansImg" @click="toAuthorPage(item.userId)">
                  <img v-bind="{src:item.userImg||require('../../../static/images/mrtx.png')}">
                </div>
                <div class="fansDsc" @click="toAuthorPage(item.userId)">
                  <h4>{{item.userName}}</h4>
                  <p>{{item.viewTime}}</p>
                </div>
                <div class="fansOperating">
                  <a href="javascript:;"
                     v-if="item.isSubscribe==0"
                     @click="AttentionAndCancel(item.userId,item.isSubscribe,index)">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
                  </a>
                  <a href="javascript:;"
                     v-if="item.isSubscribe==1"
                     @click="AttentionAndCancel(item.userId,item.isSubscribe,index)">
                    <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
                  </a>
                  <span v-if="item.hasConcern==0"
                        @click="createCityAndCancel(item.userId,item.hasConcern,index)">
                      <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
                    </span>
                  <span v-if="item.hasConcern==1"
                        @click="createCityAndCancel(item.userId,item.hasConcern,index)">
                      <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
                    </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="loading-wrapper"></div>
          <i v-show="noVisitorsTips" class="noVisitorsTips"><span>TA还没有访客哦~~</span></i>
        </scroll>
        <div class="noDataZW_2" v-if="visitorsNoDataZW"><noDataZW></noDataZW></div>
        <!--<div class="loading_2" v-if="visitorsLoading"><loading></loading></div>-->
      </div>
    </slide>
    <div class="loginBox" v-if="this.$route.params.authorId">
      <needLogin></needLogin>
    </div>
  </div>
</template>

<script>
  import scroll from './BScroll'
  import noDataZW from  './noDataZW'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import { Indicator } from 'mint-ui'
  import slide from '../common/slider'
  import $ from 'jquery'
  import needLogin from '../common/needLogin'
  export default {
    props:['active_temp'],
    components: {
      scroll,
      noDataZW,
      slide,
      needLogin
    },
    created: function () {
      this.initIndex();
    },
    data: function () {
      return {
        // defaultSlide: 0,
        // index: 0,
        active: 0,
        MyAttentionList: [],
        myFansList: [],
        myVisitorsList: [],
        pulldown: true,
        pull: true,
        attentionPageNo: 1,
        fansPageNo:1,
        visitorsPageNo:1,
        refreshDataLength: '',
        lastRefreshTime:'',
        refreshDataLength_1: '',
        lastRefreshTime_1:'',
        refreshDataLength_2: '',
        lastRefreshTime_2:'',
        attentionTotalNum:'',
        fansTotalNum:'',
        visitorsTotalNum:'',
        attentionNoDataZW:false,
        attentionLoading:false,
        fansNoDataZW:false,
        fansLoading:false,
        visitorsNoDataZW:false,
        visitorsLoading:false,
        noVisitorsTips:false,
        isAjax:true
      }
    },
    methods:{
      initIndex: function () {
        Indicator.open('加载中...');
        if (this.$route.params.cate == 'attention') {
          this.active = 0;
          this.attentionLoading = true;
          // this.cmd = 'cms_new/queryAttentionList'
          this.getMyAttentionList();
        } else if (this.$route.params.cate == 'fans') {
          this.active = 1;
          this.fansLoading = true;
          // this.cmd = 'cms_new/queryFansList'
          // this.getMyFansList()
        }else if(this.$route.params.cate == 'visitors'){
          this.active = 2;
          this.visitorsLoading = true;
          // this.cmd = 'cms_new/visitorList'
        }
      },
      // changePage: function (index) {
      //   this.active = index;
      //   // $('.wc-default-swiper-box').css({'transform': 'translateX(' + (-(index + 1) * 414) + 'px)', 'transition-duration': '0.2s'})
      // },
      getPage:function (val) {
        this.active = val
      },
      getMyAttentionList: function () {
        if(!this.isAjax){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryAttentionList',
          data: JSON.stringify({
            "pagination": {//分页信息
              "page": this.attentionPageNo,
              "rows": 10
            },
            "userId": this.$route.params.authorId||sessionStorage.getItem('userId'),//平台用户主键
            "currentUserId":sessionStorage.getItem('userId')
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.attentionPageNo == 1) {
            if(res.data.data.length==0){
              this.attentionNoDataZW = true;
              this.attentionLoading = false;
              return
            }
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.MyAttentionList = [];
            this.refreshDataLength = res.data.data.length;
            this.attentionTotalNum = res.data.total;
            this.MyAttentionList = res.data.data;
            this.attentionLoading = false
          } else {
            this.MyAttentionList = this.MyAttentionList.concat(res.data.data);
            if(this.MyAttentionList.length === this.attentionTotalNum){this.isAjax = false}
          }
        })
      },
      getMyFansList: function () {
        if(!this.isAjax){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryFansList',
          data: JSON.stringify({
            "pagination": {//分页信息
              "page": this.fansPageNo,
              "rows": 10
            },
            "userId": this.$route.params.authorId||sessionStorage.getItem('userId'),//平台用户主键
            "currentUserId":sessionStorage.getItem('userId')
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if(this.fansPageNo ==1){
            if(res.data.data.length==0){
              this.fansNoDataZW = true;
              this.fansLoading = false;
              return
            }
            this.lastRefreshTime_1 = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.myFansList = [];
            this.refreshDataLength_1 = res.data.data.length;
            this.fansTotalNum = res.data.total;
            this.myFansList = res.data.data;
            this.fansLoading = false;
          } else {
            this.myFansList = this.myFansList.concat(res.data.data);
            if(this.myFansList.length === this.fansTotalNum){this.isAjax = false}
          }
        })
      },
      getMyVisitorsList: function () {
        if(!this.isAjax){return}
        if(!sessionStorage.getItem('userId')){
          this.noVisitorsTips = true;
          setTimeout(()=>{
            Indicator.close();
          },0)
        }else{
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd: 'cms_new/visitorList',
            data: JSON.stringify({
              "pagination": {//分页信息
                "page": this.visitorsPageNo,
                "rows": 10
              },
              "userId": this.$route.params.authorId||sessionStorage.getItem('userId'),//平台用户主键
              "currentUserId":sessionStorage.getItem('userId')
            })
          };
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            Indicator.close();
            if (res.data.code !== 1) {
              Toast(res.data.msg);
              return
            }
            if(this.visitorsPageNo ==1){
              if(res.data.data.length==0){
                this.visitorsNoDataZW = true;
                this.visitorsLoading = false;
                return
              }
              this.lastRefreshTime_2 = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
              this.myVisitorsList = [];
              this.refreshDataLength_2 = res.data.data.length;
              this.visitorsTotalNum = res.data.total;
              this.myVisitorsList = res.data.data;
              this.visitorsLoading = false;
            } else {
              this.myVisitorsList = this.myVisitorsList.concat(res.data.data);
              if(this.myVisitorsList.length === this.visitorsTotalNum){this.isAjax = false}
            }
          })
        }
      },
      getMyAttentionList_1: function () {
        // Indicator.open('加载中...');
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryAttentionList',
          data: JSON.stringify({
            "pagination": {//分页信息
              "page": 1,
              "rows": this.attentionPageNo*10
            },
            "userId": this.$route.params.authorId||sessionStorage.getItem('userId'),//平台用户主键
            "currentUserId":sessionStorage.getItem('userId')
          })
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          // Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
          this.MyAttentionList = [];
          this.refreshDataLength = res.data.data.length;
          this.attentionTotalNum = res.data.total;
          this.MyAttentionList = res.data.data;
          // this.attentionLoading = false
        })
      },
      getMyFansList_1: function () {
        // Indicator.open('加载中...');
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryFansList',
          data: JSON.stringify({
            "pagination": {//分页信息
              "page": 1,
              "rows": this.fansPageNo*10
            },
            "userId": this.$route.params.authorId||sessionStorage.getItem('userId'),//平台用户主键
            "currentUserId":sessionStorage.getItem('userId')
          })
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          // Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          this.lastRefreshTime_1 = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
          this.myFansList = [];
          this.refreshDataLength_1 = res.data.data.length;
          this.fansTotalNum = res.data.total;
          this.myFansList = res.data.data;
          // this.fansLoading = false;
        })
      },
      getMyVisitorsList_1: function () {
        // Indicator.open('加载中...');
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/visitorList',
          data: JSON.stringify({
            "pagination": {//分页信息
              "page": 1,
              "rows": this.visitorsPageNo*10
            },
            "userId": this.$route.params.authorId||sessionStorage.getItem('userId'),//平台用户主键
            "currentUserId":sessionStorage.getItem('userId')
          })
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          // Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          this.lastRefreshTime_2 = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
          this.myVisitorsList = [];
          this.refreshDataLength_2 = res.data.data.length;
          this.VisitorsTotalNum = res.data.total;
          this.myVisitorsList = res.data.data;
          // this.fansLoading = false;
        })
      },
      AttentionAndCancel: function (id, isSubscribe,index) {
        if(!sessionStorage.getItem('userId')){
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
        if(isSubscribe==0){
          data.cmd = 'cms_new/addUserAttention'
        }else if(isSubscribe==1){
          data.cmd = 'cms_new/cancelAttention'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if(this.active == 0){
            this.getMyAttentionList_1()
          }else if(this.active == 1){
            this.getMyFansList_1()
          }else if(this.active == 2){
            this.getMyVisitorsList_1()
          }
          Toast(res.data.msg);
        });
      },
      createCityAndCancel: function (id, hasConcern,index) {
        if(!sessionStorage.getItem('userId')){
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
        if(hasConcern==0){
          data.cmd = 'cms_new/buildUser'
        }else if(hasConcern==1){
          data.cmd = 'cms_new/delBuildUser'
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if(this.active == 0){
            this.getMyAttentionList_1();
            if(hasConcern==0){
              Toast(res.data.msg)
            }else if(hasConcern==1){
              Toast('取消筑城成功')
            }
          }else if(this.active == 1){
            this.getMyFansList_1();
            if(hasConcern==0){
              Toast(res.data.msg)
            }else if(hasConcern==1){
              Toast('取消筑城成功')
            }
          }else if(this.active == 2){
            this.getMyVisitorsList_1();
            if(hasConcern==0){
              Toast(res.data.msg)
            }else if(hasConcern==1){
              Toast('取消筑城成功')
            }
          }
        })
      },
      loadMore: function () {
        if (this.active == 0) {
          this.attentionPageNo++;
          this.getMyAttentionList();
        }else if(this.active == 1){
          this.fansPageNo++;
          this.getMyFansList()
        }else if(this.active == 2){
          this.visitorsPageNo++;
          this.getMyVisitorsList()
        }
      },
      loadData: function () {
        this.isAjax = true;
        if (this.active == 0) {
          this.attentionPageNo = 1;
          this.getMyAttentionList();
          this.list = this.MyAttentionList
        }else if(this.active == 1){
          this.fansPageNo = 1;
          this.getMyFansList();
          this.list = this.myFansList
        }else if(this.active == 2){
          this.visitorsPageNo = 1;
          this.getMyVisitorsList();
          this.list = this.myVisitorsList
        }
      },
      toAuthorPage:function (authorId) {
        this.$router.push({path:'/author/authorPage/homePage/'+authorId})
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
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.attention-wrapper').height($(window).height() - $('.header').height());
        $('.fans-wrapper').height($(window).height() - $('.header').height());
        $('.noVisitorsTips').height($('.fans-wrapper').height())
        $('.visitors-wrapper').height($(window).height() - $('.header').height());
        $('.noDataZW').width($(window).width());
        $('.noDataZW_1').width($(window).width());
        $('.noDataZW_2').width($(window).width());
        $('.loading').width($(window).width());
        $('.loading_1').width($(window).width());
        $('.loading_2').width($(window).width());

        setTimeout(()=>{
          this.$refs.authorAttention.slide.goToPage(this.active,0,0);
        },500);
      })
    },
    updated:function () {
      this.$nextTick(function () {
        // $($('.fansOperating a img')).attr('src',require('../../../static/images/news_2_icon_guanzhu_selected@2x.png'));
        $('.noDataZW').width($(window).width());
        $('.noDataZW_1').width($(window).width());
        $('.noDataZW_2').width($(window).width());
        $('.loading').width($(window).width());
        $('.loading_1').width($(window).width());
        $('.loading_2').width($(window).width())
      })
    },
    watch:{
      active:function (val, old) {
        this.$emit('changeActive',val)
        this.isAjax = true;
        Indicator.open('加载中...');
        if(val == 0){
          // this.MyAttentionList = [];
          this.refreshDataLength = 0;
          this.attentionPageNo = 1;
          // this.fansLoading = false;
          // this.attentionLoading = true;
          this.getMyAttentionList();
        }else if(val == 1){
          // this.myFansList = [];
          this.refreshDataLength_1 = 0;
          this.fansPageNo = 1;
          // this.attentionLoading = false;
          // this.fansLoading = true;
          this.getMyFansList();
        }else if(val == 2){
          this.refreshDataLength_2 = 0;
          this.visitorsPageNo = 1;
          this.getMyVisitorsList();
        }
      },
      active_temp:function (val) {
        this.active = val
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">

  .content {
    .attentionContent {
      ul {
        background-color: #f5f5f5;
        li {
          overflow: hidden;
          padding: 20/32rem 30/32rem;
          margin-top: 10/32rem;
          background-color: #fff;
          .attentionImg {
            float: left;
            img {
              width: 98/32rem;
              height: 98/32rem;
              display: block;
            }
          }
          .attentionDsc {
            width: 100%;
            position: absolute;
            padding-left: 122/32rem;
            h4 {
              width: 320/32rem;
              margin-top: 10/32rem;
              font-size: 30/32rem;
              color: #333333;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              line-height: 40/32rem;
            }
            p {
              font-size: 24/32rem;
              color: #999999;
              margin-top: 20/32rem;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
            }

          }
          .fansOperating {
            margin-top: 20/32rem;
            float: right;
            position: relative;
            z-index: 1;
            a,span{
              display: inline-block;
              width: 114/32rem;
              height: 47/32rem;
              float: left;
              img {
                display: block;
                width: 100%;
              }
            }
            span{
              margin-left: 14/32rem;
            }
          }
          &:first-of-type{
            margin-top: 0;
            border-top: 7/32rem solid #f5f5f5;
          }
          &:last-of-type{
            border-bottom: 10/32rem solid #f5f5f5;
          }
        }
      }
    }
    .fansContent {
      ul {
        //margin-top: 30/32rem;
        background-color: #f5f5f5;
        li {
          overflow: hidden;
          padding: 20/32rem 30/32rem;
          //padding: 0 30/32rem 10/32rem 30/32rem;
          margin-top: 10/32rem;
          background-color: #fff;
          .fansImg {
            float: left;
            img {
              display: block;
              width: 98/32rem;
              height: 98/32rem;
            }
          }
          .fansDsc {
            float: left;
            margin-left: 30/32rem;
            width: 320/32rem;
            h4 {
              width: 320/32rem;
              margin-top: 10/32rem;
              font-size: 30/32rem;
              color: #333333;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              line-height: 40/32rem;
            }
            p {
              font-size: 24/32rem;
              color: #999999;
              margin-top: 20/32rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

            }
          }
          .fansOperating {
            margin-top: 20/32rem;
            float: left;
            a,span {
              display: inline-block;
              width: 114/32rem;
              height: 47/32rem;
              float: left;
              img {
                display: block;
                width: 100%;
              }
            }
            span{
              margin-left: 14/32rem;
            }
          }
          &:first-of-type{
            margin-top: 0;
            border-top: 7/32rem solid #f5f5f5;
          }
          &:last-of-type{
            border-bottom: 10/32rem solid #f5f5f5;
          }
        }
      }
    }
  }

  .noDataZW,.loading,.noDataZW_1,.loading_1,.noDataZW_2,.loading_2{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }

  .noDataZW_1,.loading_1,.noDataZW_2,.loading_2{
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .loginBox {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 6;
    transform: translateY(1320/32rem);
    display: none;
    transition: all .3s;
  }

  .noVisitorsTips{
    font-style: normal;
    position: absolute;
    background-color:#f5f5f5;
    width: 100%;
    font-size: 26/32rem;
    color: #333333;
    left: 0;
    top: 0;
    span{
      position: absolute;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50% ,-50%);
      -ms-transform: translate(-50% ,-50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50% ,-50%);
    }
  }
</style>
