<template>
    <div>
      <!--<goBack></goBack>-->
      <!--<loginHeader headerTitle="重置密码"></loginHeader>-->
      <div class="resetPsd_step2_top">
        <a href="javascript:;" class="iconfont icon-fanhui goBack" @click="goBack"></a>
        <h4>重置密码</h4>
      </div>
      <div class="resetForm">
        <form>
          <div class="psd iconfont icon-lock"><input type="password" placeholder="请输入密码(6-16位数)" class="password" v-model="NewPassword"><span class="iconfont icon-chakan1 lookPsd"></span></div>
          <a href="javascript:;" class="register">确定</a>
        </form>
      </div>
    </div>
</template>

<script>
  // import loginHeader from '../common/loginHeader'
  // import goBack from '../common/goBack'
    export default {
      components:{
        // loginHeader,
        // goBack
      },
      data:function(){
        return{
          NewPassword:'',
        }
      },
      methods:{
        goBack:function () {
          this.$parent.closeReserPassword_step_2Box();
          this.NewPassword = ''
        }
      },
      mounted:function(){
        $('.lookPsd').click(function(){
          if($('.password').attr('type')==='password'){
            $('.password').attr('type','text');
            $(this).removeClass("icon-chakan1").addClass("icon-shurukuangguanbichakanmima")
          }else{
            $('.password').attr('type','password');
            $(this).removeClass("icon-shurukuangguanbichakanmima").addClass("icon-chakan1")
          }
        })
      },
    }
</script>


<style scoped lang="less" type="text/less">
  .resetPsd_step2_top{
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
    }
  }
</style>
