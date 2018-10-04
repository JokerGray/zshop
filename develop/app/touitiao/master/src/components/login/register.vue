<template>
    <div>
      <!--<goBack></goBack>-->
      <!--<loginHeader headerTitle="注册"></loginHeader>-->
      <div class="register_top">
        <a href="javascript:;" class="iconfont icon-fanhui goBack" @click="goBack"></a>
        <h4>注册</h4>
      </div>
      <div class="registerForm">
        <form>
          <div class="tel iconfont icon-shouji"><input type="number" placeholder="请输入手机号" v-model="telNum"><span class="iconfont icon-shanchu" v-show="deleteShow" @click="delNum"></span></div>
          <div class="psd iconfont icon-lock"><input type="password" placeholder="请输入密码(6-16位数)" class="register_password" v-model="password"><span class="iconfont icon-chakan1 register_lookPsd" @click="register_lookPsd"></span></div>
          <div class="iconfont icon-yuechi"><input type="number" placeholder="请输入验证码" class="verificationCode" ref="verificationCode"><input type="button" class="getVerificationCode" value="获取验证码" @click="getCode"></div>
          <a href="javascript:;" class="register" @click="register">注册</a>
          <div class="protocol"><span class="iconfont icon-xuanzhongyuandian agreeProtocol" @click="agreeProtocol">同意遵守 智享城市APP用户协议</span></div>
        </form>
      </div>
    </div>
</template>

<script>
  // import loginHeader from '../common/loginHeader'
  import qs from 'qs'
  import $ from 'jquery'
  import {Toast} from 'mint-ui'
  import { Indicator } from 'mint-ui';
  // import goBack from '../common/goBack'
    export default {
      components:{
        // loginHeader,
        // goBack,
      },
      data:function(){
        return{
          deleteShow:false,//电话号码输入框删除按钮是否显示
          telNum:'',//电话号码输入框中的值
          isAgree:false,//记录是否勾选同意协议
          verificationCode:0,//记录返回来的验证码
          password:'',//记录输入的密码
        }
      },
      created:function () {

      },
      methods:{
        delNum:function () {
          this.telNum = ''
        },
        agreeProtocol:function(){
          if(!this.isAgree){
            $('.agreeProtocol').removeClass('icon-xuanzhongyuandian').addClass('icon-xuanzhong');
            this.isAgree = true;
          }else{
            $('.agreeProtocol').removeClass('icon-xuanzhong').addClass('icon-xuanzhongyuandian');
            this.isAgree = false;
          }
        },
        getCode:function(){
          var reg = /^1[0-9]{10}$/;
          if(!reg.test(this.telNum)){
            Toast('请输入正确手机号');
            this.telNum = '';
            return
          }
          //获取验证码
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd: 'user/reqValidatCode',
            data: JSON.stringify({"usercode": this.telNum,"operaType" : "userReg"}),
            version: 1
          };
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            if(res.data.code==1){
              this.verificationCode = res.data.data.randomcode;
            }else{
              Toast(res.data.msg)
            }
          });
          //点击获取验证码按钮后禁用此按钮
          var time = 5;
          $(this).val('('+time+'s)后重新发送').css('color','#fff');
          var clearTime = setInterval(function(){
            if(time===0){
              time = 0;
              clearInterval(clearTime);
              $('.getVerificationCode').val('获取验证码').css('color','#FA4E47').removeAttr('disabled')
            }else{
              time--;
              $('.getVerificationCode').val('('+time+'s)后重新发送').css('color','#fff').attr('disabled','disabled')
            }
          },1000);
        },
        register:function(){

          if(this.password===''){
            Toast('请输入6-16位密码');
            return
          }
          if(!this.isAgree){
            Toast('请同意协议');
            return
          }
          if(this.password.length>16||this.password.length<6){
            Toast('密码必须在6-16位之间');
            return
          }
          if($(this.$refs.verificationCode).val()!=this.verificationCode){
            Toast('请输入正确验证码');
            return
          }
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd:'user/reg',
            data:JSON.stringify({
              "usersex": "男",
              "usercode": this.telNum,
              "captcha": this.verificationCode,
              "password": this.password
            })
          };
          Indicator.open();
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            Indicator.close();
            if(res.data.code===1){
              Toast(res.data.msg);
              // this.$router.push({path:'/login/logining'})
              this.$parent.closeRegisterBox();
              this.telNum = '';
              this.password = '';
              $(this.$refs.verificationCode).val('')
            }else {
              Toast(res.data.msg);
            }
          })
        },
        register_lookPsd:function () {
          if($('.register_password').attr('type')==='password'){
            $('.register_password').attr('type','text');
            $('.register_lookPsd').removeClass("icon-chakan1").addClass("icon-shurukuangguanbichakanmima")
          }else{
            $('.register_password').attr('type','password');
            $('.register_lookPsd').removeClass("icon-shurukuangguanbichakanmima").addClass("icon-chakan1")
          }
        },
        goBack:function () {
          this.$parent.closeRegisterBox();
          this.telNum = '';
          this.password = '';
          $(this.$refs.verificationCode).val('')
        },
      },

      watch:{
        telNum:function(newValue,oldValue){
          if(newValue&&newValue!==''){
            this.deleteShow = true
          }else{
            this.deleteShow = false
          }
        },
      },
      mounted:function(){
        this.$nextTick(function () {
          if(this.isAgree){
            $('.agreeProtocol').removeClass('icon-xuanzhongyuandian').addClass('icon-xuanzhong')
          }else{
            $('.agreeProtocol').removeClass('icon-xuanzhong').addClass('icon-xuanzhongyuandian')
          }
        })
      },
    }
</script>

<style scoped lang="less" type="text/less">
  .register_top{
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
  .registerForm{
    border-top: 1/32rem solid #D9D9D9;
    box-shadow: 0 2/32rem 1/32rem 0 #D9D9D9 inset;
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
        .getVerificationCode{
          -webkit-appearance: none;
          position: absolute;
          top: 10/32rem;
          right: 0;
          width: 200/32rem;
          height: 70/32rem;
          background-color: #D9D9D9;
          font-size: 24/32rem;
          padding: 0;
          color: #FA4E47;
          border-radius: 10/32rem;
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
      .register{
        display: block;
        width: 100%;
        height: 90/32rem;
        line-height: 90/32rem;
        text-align: center;
        font-size: 32/32rem;
        background:linear-gradient(to right,#FA973F 0%,#FA4D47 100%);
        border-radius:10/32rem;
        color: #fff;
        margin-top: 68/32rem;
      }
      .protocol{
        text-align: center;
        margin-top: 25/32rem;
        span{
          font-size: 24/32rem;
          color: #131313;
          position: relative;
          padding-left: 60/32rem;
          &::before{
            font-size: 40/32rem;
            color: #FA4D47;
            position: absolute;
            top: -10/32rem;
            left: 0/32rem;
          }
        }
      }
    }
  }
</style>
