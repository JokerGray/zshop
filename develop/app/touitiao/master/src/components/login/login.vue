<template>
    <div>
      <div class="goLogin">
        <img :src="require('../../../static/images/unlogin.png')">
        <!--<router-link v-bind="{to:'/login/logining/'+todo}">登录</router-link>-->
        <a href="javascript:;" @click="showLogining">登录</a>
      </div>
      <div class="loginingBox">
        <logining ref="loginIng"></logining>
      </div>
    </div>
</template>

<script>
  import logining from './logining'
  import $ from 'jquery'
    export default {
    components:{
      logining
    },
      data:function () {
        return{
          // todo:'',
        }
      },
      created:function () {
        // this.todo  = this.$route.query.to
      },
      methods:{
        showLogining:function () {
          $('.mint-tabbar').hide();
          $('.loginingBox').show();
          setTimeout(function () {
            $('.loginingBox').css('transform','translateY(-6.4%)');
          },0);
          setTimeout(()=>{
            $('.header').hide();
          },280)
        },
        closeLogining:function () {
          $('.header').show();
          $('.mint-tabbar').show();
          $('.loginingBox').css('transform','translateY(92%)');
          setTimeout(function () {
            $('.loginingBox').hide();
          },300)
        }
      },
      watch:{
        $route:function (val, old) {
          if(val.path==='/home'||val.path==='/video'||val.path==='/topicHome'||val.path==='/care'||val.path==='/mine'){
            //点击浏览器返回按钮后，初始化登录模块，关闭所有组件
            this.closeLogining();
            // this.$refs.loginIng.closeRegisterBox();
            this.$refs.loginIng.$refs.register.goBack();
            // this.$refs.loginIng.closeReserPassword_stepBox();
            this.$refs.loginIng.$refs.resetPasswordStep1.closeReserPassword_step_2Box();
            this.$refs.loginIng.$refs.resetPasswordStep1.goBack();
          }
          // this.todo  = val.query.to
        },
      }
    }
</script>


<style scoped lang="less" type="text/less">
  .goLogin{
  width: 100%;
  text-align: center;
  margin-top: 264/32rem;
  img{
    width: 90%;
    display: inline-block;
  }
  a{
    display: inline-block;
    width: 264/32rem;
    height: 70/32rem;
    text-align: center;
    line-height: 70/32rem;
    font-size: 32/32rem;
    font-weight: 700;
    color: #333333;
    border: 2/32rem solid #cccccc;
    border-radius:10/32rem;
    margin-top: 86/32rem;

  }
}

  .loginingBox{
    width: 100%;
    height: 102%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background-color: #fff;
    transform: translateY(92%);
    display: none;
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
  }
</style>
