<template>
  <div>
    <ul class="newsListTemp">
      <li v-for="(item,index) in list" :key="index">
        <div class="tem1" v-if="1==item.previewImgType">
          <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
            <div class="newsLeft">
              <h4>{{item.articleTitle}}</h4>
              <div class="newsBottom">
                <div class="left">
                  <span>{{item.scCmsSubscription?item.scCmsSubscription.subscriptionName:item.scSysUser.username}}</span>
                  <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                  <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                </div>
                <div class="right">
                  <span>{{item.releaseTime.substring(0,10)}}</span>
                </div>
              </div>
            </div>
            <div class="newsRight">
               <img v-lazy="{src:item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl,loading:require('../../../static/images/zw166.png')}"/>
            </div>
          </span>
        </div>
        <div class="tem2" v-if="2==item.previewImgType">
                    <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                      <h4>{{item.articleTitle}}</h4>
                      <div class="newsImg">
                        <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                        <img v-lazy="{src:item.scCmsResourcesList[1].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                        <img v-lazy="{src:item.scCmsResourcesList[2].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                      </div>
                      <div class="newsBottom">
                        <div class="left">
                          <span>{{item.scCmsSubscription?item.scCmsSubscription.subscriptionName:item.scSysUser.username}}</span>
                          <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                          <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                        </div>
                        <div class="right">
                          <span>{{item.releaseTime.substring(0,10)}}</span>
                        </div>
                      </div>
                    </span>
        </div>
        <div class="tem3" v-if="3==item.previewImgType">
                    <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                      <h4>{{item.articleTitle}}</h4>
                      <div class="newsImg">
                        <img v-lazy="{src:item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl,loading:require('../../../static/images/zw750.png')}"/>
                        <span class="imgNum"><i></i>{{item.scCmsResourcesList.length}}图</span>
                      </div>
                      <div class="newsBottom">
                        <div class="left">
                          <span>{{item.scCmsSubscription?item.scCmsSubscription.subscriptionName:item.scSysUser.username}}</span>
                          <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                          <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                        </div>
                        <div class="right">
                          <span>{{item.releaseTime.substring(0,10)}}</span>
                        </div>
                      </div>
                    </span>
        </div>
        <div class="tem5" v-if="5==item.previewImgType">
                    <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                      <h4>{{item.articleTitle}}</h4>
                      <div class="newsImg">
                        <img v-lazy="{src:item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl,loading:require('../../../static/images/zw750.png')}"/>
                        <span class="playIcon"></span>
                        <span class="videoTime">{{item.scCmsResourcesList[0].videoPlayTime}}</span>
                      </div>
                      <div class="newsBottom">
                        <div class="left">
                          <span>{{item.scCmsSubscription?item.scCmsSubscription.subscriptionName:item.scSysUser.username}}</span>
                          <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                          <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                        </div>
                        <div class="right">
                          <span>{{item.releaseTime.substring(0,10)}}</span>
                        </div>
                      </div>
                    </span>
        </div>
        <div class="tem10" v-if="10==item.previewImgType">
          <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
            <div class="newsLeft">
              <h4>{{item.articleTitle}}</h4>
              <div class="newsBottom">
                <div class="left">
                  <span></span>
                  <span>{{item.scCmsSubscription?item.scCmsSubscription.subscriptionName:item.scSysUser.username}}</span>
                  <!--<span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>-->
                  <!--<span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>-->
                  <span>{{item.answerNumber}}个回答</span>
                </div>
                <div class="right">
                  <span>{{item.releaseTime.substring(0,10)}}</span>
                </div>
              </div>
            </div>
            <div class="newsRight">
               <img v-lazy="{src:item.scCmsResourcesList?item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl:'',loading:require('../../../static/images/zw166.png')}"/>
            </div>
          </span>
        </div>
        <div class="tem15" v-if="15==item.previewImgType">
                    <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                      <h4>{{item.articleTitle}}</h4>
                      <div class="newsImg">
                        <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                        <img v-lazy="{src:item.scCmsResourcesList[1].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                        <img v-lazy="{src:item.scCmsResourcesList[2].resourcesUrl,loading:require('../../../static/images/zw220.png')}"/>
                      </div>
                      <div class="newsBottom">
                        <div class="left">
                          <span class="itemIcon"></span>
                          <span>{{item.scCmsSubscription?item.scCmsSubscription.subscriptionName:item.scSysUser.username}}</span>
                          <!--<span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>-->
                          <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                          <span>{{item.voteNumber}}票</span>
                        </div>
                        <div class="right">
                          <span>{{item.releaseTime.substring(0,10)}}</span>
                        </div>
                      </div>
                    </span>
        </div>
      </li>
    </ul>
  </div>
</template>
<!--"previewImgType": "显示资源的方式， 0普通无图   1普通单图  2普通三图    3图集单图  4图集三图  5视频 6 广告大图 7广告三图 8 广告视频 9 问题无图 10问题单图  11 问题三图 12 回答无图",-->
<script>
  export default {
    props: ['list'],
    methods: {
      toNewsInfo: function (articleId, previewImgType) {
        this.$emit('toNewsInfo', articleId, previewImgType)
      }
    }
  }
</script>


<style scoped lang="less" type="text/less">
  .newsListTemp {
    width: 100%;
    padding-left: 0;
    margin: 0;
    background-color: #fff;
    text-align: left;
    /*<!--padding-top: 100/32rem;-->*/
    li {
      padding: 36/32rem 20/32rem 0 20/32rem;
      .tem1 {
        background-color: #fff;
        > span {
          display: block;
          border-bottom: 1/32rem solid #EDEDED;
          padding-bottom: 20/32rem;
          overflow: hidden;
          .newsLeft {
            width: 75%;
            height: 166/32rem;
            float: left;
            position: relative;
            h4 {
              font-size: 32/32rem;
              font-weight: 400;
              color: #443C5B;
              padding-right: 10/32rem;
              text-align: justify;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              white-space: pre-wrap;
              line-height: 38/32rem;
            }
            .newsBottom {
              width: 100%;
              position: absolute;
              bottom: 0;
              left: 0;
              display: flex;
              .left {
                flex: 7;
                span {
                  padding: 0 10/32rem
                }
              }
              .right {
                flex: 3;
                padding-right: 20/32rem;
                text-align: right;
              }
              span {
                font-size: 24/32rem;
                color: #A6A6A6;
              }
            }
          }
          .newsRight {
            width: 25%;
            float: right;
            text-align: right;
            img {
              width: 166/32rem;
              height: 166/32rem;
              display: inline-block;
              border-radius: 6/32rem;
            }
          }
        }
      }
      .tem2,.tem15 {
        background-color: #fff;
        > span {
          display: block;
          border-bottom: 1/32rem solid #EDEDED;
          h4 {
            font-size: 32/32rem;
            font-weight: 400;
            color: #443C5B;
            text-align: justify;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp:2;
            white-space: pre-wrap;
            line-height: 38/32rem;
          }
          .newsImg {
            overflow: hidden;
            font-size: 0;
            margin: 20/32rem 0;
            img {
              width: 220/32rem;
              height: 220/32rem;
              display: inline-block;
              border-radius: 6/32rem;
            }
            img:nth-of-type(2) {
              margin: 0 25/32rem;
            }
          }
          .newsBottom {
            margin-bottom: 20/32rem;
            display: flex;
            .left {
              flex: 8;
              span {
                padding: 0 10/32rem;
              }
            }
            .right {
              flex: 2;
            }
            span {
              font-size: 24/32rem;
              color: #A6A6A6;
            }
          }
        }
      }
      .tem3 {
        background-color: #fff;
        > span {
          display: block;
          border-bottom: 1/32rem solid #EDEDED;
          h4 {
            font-size: 32/32rem;
            font-weight: 400;
            color: #443C5B;
            text-align: justify;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            white-space: pre-wrap;
            line-height: 38/32rem;
          }
          .newsImg {
            width: 100%;
            margin-top: 20/32rem;
            position: relative;
            img {
              width: 100%;
              height: 394/32rem;
              display: block;
              border-radius: 6/32rem;
            }
            .imgNum {
              position: absolute;
              width: 121/32rem;
              height: 46/32rem;
              background-color: #9189f2;
              border-radius: 8/32rem;
              font-size: 26/32rem;
              color: #ffffff;
              line-height: 46/32rem;
              bottom: 24/32rem;
              right: 20/32rem;
              i {
                float: left;
                width: 24/32rem;
                height: 24/32rem;
                background: url("../../../static/images/news_2_icon_grop@2x.png") no-repeat center;
                -webkit-background-size: 24/32rem 24/32rem;
                background-size: 24/32rem 24/32rem;
                margin-right: 10/32rem;
                margin-left: 15/32rem;
                margin-top: 10/32rem;
              }
            }
          }
          .newsBottom {
            display: flex;
            margin: 20/32rem 0;
            .left {
              flex: 8;
              span {
                padding: 0 10/32rem;
              }
            }
            .right {
              flex: 2;
              text-align: right;
            }
            span {
              font-size: 24/32rem;
              color: #A6A6A6;
            }
          }
        }
      }
      .tem5 {
        background-color: #fff;
        > span {
          display: block;
          border-bottom: 1/32rem solid #EDEDED;
          h4 {
            font-size: 32/32rem;
            font-weight: 400;
            color: #443C5B;
            text-align: justify;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            white-space: pre-wrap;
            line-height: 38/32rem;
          }
          .newsImg {
            width: 100%;
            margin-top: 20/32rem;
            position: relative;
            img {
              width: 100%;
              height: 394/32rem;
              display: block;
              border-radius: 6/32rem;
            }
            .playIcon {
              position: absolute;
              width: 90/32rem;
              height: 90/32rem;
              background-color: rgba(0, 0, 0, 0.6);
              background-image: url(../../../static/images/news_2_publish_record_play@2x.png);
              background-size: 90/32rem 90/32rem;
              background-position: center center;
              border-radius: 50%;
              z-index: 2;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            .videoTime {
              position: absolute;
              width: 121/32rem;
              height: 46/32rem;
              background-color: #9189f2;
              border-radius: 8/32rem;
              font-size: 26/32rem;
              color: #ffffff;
              text-align: center;
              line-height: 46/32rem;
              bottom: 24/32rem;
              right: 20/32rem;
            }
          }
          .newsBottom {
            display: flex;
            margin: 20/32rem 0;
            .left {
              flex: 8;
              span {
                padding: 0 10/32rem;
              }
            }
            .right {
              flex: 2;
              text-align: right;
            }
            span {
              font-size: 24/32rem;
              color: #A6A6A6;
            }
          }
        }
      }
      .tem10 {
        background-color: #fff;
        > span {
          display: block;
          border-bottom: 1/32rem solid #EDEDED;
          padding-bottom: 20/32rem;
          overflow: hidden;
          .newsLeft {
            width: 75%;
            height: 166/32rem;
            float: left;
            position: relative;
            h4 {
              font-size: 32/32rem;
              font-weight: 400;
              color: #443C5B;
              padding-right: 10/32rem;
              text-align: justify;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              white-space: pre-wrap;
              line-height: 38/32rem;
            }
            .newsBottom {
              width: 100%;
              position: absolute;
              bottom: 0;
              left: 0;
              display: flex;
              .left {
                flex: 7;
                span {
                  padding: 0 10/32rem;
                  &:first-of-type{
                    display: inline-block;
                    width: 74/32rem;
                    height: 29/32rem;
                    background: url("../../../static/images/icon_wendabiaoqian_xiao@2x.png") no-repeat center;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                    vertical-align: middle;
                  }
                }
              }
              .right {
                flex: 3;
                padding-right: 20/32rem;
                text-align: right;
              }
              span {
                font-size: 24/32rem;
                color: #A6A6A6;
              }
            }
          }
          .newsRight {
            width: 25%;
            float: right;
            text-align: right;
            img {
              width: 166/32rem;
              height: 166/32rem;
              display: inline-block;
              border-radius: 6/32rem;
            }
          }
        }
      }
      .tem15{
        .newsBottom{
          .left{
            >.itemIcon{
              display: inline-block;
              width: 74/32rem;
              height: 30/32rem;
              background: url("../../../static/images/icon_toupiao@2x.png") no-repeat center;
              -webkit-background-size: 100%;
              background-size: 100%;
              vertical-align: middle;
            }
          }
        }
      }
    }

  }
</style>
