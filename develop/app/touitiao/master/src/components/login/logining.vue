<template>
  <div>
    <!--<div class="header"><h4>手机号登录</h4></div>-->
    <!--<goBack></goBack>-->
    <!--<loginHeader headerTitle="手机号登录"></loginHeader>-->
    <div class="logining_top">
      <a href="javascript:;" class="iconfont icon-fanhui goBack" @click="goBack"></a>
      <h4>手机号登录</h4>
    </div>
    <div class="loginForm">
      <form>
        <div class="tel iconfont icon-shouji"><input type="tel" placeholder="请输入手机号" v-model="telNum"><span class="iconfont icon-shanchu" v-show="deleteShow" @click="delNum"></span></div>
        <div class="psd iconfont icon-lock"><input type="password" placeholder="请输入密码" v-model="password" class="logining_password"><span class="iconfont icon-chakan1" @click="login_lookPsd" ref="lookPsdBtn"></span></div>
        <div class="psdStatus">
          <div>
            <span class="iconfont rememberPsd" @click="rememberPsd" :class="{'icon-xuanzhongyuandian':!isRememberPsd,'icon-xuanzhong':isRememberPsd}"></span>记住密码
          </div>
          <div @click="toResetPassword">忘记密码</div>
        </div>
        <a href="javascript:;" class="login" @click="login">登录</a>
        <!--<router-link to="/login/register/toRegister" class="register">注册</router-link>-->
        <a href="javascript:;" class="register" @click="showRegisterBox">注册</a>
      </form>
    </div>
    <div class="registerBox"><register ref="register"></register></div>
    <div class="resetPassword_step1"><resetPassword_step1 ref="resetPasswordStep1"></resetPassword_step1></div>
  </div>
</template>

<script>

  // import loginHeader from '../common/loginHeader'
  // import goBack from '../common/goBack'
  import $ from 'jquery'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import { Indicator } from 'mint-ui';
  import register from './register'
  import resetPassword_step1 from './resetPassword_step1'

  export default {
    components: {
      // loginHeader,
      // goBack,
      register,
      resetPassword_step1
    },
    created: function () {
     this.initForm()
    },
    data: function () {
      return {
        deleteShow: false,//电话号码输入框删除按钮是否显示
        telNum: '',//电话号码输入框中的值
        password: '',//记录输入的密码
        isRememberPsd: false,//是否记住密码
        //from: '',//记录从哪个页面进入登录页面的，方便判断当登录成功后回到来时的页面
      }
    },
    methods: {
      initForm:function () {
        if (localStorage.getItem('myLoginInfo')) {
          var obj = JSON.parse(localStorage.getItem('myLoginInfo'));
          this.telNum = obj.telNum;
          this.password = obj.passWord;
          this.isRememberPsd = true
        } else {
          this.telNum = '';
          this.password = '';
          this.isRememberPsd = false
        }
        // this.from = this.$route.params.to
      },
      delNum: function () {
        this.telNum = ''
      },
      login: function () {
        if (this.telNum === '' || this.password === '') {
          Toast('请输入正确的用户名和密码');
          return
        } else {
          if (this.isRememberPsd) {
            var obj = {"telNum": this.telNum, "passWord": this.password};
            localStorage.setItem('myLoginInfo', JSON.stringify(obj))
          }
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd: 'user/login',
            data: JSON.stringify({"usercode": this.telNum, "password": this.password}),
            version: 1
          };
          Indicator.open();
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            Indicator.close();
            if (res.data.code === 1) {
              // Toast('登录成功');
              sessionStorage.setItem('userId', res.data.data.scSysUser.id);
              sessionStorage.setItem('userName', res.data.data.scSysUser.username);
              sessionStorage.setItem('userPic', res.data.data.scSysUser.userpic);
              this.telNum = '';
              this.password = '';
              if (this.$route.path == '/mine') {
                // this.$router.push({path: '/mine'})
                this.$parent.$parent.closeLoginModule();
                this.$parent.closeLogining();
                this.$parent.$parent.loading = true;
                setTimeout(()=>{
                  this.$parent.$parent.loginModule = false;
                  this.$parent.$parent.getMyHomePage();
                },200);
              } else if (this.$route.path == '/care') {
                // this.$router.push({path: '/care'})
                this.$parent.$parent.closeLoginModule();
                this.$parent.closeLogining();
                this.$parent.$parent.loading = true;
                setTimeout(()=>{
                  this.$parent.$parent.loginModule = false;
                  this.getMyInfo();
                  this.$parent.$parent.getMyCareList();
                },200);
              }
            } else {
              Toast(res.data.msg)
            }
          })
        }
      },
      getMyInfo: function () {
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
          sessionStorage.setItem('subscriptionType',res.data.data.subscriptionType);
          sessionStorage.setItem('subscriptionId',res.data.data.subscriptionId);
        })
      },
      toResetPassword: function () {
        // this.$router.push({path: '/login/resetPassword/resetPassword_step1'})
        this.showReserPassword_stepBox()
      },
      rememberPsd: function () {
        if (!this.isRememberPsd) {
          this.isRememberPsd = true;
          if (this.telNum !== '' && this.password !== '') {
            var obj = {"telNum": this.telNum, "passWord": this.password};
            localStorage.setItem('myLoginInfo', JSON.stringify(obj))
          }
        } else {
          this.isRememberPsd = false;
          localStorage.setItem('myLoginInfo', '')
        }
      },
      login_lookPsd: function () {
        if ($('.logining_password').attr('type') === 'password') {
          $('.logining_password').attr('type', 'text');
          $(this.$refs.lookPsdBtn).removeClass("icon-chakan1").addClass("icon-shurukuangguanbichakanmima")
        } else {
          $('.logining_password').attr('type', 'password');
          $(this.$refs.lookPsdBtn).removeClass("icon-shurukuangguanbichakanmima").addClass("icon-chakan1")
        }
      },
      goBack:function () {
        this.$parent.closeLogining();
        if(!this.isRememberPsd){
          this.telNum = '';
          this.password = ''
        }
      },
      showRegisterBox:function () {
        $('.registerBox').show();
        setTimeout(function () {
          $('.registerBox').css('transform','translateX(0)')
        },0)
      },
      closeRegisterBox:function () {
        $('.registerBox').css('transform','translateX(100%)');
        setTimeout(function () {
          $('.registerBox').hide();
        },300)
      },
      showReserPassword_stepBox:function () {
        $('.resetPassword_step1').show();
        setTimeout(function () {
          $('.resetPassword_step1').css('transform','translateX(0)')
        },0)
      },
      closeReserPassword_stepBox:function () {
        $('.resetPassword_step1').css('transform','translateX(100%)');
        setTimeout(function () {
          $('.resetPassword_step1').hide();
        },300)
      }
    },
    watch: {
      telNum: function (newValue, oldValue) {
        if(newValue && newValue !== '') {
          this.deleteShow = true
        } else {
          this.deleteShow = false
        }
      },
      $route:function (val, old) {
        if(val.path=='/care'||val.path=='/mine'){
          this.initForm()
        }
      }
    },
    updated: function () {
      this.$nextTick(function () {
        if (this.isRememberPsd) {
          $(".rememberPsd").removeClass('icon-xuanzhongyuandian').addClass('icon-xuanzhong')
        } else {
          $(".rememberPsd").removeClass('icon-xuanzhong').addClass('icon-xuanzhongyuandian')
        }
      })
    },
  }
</script>


<style scoped lang="less" type="text/less">
  .logining_top{
    width: 100%;
    height: 88/32rem;
    .goBack {
      position: absolute;
      width: 88/32rem;
      height: 88/32rem;
      line-height: 88/32rem;
      font-size: 40/32rem;
      color: #666;
      padding-left: 30/32rem;
    }
    h4{
      text-align: center;
      line-height: 88/32rem;
      color: #333333;
    }
  }

  .loginForm {
    border-top: 1/32rem solid #D9D9D9;
    box-shadow: 0 2/32rem 1/32rem 0 #D9D9D9 inset;
    padding-top: 200/32rem;
    form {
      padding: 0 44/32rem;
      div {
        position: relative;
        input {
          width: 100%;
          height: 80/32rem;
          margin-bottom: 40/32rem;
          outline: none;
          padding-left: 58/32rem;
          border: none;
          border-bottom: 1/32rem solid #D9D9D9;
          font-size: 32/32rem;
          &::-webkit-input-placeholder {
            color: #A9A9A9;
          }
        }
        &::before {
          position: absolute;
          top: 12/32rem;
          left: -10/32rem;
          font-size: 48/32rem;
          color: #A9A9A9;
        }
        .icon-shanchu {
          position: absolute;
          top: 20/32rem;
          right: 0;
          color: #A9A9A9;
          font-size: 36/32rem;
        }
      }
      .psd {
        span {
          font-size: 40/32rem;
          color: #A9A9A9;
          position: absolute;
          top: 15/32rem;
          right: 0;
        }
      }
      .psdStatus {
        width: 100%;
        height: 40/32rem;
        line-height: 40/32rem;
        font-size: 24/32rem;
        color: #131313;
        div:first-child {
          float: left;
          .rememberPsd {
            width: 40/32rem;
            height: 40/32rem;
            line-height: 40/32rem;
            text-align: center;
            display: inline-block;
            color: #F95745;
          }
        }
        div:last-child {
          text-align: right;
          float: right;
        }
      }
      a {
        display: block;
        width: 100%;
        height: 90/32rem;
        line-height: 90/32rem;
        text-align: center;
        font-size: 32/32rem;
        color: #fff;
        border: 2/32rem solid #FA4E47;
        border-radius: 10/32rem;
      }
      .login {
        background: linear-gradient(to right, #FA963F 0%, #FA4E47 100%);
        border: none;
        margin-top: 40/32rem;
      }
      .register {
        color: #FA4E47;
        margin-top: 20/32rem;
      }
    }
  }

  .registerBox,.resetPassword_step1{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    -webkit-transform: translateX(100%);
    -moz-transform: translateX(100%);
    -ms-transform: translateX(100%);
    -o-transform: translateX(100%);
    transform: translateX(100%);
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    display: none;
  }
</style>
