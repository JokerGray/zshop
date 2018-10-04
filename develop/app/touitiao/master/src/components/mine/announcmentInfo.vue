<template>
  <div>
    <div class="announcmentInfo-header" ref="announcmentInfoHeader">
      <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
      <h4>公告详情</h4>
    </div>
    <scroll
      class="announcment-wrapper"
      ref="announcmentWrapper"
      :showBottomTips="false"
      :showTopTip="false">
      <div class="announcment-title" v-if="info">
        <h4>{{info.scCmsNoticeTitle}}</h4>
        <p>{{info.scCmsNoticeCreateTime}}</p>
      </div>
      <div class="announcment-content" v-html="info.scCmsNoticeContent" v-if="info"></div>
      <div class="loading-wrapper"></div>
    </scroll>

  </div>
</template>

<script>
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import $ from 'jquery'

  export default {
    components: {
      scroll
    },
    created: function () {
      this.getAnnouncmentInfo()
    },
    data: function () {
      return {
        info: null
      }
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      getAnnouncmentInfo: function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/selectNoticeA',
          data: JSON.stringify({
            "scCmsNoticeId": this.$route.params.announcmentId
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          this.info = res.data.data
        })
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.announcment-wrapper').height($(window).height()-$('.announcmentInfo-header').height())
      })
    },
  }
</script>

<style scoped lang="less" type="text/less">
  .announcmentInfo-header {
    width: 100%;
    height: 90/32rem;
    border-bottom: 1/32rem solid #e5e5e5;
    position: relative;
    background-color: #fff;
    z-index: 1;
    a {
      position: absolute;
      width: 90/32rem;
      height: 90/32rem;
      text-align: center;
      line-height: 90/32rem;
      font-size: 36/32rem;
      color: #333333;
    }
    h4 {
      font-size: 32/32rem;
      color: #333333;
      text-align: center;
      line-height: 90/32rem;
    }
  }

  .announcment-title {
    width: 100%;
    padding: 40/32rem 24/23rem;
    h4 {
      font-size: 34/32rem;
      color: #443C5B;
      line-height: 40/32rem;
    }
    p {
      font-size: 26/32rem;
      color: #999999;
      text-align: right;
      margin-top: 20/32rem;
    }
  }

  .announcment-content {
    padding: 0 24/32rem;
    /deep/ p {
      margin-left: 0 !important;
    }
  }
</style>
