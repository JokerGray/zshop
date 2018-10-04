<template>
  <scroll
    class="newsList"
    ref="newsList"
    :probeType="2"
    :data="list"
    :refreshDataLength="refreshDataLength"
    :pulldown="true"
    :pullup="true"
    :lastRefreshTime="lastRefreshTime"
    :totalNum="newsTotalNum"
    @scroll="scroll"
    @scrollToEnd="loadMore"
    @pulldown="loadData">
    <newsLisTemp :list="list" @toNewsInfo="toNewsInfo"></newsLisTemp>
    <div class="loading-wrapper"></div>
    <!--<loading v-if="show"></loading>-->
    <div v-show="isNoData" class="noDataZW">
      <noDataZW></noDataZW>
    </div>
  </scroll>
  <!--"previewImgType": "显示资源的方式， 0普通无图   1普通单图  2普通三图    3图集单图  4图集三图  5视频 6 广告大图 7广告三图 8 广告视频 9 问题无图 10问题单图  11 问题三图 12 回答无图",-->
</template>
<script>
  import qs from 'qs'
  import scroll from '../common/BScroll.vue'
  import loading from '../common/loading.vue'
  import $ from 'jquery'
  import noDataZW from '../common/noDataZW'
  import newsLisTemp from '../common/newsListTemp'
  import AMap from 'AMap'
  import {Toast} from 'mint-ui'

  export default {
    props: ['active', 'newsList', 'cateId'],
    components: {
      scroll,
      loading,
      noDataZW,
      newsLisTemp
    },
    data: function () {
      return {
        list: [],
        //show:false,//是否显示loading
        pageNo: 1,
        lastRefreshTime: '',//最后刷新时间
        isNoData: false,
        refreshDataLength: '',
        newsTotalNum: '',
        operation: 0,
        isAjax:true,
        y: 0//记录页面滚动y轴坐标
      }
    },
    created: function () {
      //this.show = true;
      this.newsListInit()
      // this.list = this.newsList
    },
    methods: {
      newsListInit: function () {
        //使用异步加载方式引入高德api，目的是等api全部加载回来后，执行定位操作，避免AMap报错
        // var script = document.createElement('script');
        // var head = document.getElementsByTagName("head")[0];
        // script.src = '//webapi.amap.com/maps?v=1.4.4&key=9baeb4f7264baa46dbb5a7ac726ba7c6';
        // script.async = true;
        // head.insertBefore(script,head.firstChild);
        // 异步加载会阻塞onload的执行，保证api高德api已经全部加载完成
        if (sessionStorage.getItem('cityCode')) {
          this.getNewsList()
        } else {
          //保证高德API全部加载完成后执行操作
          window.onload = () => {
            setTimeout(() => {
              this.getCityCode();
            }, 0)
          }
        }
      },
      getCityCode: function () {
        var _this = this;
        // var str = sessionStorage.getItem('coordinate');
        var map = new window.AMap.Map('container', {
          resizeEnable: true
        });
        map.plugin('AMap.Geolocation', () => {
          var geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new window.AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          window.AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
          window.AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });

        //解析定位结果
        function onComplete(data) {
          var str = data.position.getLng() + ',' + data.position.getLat();
          $.ajax({
            type: 'get',
            dataType: "jsonp",
            jsonp: "callback",
            url: 'http://restapi.amap.com/v3/geocode/regeo',
            data: {
              output: 'json',
              location: str,
              key: '9baeb4f7264baa46dbb5a7ac726ba7c6',
              radius: 1000,
              extensions: 'all'
            },
            success: function (res) {
              if (res.status !== '1') {
                Toast(res.info);
                return
              }
              sessionStorage.setItem('cityCode', res.regeocode.addressComponent.adcode);
              _this.getNewsList();
            }
          })
        }

        //解析定位错误信息
        function onError(data) {
          sessionStorage.setItem('cityCode', '4201');
          _this.getNewsList()
        }
      },
      toNewsInfo: function (id, type) {
        if (type == 0 || type == 1 || type == 2 || type == 10) {
          this.$router.push({path: '/newsInfo/' + id})
        } else if (type == 3 || type == 4) {
          this.$router.push({path: '/pictures/' + id})
        } else if (type == 5) {
          this.$router.push({path: '/videoInfo/' + id})
        }

        // this.$router.push({path:path})
        // /home/newsInfo/
      },
      getNewsList: function () {
        if(!this.isAjax){
          return
        }
        // var index = this.active
        // var channelId = this.cateId[index]
        var url = 'zxcity_restful/ws/rest';
        if (this.cateId == '0001') {
          var data = {
            cmd: 'cms_new/querArticleByRecommend',
            // data:JSON.stringify({"userId":"1","minbehottime":0,"tadrequire":false,'channelId':channelId}),
            data: JSON.stringify({
              "operation": this.operation,
              "releaseCity": sessionStorage.getItem('cityCode'),
//              "releaseCity": 4201,
              "userId": sessionStorage.getItem('userId'),
              "pagination": {
                "page": this.pageNo,
                "rows": 10
              }
            }),
            version: 1
          };
        } else if (this.cateId == '0002') {
          var data = {
            cmd: 'cms_new/queryHotArticelList',
            // data:JSON.stringify({"userId":"1","minbehottime":0,"tadrequire":false,'channelId':channelId}),
            data: JSON.stringify({
              "operation": "0",
              "releaseCity": sessionStorage.getItem('cityCode'),
//              "releaseCity": 4201,
              "userId": sessionStorage.getItem('userId'),
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
              'channelId': this.cateId,
              'releaseCity': sessionStorage.getItem('cityCode'),
//              'releaseCity': 4201,
              "pagination": {
                "page": this.pageNo,
                "rows": 10
              }
            }),
            version: 1
          };
        }
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.pageNo === 1) {
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            if (res.data.data.length == 0) {
              this.isNoData = true;
              //this.show = false;
              this.$emit('hideLoading', this.active);
              return
            }
            this.list = [];
            this.refreshDataLength = res.data.data.length;
            this.newsTotalNum = res.data.total;
            this.list = res.data.data;
            this.$emit('hideLoading', this.active);
          } else {
            this.list = this.list.concat(res.data.data);
            if(this.list.length === this.newsTotalNum){
              this.isAjax = false
            }
          }
        })
      },
      loadData: function () {
        this.operation = 0;
        this.pageNo = 1;
        // this.refresh = true;
        this.isAjax = true;
        this.getNewsList()
      },
      loadMore: function () {
        this.operation = 1;
        this.pageNo++;
        this.getNewsList()
      },
      scroll: function (pos) {
        this.y = pos.y
      }
    },
    filters: {
      timeFormat: function (time) {
        return time.substring(0, 10)
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        var height = $(window).height() - $('.logo').height() - $('.cateBox').height() - $('.mint-tabbar').height();
        $('.newsList').height(height);
        $('.noDataZW').height(height);
      })
    },
    watch: {
      $route: function (newValue, oldValue) {
        //解决从作者关注或者粉丝页面返回新闻列表页后，新闻列表页不能上下滑动的bug
        if (oldValue.path !== '/home' && newValue.path === '/home') {
          this.$refs.newsList.scrollTo(0, this.y < 0 ? this.y : 0, 0);
          setTimeout(() => {
            this.$refs.newsList.refresh();
          }, 300)
        }
        //当用户退出登录时跳转到首页，并刷新当前列表
        if(oldValue.path === '/mine'&& newValue.path === '/home'&&!sessionStorage.getItem('userId')){
          this.pageNo = 1;
          this.$refs.newsList.scrollTo(0,0,0);
          this.getNewsList()
        }
      },
    },
  }
</script>

<style scoped lang="less" type="text/less">
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
