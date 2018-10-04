<template>
  <div>
    <div class="searchBox">
      <div class="header">
        <a href="javascript:;" class="iconfont icon-fanhui" @click="goBack"></a>
        <form action="#" @submit.prevent="submit">
          <input type="search" placeholder="请输入关键词" v-model.trim="keyWord" ref="searchText" @input="input">
        </form>
        <span class="del iconfont icon-shanchu" @click="clearKeyWord"></span>
        <span class="searchIco iconfont icon-sousuo1"></span>
        <a href="javascript:;" class="searchBtn" @click="search">{{btnText}}</a>
      </div>
      <scroll v-show="hide&&!showAssociationSearchResult" :showBottomTips="false" :showTopTip="false">
        <div class="searchKey" >
          <div class="searchHistory">
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
                <!--<li @click="goSearch('木心')">木心</li>-->
              </ul>
            </div>
          </div>
        </div>
        <div class="loading-wrapper"></div>
      </scroll>
      <div class="searchResult" v-if="!hide">
        <searchResult :keyWord="keyWord" ref="resultPage"></searchResult>
      </div>
      <div class="associationSearchResult" v-show="showAssociationSearchResult">
        <associationSearch :keyWord="keyWord" :typeCode="1001" ref="associationSearchResult"></associationSearch>
      </div>
    </div>
  </div>
</template>
<script>
  import searchResult from './searchResult'
  import $ from 'jquery'
  import qs from 'qs'
  import {Toast} from 'mint-ui'
  import {Indicator} from 'mint-ui'
  import scroll from '../common/BScroll'
  import associationSearch from '../common/associationSearchResultTemp'
  export default {
    components: {
      searchResult,
      scroll,
      associationSearch
    },
    created:function () {
      this.getHistoryList();
      this.getHotSearchKeyWord();
    },
    data: function () {
      return {
        hide: true,
        btnText: '搜索',
        keyWord: '',
        historyKeyWords:[],
        hotSearchKeyWord:[],
        showAssociationSearchResult:false,
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
            "searchType": 1,
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
      search: function () {
        if (this.hide) {
          if (this.keyWord == '') {
            Toast('搜索内容不能为空');
            return
          }
          this.hide = false;
          this.btnText = '取消';
          this.saveHistoryWord()
        } else {
          this.hide = true;
          this.btnText = '搜索';
          this.keyWord = ''
        }
      },
      clearKeyWord: function () {
        this.keyWord = '';
        this.showAssociationSearchResult = false;
        this.$refs.associationSearchResult.resultList = [];
      },
      submit: function () {
        if (this.keyWord == '') {
          Toast('搜索内容不能为空');
          return
        }
        this.hide = false;
        this.showAssociationSearchResult = false;
        this.btnText = '取消';
        this.saveHistoryWord();
        if (this.$refs.resultPage) {
          this.$refs.resultPage.pageNo = 1;
          this.$refs.resultPage.isAjax = true;
          this.$refs.resultPage.getSearchResult()
        }
      },
      goSearch:function (keyWord) {
        this.keyWord = keyWord;
        this.hide = false;
        this.showAssociationSearchResult = false;
        this.btnText = '取消';
        this.saveHistoryWord()
      },
      saveHistoryWord:function () {
        for(var i = 0;i<this.historyKeyWords.length;i++){
          if(this.historyKeyWords[i].value==this.keyWord){
            return
          }
        }
        this.historyKeyWords.unshift({value:this.keyWord});
        sessionStorage.setItem('historyKeyWords',JSON.stringify(this.historyKeyWords))
      },
      getHistoryList:function () {
        this.historyKeyWords = JSON.parse(sessionStorage.getItem("historyKeyWords")||'[]')
      },
      clearHistoryKeyWords:function () {
        this.historyKeyWords = [];
        sessionStorage.setItem('historyKeyWords','')
      },
      input:function () {
        if(this.keyWord===''){
          this.btnText = '搜索';
          this.showAssociationSearchResult = false;
          this.$refs.associationSearchResult.resultList = [];
        }else{
          this.showAssociationSearchResult = true;
          this.hide = true;
          // this.$refs.associationSearchResult.pageNo = 1;
          // this.$refs.associationSearchResult.refreshDataLength = 0;
          // this.$refs.associationSearchResult.articleList = [];
          // this.$refs.associationSearchResult.getAssociationSearch(this.keyWord);
          this.$refs.associationSearchResult.init(this.keyWord)
        }
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        $('.searchBox').height($(window).height());
        $('.wrapper').height($(window).height()-$('.header').height());
      })
    }
  }
</script>
<style scoped lang="less" type="text/less">
  .searchBox {
    width: 100%;
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    overflow: hidden;
    background-color: #fff;
    .header {
      width: 100%;
      height: 88/32rem;
      line-height: 88/32rem;
      border-bottom: 1/32rem solid #e5e5e5;
      background-color: #fff;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
      .icon-fanhui {
        float: left;
        width: 60/32rem;
        height: 88/32rem;
        text-align: center;
        color: #787878;
        font-size: 32/32rem;
      }
      input {
        float: left;
        width: 603/32rem;
        height: 60/32rem;
        border: none;
        outline: none;
        background-color: #f6f6f6;
        border-radius: 8/32rem;
        padding-left: 60/32rem;
        margin-top: 14/32rem;
        font-size: 26/32rem;
        -webkit-appearance:none !important;
        &::-webkit-search-cancel-button {
          display: none;
        }
      }
      .searchBtn {
        float: left;
        width: 87/32rem;
        height: 88/32rem;
        font-size: 28/32rem;
        text-align: center;
        color: #333333;
      }
      .del {
        position: absolute;
        top: 4/32rem;
        right: 108/32rem;
        font-size: 36/32rem;
        color: #bfbfbf;
      }
      .searchIco {
        position: absolute;
        top: 4/32rem;
        left: 70/32rem;
        font-size: 36/32rem;

      }
    }
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
      padding-top: 169/32rem;
    }
    .associationSearchResult{
      position: absolute;
      top: 90/32rem;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
  }
</style>
