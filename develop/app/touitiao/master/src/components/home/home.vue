<template>
  <div>
    <div class="homeContent">
      <!--<span class="close" @click="close" v-if="closeShow">×</span>-->
      <div class="newsCate" >
        <cate :cateList="cateList" :active="active" @sent="getActive" ref="cate_list"></cate>
        <span class="addCate" @click="toShow"></span>
      </div>
      <cube-slide @change="getPage"
                  :initial-index="active"
                  :loop="false"
                  :auto-play="false"
                  :threshold="0.4"
                  :allowVertical="false"
                  ref="newsSlide">
        <cube-slide-item v-for="(item,index) in cateList" :key="index">
          <!--<div class="pageZW" v-if="index!==isShow"></div>-->
          <div class="pageZW" v-if="index!==loadingShow&&!listObj[item.channelId]"><loading></loading></div>
          <newsList v-bind="{active:active,cateId:item.channelId}" v-if="index==isShow||listObj[item.channelId]" ref="newsList" @hideLoading="hideLoading"></newsList>
        </cube-slide-item>
      </cube-slide>
      <addCate @sentMyChannel="getMyChannel" ref="homeCateList"></addCate>
    </div>
  </div>
</template>
<script>
  import newsList from './newsList.vue'
  import addCate from '../common/addCate.vue'
  import loading from '../common/loading.vue'
  import cate from '../common/cateList.vue'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  // import slide from '../common/slider'
  export default {
    components: {
      newsList,
      addCate,
      loading,
      cate,
      // slide
    },
    data: function () {
      return {
        active: 0,
        cateList: [{channelId:'0001',channelName:'推荐'},{channelId:'0002',channelName:'热点'}],//我的分类列表
        newsList: [],//新闻列表数据
        isShow: 0,
        loadingShow:-1,
        listObj:{},
        recommendChannel:[],//推荐列表
        //cateId: [],//分类列表项ID
        //show: false,
        //closeShow: false,
      }
    },
    methods: {
      homeInit:function () {
        if(sessionStorage.getItem('newsMyChannel')){
          this.cateList = this.cateList.concat(JSON.parse(sessionStorage.getItem('newsMyChannel')))
        }else {
          // this.cateList = []
          this.getCateList()
        }
      },
      getActive: function (active) {
        this.active = active
      },
      changePage: function (id) {
        this.active = id;
        this.type = id
      },
      getPage:function (val) {
        this.active = val
      },
      getCateList: function () {
        var data = {
          cmd: 'cms_back/selectAllChannel',
          // data: JSON.stringify({"videoChannel": 1}),
          data: JSON.stringify({'videoChannel':0}),
          version: 1,
        };
        this.$axios.post('/zxcity_restful/ws/rest', qs.stringify(data)).then((res) => {
          if(res.data.code!=1){
            Toast(res.data.msg);
            return
          }
          this.cateList = this.cateList.concat(res.data.data.slice(0, 10));
          this.recommendChannel = res.data.data.slice(10,res.data.data.length);
          //将获取的我的分类列表数据和推荐分类列表数据存到sessionStorage中，让子组件addCate可以获取到
          sessionStorage.setItem('newsMyChannel',JSON.stringify(this.cateList.slice(2)));
          sessionStorage.setItem('newsRecommendChannel',JSON.stringify(this.recommendChannel));
          // for (var i = 0; i < this.cateList.length; i++) {npm
          //   this.cateId.push(this.cateList[i].channelId)
          // }
          // this.getNewsList(this.cateId)
          //分类列表数据回来后，初始化编辑列表的数据
          this.$refs.homeCateList.addCateInit();
          //分类列表数据回来后，初始化主页轮播图结构
          this.$refs.newsSlide.refresh();
        })
      },
      toShow: function () {
        this.$refs.homeCateList.showCatePage()
      },
      //这个方法在这个组件中没有使用
      getNewsList: function (type) {
        for (var i = 0; i < type.length; i++) {
          var data = {
            cmd: 'cms_new/queryArticleByChannel',
            // data: JSON.stringify({"userId": "1", "minbehottime": 0, "tadrequire": false, 'channelId': type[i]}),
            data: JSON.stringify({
              'channelId': type[i],
              'releaseCity': sessionStorage.getItem('cityCode'),
              "pagination": {
                "page": 1,
                "rows": 10
              }
            }),
            version: 1
          }
          this.$axios.post('zxcity_restful/ws/rest', qs.stringify(data)).then((res) => {
            this.newsList.push(res.data.data)
          })

        }
      },
      getMyChannel:function (val) {
        //接收子组件变化的数据，重新复制给this.cateList，使我的新闻分类列表随之变化
        this.cateList = JSON.stringify(val.myChannel);
        this.cateList = [{channelId:'0001',channelName:'推荐'},{channelId:'0002',channelName:'热点'}].concat(JSON.parse(this.cateList));
        //更新sessionStorage中分类列表数据
        sessionStorage.setItem('newsMyChannel',JSON.stringify(val.myChannel));
        sessionStorage.setItem('newsRecommendChannel',JSON.stringify(val.recommendChannel))
      },
      hideLoading:function (val) {
        this.loadingShow = val
      }
    },
    created: function () {
      this.homeInit();
    },
    mounted:function () {
      this.$nextTick(function () {
        // 避免从新闻详情页刷新后返回新闻列表页空白
        setTimeout(()=>{
          this.$refs.newsSlide.refresh();
        },100)
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
  .newsCate {
    background-color: #fff;
    width:100%;
    height:70/32rem;
    position: fixed;
    top:90/32rem;
    left: 0;
    z-index:4;
    .addCate {
      position: absolute;
      width: 80/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      background-color: #fff;
      background-image: url(../../../static/images/xiala.png);
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 50%;
      z-index: 10;
      top: 0;
      right: 0;
      font-size: 45/32rem;
      text-align: center;
    }
  }
  .homeContent {
    width:100%;
    position: absolute;
    top:170/32rem;
    left: 0;
    .mint-tab-container{
      /*<!--margin-top:30/32rem;-->*/
    }
  }
  /*去除轮播图的dots*/
  .homeContent /deep/ .cube-slide-dots {
    display: none;
  }
</style>
