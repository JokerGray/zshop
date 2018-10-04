<template>
  <div>
    <div class="voteTitle">
      <img src="http://img0.imgtn.bdimg.com/it/u=3403969601,1685452289&fm=15&gp=0.jpg" class="bgImg">
      <div class="voteTitle-mask"></div>
      <div class="voteTitle-top">
        <a href="javascript:;" class="iconfont icon-fanhui"></a>
      </div>
      <div class="voteTitle-content">
        <h4>2017武汉网红大赛开始了，把票投给你心仪的她！</h4>
        <p>【匿名】</p>
      </div>
    </div>
    <div class="authorInfo-box">
      <img src="http://g.hiphotos.baidu.com/zhidao/pic/item/b8014a90f603738da763cbb9b51bb051f819ec04.jpg">
      <div class="authorInfo-name">
        <p>夜晚不黑</p>
        <p>2018.04.18 11:27</p>
      </div>
      <div class="authorControl-btn">
        <a href="javascript:;"><img src="../../../static/images/news_2_icon_zhucheng@2x.png"></a>
        <a href="javascript:;"><img src="../../../static/images/news_2_icon_guanzhu@2x.png"></a>
      </div>
    </div>
    <div class="voteNumber">
      <a href="javascript:;">
        <p>参与选手</p>
        <p>65</p>
      </a>
      <a href="javascript:;">
        <p>累计投票</p>
        <p>65</p>
      </a>
      <a href="javascript:;">
        <p>访问人数</p>
        <p>65</p>
      </a>
    </div>
    <div class="voteDesc">
      <p><img :src="require('../../../static/images/toupiao_icon_kaishishijian@2x.png')"><span>开始时间：</span><span>2018.04.18 15:33</span></p>
      <p><img :src="require('../../../static/images/toupiao_icon_jieshushijian@2x.png')"><span>结束时间：</span><span>2018.04.18 15:33</span></p>
      <p><img :src="require('../../../static/images/toupiao_icon_toupiaoguize@2x.png')"><span>投票规则：</span><span>同一个账户每天可投两票</span></p>
      <p><img :src="require('../../../static/images/toupiao_icon_toupiaomiaoshu@2x.png')"><span>投票描述：</span><span>同一个账户每天可投两票同一个账户每天可投两票</span></p>
    </div>
    <div class="players-box">
      <div class="search-box">
        <form action="javascript:;">
          <input type="text">
          <a href="javascript:;" class="searchBtn"><img :src="require('../../../static/images/toupiao_icon_sousuo@2x.png')"></a>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>


<style scoped lang="less" type="text/less">
  .voteTitle{
    width: 100%;
    height: 380/32rem;
    position: relative;
    .bgImg{
      position: absolute;
      width: 100%;
      height: 380/32rem;
      top: 0;
      left: 0;
    }
    .voteTitle-mask{
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0,.5);
      width: 100%;
      height: 380/32rem;
    }
    .voteTitle-top{
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      a{
        display: block;
        width: 90/32rem;
        height: 90/32rem;
        text-align: center;
        line-height: 90/32rem;
        font-size: 36/32rem;
        color: #ffffff;
      }
    }
    .voteTitle-content{
      width: 100%;
      position: absolute;
      top: 155/32rem;
      left: 0;
      z-index: 1;
      >h4{
        font-size: 44/32rem;
        color: #fff;
        text-align: center;
        padding: 0 80/32rem;
        line-height: 50/32rem;
      }
      >p{
        font-size: 34/32rem;
        color: #eeeeee;
        text-align: center;
        margin-top: 18/32rem;
      }
    }
  }
  .authorInfo-box{
    width: 100%;
    height: 180/32rem;
    border-bottom:20/32rem solid #f8f8f8;
    padding: 0 24/32rem;
    position: relative;
    >img{
      width: 80/32rem;
      height: 80/32rem;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      float: left;
      margin-top: 40/32rem;
    }
    .authorInfo-name{
      float: left;
      margin-top: 40/32rem;
      margin-left: 24/32rem;
      >p:first-of-type{
        font-size: 34/32rem;
        color: #3c3b3b;
      }
      >p:last-of-type{
        font-size: 22/32rem;
        color: #787878;
        margin-top: 26/32rem;
      }
    }
    .authorControl-btn{
      font-size: 0;
      position: absolute;
      right: 24/32rem;
      top: 58/32rem;
      a{
        display: inline-block;
        width: 114/32rem;
        height: 47/32rem;
        font-size: 0;
        margin-left: 14/32rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .voteNumber{
    width: 100%;
    height: 177/32rem;
    border-bottom: 20/32rem solid #f8f8f8;
    font-size: 0;
    padding: 40/32rem;
    a{
      display: inline-block;
      width: 33.3333333%;
      height: 100%;
      font-size: 30/32rem;
      color: #333333;
      text-align: center;
      &:nth-of-type(2){
        border-left: 1/32rem solid #999999;
        border-right: 1/32rem solid #999999;
      }
      p:nth-of-type(2){
        margin-top: 20/32rem;
      }
    }
  }
  .voteDesc{
    width: 100%;
    padding: 40/32rem 40/32rem 40/32rem 30/32rem;
    p{
      line-height: 58/32rem;
      img{
        width: 31/32rem;
        height: 34/32rem;
        margin-right: 30/32rem;
        vertical-align: middle;
      }
      span:nth-of-type(1){
        font-size: 28/32rem;
        color: #888888;
      }
      span:nth-of-type(2){
        font-size: 28/32rem;
        color: #333333;
      }
    }
  }
  .players-box{
    width: 100%;
    background-color: #f8f8f8;
    .search-box{
      width: 100%;
      font-size: 0;
      padding: 0 42/32rem;
      form{
        vertical-align: middle;
        input{
          width: 586/32rem;
          height: 56/32rem;
          outline: none;
          border: 2/32rem solid #d2d2d2;
          -webkit-border-radius: 4/32rem;
          -moz-border-radius: 4/32rem;
          border-radius: 4/32rem;
        }
      }
      .searchBtn{
        display: inline-block;
        width: 60/32rem;
        height: 56/32rem;
        margin-left: 20/32rem;
        vertical-align: middle;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
