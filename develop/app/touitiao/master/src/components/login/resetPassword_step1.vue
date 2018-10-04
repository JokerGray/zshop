<template>
    <div>
      <!--<goBack></goBack>-->
      <!--<loginHeader headerTitle="重置密码"></loginHeader>-->
      <div class="resetPsd_top">
        <a href="javascript:;" class="iconfont icon-fanhui goBack" @click="goBack"></a>
        <h4>忘记密码</h4>
      </div>
      <div class="resetForm">
        <form>
          <div class="tel iconfont icon-shouji"><input type="number" placeholder="请输入手机号" v-model="telNum"><span class="iconfont icon-shanchu" v-show="deleteShow" @click="delNum"></span></div>
          <div class="iconfont icon-yuechi">
            <input type="number" placeholder="请输入验证码" class="VerificationCode" v-model="verificationCode">
            <input type="button" class="getVerificationCode" value="获取验证码" @click="getCode">
          </div>
          <a href="javascript:;" class="register" @click="resetPassword">重置密码</a>
        </form>
      </div>
      <div class="resetPsd_step2Box"><resetPsd_step2></resetPsd_step2></div>
    </div>
</template>

<script>
  // import loginHeader from '../common/loginHeader'
  import {Toast} from 'mint-ui'
  import qs from 'qs'
  import $ from 'jquery'
  import resetPsd_step2 from './resetPassword_step2'
  import { Indicator } from 'mint-ui';
  // import goBack from '../common/goBack'
    export default {
      components:{
        // loginHeader,
        // goBack
        resetPsd_step2
      },
      data:function(){
        return{
          telNum:'',
          deleteShow:false,
          verificationCode:''
        }
      },
      methods:{
        delNum:function () {
          this.telNum = ''
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
            data: JSON.stringify({"usercode": this.telNum, "operaType": "userFindPwd"}),
            version: 1
          };
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            if(res.data.code!==1){
              // this.verificationCode = res.data.data.randomcode;
              Toast(res.data.msg);
              return
            }
            //点击获取验证码按钮后禁用此按钮
            var time = 5;
            $('.getVerificationCode').attr('disabled',true).val('('+time+'s)后重新发送').css('color','#fff');
            var clearTime = setInterval(function(){
              if(time===0){
                time = 0;
                clearInterval(clearTime);
                $('.getVerificationCode').attr('disabled',false).val('获取验证码').css('color','#FA4E47')
              }else{
                time--;
                $('.getVerificationCode').val('('+time+'s)后重新发送').css('color','#fff')
              }
            },1000);
          });
        },
        resetPassword:function(){
          if(this.telNum===''){
            Toast('请先输入手机号码');
            return
          }
          if(this.verificationCode===''){
            Toast('请输入验证码');
            return
          }
          var url = '/zxcity_restful/ws/rest';
          var data = {
            cmd:'user/checkCode',
            data:JSON.stringify({
              "usercode": this.telNum,
              "captcha": this.verificationCode
            })
          };
          Indicator.open();
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            Indicator.close();
            if(res.data.code==1){
              // this.$router.push({path:'/login/resetPassword/resetPassword_step1/resetPassword_step2'})
              this.showReserPassword_step_2Box();
              this.telNum = '';
              this.verificationCode = ''
            }else{
              Toast(res.data.msg)
            }
          })
        },
        goBack:function () {
          this.$parent.closeReserPassword_stepBox();
          this.telNum = '';
          this.verificationCode = ''
        },
        showReserPassword_step_2Box:function () {
          $('.resetPsd_step2Box').show();
          setTimeout(function () {
            $('.resetPsd_step2Box').css('transform','translateX(0)')
          },0)
        },
        closeReserPassword_step_2Box:function () {
          $('.resetPsd_step2Box').css('transform','translateX(100%)');
          setTimeout(function () {
            $('.resetPsd_step2Box').hide();
          },300)
        },
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
  .resetForm{
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
    }
  }
  .resetPsd_top{
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

  .resetPsd_step2Box{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
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
