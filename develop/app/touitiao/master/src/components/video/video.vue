<template>
  <div class="videoApp">
    <div class="videoContent">
      <!--<span class="close" @click="close" v-if="closeShow">×</span>-->
      <div class="newsCate">
        <cateList :cateList="videoCate" :active="active" @sent="getActive"></cateList>
        <span class="addCate" @click="toShow"></span>
      </div>
      <cube-slide
        @change="getPage"
        :initial-index="active"
        :loop="false"
        :auto-play="false"
        :threshold="0.4"
        :allowVertical="false"
        ref="videoSlide">
        <cube-slide-item v-for="(item,index) in videoCate" :key="index">
          <div class="pageZW" v-if="index!==loadingShow&&!listObj[item.channelId]"><loading></loading></div>
          <videoList  :cate="item"
                      :active="active"
                      v-if="index==isShow||listObj[item.channelId]"
                      ref="videoList"
                      @hideLoading="hideLoading"
                      @showControlBtns="showControlBtns">
          </videoList>
        </cube-slide-item>
      </cube-slide>
      <addCate @sentMyChannel="getMyChannel" ref="videoCateList"></addCate>
    </div>
    <shareModule ref="videoListShareModule" :info="shareData"></shareModule>
    <div class="loginBox"><needLogin></needLogin></div>
  </div>
</template>

<script>
  import videoList from './videoList.vue'
  import addCate from '../common/addCate.vue'
  import loading from '../common/loading.vue'
  import cateList from '../common/cateList.vue'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import shareModule from '../common/shareModule'
  import needLogin from '../common/needLogin'
  // import slide from '../common/slider'
  export default {
    components: {
      videoList,
      addCate,
      loading,
      cateList,
      // slide,
      shareModule,
      needLogin
    },
    data: function () {
      return {
        active: 0,
        isShow: 0,//控制视频列表的显示和隐藏
        loadingShow:-1,
        videoList: [],//视频列表
        videoCate:[{channelId:'0001',channelName:'推荐'},{channelId:'0002',channelName:'热点'}],
        shareData:{},
        listObj:{}
        //show: false,//控制编辑分类列表页面的显示和隐藏
        //hotTime: 0,//记录下一页数据的时间戳
        //closeShow: false,//控编辑分类列表中关闭按钮的显示和隐藏
      }
    },
    created: function () {
      this.videoInit();
    },
    methods: {
      videoInit:function () {
        if(sessionStorage.getItem('videoMyChannel')){
          this.videoCate = this.videoCate.concat(JSON.parse(sessionStorage.getItem('videoMyChannel')))
        }else {
          this.getVideoCateList()
        }
      },
      getActive:function (active) {
        this.active = active
      },
      getPage:function (val) {
        this.active = val
      },
      toShow: function () {
        this.$refs.videoCateList.showCatePage()
      },
      getVideoCateList:function(){
        var data = {
          cmd:'cms_back/selectAllChannel',
          data:JSON.stringify({
            videoChannel:1
          })
        };
        this.$axios.post('/zxcity_restful/ws/rest',qs.stringify(data)).then((res)=>{
          if(res.data.code===1){
            // res.data.data.forEach((v,i)=>{
            //   this.videoCate.push({channelName:v.channelName,channelId:v.channelId})
            // })
            this.videoCate = this.videoCate.concat(res.data.data.splice(0, 10));
            this.recommendChannel = res.data.data.slice(10,res.data.data.length);
            sessionStorage.setItem('videoMyChannel',JSON.stringify(this.videoCate.slice(2)));
            sessionStorage.setItem('videoRecommendChannel',JSON.stringify(this.recommendChannel));
            this.$refs.videoCateList.addCateInit();
            this.$refs.videoSlide.refresh();
          }else{
            Toast(res.data.msg)
          }
        })
      },
      // 这个方法没有在此组件使用
      getVideoList: function (hottime) {
        var data = {
          cmd: 'cms_new/queryReVideoList',
          data: JSON.stringify({"userId": "1", "minbehottime": hottime, "tadrequire": false}),
          version: 1
        };
        var url = '/zxcity_restful/ws/rest';
        if (hottime == 0) {
          this.videoCate.forEach(() => {
            this.$axios.post(url, qs.stringify(data)).then((res) => {
              this.videoList.push(res.data.data.list);
              this.hotTime = res.data.data.next
            })
          })
        } else {
          this.$axios.post(url, qs.stringify(data)).then((res) => {
            var index = this.active;
            this.videoList[index] = this.videoList[index].concat(res.data.data.list);
            this.videoList = JSON.parse(JSON.stringify(this.videoList));
            this.hotTime = res.data.data.next
          });
          this.loading = false
        }
      },
      getMyChannel:function (val) {
        //接收子组件变化的数据，重新复制给this.cateList，使我的新闻分类列表随之变化
        this.videoCate = JSON.stringify(val.myChannel);
        this.videoCate = [{channelId:'0001',channelName:'推荐'},{channelId:'0002',channelName:'热点'}].concat(JSON.parse(this.videoCate));
        //更新sessionStorage中分类列表数据
        sessionStorage.setItem('videoMyChannel',JSON.stringify(val.myChannel));
        sessionStorage.setItem('videoRecommendChannel',JSON.stringify(val.recommendChannel))
      },
      hideLoading:function (val) {
        this.loadingShow = val;
      },
      showControlBtns:function (item) {
        this.shareData = item;
        this.$refs.videoListShareModule.showShareBtns()
      },
      showLoginPage:function () {
        $('.loginBox').show();
        $('.mint-tabbar').hide();
        $('header').hide();
        setTimeout(function () {
          $('.loginBox').css({'top':'0'});
        },0);
      },
      closeLoginPage:function () {
        $('.loginBox').css({'top':'100%'});
        $('.mint-tabbar').show();
        $('header').show();
        setTimeout(function () {
          $('.loginBox').hide();
        },300);
      },
    },
    mounted:function () {
      this.$nextTick(function () {
        // 避免从新闻详情页刷新后返回新闻列表页空白的问题
        setTimeout(()=>{
          this.$refs.videoSlide.refresh();
        },100)
      })
    },
    updated:function () {
      this.$nextTick(function () {
        $('.videoMask').each((i,v)=>{
          $(v).html('')
        })
      })
    },
    watch: {
      active: function (newValue, oldValue) {
        this.isShow = newValue;
      },
    },
  }
</script>


<style scoped lang="less" type="text/less">
  .pageZW{
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: relative;
  }

  .videoContent{
    width: 100%;
    margin-top: 90/32rem;
    position: absolute;
    top: 90/32rem;
    z-index: 1;
  }

  .newsCate {
    background-color: #fff;
    width:100%;
    height:70/32rem;
    /*position: relative;*/
    /*<!--margin-bottom: 10/32rem;-->*/
    position: fixed;
    top:90/32rem;
    left: 0;
    z-index:4;
    .addCate {
      position: absolute;
      width: 80/32rem;
      height: 90/32rem;
      background-color: #fff;
      background-image: url(../../../static/images/xiala.png);
      background-position: center center;
      background-size: 50%;
      background-repeat: no-repeat;
      z-index: 10;
      top: 0;
      right: 0;
      font-size: 45/32rem;
      text-align: center;
      line-height: 90/32rem;
    }
  }

  .videoContent {
    .mint-tab-container{
      margin-top:50/32rem;
      .mint-tab-container-item {
        > span {
          display: block;
          margin-top: 40%;
          margin-left: 35%;
        }
      }
    }
  }

  /*去除轮播图的dots*/
  .videoContent /deep/ .cube-slide-dots {
    display: none;
  }

  .loginBox{
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    transition: all .3s;
  }
</style>
