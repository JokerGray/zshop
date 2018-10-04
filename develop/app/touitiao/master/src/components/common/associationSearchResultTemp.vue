<template>
    <div>
      <scroll
        ref="AssociationSearchWrapper"
        class="AssociationSearchWrapper"
        :data="list"
        :pulldown="true"
        :pullup="true"
        :refreshDataLength="refreshDataLength"
        :lastRefreshTime="lastRefreshTime"
        :totalNum="totalNum"
        :rows="row"
        @scrollToEnd="loadMore"
        @pulldown="loadData">
        <ul>
          <li v-for="(item,index) in resultList" :key=index @click="goSearch(item.text)" v-html="item.html"></li>
        </ul>
        <div class="loading-wrapper"></div>
      </scroll>
    </div>
</template>

<script>
  import qs from 'qs'
  import $ from 'jquery'
  import {Toast} from 'mint-ui'
  import scroll from './BScroll'
    export default {
      props:['keyWord','typeCode'],
      components:{
        scroll
      },
      data:function () {
        return{
          resultList:[],
          refreshDataLength:-1,
          lastRefreshTime:'',
          totalNum:-1,
          pageNo:1,
          row:20,
          list:[],
          isAjax:true
        }
      },
      methods:{
        getAssociationSearch:function (keyWord) {
          if(keyWord===''||!this.isAjax){return}
          var url = 'zxcity_restful/ws/rest';
          var data = {
            cmd:'cms_new/querySearchArticleOrUser',
            data:JSON.stringify({
              "keyword": keyWord,
              "userId": sessionStorage.getItem('userId'),
              "releaseCity": sessionStorage.getItem('cityCode'),
              "typeCode": this.typeCode,
              "pagination": {
                "page": this.pageNo,
                "rows": this.row
              }
            })
          };
          this.$axios.post(url,qs.stringify(data)).then((res)=>{
            if(res.data.code!==1){
              Toast(res.data.msg);
              return
            }
            if(this.pageNo===1){
              this.lastRefreshTime = (new Date().getHours() >= 10 ? new Date().getHours() : ('0' + new Date().getHours())) + ':' + (new Date().getMinutes() >= 10 ? new Date().getMinutes() : ('0' + new Date().getMinutes()));
              this.resultList = [];
              if(res.data.data.subscription){
                res.data.data.subscription.forEach((v,i)=>{
                  // console.log(v);
                  var str = v.subscriptionName;
                  str = str.replace(this.keyWord,'<span style="color: #9171F9;">'+this.keyWord+'</span>')
                  this.resultList.push({text:v.subscriptionName,html:str})
                });
              }
              if(res.data.data.articleList){
                res.data.data.articleList.forEach((v,i)=>{
                  var str = v.articleTitle;
                  str = str.replace(this.keyWord,'<span style="color: #9171F9;">'+this.keyWord+'</span>')
                  this.resultList.push({text:v.articleTitle,html:str})
                })
              }
              this.list = this.typeCode == 1001?res.data.data.articleList:(res.data.data.subscription!==null?res.data.data.subscription:[])
              this.refreshDataLength = this.typeCode == 1001?res.data.data.articleList.length:(res.data.data.subscription!==null?res.data.data.subscription.length:0);
              this.totalNum = this.typeCode == 1001?res.data.total:(res.data.data.subscription!==null?res.data.data.subscription.length:0)
            }else{
              this.list = this.typeCode == 1001?this.list.concat(res.data.data.articleList):this.list.concat([]);
              if(res.data.data.articleList){
                res.data.data.articleList.forEach((v,i)=>{
                  var str = v.articleTitle;
                  str = str.replace(this.keyWord,'<span style="color: #9171F9;">'+this.keyWord+'</span>')
                  this.resultList.push({text:v.articleTitle,html:str})
                })
              }
              if(this.totalNum === this.list.length){
                this.isAjax = false
              }
            }
          })
        },
        loadMore:function () {
          this.pageNo++;
          this.getAssociationSearch(this.keyWord)
        },
        loadData:function () {
          this.isAjax = true;
          this.pageNo = 1;
          this.getAssociationSearch(this.keyWord)
        },
        goSearch:function (val) {
          this.$parent.goSearch(val);
        },
        init:function (keyWord) {
          if(keyWord === this.keyWord){
            return
          }
          this.pageNo = 1;
          this.refreshDataLength = 0;
          this.list = [];
          this.isAjax = true;
          this.getAssociationSearch(keyWord);
        }
      },
      mounted:function () {
        this.$nextTick(function () {
          $('.AssociationSearchWrapper').height($(window).height()-$('.header').height())
        })
      },
      //watch:{
        //keyWord:function (val,old) {
          // this.pageNo = 1;
          // this.refreshDataLength = 0;
          // this.articleList = [];
          // this.getAssociationSearch();
        //}
      //}
    }
</script>

<style scoped lang="less" type="text/less">
  ul{
    width: 100%;
    height: 100%;
    padding: 0 30/32rem;
    li{
      width: 100%;
      height: 80/32rem;
      line-height: 80/32rem;
      border-bottom: 1/32rem solid #e5e5e5;
      text-overflow:ellipsis;
      white-space:nowrap;
      overflow:hidden;
      font-size: 28/32rem;
    }
  }
</style>
