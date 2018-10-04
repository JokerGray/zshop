<template>
    <div>
      <div class="top">
        <a href="javascript:;" class="iconfont icon-fanhui goBack" @click="goBack"></a>
        <h4>"{{keyWord}}"的搜索结果</h4>
      </div>
      <div class="attentionContent">
        <scroll class="author_list" :showBottomTips="false" :showTopTip="false">
          <ul>
            <li v-for="(item,index) in list" :key="index" v-if="item.scSysUser">
              <div class="fansImg" @click="toAuthorPage(item.userId)">
                <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),
                loading:require('../../../static/images/zw166.png'),
                error:require('../../../static/images/zw166.png')}">
              </div>
              <div class="fansDsc" @click="toAuthorPage(item.userId)">
                <h4 v-html="item.subscriptionName?item.subscriptionName:item.scSysUser.username"></h4>
                <p>{{item.enshrinedNum}}人关注</p>
                <!--<h4>夜晚不黑</h4>-->
                <!--<p>2人关注</p>-->
              </div>
              <div class="fansOperating">
                <a href="javascript:;" @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)" v-if="item.scSysUser.isSubscribe==0">
                  <img :src="require('../../../static/images/news_2_icon_guanzhu@2x.png')">
                </a>
                <a href="javascript:;" @click="AttentionAndCancel(item.scSysUser.id,item.scSysUser.isSubscribe)" v-if="item.scSysUser.isSubscribe==1">
                  <img :src="require('../../../static/images/news_2_icon_guanzhu_selected@2x.png')">
                </a>
                <a href="javascript:;" v-if="item.scSysUser.hasConcern==0" @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)">
                  <img :src="require('../../../static/images/news_2_icon_zhucheng@2x.png')">
                </a>
                <a href="javascript:;" v-if="item.scSysUser.hasConcern==1" @click="createCityAndCancel(item.scSysUser.id,item.scSysUser.hasConcern)">
                  <img :src="require('../../../static/images/news_2_icon_zhucheng_selected@2x.png')">
                </a>
              </div>
            </li>
          </ul>
          <div class="loading-wrapper"></div>
        </scroll>
      </div>
      <div class="noDataZW" v-if="list==null||list.length==0"><noDataZW></noDataZW></div>
    </div>
</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import noDataZW from '../common/noDataZW'
  import scroll from '../common/BScroll'
    export default {
      props:['list','keyWord'],
      components:{
        noDataZW,
        scroll
      },
      methods:{
        AttentionAndCancel: function (id, isSubscribe) {
          // if (!sessionStorage.getItem('userId')) {
          //   this.showLoginPage();
          //   return
          // }
          var url = 'zxcity_restful/ws/rest';
          var data = {
            cmd: '',
            data: JSON.stringify({
              "userId": sessionStorage.getItem('userId'),//平台用户主键
              "attentionUserId": id //其他用户主键
            }),
            version: 1
          };
          if (isSubscribe == 0) {
            data.cmd = 'cms_new/addUserAttention'
          } else if (isSubscribe == 1) {
            data.cmd = 'cms_new/cancelAttention'
          }
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            if (res.data.code != 1) {
              Toast(res.data.msg);
              return
            }
            this.$parent.submit(this.keyWord);
            Toast(res.data.msg);
          })
        },
        createCityAndCancel: function (id, hasConcern) {
          // if (!sessionStorage.getItem('userId')) {
          //   this.showLoginPage();
          //   return
          // }
          var url = 'zxcity_restful/ws/rest';
          var data = {
            cmd: '',
            data: JSON.stringify({
              "buildId": id,
              "userId": sessionStorage.getItem('userId')
            })
          };
          if (hasConcern == 0) {
            data.cmd = 'cms_new/buildUser'
          } else if (hasConcern == 1) {
            data.cmd = 'cms_new/delBuildUser'
          }
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            if (res.data.code != 1) {
              Toast(res.data.msg);
              return
            }
            this.$parent.submit(this.keyWord);
            if (hasConcern == 0) {
              Toast(res.data.msg);
            } else if (hasConcern == 1) {
              Toast('取消筑城成功');
            }
          })
        },
        goBack:function () {
          this.$parent.closeResultBox()
        },
        toAuthorPage:function (authorId) {
          this.$router.push({path:'/author/authorPage/homePage/'+authorId})
        }
      },
      mounted:function () {
        $('.author_list').height(($(window).height()-$('.top').height())*0.935);
        $('.attentionContent').height($(window).height()-$('.top').height())
      }
    }
</script>


<style scoped lang="less" type="text/less">
  .top{
    width: 100%;
    height: 100/32rem;
    line-height: 100/32rem;
    text-align: center;
    font-size: 30/32rem;
    color: #333333;
    font-weight: 400;
    border-bottom: 1/32rem solid #e5e5e5;
    position: relative;
    .goBack{
      position: absolute;
      width: 80/32rem;
      height: 100/32rem;
      text-align: center;
      top: 0;
      left: 0;
      font-size: 34/32rem;
      color: #333333;
    }
  }
  .attentionContent {
    overflow: hidden;
    ul {
      margin-top: 30/32rem;
      li {
        overflow: hidden;
        padding: 0 30/32rem 20/32rem 30/32rem;
        margin-top: 20/32rem;
        border-bottom: 1/32rem solid #e5e5e5;
        .fansImg {
          float: left;
          img {
            display: block;
            width: 74/32rem;
            height: 74/32rem;
          }
        }
        .fansDsc {
          float: left;
          margin-left: 30/32rem;
          width: 320/32rem;
          h4 {

            font-size: 28/32rem;
            color: #333333;
          }
          p {
            font-size: 24/32rem;
            color: #999999;
            margin-top: 15/32rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

          }
        }
        .fansOperating {
          margin-top: 10/32rem;
          float: left;
          a {
            display: inline-block;
            width: 114/32rem;
            height: 47/32rem;
            float: left;
            img {
              display: block;
              width: 100%;
            }
            &:nth-of-type(2) {
              margin-left: 14/32rem;
            }
          }
        }
      }
    }
  }
  .noDataZW{
    position: absolute;
    width: 100%;
    height: 90%;
    bottom: 0;
    left: 0;
    background-color: #fff;
  }
</style>
