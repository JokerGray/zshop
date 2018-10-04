<template>
  <div>
    <div class="dynamicMain">
      <div class="header ">
        <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
        <h4>动态</h4>
      </div>
      <div class="content ">
        <scroll
          v-show="!loading"
          :refreshDataLength="refreshDataLength"
          :pulldown="true"
          :pullup="true"
          :data="dynamicList"
          :lastRefreshTime="lastRefreshTime"
          :totalNum="friendUpdatesTotalNum"
          @scrollToEnd="loadMore"
          @pulldown="loadData"
          class="wrapper">
          <dynamic :list="dynamicList" @toInfo="toInfo"></dynamic>
          <div class="loading-wrapper"></div>
        </scroll>
        <loading v-if="loading"></loading>
        <div class="noDataZW" v-if="noDataZW"><noDataZW></noDataZW></div>
      </div>
    </div>
  </div>
</template>
<script>
  import dynamic from '../common/dynamic'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll.vue'
  import $ from 'jquery'
  import loading from '../common/loading.vue'
  import noDataZW from '../common/noDataZW'

  export default {
    components: {
      dynamic,
      scroll,
      loading,
      noDataZW
    },
    data: function () {
      return {
        dynamicList: [],
        pageNo: 1,
        lastRefreshTime: '',
        loading: true,
        refreshDataLength:'',
        friendUpdatesTotalNum:'',
        noDataZW:false,
        isAjax:true
      }
    },
    created: function () {
      this.getDynamicList();
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      getDynamicList: function () {
        if(!this.isAjax){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/queryFollowCmsDynamicResponse ',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo,
              "rows": 10
            }
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (this.pageNo == 1) {
            if(res.data.data.length==0){
              this.noDataZW = true;
              this.loading = false;
              return
            }
            this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.friendUpdatesTotalNum = res.data.total;
            this.refreshDataLength = res.data.data.length;
            this.dynamicList = [];
            this.dynamicList = res.data.data;
            this.loading = false
          } else {
            this.dynamicList = this.dynamicList.concat(res.data.data);
            if(this.dynamicList.length === this.friendUpdatesTotalNum){this.isAjax = false}
          }
        })
      },
      loadMore: function () {
        this.pageNo++;
        this.getDynamicList()
      },
      loadData: function () {
        this.pageNo = 1;
        this.isAjax = true;
        this.getDynamicList()
      },
      toInfo:function (type, articleId, previewImgType, authorId,cmsNewComment) {
        if(type==1||type==2||type==3||type==5||type==6){
          if(previewImgType==0||previewImgType==1||previewImgType==2){
            this.$router.push({path:'/newsInfo/'+articleId})
          }else if(previewImgType==3||previewImgType==4){
            this.$router.push({path:'/pictures/'+articleId})
          }else if(previewImgType==5){
            this.$router.push({path:'/videoInfo/'+articleId})
          }
        }else if(type==7){
          this.$router.push({path:'/author/authorPage/homePage/'+authorId})
        }else if (type == 9) {
          if (previewImgType == 10) {
            this.$router.push({path: '/answerInfo/' + articleId})
          }
        }else if (type == 15||type == 13||type == 14) {
          if (previewImgType == 12) {
            this.$router.push({path: '/singleAnswer/' + articleId})
          }
        }else if(type == 4){
          this.$router.push({path: '/commentReplyInfo?info='+JSON.stringify(cmsNewComment)})
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.wrapper').height($(window).height() - $('.header').height())
      })
    },
  }

</script>

<style scoped lang="less" type="text/less">
  .wrapper {
    overflow: hidden;
  }
  .header {
    width: 100%;
    height: 100/32rem;
    line-height: 100/32rem;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1/32rem solid #e5e5e5;
    background-color: #ffffff;
    z-index: 2;
    a {
      position: absolute;
      width: 100/32rem;
      height: 100/32rem;
      font-size: 36/32rem;
      text-align: center;
      color: #787878;
      top: 0;
      left: 0;
    }
    h4 {
      font-size: 34/32rem;
      color: #464256;
    }
  }
  .content {
    width: 100%;
    padding-top: 100/32rem;
    .noDataZW{
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: 0;
      left: 0;
    }
  }
</style>
