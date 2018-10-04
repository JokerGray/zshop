<template>
  <div>
    <div class="maskBox" @click="closeShareBtns">
      <div class="shareBtns">
        <div class="top_btns">
          <div class="transform_btns"></div>
        </div>
        <div class="bottom_btns">
          <div class="transform_bottom">
            <!--<a href="javascript:;">-->
            <!--<span><img :src="require('../../../static/images/zx-10.fw.png')"></span>-->
            <!--<p>短信</p>-->
            <!--</a>-->
            <a href="javascript:;" class="copyBtn" :data-clipboard-text="href">
              <span><i class="iconfont icon-fuzhilianjie"></i></span>
              <p>复制链接</p>
            </a>
            <a href="javascript:;" v-show="path==='/video'" @click="Collection(info.articleId)">
              <img :src="toggleCollection==0?require('../../../static/images/news_2_videomore_icon_favor@2x.png'):require('../../../static/images/news_2_videomore_icon_favor_selected@2x.png')"
                   class="CollectionBtn">
              <!--<span v-show="toggleCollection==1">-->
              <!--<img :src="require('../../../static/images/news_2_videomore_icon_favor_selected@2x.png')" class="CollectionBtn">-->
              <!--</span>-->
              <p>收藏</p>
            </a>
            <a href="javascript:;" v-show="path==='/video'" @click="praise(info.articleId)">
              <img :src="isPraised===null?require('../../../static/images/news_2_videomore_icon_zan@2x.png'):require('../../../static/images/news_2_videomore_icon_zan_selected@2x.png')"
                   class="CollectionBtn">
              <p>点赞</p>
            </a>
            <a href="javascript:;" @click="toReport">
              <span><img :src="require('../../../static/images/zx-8.fw.png')" class="addBlack"></span>
              <p>举报</p>
            </a>
            <a href="javascript:;" @click="addBlackList(info.scSysUser?info.scSysUser.id:info.userId)">
              <span><img :src="require('../../../static/images/zx-9.fw.png')" class="addBlack"></span>
              <p>拉黑</p>
            </a>
            <a href="javascript:;" @click="toAuthorPage(info.scSysUser?info.scSysUser.id:info.userId)" v-if="info.scSysUser||info.userAuthorImg==null||info.userAuthorImg">
              <span><img :src="info.scSysUser?info.scSysUser.userpic:info.userAuthorImg||require('../../../static/images/mrtx.png')" class="authorImg"></span>
              <p>查看智享号</p>
            </a>
          </div>
        </div>
        <button @click="closeShareBtns" class="closeShareBtns">取消</button>
      </div>
      <div class="warningBox">
        <div class="warningTitle">
          <span @click="closeReportBox">×</span>
          <p>举报</p>
        </div>
        <div class="warningReason">
          <ul>
            <li @click="selectReason(0)">色情<span class="iconfont"></span></li>
            <li @click="selectReason(1)">低俗<span class="iconfont"></span></li>
            <li @click="selectReason(2)">政治<span class="iconfont"></span></li>
            <li @click="selectReason(3)">侵权<span class="iconfont"></span></li>
          </ul>
          <div class="otherReason" @click="writeOtherReason">其他原因<span class="iconfont icon-you"></span></div>
        </div>
        <button @click="sureReport()">确定</button>
      </div>
      <div class="otherReasonBox">
        <div class="otherReasonBox_title">
          <a href="javascript:;" class="iconfont icon-fanhui" @click="backSelectBox"></a>
          <p>举报</p>
        </div>
        <div class="textArea">
          <textarea placeholder="请输入举报原因..." v-model="otherReason"></textarea>
        </div>
        <div class="controlBtns">
          <a href="javascript:;" @click="closeShareBtns" class="cancelBtn">取消</a>
          <a href="javascript:;" @click="sureReport">确定</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import soshm from 'soshm'
  import Clipboard from 'Clipboard'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import $ from 'jquery'
  export default {
    props: ['info'],
    data: function () {
      return {
        href: '',
        newsInfo: '',
        reasons: [],
        otherReason: '',
        path: '',
        toggleCollection: 0,
        isPraised: null
      }
    },
    created: function () {
      this.path = this.$route.path;
    },
    methods: {
      showShareBtns: function () {
        $('.shareBtns').show();
        $('.maskBox').fadeIn(300);
        setTimeout(() => {
          $('.shareBtns').css('transform', 'translateY(0)');
          //解决从视频详情页回到视频列表页，点击分享按钮，底部菜单不隐藏的bug
          $('.mint-tabbar').fadeOut(300);
        }, 10)
      },
      closeShareBtns: function (e) {
        if (e === undefined) {
          //解决从视频详情页回到视频列表页，点击分享按钮，底部菜单不隐藏的bug
          $('.mint-tabbar').show();
          $('.shareBtns').css('transform', 'translateY(100%)');
          $('.warningBox').css('transform', 'translateY(100%)');
          $('.maskBox').fadeOut(300);
          this.clearSelected();
          setTimeout(() => {
            $('.shareBtns').hide();
            $('.warningBox').hide();
            $('.otherReasonBox').hide()
          }, 300);
          return
        }
        if (e.target.className === 'maskBox' || e.target.className === 'closeShareBtns' || e.target.className === 'cancelBtn') {
          //解决从视频详情页回到视频列表页，点击分享按钮，底部菜单不隐藏的bug
          $('.mint-tabbar').show();
          $('.shareBtns').css('transform', 'translateY(100%)');
          $('.warningBox').css('transform', 'translateY(100%)');
          $('.maskBox').fadeOut(300);
          this.clearSelected();
          setTimeout(() => {
            $('.shareBtns').hide();
            $('.warningBox').hide();
            $('.otherReasonBox').hide()
          }, 300)
        }
      },
      toAuthorPage: function (authorId) {
        this.$emit('toAuthorPage',authorId);
        this.closeShareBtns();
        this.$router.push({path: '/author/authorPage/homePage/' + authorId})
      },
      toReport: function () {
        $('.mint-tabbar').hide();
        $('.maskBox').fadeIn(300);
        $('.shareBtns').css('transform', 'translateY(100%)').hide();
        $('.warningBox').fadeIn(300);
        setTimeout(() => {
          $('.warningBox').css('transform', 'translateY(0)')
        }, 100)
      },
      closeReportBox: function () {
        //解决从视频详情页回到视频列表页，点击分享按钮，底部菜单不隐藏的bug
        $('.mint-tabbar').show();
        $('.warningBox').css('transform', 'translateY(100%)');
        $('.maskBox').fadeOut(300);
        $('.otherReasonBox').fadeOut(300);
        setTimeout(() => {
          $('.warningBox').hide();
        }, 300);
        this.clearSelected()
      },
      addBlackList: function (id) {
        if (!sessionStorage.getItem('userId')) {
          this.closeShareBtns();
          this.$parent.showLoginPage();
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'blacklist/addScUserBlackList',
          data: JSON.stringify({
            "blacklistUserId": id,
            "operationUserId": sessionStorage.getItem('userId'),
            "blackListType": 0,
            "blackListAppName": "24"
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            Toast('已将该用户移入黑名单');
            this.closeShareBtns();
            if (this.path === '/video') {
              // this.$router.go(0)
              this.$parent.$refs.videoList[0].list.length = 0;
              this.$parent.$refs.videoList[0].refreshDataLength = 0;
              this.$parent.$refs.videoList[0].getVideoList();
            } else if (this.$route.name === 'newsInfo') {
              // this.$router.push({path:'/home'});
              this.$parent.$refs.backBtn.goBack();
            } else if (this.$route.name === 'pictures') {
              this.$parent.goBack()
            } else if (this.$route.name === 'videoInfo') {
              this.$parent.$refs.backBtn.goBack();
              // setTimeout(()=>{
              //   this.$router.go(0)
              // },0)
            }
          } else {
            Toast(res.data.msg)
          }
        })
      },
      selectReason: function (index) {
        if ($($('.warningReason ul li span')[index]).hasClass('icon-icon-test')) {
          $($('.warningReason ul li span')[index]).removeClass('icon-icon-test')
        } else {
          $($('.warningReason ul li span')[index]).addClass('icon-icon-test')
        }
      },
      sureReport: function () {
        $('.warningReason ul li span').each((i, v) => {
          if ($(v).hasClass('icon-icon-test')) {
            this.reasons.push($(v).parent().text())
          }
        });
        if (this.otherReason !== '') {
          this.reasons.push(this.otherReason)
        }
        if (this.reasons.length == 0) {
          Toast('未选择或输入举报原因');
          this.closeReportBox();
          return
        }
        this.reasons.join(',');
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'base/addReportInformation',
          data: JSON.stringify({
            "reason": this.reasons.join(','),
            "reviewType": "21",
            "reviewId": this.info.articleId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code == 1) {
            Toast(res.data.msg)
          } else {
            Toast(res.data.msg)
          }
          this.reasons = [];
          this.otherReason = '';
          this.closeReportBox();
          this.clearSelected()
        })
      },
      writeOtherReason: function () {
        $('.warningBox').css('transform', 'translateY(100%)').fadeOut(300);
        $('.otherReasonBox').fadeIn(300);
        $('.textArea textarea').focus();
        this.clearSelected()
      },
      backSelectBox: function () {
        $('.otherReasonBox').fadeOut(300);
        $('.warningBox').fadeIn(300).css('transform', 'translateY(0)');
      },
      clearSelected: function () {
        $('.warningReason ul li span').each((i, v) => {
          $(v).removeClass('icon-icon-test')
        });
      },
      Collection: function (articleId) {
        if (!sessionStorage.getItem('userId')) {
          this.closeShareBtns();
          this.$parent.showLoginPage();
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/ArticleCollection',
          data: JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "articleId": articleId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code != 1) {
            Toast(res.data.msg);
            return
          }
          if (res.data.data.isEnshrined == 0) {
            Toast('取消收藏成功')
          } else {
            Toast('收藏成功')
          }
          this.toggleCollection = res.data.data.isEnshrined;
          this.$parent.$refs.videoList[0].getVideoList();
        })
      },
      praise: function (articleId) {
        if (!sessionStorage.getItem('userId')) {
          this.closeShareBtns();
          this.$parent.showLoginPage();
          return
        }
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/articlePraiseOrRetort',
          data: JSON.stringify({
            "praiseUser": sessionStorage.getItem('userId'),
            "praiseOrRetort": 1,
            "articleId": articleId
          }),
          version: 1
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code !== 1) {
            Toast(res.data.msg);
            return
          }
          if (res.data.data.isPraised == 0) {
            this.isPraised = null;
          } else if (res.data.data.isPraised == 1) {
            this.isPraised = res.data.data.isPraised;
          }
          this.$parent.$refs.videoList[0].getVideoList();
        })
      },
      importSharePlugins:function () {
        soshm('.transform_btns', {
          // 分享的链接，默认使用location.href
          url: this.path === '/video' ? location.origin + '/#/videoInfo/' + this.info.articleId : this.href,
          // 分享的标题，默认使用document.title
          title: this.info.articleTitle || this.info.scCmsArticleTitle,
          // 分享的摘要，默认使用<meta name="description" content="">content的值
          digest: '智享头条',
          // 分享的图片，默认获取本页面第一个img元素的src
          pic: this.info.scCmsResourcesList[0]?this.info.scCmsResourcesList[0].resourcesUr:'',
          // 默认显示的网站为以下六个个,支持设置的网站有
          // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
          sites: ['weixin', 'weixintimeline', 'qq', 'qzone', 'weibo', 'tqq', 'douban', 'yixin', 'renren']
        });
      },
      importCopyPlugins:function () {
        var clipboard = new Clipboard('.copyBtn');
        clipboard.on('success', (e) => {
          Toast('已复制到粘贴板');
          this.closeShareBtns()
        });
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        $('.maskBox').height($(window).height());
      })
    },
    updated: function () {
      this.$nextTick(function () {
        //分享插件配置
        this.importSharePlugins();
        //复制链接操作
        this.importCopyPlugins()
      })
    },
    watch: {
      info: function (val, old) {
        this.isPraised = val.isPraised;
        this.toggleCollection = val.isEnshrined;
        if (this.path === '/video') {
          this.href = location.origin + '/#/videoInfo/' + val.articleId
        } else {
          this.href = location.href;
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .maskBox {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1001;
    display: none;
    .shareBtns {
      width: 100%;
      height: 510/32rem;
      background-color: #f7f7f7;
      position: fixed;
      bottom: 0;
      left: 0;
      border-top: 1/32rem solid #d2d2d2;
      display: none;
      -webkit-transform: translateY(100%);
      -moz-transform: translateY(100%);
      -ms-transform: translateY(100%);
      -o-transform: translateY(100%);
      transform: translateY(100%);
      -webkit-transition: transform .3s;
      -moz-transition: transform .3s;
      -ms-transition: transform .3s;
      -o-transition: transform .3s;
      transition: transform .3s;
      padding: 0 10/32rem;
      .top_btns {
        width: 100%;
        height: 230/32rem;
        padding-top: 35/32rem;
        overflow: hidden;
        overflow-x: scroll;
        border-bottom: 2/32rem solid #e4e4e4;
        a {
          display: inline-block;
          float: left;
          text-align: center;
          padding: 10/32rem 18/32rem;
          span {
            display: inline-block;
            width: 110/32rem;
            height: 110/32rem;
            background-color: #fff;
            border-radius: 50%;
            text-align: center;
            margin-bottom: 20/32rem;

            img {
              width: 56/32rem;
              height: 56/32rem;
              margin-top: 27/32rem;
            }
          }
          p {
            font-size: 24/32rem;
            color: #666666;
          }
        }
        .transform_btns {
          white-space: nowrap;
          /*width: 200%;*/
          height: 100%;
          /deep/ .soshm-item {
            margin-left: 20/32rem;
            margin-right: 20/32rem;
            text-align: center;
            display: inline-block;
            float: none;
            .soshm-item-text {
              display: block;
              margin-top: 30/32rem;
              font-size: 26/32rem;
              color: #666666;
            }
            .soshm-item-icon {
              width: 65/32rem;
              height: 65/32rem;
            }
          }
        }
      }
      .bottom_btns {
        width: 100%;
        height: 200/32rem;
        overflow: hidden;
        overflow-x: scroll;
        .transform_bottom {
          white-space: nowrap;
          width: 100%;
          height: 100%;
          a {
            display: inline-block;
            margin: 13/32rem;
            text-align: center;
            height: 174/32rem;
            span {
              display: inline-block;
              width: 110/32rem;
              height: 110/32rem;
              background-color: #fff;
              border-radius: 50%;
              text-align: center;
              float: left;
              img {
                width: 55/32rem;
                height: 55/32rem;
                margin-top: 20/32rem;
                display: inline-block;
                &.authorImg {
                  width: 110/32rem;
                  height: 110/32rem;
                  border-radius: 50%;
                  margin-top: 0;
                }
                &.addBlack {
                  width: 50/32rem;
                  height: 60/32rem;
                  margin-top: 20/32rem;
                }

              }
              .icon-fuzhilianjie {
                display: block;
                font-size: 70/32rem;
                margin-top: 22/32rem;
                color: #666666;
              }
            }
            .CollectionBtn {
              width: 114/32rem;
              height: 114/32rem;
              margin: 0;
              float: left;
            }
            p {
              font-size: 26/32rem;
              color: #666666;
              text-align: center;
              margin-top: 130/32rem;
            }

          }
        }
      }
      button {
        width: 100%;
        height: 80/32rem;
        outline: none;
        background-color: #fff;
        border: none;
        border-top: 1/32rem solid #d2d2d2;
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 32/32rem;
        color: #666666;
      }
    }
    .warningBox {
      width: 100%;
      height: 640/32rem;
      background-color: #f8f8f8;
      position: fixed;
      bottom: 0;
      left: 0;
      -webkit-transform: translateY(100%);
      -moz-transform: translateY(100%);
      -ms-transform: translateY(100%);
      -o-transform: translateY(100%);
      transform: translateY(100%);
      -webkit-transition: transform .3s;
      -moz-transition: transform .3s;
      -ms-transition: transform .3s;
      -o-transition: transform .3s;
      transition: transform .3s;
      display: none;
      .warningTitle {
        width: 100%;
        height: 60/32rem;
        line-height: 60/32rem;
        position: relative;
        padding: 0 30/32rem;
        margin-top: 10/32rem;
        span {
          position: absolute;
          font-size: 40/32rem;
          color: #ff0648;
          width: 60/32rem;
          height: 60/32rem;
          font-family: SimSun;
          font-weight: 700;
        }
        p {
          text-align: center;
          font-size: 30/32rem;
          color: #000000;
        }
      }
      .warningReason {
        width: 100%;
        padding: 20/32rem 30/32rem 0 30/32rem;
        ul {
          width: 100%;
          li {
            width: 100%;
            height: 90/32rem;
            line-height: 90/32rem;
            font-size: 30/32rem;
            color: #000000;
            border-bottom: 1/32rem solid #e2e2e2;
            padding: 0 10/32rem;
            position: relative;
            span {
              position: absolute;
              right: 10/32rem;
              top: 10/32rem;
            }
          }
        }
        .otherReason {
          width: 100%;
          height: 90/32rem;
          line-height: 90/32rem;
          font-size: 30/32rem;
          color: #000000;
          padding: 0 10/32rem;
          span {
            font-weight: 700;
            margin-left: 10/32rem;
            font-size: 26/32rem;
            color: #333333;
          }
        }
      }
      button {
        width: 100%;
        height: 100/32rem;
        outline: none;
        border: none;
        background-color: #fff;
        font-size: 30/32rem;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    .otherReasonBox {
      width: 70%;
      height: 300/32rem;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      display: none;
      .otherReasonBox_title {
        width: 100%;
        height: 60/32rem;
        line-height: 60/32rem;
        position: relative;
        a {
          position: absolute;
          width: 60/32rem;
          height: 60/32rem;
          text-align: center;
          font-size: 30/32rem;
          color: #000000;
        }
        p {
          text-align: center;
          color: #000000;
          font-size: 30/32rem;
        }
      }
      .textArea {
        width: 100%;
        padding: 0 30/32rem;
        margin-top: 10/32rem;
        textarea {
          width: 100%;
          height: 140/32rem;
          resize: none;
          outline: none;
          border-color: #dddddd;
          border-radius: 6/32rem;
          padding: 10/32rem;
          -webkit-appearance: none;
        }
      }
      .controlBtns {
        width: 100%;
        height: 90/32rem;
        a {
          float: left;
          width: 50%;
          height: 100%;
          line-height: 90/32rem;
          text-align: center;
          font-size: 30/32rem;
          color: #333333;
        }
      }

    }
  }
</style>
