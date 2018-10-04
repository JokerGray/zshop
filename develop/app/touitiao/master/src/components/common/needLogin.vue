<template>
  <div>
    <div class="top">
      <a href="javascript:;" class="iconfont icon-fanhui goBack" @click="close"></a>
      <h4>请登录</h4>
    </div>
    <div class="loginForm">
      <form>
        <div class="tel iconfont icon-shouji"><input type="tel" placeholder="请输入手机号" v-model="telNum"><span class="iconfont icon-shanchu" v-show="deleteShow" @click="delNum"></span></div>
        <div class="psd iconfont icon-lock"><input type="password" placeholder="请输入密码"  v-model="password" class="needLogin_password"><span class="iconfont icon-chakan1 lookPsd" @click="lookPsd"></span></div>
        <a href="javascript:;" class="login" @click="login">登录</a>
      </form>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import { Indicator } from 'mint-ui';
  // import loginHeader from '../common/loginHeader'
  export default {
    components:{
      // loginHeader,
    },
    created:function(){
      this.needLoginInit()
    },
    data:function(){
      return{
        deleteShow:false,//电话号码输入框删除按钮是否显示
        telNum:'',//电话号码输入框中的值
        password:'',//记录输入的密码
      }
    },
    methods:{
      needLoginInit:function () {
        if(localStorage.getItem('myLoginInfo')){
          var obj = JSON.parse(localStorage.getItem('myLoginInfo'));
          this.telNum = obj.telNum;
          this.password = obj.passWord;
          this.isRememberPsd = true
        }else{
          this.isRememberPsd = false
        }
      },
      delNum:function () {
        this.telNum = ''
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
          sessionStorage.setItem('subscriptionType',res.data.data.subscriptionType);
          sessionStorage.setItem('subscriptionId',res.data.data.subscriptionId);
        })
      },
      login:function(){
        if(this.telNum===''||this.password===''){
          Toast('请输入正确的用户名和密码');
          return
        }else{
          // if(this.isRememberPsd){
          //   var obj = {"telNum":this.telNum,"passWord":this.password};
          //   localStorage.setItem('myLoginInfo',JSON.stringify(obj))
          // }
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd: 'user/login',
            data: JSON.stringify({"usercode": this.telNum, "password": this.password}),
            version: 1
          };
          Indicator.open();
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            Indicator.close();
            if(res.data.code===1){
              Toast('登录成功');
              sessionStorage.setItem('userId',res.data.data.scSysUser.id);
              sessionStorage.setItem('userName',res.data.data.scSysUser.username);
              sessionStorage.setItem('userPic',res.data.data.scSysUser.userpic);
              this.getMyHomePage();
              setTimeout(()=>{
                this.$parent.closeLoginPage()
              },0)
            }else{
              Toast(res.data.msg)
            }
          })
        }
      },
      lookPsd:function () {
        if($('.needLogin_password').attr('type')==='password'){
          $('.needLogin_password').attr('type','text');
          $('.lookPsd').removeClass("icon-chakan1").addClass("icon-shurukuangguanbichakanmima")
        }else{
          $('.needLogin_password').attr('type','password');
          $('.lookPsd').removeClass("icon-shurukuangguanbichakanmima").addClass("icon-chakan1")
        }
      },
      close:function () {
        this.$parent.closeLoginPage();
        this.telNum = '';
        this.password = '';
      }
    },
    watch:{
      telNum:function(newValue,oldValue){
        if(newValue&&newValue!==''){
          this.deleteShow = true
        }else{
          this.deleteShow = false
        }
      }
    },
  }
</script>


<style scoped lang="less" type="text/less">
  .top{
    width: 100%;
    height: 88/32rem;
    text-align: center;
    line-height: 88/32rem;
    font-size: 36/32rem;
    color: #131313;
    position: relative;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    border-bottom: 1/32rem solid #e5e5e5;
    a{
      position: absolute;
      left: 0;
      top: 0;
      width: 88/32rem;
      height: 100%;
      font-size: 36/32rem;
    }
    h4{
      font-weight: 400;
    }
  }
  .loginForm{
    /*<!--border-top: 1/32rem solid #D9D9D9;-->*/
    /*<!--box-shadow: 0 2/32rem 1/32rem 0 #D9D9D9 inset;-->*/
    padding-top: 200/32rem;
    form{
      padding: 0 44/32rem;
      div{
        position: relative;
        input{
          width: 100%;
          height: 80/32rem;
          margin-bottom: 40/32rem;
          outline: none;
          padding-left: 58/32rem;
          border: none;
          border-bottom: 1/32rem solid #D9D9D9;
          font-size: 32/32rem;
          &::-webkit-input-placeholder{
            color:#A9A9A9;
          }
        }
        &::before{
          position: absolute;
          top: 12/32rem;
          left: -10/32rem;
          font-size: 48/32rem;
          color: #A9A9A9;
        }
        .icon-shanchu{
          position: absolute;
          top: 20/32rem;
          right: 0;
          color: #A9A9A9;
          font-size: 36/32rem;
        }
      }
      .psd{
        span{
          font-size: 40/32rem;
          color: #A9A9A9;
          position: absolute;
          top: 15/32rem;
          right: 0;
        }
      }
      .psdStatus{
        width: 100%;
        height: 40/32rem;
        line-height: 40/32rem;
        font-size: 24/32rem;
        color: #131313;
        div:first-child{
          float: left;
          #rememberPsd{
            width: 40/32rem;
            height: 40/32rem;
            line-height: 40/32rem;
            text-align: center;
            display: inline-block;
            color: #F95745;
          }
        }
        div:last-child{
          text-align: right;
          float: right;
        }
      }
      a{
        display: block;
        width: 100%;
        height: 90/32rem;
        line-height: 90/32rem;
        text-align: center;
        font-size: 32/32rem;
        color: #fff;
        border: 2/32rem solid #FA4E47;
        border-radius:10/32rem;
      }
      .login{
        background:linear-gradient(to right, #FA963F 0%, #FA4E47 100%);
        border: none;
        margin-top:40/32rem;
      }
      .register{
        color: #FA4E47;
        margin-top: 20/32rem;
      }
    }
  }
</style>
