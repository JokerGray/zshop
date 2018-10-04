<template>
  <scroll
    :probeType="2"
    class="videoList"
    ref="videoList"
    :data="list"
    :refreshDataLength="refreshDataLength"
    :pulldown="true"
    :pullup="true"
    :lastRefreshTime="lastRefreshTime"
    :totalNum="videoTotalNum"
    @scrollToEnd="loadMore"
    @scroll="scroll"
    @pulldown="loadData">
    <ul id="ul">
      <li v-for="(item,index) in list" :key="index">
        <a href="javascript:;">
          <div class="videoPic" ref="videoPic">
            <strong v-show="titleShow !== index" ref="h4">{{item.articleTitle}}</strong>
            <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw703.png')}" v-show="index !== show">
            <div class="videoMask" v-if="index !== show" ref="videoMask"></div>
            <!--<video :src="item.scCmsResourcesList[0].videoUrl"-->
            <!--@click="showTitle(index)"-->
            <!--webkit-playsinline-->
            <!--controls-->
            <!--class="video"-->
            <!--v-if="index==showVideo"-->
            <!--autoplay></video>-->
            <div class="chimee-container" v-if="index == showVideo" @click="showTitle(index)">
              <video tabindex="-1" class="video" ref="video"></video>
            </div>
            <span @click="goPlay(index,item.scCmsResourcesList[0].videoUrl)" v-if="index!==show" id="goPlay"><i></i></span>
            <s class="videoTime" v-show="index !== show">{{item.scCmsResourcesList[0].videoPlayTime}}</s>
          </div>
          <div class="videoMsg">
            <div class="videoAuthor" @click="toAuthorPage(item.scSysUser.id)">
              <img :src="item.scSysUser?item.scSysUser.userpic:require('../../../static/images/mrtx.png')">&nbsp;<span>{{item.scSysUser?item.scSysUser.username:''}}</span>
            </div>
            <div class="otherMsg">
              <span @click="toVideoInfo('/videoInfo/'+item.scCmsResourcesList[0].articleId)">
                <span>{{item.articleBrowser}}次播放</span>
                <span class="iconfont icon-xinxi">{{item.commentNum}}</span>
              </span>
              <span class="iconfont icon-shenglvehao" @click.stop.prevent="toControlBtns(item)"></span>
            </div>
          </div>
        </a>
      </li>
    </ul>
    <div class="loading-wrapper"></div>
    <!--<loading v-if="loading"></loading>-->
    <div v-show="isZW" class="noDataZW">
      <noDataZW></noDataZW>
    </div>
  </scroll>
</template>

<script>
  import scroll from '../common/BScroll.vue'
  import qs from 'qs'
  import ChimeeMobilePlayer from 'chimee-mobile-player'
  import chimeePluginMobileControlbar from 'chimee-plugin-mobile-controlbar'

  ChimeeMobilePlayer.install(chimeePluginMobileControlbar);
  import $ from 'jquery'
  import loading from '../common/loading'
  import noDataZW from '../common/noDataZW'

  export default {
    props: ['videoList', 'active', 'cate'],
    components: {
      scroll,
      loading,
      noDataZW,
    },
    data: function () {
      return {
        show: -1,//控制遮罩图片和播放按钮的显示状态
        showVideo: -1,//控制video的显示与隐藏
        titleShow: -1,//控制视频title的显示与隐藏
        // hotTime:0,
        list: [],
        pageNo: 1,
        loading: false,
        isZW: false,
        lastRefreshTime: '',
        refreshDataLength: '',
        videoTotalNum: '',
        isAjax: true,
        y: 0,//记录页面滚动y轴的坐标
        chimee:''
      }
    },
    created: function () {
      this.loading = true;
      this.getVideoList()
    },
    methods: {
      goPlay: function (index, src) {
        // $('.chimee-container').html('');
        this.show = index;
        this.showVideo = index;
        this.titleShow = index;
        // this.index = index;
        this.$nextTick(function () {
          this.chimee = new ChimeeMobilePlayer({
            wrapper: '.chimee-container',  // video dom容器
            src: src,
            autoplay: true,
            controls: true,
            playsInline: true,
            webkitPlaysinline:true,
            preload: true,
            x5VideoPlayerFullscreen: true,
            x5VideoOrientation: true,
            xWebkitAirplay: true,
            muted: false,
            inline: true,
            plugin: [
              {
                name: chimeePluginMobileControlbar.name,
                majorColor: '#fff',
                hoverColor: '#fff',
                hideBarTime: 5000,
                barShowByMouse: 'move', // 控制条显示由， move 还是 enter/leave 来控制显示／隐藏
                children: {
                  play: {},
                  screen: {
                    bitmap: true,
                  },
                  currentTime: {},
                  totalTime: {},
                  progressBar: {},
                }
              }
            ],
          });
          //隐藏全屏按钮
          $($('.chimee-flex-component')[1]).hide();
        })
      },
      showTitle: function (index) {
        this.titleShow = -1;
        setTimeout(() => {
          this.titleShow = index
        }, 5000)
      },
      toVideoInfo: function (path) {
        if (this.$refs.video && this.$refs.video.length !== 0) {
          this.$refs.video[0].pause();
        }
        this.$router.push({path: path})
      },
      getVideoList: function () {
        if (!this.isAjax) {
          return
        }
        var url = '/zxcity_restful/ws/rest';
        if (this.cate.channelId === '0001') {
          var data = {
            cmd: 'cms_new/queryArticelList ',
            data: JSON.stringify({
              "userId": sessionStorage.getItem('userId') || "",
              "praiseUser": sessionStorage.getItem('userId') || "",
              "typeCode": "1003",
              "releaseCity": sessionStorage.getItem('cityCode'),
              "pagination": {
                "page": this.pageNo,
                "rows": 10
              }
            }),
            version: 1
          };
        } else if (this.cate.channelId === '0002') {
          var data = {
            cmd: 'cms_new/queryHotVideoList',
            data: JSON.stringify({
              "userId": sessionStorage.getItem('userId') || "",
              "praiseUser": sessionStorage.getItem('userId') || "",
              "releaseCity": sessionStorage.getItem('cityCode'),
              "pagination": {
                "page": this.pageNo,
                "rows": 10
              }
            }),
            version: 1
          };
        } else {
          var data = {
            cmd: 'cms_new/queryArticleByChannel',
            data: JSON.stringify({
              "userId": sessionStorage.getItem('userId') || "",
              "praiseUser": sessionStorage.getItem('userId') || "",
              "channelId": this.cate.channelId,
              "releaseCity": sessionStorage.getItem('cityCode'),
              "pagination": {
                "page": this.pageNo,
                "rows": 10
              }
            }),
            version: 1
          };
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (this.pageNo === 1) {
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.$parent.$parent.$parent.listObj[this.cate.channelId] = true;
            if (res.data.data.length == 0 && res.data.code == 1) {
              this.isZW = true;//没有数据是显示站位图
              this.loading = false;
              this.$emit('hideLoading', this.active);
              return
            }
            this.refreshDataLength = res.data.data.length;
            this.videoTotalNum = res.data.total;
            this.list = [];
            this.list = res.data.data;
            this.$emit('hideLoading', this.active)
          } else {
            this.list = this.list.concat(res.data.data);
            if(this.list.length === this.videoTotalNum){
              this.isAjax = false
            }
          }
        })
      },
      loadMore: function () {
        this.pageNo++;
        this.getVideoList()
      },
      loadData: function () {
        this.isAjax = true;
        this.pageNo = 1;//每次刷新完之后将pageNo初始化，避免上拉加载时pageNo无限增加
        this.getVideoList();
        this.show = -1;
        this.showVideo = -1;
        this.titleShow = -1
      },
      scroll: function (pos) {
        this.y = pos.y;
        if ($('.video').length > 0) {
          if (Math.abs($('.video').offset().top) >= Math.abs($('.video').parent().parent().parent().outerHeight() - $('.videoMsg').height()) && $('.video').offset().top < 0) {
            $('.video')[0].pause();
            $('.chimee-container').html('');
            this.show = -1;
            this.showVideo = -1;
            this.titleShow = -1
          }
        } else {
          return;
        }
      },
      toAuthorPage: function (authorId) {
        this.$router.push({path: '/author/authorPage/homePage/' + authorId});
      },
      toControlBtns: function (item) {
        this.$emit('showControlBtns', item)
      }
    },
    watch: {
      active: function (value, old) {
        this.show = -1;
        this.showVideo = -1;
        this.titleShow = -1;
      },
      $route: function (newValue, oldValue) {
        //解决从作者关注或者粉丝页面返回视频列表页后，视频列表页不能上下滑动的bug
        if (oldValue.path !== '/video' && newValue.path === '/video') {
          this.$refs.videoList.scrollTo(0, this.y < 0 ? this.y : 0, 0);
          setTimeout(() => {
            this.$refs.videoList.refresh();
          }, 300)
        }
        //跳转页面时，暂定播放视频
        if(newValue.path !== '/video'){
          if (this.$refs.video && this.$refs.video.length !== 0) {
            this.$refs.video[0].pause();
          }
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        var height = $(window).height() - $('.logo').height() - $('.cateBox').height() - $('.mint-tabbar').height();
        $('.videoList').height(height);
        $('.noDataZW').height(height);
      })
    },
    updated:function () {
      this.$nextTick(function () {
        //解决视频在播放时切换页面或者刷新页面时，页面出现黑色背景的问题
        $('.videoMask').each((i,v)=>{
          $(v).html('')
        });
        //防止拖动视频滚动条时，页面也会跟着左右滑动
        $('.small').on('touchmove',function () {
          return false
        })
      })
    }
  }
</script>
<style scoped lang="less" type="text/less">
  .videoList {
    width: 100%;
    background-color: #fff;
    height: 1140/32rem;
    ul {
      padding-left: 0;
      margin: 0;
      /*<!--padding-bottom: 100/32rem;-->*/
      li {
        background-color: #fff;
        a {
          display: block;
          .videoPic {
            width: 100%;
            position: relative;
            height: 422/32rem;
            video {
              width: 100%;
              height: 422/32rem;
            }
            img {
              width: 100%;
              height: 422/32rem;
              position: absolute;
              top: 0;
              left: 0;
              z-index: 3;
            }
            span {
              position: absolute;
              width: 90/32rem;
              height: 90/32rem;
              background-color: rgba(0, 0, 0, 0.6);
              background-image: url(../../../static/images/news_2_publish_record_play@2x.png);
              background-size: 90/32rem 90/32rem;
              background-position: center center;
              border-radius: 50%;
              z-index: 3;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            strong {
              position: absolute;
              top: 25/32rem;
              left: 18/32rem;
              font-size: 32/32rem;
              color: #fff;
              text-align: left;
              /*background-color: rgba(0, 0, 0, .3);*/
              padding: 0 20/32rem;
              margin: 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal;
              font-weight: 400;
              z-index: 4;
              line-height: 40/32rem;
            }
            .videoMask {
              width: 100%;
              height: 422/32rem;
              position: absolute;
              top: 0;
              left: 0;
              background-color: rgba(0, 0, 0, 0.3);
              z-index: 3;
            }
            .videoTime {
              position: absolute;
              bottom: 30/32rem;
              right: 30/32rem;
              width: 120/32rem;
              height: 46/32rem;
              line-height: 46/32rem;
              text-align: center;
              font-size: 26/32rem;
              color: #fff;
              background-color: #9189f2;
              z-index: 3;
              text-decoration: none;
              border-radius: 8/32rem;
            }
          }
          .videoMsg {
            width: 100%;
            overflow: hidden;
            height: 90/32rem;
            line-height: 90/32rem;
            padding-left: 20/32rem;
            /*<!--margin: 10/32rem 0;-->*/
            color: #333;
            .videoAuthor {
              width: 40%;
              height: 100%;
              float: left;
              font-size: 30/32rem;
              color: #53537D;
              text-align: left;
              img {
                width: 60/32rem;
                height: 60/32rem;
                border-radius: 50%;
                float: left;
                margin-top: 15/32rem;
              }
            }
            .otherMsg {
              width: 60%;
              height: 100%;
              float: right;
              text-align: right;
              > span {
                display: inline-block;
                color: #656565;
                height: 100%;
                span {
                  font-size: 26/32rem;
                  margin-right: 20/32rem;
                  &::before {
                    font-size: 30/32rem;
                    margin-right: 10/32rem;
                  }
                }
              }
              span:nth-of-type(2) {
                padding-right: 20/32rem;
                font-size: 34/32rem;
              }
            }
          }
        }
      }
    }
  }

  .noDataZW {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    background-color: #fff;
    /deep/ .zw {
      .zwPic {
        width: 50%;
        height: 25%;
      }
      .zwTips {
        width: 40%;
        height: 3%;
      }
    }
  }
</style>
