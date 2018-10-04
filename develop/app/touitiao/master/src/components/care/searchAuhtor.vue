<template>
  <div>
    <div class="searchBox">
      <scroll :showBottomTips="false" :showTopTip="false">
        <div class="searchKey" >
          <div class="searchHistory search_history">
            <div class="historyTop">
              <div class="historyTitle">
                <span class="iconfont icon-sousuo1"></span><span>历史记录</span>
              </div>
              <div class="historyDel">
                <span class="iconfont icon-huishouzhan" @click="clearHistoryKeyWords"></span>
              </div>
            </div>
            <div class="historyContent">
              <ul>
                <li v-for="(item,index) in historyKeyWords" :key="index" @click="goSearch(item.value)">{{item.value}}</li>
              </ul>
            </div>
          </div>
          <div class="searchHistory hotSearch">
            <div class="historyTop">
              <div class="historyTitle">
                <span class="iconfont icon-remen"></span><span>热门搜索</span>
              </div>
            </div>
            <div class="historyContent">
              <ul>
                <li v-for="(item,index) in hotSearchKeyWord" :key="index" @click="goSearch(item.searchRecordName)">{{item.searchRecordName}}</li>
                <!--<li @click="goSearch('旅行')">旅行</li>-->
              </ul>
            </div>
          </div>
        </div>
        <div class="loading-wrapper"></div>
      </scroll>
      <div class="searchResult">
        <!--<searchResult :keyWord="keyWord" ref="resultPage"></searchResult>-->
        <searAuthorResult :list="list" :keyWord="keyWord"></searAuthorResult>
      </div>
      <div class="associationSearch" v-show="showAssociationSearch">
        <associationSearch :keyWord="keyWord" :typeCode="1000" ref="associationSearch"></associationSearch>
      </div>
    </div>
  </div>
</template>
<script>
  import {Toast} from 'mint-ui'
  import {Indicator} from 'mint-ui'
  import $ from 'jquery'
  import scroll from '../common/BScroll'
  import searAuthorResult from './searchAuthor_result'
  import associationSearch from '../common/associationSearchResultTemp'
  import qs from 'qs'
  export default {
    props:['keyWord'],
    components: {
      searAuthorResult,
      associationSearch,
      scroll
    },
    created:function () {
      this.getHistoryList();
      this.getHotSearchKeyWord()
    },
    data: function () {
      return {
        historyKeyWords:[],
        pageNo:1,
        list:[],
        hotSearchKeyWord:[],
        showAssociationSearch:false
      }
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      getHotSearchKeyWord:function () {
        var url = 'zxcity_restful/ws/rest';
        var data = {
          cmd:'cms_new/queryHotSearchWord',
          data:JSON.stringify({
            "searchType": 0,
            "pagination": {
              "page": 1,
              "rows": 20
            }
          }),
          version: 1
        };
        Indicator.open();
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          Indicator.close();
          if(res.data.code!==1){
            Toast(res.data.msg);
            return
          }
          this.hotSearchKeyWord = res.data.data;
        })
      },
      clearKeyWord: function () {
        this.keyWord = ''
      },
      submit: function (keyWord) {
        if (keyWord=='') {
          Toast('搜索内容不能为空');
          return
        }
        var url = 'zxcity_restful/ws/rest';
        var data = {
          cmd: 'cms_new/querySearchArticleOrUser',
          data: JSON.stringify({
            "keyword": keyWord,
            "userId": sessionStorage.getItem('userId') || '',
            "releaseCity": sessionStorage.getItem('cityCode'),
            "typeCode": 1000,//1003视频 1001综合 1002图集 1000用户
            "pagination": {
              "page": this.pageNo,
              "rows": 10,
            }
          }),
          version: 1
        };
        Indicator.open();
        this.$axios.post(url,qs.stringify(data)).then((res)=>{
          Indicator.close();
          if(res.data.code!=1){
            Toast(res.data.msg);
            return
          }
          if(res.data.data.subscription){
            res.data.data.subscription.forEach((v,i)=>{
              v.subscriptionName = v.subscriptionName.replace(this.keyWord,'<span style="color: #9172fa;">'+this.keyWord+'</span>')
            })
          }
          this.list = res.data.data.subscription
        });
        // this.hide = false
        this.showResultBox();
        this.saveHistoryWord(keyWord)
        // if (this.$refs.resultPage) {
        //   this.$refs.resultPage.pageNo = 1
        //   this.$refs.resultPage.isAjax = true
        //   this.$refs.resultPage.getSearchResult()
        // }
      },
      goSearch:function (keyWord) {
        this.$parent.keyWord = keyWord;
        this.submit(keyWord);
        // this.hide = false
        // this.saveHistoryWord(keyWord)
      },
      saveHistoryWord:function (keyWord) {
        for(var i = 0;i<this.historyKeyWords.length;i++){
          if(this.historyKeyWords[i].value==keyWord){
            return
          }
        }
        this.historyKeyWords.unshift({value:keyWord});
        sessionStorage.setItem('historyKeyWords_author',JSON.stringify(this.historyKeyWords))
      },
      getHistoryList:function () {
        this.historyKeyWords = JSON.parse(sessionStorage.getItem("historyKeyWords_author")||'[]')
      },
      clearHistoryKeyWords:function () {
        this.historyKeyWords = [];
        sessionStorage.setItem('historyKeyWords_author','')
      },
      showResultBox:function () {
        $('.searchResult').show();
        setTimeout(function () {
          $('.searchResult').css('transform','translateX(0%)')
        },0)
      },
      closeResultBox:function () {
        this.$parent.keyWord = '';
        // $('.associationSearch').hide();
        this.showAssociationSearch = false;
        $('.searchResult').css('transform','translateX(100%)');
        setTimeout(function () {
          $('.searchResult').hide();
        },300)
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.wrapper').height($(window).height()-$('.header').height())
      })
    },
  }
</script>
<style scoped lang="less" type="text/less">
  .searchBox {
    width: 100%;
    overflow: hidden;
    .searchKey{
      background-color: #fff;
      .searchHistory {
        width: 100%;
        padding: 0 20/32rem;
        margin-top: 88/32rem;
        .historyTop {
          height: 100/32rem;
          line-height: 100/32rem;
          color: #333333;
          .historyTitle {
            float: left;
            span {
              font-size: 30/32rem;
              color: #333333;
              font-weight: 700;
            }
            .icon-sousuo1, .icon-remen {
              font-size: 40/32rem;
              font-weight: 400;
              margin-right: 10/32rem;
            }
          }
          .historyDel {
            float: right;
            .icon-huishouzhan {
              font-size: 40/32rem;
            }
          }
        }
        .historyContent {
          ul {
            width: 100%;
            overflow: hidden;
            li {
              width: 160/32rem;
              height: 60/32rem;
              line-height: 60/32rem;
              text-align: center;
              background-color: #f6f6f6;
              border-radius: 8/32rem;
              float: left;
              margin-bottom: 30/32rem;
              margin-right: 23/32rem;
            }
            li:nth-of-type(4n) {
              margin-right: 0;
            }
          }
        }
      }
      .search_history{
        margin-top: 0;
      }
    }
    .searchHistory {
      width: 100%;
      padding: 0 20/32rem;
      margin-top: 88/32rem;
      .historyTop {
        height: 100/32rem;
        line-height: 100/32rem;
        color: #333333;
        .historyTitle {
          float: left;
          span {
            font-size: 30/32rem;
            color: #333333;
            font-weight: 700;
          }
          .icon-sousuo1, .icon-remen {
            font-size: 40/32rem;
            font-weight: 400;
            margin-right: 10/32rem;
          }
        }
        .historyDel {
          float: right;
          .icon-huishouzhan {
            font-size: 40/32rem;
          }
        }
      }
      .historyContent{
        ul {
          width: 100%;
          overflow: hidden;
          li {
            width: 160/32rem;
            height: 60/32rem;
            line-height: 60/32rem;
            text-align: center;
            background-color: #f6f6f6;
            border-radius: 8/32rem;
            float: left;
            margin-bottom: 30/32rem;
            margin-right: 23/32rem;
            text-overflow:ellipsis;
            white-space:nowrap;
            overflow:hidden;
          }
          li:nth-of-type(4n) {
            margin-right: 0;
          }
        }
      }

    }
    .searchResult{
      position: absolute;
      width: 100%;
      height: 100%;
      top: -9%;
      left: 0;
      background-color: #fff;
      display: none;
      -webkit-transform: translateX(100%);
      -moz-transform: translateX(100%);
      -ms-transform: translateX(100%);
      -o-transform: translateX(100%);
      transform: translateX(100%);
      transition:all .3s;
      z-index: 3;
    }
    .associationSearch{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
  }
</style>
