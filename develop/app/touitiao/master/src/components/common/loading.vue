<template>
    <div class="loading_app">
      <div class="divs">
        <ul class="top">
          <li>
            <span class="one"></span>
            <span class="two"></span>
          </li>
          <li>
            <span class="three"></span>
            <span class="four"></span>
          </li>
        </ul>
        <ul class="bottom">
          <li>
            <span></span>
            <span class="hide"></span>
            <span></span>
          </li>
          <li>
            <span></span>
            <span></span>
            <span></span>
          </li>
        </ul>
      </div>
      <div class="tips">
        <p>数据正在加载中</p>
        <p>请耐心等待</p>
      </div>
    </div>
</template>
<script>
  import $ from 'jquery'
    export default {
      mounted:function () {
        $('.loading_app').height($(window).height())
      }
    }
</script>
<style scoped type="text/less" lang="less">
  .loading_app{
    width:100%;
    background-color: #fff;
    .divs{
      position: absolute;
      width:100%;
      height:260/32rem;
      top: 50%;
      transform: translateY(-90%);
      ul{
        li{
          text-align: center;
          font-size:0;
          span{
            display: inline-block;
            width:12/32rem;
            height:12/32rem;
            background-color: #d9d9d9;
            margin:2/32rem;
          }
        }
      }
      .top{
        position: relative;
        top:0;
        left:8/32rem;
        -webkit-animation: topAni 1.5s steps(1);
        -o-animation: topAni 1.5s steps(1);
        animation: topAni 1.5s steps(1);
        animation-iteration-count: infinite;
        .one{
          -webkit-animation: oneAni 1.5s steps(1);
          -o-animation: oneAni 1.5s steps(1);
          animation: oneAni 1.5s steps(1);
          animation-iteration-count: infinite;
        }
        .two{
          -webkit-animation: twoAni 1.5s steps(1);
          -o-animation: twoAni 1.5s steps(1);
          animation: twoAni 1.5s steps(1);
          animation-iteration-count: infinite;
        }
        .three{
          -webkit-animation: threeAni 1.5s steps(1);
          -o-animation: threeAni 1.5s steps(1);
          animation: threeAni 1.5s steps(1);
          animation-iteration-count: infinite;
        }
        .four{
          -webkit-animation: fourAni 1.5s steps(1);
          -o-animation: fourAni 1.5s steps(1);
          animation: fourAni 1.5s steps(1);
          animation-iteration-count: infinite;
        }
      }
      .bottom{
        margin-top: 106/32rem;
      }
    }
    .tips{
      width:100%;
      text-align: center;
      font-size:26/32rem;
      color: #d1d1d1;
      line-height:36/32rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .hide{
    visibility: hidden;
  }
  @keyframes topAni {
    0%{
      top:0;
    }
    20%{
      top:30/32rem;
    }
    40%{
      top:60/32rem;
    }

    60%{
      top:90/32rem;
    }
    80%{
      top:120/32rem;
    }
    100%{
      top:150/32rem;
    }
  }
  @keyframes oneAni {
    0%{
      opacity: 1;
    }
    25%{
      opacity: 0;
    }
    50%{
      opacity: 1;
    }
    75%{
      opacity: 1;
    }
    100%{
      opacity: 1;
    }
  }
  @keyframes twoAni {
    0%{
      opacity: 0;
    }
    25%{
      opacity: 1;
    }
    50%{
      opacity: 1;
    }
    75%{
      opacity: 1;
    }
    100%{
      opacity: 1;
    }
}
  @keyframes threeAni {
    0%{
      opacity: 1;
    }
    25%{
      opacity: 1;
    }
    50%{
      opacity: 0;
    }
    75%{
      opacity: 1;
    }
    100%{
      opacity: 1;
    }
}
  @keyframes fourAni {
  0%{
    opacity: 1;
  }
  25%{
    opacity: 1;
  }
  50%{
    opacity: 1;
  }
  75%{
    opacity: 0;
  }
  100%{
    opacity: 0;
  }
}
</style>
