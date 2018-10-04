<template>
  <div>
    <div class="header">
      <h4>我关注的</h4>
      <router-link class="iconfont icon-jia" to="/care/addCare" v-if="addBtnShow"></router-link>
    </div>
    <div class="friendUpdates" v-show="!loginModule">
      <router-link to="/care/friendUpdates">
        <img src="../../../static/images/news_2_icon_haoyoudt@2x.png">
        <p>好友动态</p>
      </router-link>
    </div>
    <div class="attentionContent">
      <scroll
        class="attentionScroll"
        :pulldown="true"
        :pullup="true"
        :refreshDataLength="refreshDataLength"
        :lastRefreshTime="lastRefreshTime"
        :totalNum="careTotalNum"
        :data="MyCareList"
        @scrollToEnd="loadMore"
        @pulldown="loadData">
        <ul>
          <!--<li class="pullUp" v-if="refresh"><span>正在刷新数据中...</span><p>最后更新:今天{{lastRefreshTime}}</p></li>-->
          <li v-for="(item,index) in MyCareList" :key="index" @click="goAuthorHomePage(item.id)">
            <div class="attentionImg">
              <img v-lazy="{src:item.userpic?item.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/mrtx.png')}">
            </div>
            <div class="attentionDsc">
              <h4>{{item.username}}</h4>
              <p>{{item.signature}}</p>
            </div>
          </li>
          <!--<li class="bottomLoading" v-show="!loading"><img :src="tipLoading">&nbsp;<span>{{bottomTips}}</span></li>-->
        </ul>
        <div class="loading-wrapper"></div>
      </scroll>
    </div>
    <div class="loading" v-if="loading"><loading></loading></div>
    <div class="loginModule" v-show="loginModule"><login></login></div>
    <div class="noDataZw" v-if="noDataZw"><noDataZw></noDataZw></div>
  </div>
</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import $ from 'jquery'
  import loading from '../common/loading'
  import login from '../login/login'
  import noDataZw from '../common/noDataZW'
  export default {
    components: {
      scroll,
      loading,
      login,
      noDataZw
    },

    created: function () {
      this.careInit();
    },
    data: function () {
      return {
        MyCareList: [],
        pageNo: 1,
        loading:true,
        //refresh: false,//是否显示刷新提示
        lastRefreshTime: '',//最后刷新时间
        refreshDataLength:'',
        careTotalNum:'',
        loginModule:false,
        addBtnShow:true,
        noDataZw:false,
        isAjax:true
      }
    },
    methods: {
      careInit:function () {
        if(!sessionStorage.getItem('userId')){
          this.loginModule = true;
          this.loading = false;
          this.addBtnShow = false;
          $('.loginModule').css('transform','translateY(0)');
          return
        }else{
          this.loginModule = false;
          this.addBtnShow = true;
          this.getMyCareList()
        }
      },
      getMyCareList: function () {
        if(!this.isAjax){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryAttentionList',
          data: JSON.stringify({
            "pagination": {//分页信息
              "page": this.pageNo,
              "rows": 10
            },
            "userId": sessionStorage.getItem('userId')//平台用户主键
          })
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.pageNo == 1) {
            // if(res.data.total<=10){
            //   //this.bottomTips = '已全部加载完毕！';
            //   //this.tipLoading = ''
            // }
            if(res.data.data.length==0){
              this.loading = false;
              this.noDataZw = true;
              return
            }
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.MyCareList = [];
            this.careTotalNum = res.data.total;
            this.refreshDataLength = res.data.data.length;
            this.MyCareList = res.data.data;
            //this.refresh = false;
            this.loading = false;
            this.noDataZw = false;
          } else {
            this.MyCareList = this.MyCareList.concat(res.data.data);
            if(this.MyCareList.length === this.careTotalNum){this.isAjax = false}
          }
        })
      },
      goAuthorHomePage: function (id) {
        this.$router.push({path:'/author/authorPage/homePage/'+id})
      },
      loadMore: function () {
        this.pageNo++;
        this.getMyCareList()
      },
      loadData: function () {
        //this.refresh = true;
        this.isAjax = true;
        this.pageNo = 1;
        this.getMyCareList()
      },
      closeLoginModule:function () {
        $('.loginModule').css('transform','translateY(100%)');
        this.addBtnShow = true;
        setTimeout(function () {
          $('.loginModule').hide();
        },300)
      }
    },
    updated: function () {
      this.$nextTick(function () {
        $('.attentionScroll').height($(window).height() - $('.header').height() - $('.friendUpdates').height() - $('.mint-tabbar').height());
        // $('.attentionContent').height($(window).height()-$('.header').height()-$('.friendUpdates').height()-$('.mint-tabbar').height())
      })
    },
    watch:{
      $route:function (val, old) {
        if(val.path=='/care'){
          this.careInit();
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .header {
    width: 100%;
    height: 100/32rem;
    line-height: 100/32rem;
    text-align: center;
    position: relative;
    border-bottom: 1/32rem solid #e5e5e5;
    background-color: #fff;
    top: 0;
    left: 0;
    z-index: 1;
    h4 {
      font-size: 34/32rem;
      color: #424656;
    }
    a {
      position: absolute;
      width: 100/32rem;
      height: 100/32rem;
      top: 0;
      right: 0;
      font-size: 36/32rem;
      color: #787878;

    }
  }
  .friendUpdates {
    width: 100%;
    height: 151/32rem;
    border-bottom: 1/32rem solid #e5e5e5;
    background-color: #fff;
    padding-left: 24/32rem;
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    a {
      display: block;
      width: 100%;
      height: 100%;
      img {
        width: 98/32rem;
        height: 98/32rem;
        float: left;
        margin-top: 26/32rem;
      }
      p {
        float: left;
        font-size: 30/32rem;
        color: #333333;
        margin-top: 60/32rem;
        margin-left: 30/32rem;
      }
    }
  }
  .attentionContent {
    position: relative;
    ul {
      /*<!--padding-top: 20/32rem;-->*/
      li {
        overflow: hidden;
        padding-left: 30/32rem;
        padding-bottom: 20/32rem;
        margin-top: 10/32rem;
        .attentionImg {
          float: left;
          img {
            width: 98/32rem;
            height: 98/32rem;
            display: block;
          }
        }
        .attentionDsc {
          position: absolute;
          padding-left: 122/32rem;
          h4 {
            margin-top: 10/32rem;
            font-size: 30/32rem;
            color: #333333;
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
            line-height: 32/32rem;

          }
        }
      }
    }
  }
  .loading{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 1;
  }
  .loginModule{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 92%;
    background-color: #fff;
    z-index: 0;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
  .noDataZw{
    position: absolute;
    width: 100%;
    height: 90%;
    bottom: 0;
    left: 0;
  }
</style>
