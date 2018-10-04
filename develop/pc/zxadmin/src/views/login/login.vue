<template>
    <div class="body-bg">
        <div id='bg' class='bg1'></div>
        <div class='bg2'></div>
        <div id='earth'>
          <div class="layer mars"></div>
          <div class="layer virus"></div>
          <div class="layer earth"></div>
        </div>
        <div id='light' ref='light'></div>
    <!-- <div class="logo-img"></div> -->
      <transition name="fade">
        <div class='content' ref='content' v-if="showContent">
            <form id="myform" method="post">
              <div class="form-box">
                  <div class="login-title">
                  </div>
                  <div class="form-group">
                  <div class="input-box">
                      <input class="login-input w-250" v-model='acount' ref='acount' type="" name="" placeholder="请输入账号">
                  </div>
                  <div class="input-box password-box">
                      <input class="login-input w-250" v-model='password' ref='password' type="" name="" placeholder="请输入密码">
                  </div>
                  <div class="input-box">
                      <a href="/index.html">
                          <button type="submit" class="btn btn-login" @click.prevent='login'>GO</button>
                      </a>
                  </div>
                </div>
                <div class="form-group forget-box">
                  <input class="login-input-checkbox" type="checkbox" name="remember" ><span class=" remember-me">记住账号和密码</span>
                  <a href="javascript:;" class="forgot">忘记密码？</a>
                </div>
              </div>
            </form>
        </div>
      </transition>
      <div class="zhixiang-slogon"></div>
    </div>
</template>

<script>
import api from '../../api'
export default {
  mounted() {
    document.getElementsByTagName('body')[0].className = 'body-bg'; // body背景色变黑
    setTimeout(this.change, 2000) // 两秒后球开始晃动
  },
  data() {
    return {
      showContent: false,
      acount: '',
      password: ''
    };
  },
  methods: {
    submitForm(formName) {
      let that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.$router.replace('/backend/home')
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    change() {
      this.showContent = true
      // 地球晃动
      var items = document.getElementsByClassName('layer');
      document.addEventListener('mousemove', function (evt) {
        var x = evt.clientX;
        var y = evt.clientY;
        // console.log(x);
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        var halfWidth = winWidth / 2;
        var halfHeight = winHeight / 2;
        var rx = x - halfWidth;
        var ry = halfHeight - y;
        var length = items.length;
        var max = 10;

        for (let i = 0; i < length; i++) {
          var dx = (items[i].getBoundingClientRect().width / max) * ((rx / -halfWidth) * (i + 1));
          var dy = (items[i].getBoundingClientRect().height / max) * ((ry / halfHeight) * (i + 1));
          if (i % 2 !== 0) {
            dx = 0 - dx;
            dy = 0 - dy;
          }
          items[i].style['transform'] = items[i].style['-webkit-transform'] = 'translate(' + dx + 'px,' + dy + 'px)';
        }
      }, false);
    },
    login() {
      // 测试登陆
      let that = this
      api.testAxios(this.acount, this.password).then(function(res) {
        that.$message({
          showClose: true,
          message: res.data.msg,
          type: 'success'
        });
      });
    }
  }
};
</script>

<style scoped>
  .body-bg{
    background-color: #000;
    overflow: hidden;
    height: 100%;
  }
  .bg1{
    animation: circle 60s linear infinite ;
    width:1475px;
    height:1475px;
    margin-left: 50%;
    position: absolute;
    top: -380px;
    left: -737.5px;
    background: url('./img/11.png') no-repeat;
  }
  .bg2{
    width:1920px;
    height:1080px;
    margin-left: 50%;
    left: -960px;
    background: url('./img/1.png') no-repeat;
    position: absolute;
    z-index: -20;
    display: none;
  }
  #earth{
    position: absolute;
    width: 1152px;
    height: 648px;
    margin-left: 50%;
    left: -576px;
    top: 200px;
    z-index: 0;
    opacity: 1;
  }
  .earth-move{
    animation: big 2.5s linear ;
    transform: translateZ(1000px);
    /*display: none;*/
  }
  #light{
    width: 576px;
    height: 401px;
    background: url('./img/light_4.png') no-repeat;
    position: absolute;
    z-index: 10;
    display: none;
  }
  .star{
    animation: star 1s linear ;
  }
  /* 定义动画，动画名：animat_rotate，可以取任意名字 */
  /* 使用方式：animation: run 6s linear; */
  @keyframes rotate{
      0%{
          /*动画开始角度*/
          transform: rotate(0deg);
          width:1920px;
      height:1080px;
      }
      60%{
        transform: rotate(50deg) ;
        opacity: 1
      }
      to {
          /*动画结束时角度*/
          transform: rotate(150deg) scale(2);
          opacity: 0
      }
  }
  @keyframes circle{
      from{
          /*动画开始角度*/
          transform: rotate(0deg);
      }
      to {
          /*动画结束时角度*/
          transform: rotate(360deg);
      }
  }

  @keyframes big {
      from{
          transform: scale(0.1);
      }
      to{
          transform: scale(1);
      }
  }
  @keyframes star {
      from{
          top: 300px;
          left: 0;
          opacity: 1;
      }
      90%{
        top: -300px;
        left: 400px;
        opacity: 0.99;
      }
      to{
        top: -300px;
        left: 400px;
        opacity: 0;
      }
  }
  @keyframes myFadeIn {
      from{
          opacity: 0;
      }
      to{
          opacity: 1;
      }
  }
  .virus{
    width: 200px;
    height: 200px;
    background: url('./img/virus_big.png') no-repeat;
    position: relative;
      left: 900px;
      top: -110px;
      /*display: none;*/
  }
  .mars{
    width: 80px;
    height: 80px;
    background: url('./img/mars_big.png') no-repeat;
    position: relative;
      left: -30px;
      top: -50px;
      /*display: none;*/
  }
  .earth{
    width: 500px;
    height: 500px;
    background: url('./img/earth_big.png') no-repeat;
    position: relative;
      left: 1100px;
      top: 200px;
      /*display: none;*/
  }
  .logo-img{
    position: absolute;
    top: 100px;
    left:100px;
    width: 84px;
    height: 84px;
    background: url('./img/logo.png') no-repeat;
  }
  .zhixiang-slogon{
    color: #fff;
    font-size: 40px;
    position: absolute;
    bottom: 80px;
    width: 430px;
    height: 90px;
    letter-spacing: 5px;
    margin-left: 50%;
    left: -215px;
    background: url('./img/slogon_word.png') no-repeat;
  }
  .zhixiang-jia{
    font-size: 60px;
      position: relative;
    top: 7px;
  }
  .zhixiang-phone{
    color: #fff;
    position: absolute;
    bottom: 50px;
    width: 800px;
    letter-spacing: 5px;
    margin-left: 50%;
    left: -400px;
  }
  .content{
    width: 1000px;
    height: 1200px;
    position: absolute;
    margin-left: 50%;
    left: -500px;
    // display: none;
    /*animation: myFadeIn 5s linear;*/
  }
  .content-fadeIn{
    animation: myFadeIn 4s linear;
  }
  .form-box{
    width: 600px;
    height: 200px;
    margin: auto;
    /*padding: 30px;*/
    position: relative;
    top: 300px;
    /*background: rgba(255, 255, 255, 0.3);*/
    border-radius: 5px;
    /*border: 1px #fff solid;*/
  }
  .login-title{
    /*color: #fff;
    font-size: 30px;
    letter-spacing: 6px;*/
    width: 270px;
    height: 56px;
    margin: 0 auto 40px;
    background: url('./img/logo_small.png') no-repeat;
  }
  .login-input{
    color: #000;
    background-color: #fff;
    border: 1px #fff solid;
    height: 36px;
    padding-left: 15px;
    letter-spacing: 2px;
  }
  .input-box{
    display: inline-block;
  }
  .input-box::after{
      content: url(./img/between.png);
      position: absolute;
      width: 15px;
      height: 36px;
      left: 250px;
      top: 96px;
  }
  .password-box{
    margin-left: 15px;
  }
  .login-input:focus {
    background-color: rgba(255, 255, 255, 1);
    border: 1px #fff solid;
    outline:none;
  }
  .login-input-checkbox{
    width: 18px;
    height: 18px;
    border: 1px #fff solid;
  }
  .remember-me{
    color: #fff;
    letter-spacing: 2px;
    position: relative;
      top: -4px;
      left: 5px;
  }
  .w-250{
    width: 250px;
  }
  .verification{
    display: inline-block;
      width: 106px;
      height: 36px;
      margin-left: 6px;
      margin-top: -10px;
      position: relative;
      top: 13px;
      border-radius: 5px;
      background: url('./img/ma.png') no-repeat;
      background-size: cover;
  }
  .btn{
    display: inline-block;
    margin-bottom: 0px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    user-select: none;
    background-image: none;
    padding: 6px 12px;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    border-image: initial;
    border-radius: 4px;
  }
  .btn-login{

      width: 56px;
      height: 37px;
      color: #fff;
      background-color: #00b7ee;
      font-size: 20px;
      font-family: 微软雅黑;
      position: relative;
      top: -1px;
    left: -4px;
      border-radius: 0;
  }
  .forgot{
    color: #fff;
      float: right;
      position: relative;
      right: 18px;
      top: -2px;
      letter-spacing: 2px;
  }
  input::-webkit-input-placeholder{
      color: #666;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color: #666;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
      color: #666;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
      color: #666;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .forget-box{
    margin-top: 20px;
    padding-right: 10px;
  }
</style>
