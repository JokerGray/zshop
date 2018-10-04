<template>
  <div style="background-color:#fff;">
    <div class="header">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <h4>作家二维码</h4>
    </div>
    <div class="authorMsg">
      <div class="authorImg" v-if="authorInfo.scSysUser">
        <!--http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/user/photos/0e7e8be7966d84e421e20b1a161d04fe.png-->
        <img :src="authorInfo.scSysUser.userpic" ref="usreImg">
        <div>
          <h4>{{authorInfo.scSysUser.username}}</h4>
          <p>粉丝{{authorInfo.enshrinedNum}}</p>
        </div>
      </div>
      <div class="authorCode">
        <!--<img src="../../../static/images/ercode.png" alt="">-->
        <vue-qr :size="size" :text="text" :logoSrc="logoSrc" :dotScale="dotScale"></vue-qr>
      </div>
      <p class="tips">扫一扫二维码，进入作家主页</p>
    </div>
    <div class="ewCodeLoading" v-if="loading"><loading></loading></div>
  </div>
</template>
<script>
  import VueQr from 'vue-qr'
  import qs from 'qs'
  import loading from '../common/loading'
  export default {
    components: {
      VueQr,
      loading
    },
    created:function () {
      this.userId = this.$route.params.userId;
      this.getAuthorHomePage();
      this.text = window.location.origin+'/24hours/share24/ewm.html?apptype=citynews&subtype=newsPersonHome&userId='+this.userId;
    },
    data:function () {
      return{
        text:'',
        logoSrc:'',
        size:260,
        dotScale:1,
        userId:0,
        authorInfo:{},
        loading:true
      }
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      getAuthorHomePage: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/querySubscriptionDetail',
          data: JSON.stringify({
            "userId": this.userId,//平台用户主键
            "byVisitUser": this.userId//个人频道主键
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          this.authorInfo = res.data.data;
          setTimeout(()=>{
            this.loading = false
          },400)

        })
      },
    },
    mounted:function () {
      this.$nextTick(function () {

      })
    }
  }
</script>


<style scoped lang="less" type="text/less">
  .header {
    width: 100%;
    height: 90/32rem;
    background-color: #fff;
    line-height: 90/32rem;
    position: relative;
    top: 0;
    left: 0;
    border-bottom: 1/32rem solid #e5e5e5;
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

  .authorMsg {
    width: 690/32rem;
    height: 900/32rem;
    margin-left: 30/32rem;
    margin-top: 100/32rem;
    box-shadow: 5/32rem 5/32rem 10/32rem #eaeaea,-5/32rem -5/32rem 10/32rem #eaeaea;
    background-color: #fff;
    .authorImg {
      overflow: hidden;
      padding: 30/32rem;
      img {
        width: 98/32rem;
        height: 98/32rem;
        border-radius: 50%;
        float: left;
      }
      > div {
        float: left;
        margin-left: 30/32rem;
        h4 {
          font-size: 30/32rem;
          color: #000000;
          margin-top: 15/32rem;
        }
        p {
          font-size: 24/32rem;
          color: #333333;
          margin-top: 13/32rem;
        }
      }
    }
    .authorCode {
      width: 100%;
      text-align: center;
      margin-top: 70/32rem;
      > img {
        width: 490/32rem;
      }
    }
    .tips {
      font-size: 28/32rem;
      text-align: center;
      color: #000000;
      margin-top: 40/32rem;
    }
  }
  .ewCodeLoading{
    position: absolute;
    width: 100%;
    height: 93%;
    bottom: 0;
    left: 0;
  }
</style>
