<template>
  <div>
    <div class="questionManage-top">
      <a href="javascript:;" class="iconfont icon-fanhui backBtn" @click="goBack"></a>
      <div class="NavTab">
        <a href="javascript:;" :class="{active:active===0}" @click="changeType(0)">我的提问</a>
        <a href="javascript:;" :class="{active:active===1}" @click="changeType(1)">等我来答</a>
        <a href="javascript:;" :class="{active:active===2}" @click="changeType(2)">我答过的</a>
      </div>
    </div>
    <div class="questionManage-contentBox">
      <div class="mineQuestions" v-show="active===0">
        <scroll class="mineQuestions-wrapper"
                :pulldown="true"
                :pullup="true"
                :data="myQuestionList"
                :refreshDataLength="refreshDataLength_question"
                :lastRefreshTime="lastRefreshTime_question"
                :totalNum="totalNum_question"
                @scrollToEnd="loadMore"
                @pulldown="loadData">
          <ul>
            <li v-for="(item,index) in myQuestionList" :key="index" v-if="5!==item.imgType">
              <leftDel textTips="删除问题" @deleteItem="deleteItem(index,item.articleId)" :index="index" ref="leftDel">
                <div class="tem1" v-if="1==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                  <div class="newsLeft">
                    <h4>{{item.articleTitle}}</h4>
                    <div class="newsBottom">
                      <div class="left">
                        <span>{{item.scCmsSubscription?item.scCmsSubscription.subscriptionName:''}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="newsRight">
                    <img v-lazy="{src:item.scCmsResourcesList.length!==0?item.scCmsResourcesList[0].resourcesUrl:'',loading:require('../../../static/images/zw166.png')}"/>
                  </div>
                  <div class="articleDataBox">
                    <span>回答{{item.answerNumber}}</span>
                    <span>阅读{{item.articleBrowser}}</span>
                    <span>转发{{item.forwardNumber}}</span>
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
                        <span>{{item.scCmsSubscription.subscriptionName}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                    <div class="articleDataBox">
                      <span>回答{{item.answerNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>转发{{item.forwardNumber}}</span>
                    </div>
                   </span>
                </div>
                <div class="tem3" v-if="3==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                    <h4>{{item.articleTitle}}</h4>
                    <div class="newsImg">
                      <img v-lazy="{src:item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl,loading:require('../../../static/images/zw750.png')}"/>
                      <span class="imgNum"><i></i>{{item.scCmsResourcesList.length-1}}图</span>
                    </div>
                    <div class="newsBottom">
                      <div class="left">
                        <span>{{item.scCmsSubscription.subscriptionName}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                    <div class="articleDataBox">
                      <span>回答{{item.answerNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>转发{{item.forwardNumber}}</span>
                    </div>
                  </span>
                </div>
                <div class="tem5" v-if="5==item.previewImgType">
                  <span @click="toNewsInfo(item.scCmsResourcesList[0].articleId,item.previewImgType)">
                    <h4>{{item.articleTitle}}</h4>
                    <div class="newsImg">
                      <img v-lazy="{src:item.scCmsResourcesList[0].resourcesUrl,loading:require('../../../static/images/zw750.png')}"/>
                      <span class="playIcon"></span>
                      <span class="videoTime">{{item.scCmsResourcesList[0].videoPlayTime}}</span>
                    </div>
                    <div class="newsBottom">
                      <div class="left">
                        <span>{{item.scCmsSubscription.subscriptionName}}</span>
                        <span class="iconfont icon-chakan">&nbsp;{{item.articleBrowser}}</span>
                        <span class="iconfont icon-xinxi">&nbsp;{{item.commentNum}}</span>
                      </div>
                      <div class="right">
                        <span>{{item.releaseTime.substring(0,10)}}</span>
                      </div>
                    </div>
                    <div class="articleDataBox">
                      <span>回答{{item.answerNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>转发{{item.forwardNumber}}</span>
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
                          <span>{{item.scCmsSubscription.subscriptionName}}</span>
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
                       <img
                         v-lazy="{src:item.scCmsResourcesList.length!==0?item.scCmsResourcesList[item.scCmsResourcesList.length-1].resourcesUrl:'',loading:require('../../../static/images/zw166.png')}"/>
                    </div>
                    <div class="articleDataBox">
                      <span>回答{{item.answerNumber}}</span>
                      <span>阅读{{item.articleBrowser}}</span>
                      <span>转发{{item.forwardNumber}}</span>
                    </div>
                  </span>
                </div>
              </leftDel>
            </li>
          </ul>
          <div class="loading-wrapper"></div>
        </scroll>
        <div class="noDataZW" v-if="noDataZW_question"><noDataZW></noDataZW></div>
      </div>
      <div class="needAnswer" v-show="active===1">
        <scroll class="needAnswer-wrapper"
                :pulldown="true"
                :pullup="true"
                :data="waiterForAnswerList"
                :refreshDataLength="refreshDataLength_need"
                :lastRefreshTime="lastRefreshTime_need"
                :totalNum="totalNum_need"
                @scrollToEnd="loadMore"
                @pulldown="loadData">
          <p class="totalNum" v-if="totalNum_need>=0">共{{totalNum_need}}条</p>
          <div class="needAnswerList">
            <ul>
              <li v-for="(item,index) in waiterForAnswerList" :key="index" @click="toAnswerInfo(item.articleId)">
                <div class="authorDesc">
                  <img :src="item.scSysUser.userpic">
                  <div class="authorName">
                    <h4>{{item.scSysUser.username}}<sub>邀请你回答</sub></h4>
                    <p>{{item.reviewerTime}}</p>
                  </div>
                </div>
                <div class="temp1" v-if="item.previewImgType == 11">
                  <div class="questionContent">
                    <h4 class="questionTitle">{{item.articleTitle}}</h4>
                    <div class="questionPic">
                      <img :src="v.resourcesUrl" v-for="(v,i) in item.scCmsResourcesList" :key="i">
                    </div>
                    <div class="questionOtherMsg">
                      <p><span class="iconfont icon-shuxie"></span><span>回答：{{item.answerNumber}}</span></p>
                      <p>{{item.releaseTime}}</p>
                    </div>
                  </div>
                </div>
                <div class="temp2" v-if="item.previewImgType == 10">
                  <div class="questionContent">
                    <div class="questionDesc">
                      <h4 class="questionTitle">
                        {{item.articleTitle}}
                      </h4>
                      <div class="questionOtherMsg">
                        <p><span class="iconfont icon-shuxie"></span><span>回答：{{item.answerNumber}}</span></p>
                        <p>{{item.releaseTime}}</p>
                      </div>
                    </div>
                    <div class="questionPic">
                      <img :src="item.scCmsResourcesList[0].resourcesUrl">
                    </div>
                  </div>
                </div>
                <a href="javascript:;" class="toAnswerBtn" @click.stop="toAnswer(item)"><img :src="require('../../../static/images/wendaxiangqing_icon_huida@2x.png')"></a>
              </li>
              <!--<li>-->
              <!--<div class="authorDesc">-->
              <!--<img src="http://oss-cn-hangzhou.aliyuncs.com/tsnrhapp/user/photos/1c2a3108b06df7a075cde52f4ed7a9c3.png">-->
              <!--<div class="authorName">-->
              <!--<h4>夜晚不黑<sub>邀请你回答</sub></h4>-->
              <!--<p>2018-03-23 10:47</p>-->
              <!--</div>-->

              <!--</div>-->
              <!--<div class="temp1" v-if="false">-->
              <!--<div class="questionContent">-->
              <!--<h4 class="questionTitle">斯柯达几号放假开会时间快点发时刻记得回复进口纱斯柯达几号放假开会时间快点发时刻记得回复进口纱</h4>-->
              <!--<div class="questionPic">-->
              <!--<img src="http://image3.suning.cn/uimg/b2c/newcatentries/0070107620-000000000675486147_1_220x220.jpg">-->
              <!--<img src="http://image3.suning.cn/uimg/b2c/newcatentries/0070167766-000000010120633248_1_220x220.jpg">-->
              <!--<img src="http://life.southmoney.com/tuwen/UploadFiles_6871/201802/20180228111216170.gif">-->
              <!--</div>-->
              <!--<div class="questionOtherMsg">-->
              <!--<p><span class="iconfont icon-shuxie"></span><span>回答：50</span></p>-->
              <!--<p>2018-03-23 11:15</p>-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="temp2" v-if="true">-->
              <!--<div class="questionContent">-->
              <!--<div class="questionDesc">-->
              <!--<h4 class="questionTitle">-->
              <!--索拉卡点击付款了萨达减肥卡你设计索拉卡点击付款了萨达计费你说的卡积分卡拿到可视对讲浪费空间撒对讲浪费空间撒-->
              <!--</h4>-->
              <!--<div class="questionOtherMsg">-->
              <!--<p><span class="iconfont icon-shuxie"></span><span>回答：50</span></p>-->
              <!--<p>2018-03-23 11:15</p>-->
              <!--</div>-->
              <!--</div>-->
              <!--<div class="questionPic">-->
              <!--<img src="http://life.southmoney.com/tuwen/UploadFiles_6871/201802/20180228111216170.gif">-->
              <!--</div>-->
              <!--</div>-->
              <!--</div>-->
              <!--<a href="javascript:;" class="toAnswerBtn"><img :src="require('../../../static/images/wendaxiangqing_icon_huida@2x.png')"></a>-->
              <!--</li>-->
            </ul>
          </div>
          <div class="loading-wrapper"></div>
        </scroll>
        <div class="noDataZW" v-if="noDataZW_need"><noDataZW></noDataZW></div>
      </div>
      <div class="AnsweredBox" v-show="active===2">
        <scroll class="mineAnswer-wrapper"
                :pulldown="true"
                :pullup="true"
                :data="myAnswerList"
                :refreshDataLength="refreshDataLength_answer"
                :lastRefreshTime="lastRefreshTime_answer"
                :totalNum="totalNum_answer"
                @scrollToEnd="loadMore"
                @pulldown="loadData">
          <p class="totalNum" v-if="totalNum_answer>=0">共{{totalNum_answer}}条</p>
          <div class="AnsweredList">
            <ul>
              <li v-for="(item,index) in myAnswerList" :key="index">
                <div class="status">
                  <p v-if="item.isExamine === 2">
                    <span class="iconfont icon-naozhong"></span>
                    <span>待审核</span>
                  </p>
                  <p v-if="item.isExamine === 1" class="green">
                    <span class="iconfont icon-iconfontzhizuobiaozhun023139"></span>
                    <span>审核通过</span>
                  </p>
                  <p v-if="item.isExamine === 0" class="red">
                    <span class="iconfont icon-gantanhao"></span>
                    <span>审核未通过</span>
                  </p>
                </div>
                <div class="questionTitle">
                  <h4>{{item.articleTitle}}</h4>
                </div>
                <div class="sign"><img :src="require('../../../static/images/icon_wodehuida@2x.png')"></div>
                <div class="answerContent" v-html="item.articleContent"></div>
                <div class="answerOtherMsg">
                  <p>
                    <span class="iconfont icon-chakan1">{{item.articleBrowser}}</span>
                    <span class="iconfont icon-xinxi">{{item.commentNum}}</span>
                  </p>
                  <p>{{item.releaseTime}}</p>
                </div>
                <div class="controlBtns">
                  <a href="javascript:;" @click="toEditAnswer(item.articleId,item.articleTitle,item.articleContent)">编辑</a>
                  <a href="javascript:;" @click="deleteItem(index,item.articleId)">删除</a>
                </div>
              </li>
            </ul>
          </div>
          <div class="loading-wrapper"></div>
        </scroll>
        <div class="noDataZW" v-if="noDataZW_answer"><noDataZW></noDataZW></div>
      </div>
    </div>
    <div class="loading" v-if="loading"><loading></loading></div>
  </div>
</template>

<script>
  import leftDel from '../common/leftDel'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import scroll from '../common/BScroll'
  import $ from 'jquery'
  import noDataZW from '../common/noDataZW'
  import { Indicator } from 'mint-ui'
  import loading from '../common/loading'
  export default {
    components: {
      leftDel,
      scroll,
      noDataZW,
      loading
    },
    data: function () {
      return {
        loading:true,
        active: 0,
        myQuestionList: [],
        pageNo_question:1,
        lastRefreshTime_question:'',
        refreshDataLength_question:-1,
        totalNum_question:-1,
        isAjax_question:true,
        noDataZW_question:false,

        myAnswerList:[],
        pageNo_answer:1,
        lastRefreshTime_answer:'',
        refreshDataLength_answer:-1,
        totalNum_answer:-1,
        isAjax_answer:true,
        noDataZW_answer:false,

        waiterForAnswerList:[],
        pageNo_need:1,
        lastRefreshTime_need:'',
        refreshDataLength_need:-1,
        totalNum_need:-1,
        isAjax_need:true,
        noDataZW_need:false
      }
    },
    created: function () {
      this.getMyQuestionList();
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      changeType: function (val) {
        this.active = val;
        if(this.active === 0&&this.myQuestionList.length === 0){
          Indicator.open('加载中...');
          this.getMyQuestionList();
        }else if(this.active === 1&&this.waiterForAnswerList.length === 0){
          Indicator.open('加载中...');
          this.getNeedAnswerList()
        }else if(this.active === 2&&this.myAnswerList.length === 0){
          Indicator.open('加载中...');
          this.getMyAnswerList()
        }
      },
      getMyQuestionList: function () {
        if(!this.isAjax_question){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/questionList',
          data: JSON.stringify({
            "IsDraft": "",
            "isExamine": "",
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo_question,
              "rows": 10
            }
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          Indicator.close();
          if (res.data.code !== 1) {
            Toast(res.data.smg);
            return
          }
          if(this.pageNo_question === 1){
            this.loading = false;
            if(res.data.data.length === 0){
              this.noDataZW_question = true
            }
            this.lastRefreshTime_question = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) +
              ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.totalNum_question = res.data.total;
            this.refreshDataLength_question = res.data.data.length;
            this.myQuestionList = res.data.data;
          }else{
            this.myQuestionList = this.myQuestionList.concat(res.data.data);
            if(this.myQuestionList.length === this.totalNum_question){
              this.isAjax_question = false
            }
          }
        })
      },
      toNewsInfo: function (articleId, previewImgType) {
        this.$router.push({path: '/answerInfo/' + articleId});
      },
      deleteItem: function (index, articleId) {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/deleteQuestion',
          data: JSON.stringify({
            articleId: articleId
          })
        };
        this.$axios.post(url, qs.stringify(data)).then((res) => {
          if (res.data.code === 1) {
            if(this.active === 0){
              this.myQuestionList.splice(index, 1);
            }else if(this.active === 2){
              this.myAnswerList.splice(index, 1);
              this.totalNum_answer--;
            }
            Toast('删除成功')
          } else {
            Toast(res.data.msg)
          }
        })

      },
      getMyAnswerList:function () {
        if(!this.isAjax_answer){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/answeredList',
          data:JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo_answer,
              "rows": 10
            }
          })
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          Indicator.close();
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          if(this.pageNo_answer===1){
            if(res.data.data.length === 0){
              this.noDataZW_answer = true
            }
            this.lastRefreshTime_answer = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) +
              ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.refreshDataLength_answer = res.data.data.length;
            this.totalNum_answer = res.data.total;
            this.myAnswerList = res.data.data
          }else{
            this.myAnswerList = this.myAnswerList.concat(res.data.data);
            if(this.myAnswerList.length === this.totalNum_answer){
              this.isAjax_answer = false
            }
          }


        })
      },
      getMyAnswerList_1:function () {
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/answeredList',
          data:JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": 1,
              "rows": this.pageNo_answer*10
            }
          })
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          Indicator.close();
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          this.lastRefreshTime_answer = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) +
            ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
          // this.refreshDataLength_answer = res.data.data.length;
          this.totalNum_answer = res.data.total;
          this.myAnswerList = res.data.data
        })
      },
      getNeedAnswerList:function () {
        if(!this.isAjax_need){return}
        var url = '/zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/waitForAnswerList',
          data:JSON.stringify({
            "userId": sessionStorage.getItem('userId'),
            "pagination": {
              "page": this.pageNo_need,
              "rows": 20
            }
          })
        };
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          Indicator.close();
          if(res.data.code!==1){
            Toast(res.date.msg);
            return
          }
          if(this.pageNo_need === 1){
            if(res.data.data.length === 0){
              this.noDataZW_need = true
            }
            this.lastRefreshTime_need = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) +
              ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
            this.refreshDataLength_need = res.data.data.length;
            this.totalNum_need = res.data.total;
            this.waiterForAnswerList = res.data.data
          }else{
            this.waiterForAnswerList = this.waiterForAnswerList.concat(res.data.data);
            if(this.waiterForAnswerList.length === this.totalNum_need){
              this.isAjax_need = false
            }
          }
        })
      },
      loadMore:function () {
        if(this.active===0){
          this.pageNo_question++;
          this.getMyQuestionList()
        }else if(this.active===1){
          this.pageNo_need++;
          this.getNeedAnswerList()
        }else if(this.active===2){
          this.pageNo_answer++;
          this.getMyAnswerList()
        }
      },
      loadData:function () {
        if(this.active===0){
          this.pageNo_question = 1;
          this.isAjax_question = true;
          this.getMyQuestionList()
        }else if(this.active===1){
          this.pageNo_need = 1;
          this.isAjax_need = true;
          this.getNeedAnswerList()
        }else if(this.active===2){
          this.pageNo_answer = 1;
          this.isAjax_answer = true;
          this.getMyAnswerList()
        }
      },
      toEditAnswer:function (articleId,articleTitle,articleContent) {
        sessionStorage.setItem('articleContent',articleContent);
        this.$router.push({path:'/editMyAnswer/'+articleId+'/'+articleTitle})
      },
      toAnswerInfo:function (articleId) {
        this.$router.push({path:'/answerInfo/'+articleId})
      },
      toAnswer:function (item) {
        sessionStorage.setItem('questionInfo',JSON.stringify(item));
        this.$router.push({path:'/toAnswerPage/'});
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.mineQuestions-wrapper').height($(window).height()-$('.questionManage-top').height());
        $('.mineAnswer-wrapper').height($(window).height()-$('.questionManage-top').height());
        $('.needAnswer-wrapper').height($(window).height()-$('.questionManage-top').height());
      })
    },
    watch:{
      $route:function (val, old) {
        if(val.name === 'mineQuestionManage'&&old.name === 'editMyAnswer'&&this.active === 2){
          this.getMyAnswerList_1()
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .questionManage-top {
    width: 100%;
    height: 90/32rem;
    border-bottom: 1/32rem solid #eeeeee;
    position: relative;
    background-color: #fff;
    z-index: 1;
    .backBtn {
      position: absolute;
      width: 90/32rem;
      height: 90/32rem;
      line-height: 90/32rem;
      font-size: 36/32rem;
      color: #333333;
      text-align: center;
    }
    .NavTab {
      width: 100%;
      height: 100%;
      line-height: 90/32rem;
      text-align: center;
      a {
        display: inline-block;
        height: 100%;
        font-size: 34/32rem;
        color: #999999;
        margin: 0 30/32rem;
        &.active {
          border-bottom: 4/32rem solid #333;
          color: #333333;
        }
      }
    }
  }

  .questionManage-contentBox {
    .mineQuestions {
      ul {
        padding-left: 0;
        margin: 0;
        background-color: #fff;
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
          .tem2 {
            background-color: #fff;
            > span {
              display: block;
              border-bottom: 1/32rem solid #EDEDED;
              padding-bottom: 20/32rem;
              overflow: hidden;
              h4 {
                font-size: 32/32rem;
                font-weight: 400;
                color: #443C5B;
                text-align: justify;
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
                  margin: 0 20/32rem;
                }
              }
              .newsBottom {
                margin-bottom: 20/32rem;
                display: flex;
                .left {
                  flex: 7;
                }
                .right {
                  flex: 2;
                }
                span {
                  font-size: 24/32rem;
                  padding: 0 10/32rem;
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
              padding-bottom: 20/32rem;
              overflow: hidden;
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
              }
              .newsImg {
                width: 100%;
                margin-top: 20/32rem;
                position: relative;
                img {
                  width: 703/32rem;
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
                    margin-top: 10/32rem;
                    margin-left: 25/32rem;
                  }
                }
              }
              .newsBottom {
                display: flex;
                margin: 20/32rem 0;
                .left {
                  flex: 7;
                }
                .right {
                  flex: 2;
                  text-align: right;
                }
                span {
                  font-size: 24/32rem;
                  padding: 0 10/32rem;
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
              padding-bottom: 20/32rem;
              overflow: hidden;
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
              }
              .newsImg {
                width: 100%;
                margin-top: 20/32rem;
                position: relative;
                img {
                  width: 703/32rem;
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
                  flex: 7;
                }
                .right {
                  flex: 2;
                  text-align: right;
                }
                span {
                  font-size: 24/32rem;
                  padding: 0 10/32rem;
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
                      &:first-of-type {
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
          .articleDataBox {
            width: 100%;
            height: 70/32rem;
            background-color: #d2d2d2;
            float: left;
            margin-top: 20/32rem;
            span {
              float: left;
              width: 33.3333%;
              height: 50/32rem;
              font-size: 26/32rem;
              text-align: center;
              line-height: 50/32rem;
              color: #ffffff;
              margin-top: 10/32rem;
              &:nth-of-type(2) {
                border-left: 1/32rem solid #fff;
                border-right: 1/32rem solid #fff;
              }
            }
          }
        }
      }
    }
    .needAnswer {
      .totalNum {
        width: 100%;
        height: 66/32rem;
        line-height: 66/32rem;
        font-size: 30/32rem;
        color: #999999;
        background-color: #f8f8f8;
        padding-left: 24/32rem;
      }
      .needAnswerList {
        width: 100%;
        ul {
          li {
            overflow: hidden;
            padding-bottom: 25/32rem;
            border-bottom: 20/32rem solid #eeeeee;
            margin-top: 24/32rem;
            .authorDesc {
              width: 100%;
              height: 100%;
              overflow: hidden;
              padding-left: 20/32rem;
              img {
                width: 80/32rem;
                height: 80/32rem;
                border-radius: 50%;
                float: left;
              }
              .authorName {
                float: left;
                margin-left: 25/32rem;
                h4 {
                  font-size: 34/32rem;
                  color: #3c3b3b;
                  sub {
                    font-size: 28/32rem;
                    color: #999999;
                    margin-left: 10/32rem;
                  }
                }
                p {
                  font-size: 22/32rem;
                  color: #787878;
                  margin-top: 25/32rem;
                }
              }
            }
            .temp1 {
              .questionContent {
                width: 100%;
                padding: 0 23/32rem;
                margin-top: 28/32rem;
                .questionTitle {
                  font-size: 32/32rem;
                  color: #53537d;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  line-height: 38/32rem;
                }
                .questionPic {
                  font-size: 0;
                  margin-top: 20/32rem;
                  img {
                    width: 221/32rem;
                    height: 221/32rem;
                    &:nth-of-type(2) {
                      margin: 0 20/32rem;
                    }
                  }
                }
                .questionOtherMsg {
                  height: 50/32rem;
                  line-height: 50/32rem;
                  font-size: 0;
                  p {
                    display: inline-block;
                    width: 50%;
                    font-size: 20/32rem;
                    color: #bdbdbd;
                    .icon-shuxie {
                      font-size: 32/32rem;
                      vertical-align: middle;
                      margin-right: 10/32rem;
                    }
                    &:last-of-type {
                      text-align: right;
                    }
                  }
                }
              }
            }
            .temp2 {
              .questionContent {
                width: 100%;
                height: 166/32rem;
                position: relative;
                padding: 0 23/32rem;
                margin: 15/32rem 0;
                .questionDesc {
                  margin-right: 189/32rem;
                  height: 100%;
                  position: relative;
                  .questionTitle {
                    font-size: 32/32rem;
                    color: #53537d;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    line-height: 38/32rem;
                  }
                  .questionOtherMsg {
                    font-size: 0;
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    p {
                      display: inline-block;
                      width: 50%;
                      font-size: 20/32rem;
                      color: #bdbdbd;
                      .icon-shuxie {
                        font-size: 32/32rem;
                        vertical-align: middle;
                        margin-right: 10/32rem;
                      }
                      &:last-of-type {
                        text-align: right;
                      }
                    }
                  }
                }
                .questionPic {
                  position: absolute;
                  font-size: 0;
                  top: 0;
                  right: 23/32rem;
                  img {
                    width: 166/32rem;
                    height: 166/32rem;

                  }
                }
              }
            }
            .toAnswerBtn {
              float: right;
              width: 120/32rem;
              height: 55/32rem;
              margin-right: 23/32rem;
              margin-top: 10/32rem;
              img {
                width: 120/32rem;
                height: 55/32rem;
              }
            }
          }
        }
      }
    }
    .AnsweredBox{
      .totalNum {
        width: 100%;
        height: 66/32rem;
        line-height: 66/32rem;
        font-size: 30/32rem;
        color: #999999;
        background-color: #f8f8f8;
        padding-left: 24/32rem;
      }
      .AnsweredList{
        width: 100%;
        ul{
          li{
            padding: 0 24/32rem;
            border-bottom: 20/32rem solid #f8f8f8;
            .status{
              width: 100%;
              height: 50/32rem;
              line-height: 50/32rem;
              border-bottom: 1/32rem solid #dadada;
              font-size: 24/32rem;
              color: #facf27;
              span:first-of-type{
                font-size: 44/32rem;
                vertical-align: middle;
              }
              .red{
                color: #fb666e;
              }
              .green{
                color: limegreen;
              }
            }
            .questionTitle{
              margin-top: 24/32rem;
              h4{
                font-size: 32/32rem;
                color: #53537d;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                line-height: 38/32rem;
              }
            }
            .sign{
              font-size: 0;
              margin: 22/32rem 0;
              img{
                width: 93/32rem;
                height: 31/32rem;
              }
            }
            .answerContent{
              font-size: 28/32rem;
              color: #333333;
              line-height: 40/32rem;
              /deep/img{
                width: 351/32rem!important;
                height: 243/32rem;
              }
            }
            .answerOtherMsg{
              margin-top: 25/32rem;
              overflow: hidden;
              p{
                font-size: 20/32rem;
                color: #bdbdbd;
                float: left;
                width: 50%;
                span{
                  font-size: 20/32rem;
                  margin-right: 20/32rem;
                  &::before{
                    font-size: 24/32rem;
                  }
                }
                &:last-of-type{
                  text-align: right;
                }
              }
            }
            .controlBtns{
              text-align: right;
              a{
                display: inline-block;
                font-size: 28/32rem;
                color: #333333;
                padding: 30/32rem 40/32rem;
              }
            }
          }
        }
      }
    }
  }

  .noDataZW{
    position: absolute;
    width: 100%;
    height: 93%;
    bottom:0;
    left: 0;
  }
  .loading{
    position: absolute;
    width: 100%;
    height: 93%;
    bottom: 0;
    left: 0;
  }
</style>
