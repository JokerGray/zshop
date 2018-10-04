<template>
  <div>
    <div class="min_top" v-if="!loginModule"><a href="javascript:;" @click="dropOut"><span class="iconfont icon-tuichu"></span><p>退出登录</p></a></div>
    <div class="user" v-if="!loginModule&&!loading">
      <img :src="myPageData.scSysUser.userpic">
      <div class="mine_mask"></div>
      <div class="userPhoto">
        <img :src="myPageData.scSysUser.userpic">
        <h4>{{myPageData.scSysUser.username}}</h4>
        <p>{{myPageData.scSysUser.signature}}</p>
      </div>
    </div>
    <div class="userStatus" v-if="!loginModule&&!loading">
      <ul>
        <li>
          <router-link to="/mine/mine-active">
            <p>{{myPageData.dynamicCount}}</p>
            <p>动态</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mine/mine-attentionAndFans/attention">
            <p>{{myPageData.followNum}}</p>
            <p>关注</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mine/mine-attentionAndFans/fans">
            <p>{{myPageData.enshrinedNum}}</p>
            <p>粉丝</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mine/mine-attentionAndFans/visitors">
            <p>{{myPageData.visitoredNum}}</p>
            <p>访客</p>
          </router-link>
        </li>
        <li>
          <router-link v-bind="{to:'/mine/min-ewCode/'+myPageData.userId}">
            <p><span class="iconfont icon-erweima"></span></p>
            <p>二维码</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mine/mine-CollectionAndHistory/Collection">
            <p><span class="iconfont icon-icon-copy"></span></p>
            <p>收藏</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mine/mine-CollectionAndHistory/history">
            <p><span class="iconfont icon-naozhong"></span></p>
            <p>历史</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mine/mineArticleManage">
            <p><span class="iconfont icon-wenzhangguanli02"></span></p>
            <p>文章管理</p>
          </router-link>
        </li>
        <li>
          <router-link to="/mine/mineQuestionManage">
            <p><span class="iconfont icon-boshimao1"></span></p>
            <p>问答管理</p>
          </router-link>
        </li>
      </ul>
    </div>
    <loading v-if="loading"></loading>
    <div class="loginModule" v-show="loginModule"><login></login></div>
  </div>
</template>
<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import loading from '../common/loading'
  import login from '../login/login'

  export default {
    components:{
      loading,
      login
    },
    created: function () {
      this.init();
    },
    data: function () {
      return {
        myPageData: [],
        loading:true,
        loginModule:false
      }
    },
    methods: {
      init:function () {
        if(!sessionStorage.getItem('userId')){
          this.loginModule = true;
          this.loading = false;
          $('.loginModule').css('transform','translateY(0)');
          return
        }else{
          this.loginModule = false;
          this.getMyHomePage()
        }
      },
      getMyHomePage: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/querySubscriptionDetail',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),//平台用户主键
            "byVisitUser": sessionStorage.getItem('userId')//个人频道主键
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          this.myPageData = res.data.data;
          this.loading = false;
          sessionStorage.setItem('subscriptionType',res.data.data.subscriptionType);
          sessionStorage.setItem('subscriptionId',res.data.data.subscriptionId);
        })
      },
      dropOut:function () {
        // sessionStorage.setItem('userId','');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userPic');
        sessionStorage.removeItem('subscriptionId');
        sessionStorage.removeItem('subscriptionType');
        this.$router.push({path:'/'});
        // setTimeout(()=>{
        //   this.$router.go(0)
        // },0)

      },
      closeLoginModule:function () {
        $('.loginModule').css('transform','translateY(100%)');
        setTimeout(function () {
          $('.loginModule').hide();
        },300)
      }
    },
    watch:{
      $route:function (val, old) {
        if(val.path=='/mine'){
          this.init()
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .min_top{
    width: 120/32rem;
    height: 90/32rem;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    a{
      float: right;
      width: 100/32rem;
      height: 100%;
      text-align: center;
      color: #333;
      margin-right: 20/32rem;
      margin-top: 20/32rem;
      span{
        font-size: 42/32rem;
      }
      p{
        font-size: 22/32rem;
      }
    }
  }
  .user {
    width: 100%;
    height: 710/32rem;
    position: relative;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 999;
    > img {
      width: 100%;
    }
    .mine_mask {
      width: 100%;
      height: 710/32rem;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 1) 100%);
      position: absolute;
      top: 0;
      left: 0;
    }
    .userPhoto {
      position: absolute;
      top: 105/32rem;
      left: 60/32rem;
      img {
        width: 140/32rem;
        height: 140/32rem;
        border-radius: 50%;
      }
      h4 {
        font-size: 44/32rem;
        color: #333333;
        font-weight: 400;
        margin-top: 25/32rem;
      }
      p {
        font-size: 28/32rem;
        color: #999999;
        margin-top: 20/32rem;
      }
    }
  }
  .userStatus {
    width: 100%;
    z-index: 2000;
    position: absolute;
    top: 450/32rem;
    left: 0;
    ul {
      li {
        width: 25%;
        float: left;
        margin-bottom: 88/32rem;
        a {
          display: block;
          text-align: center;
          p:first-child {
            font-size: 40/32rem;
            color: #333333;
            font-weight: 700;
            span {
              font-size: 90/32rem;
              color: #666666;
              font-weight: 400;
            }
          }
          p:last-child {
            font-size: 24/32rem;
            color: #999999;
            font-weight: 700;
            margin-top: 20/32rem;
          }
        }
      }
    }
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
</style>
