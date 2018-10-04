<template>
    <div>
        <div class="AllList" >
          <a href="javascript:;" class="cancelBtn" @click="closeCatePage(0)">取消</a>
          <a href="javascript:;" class="closeBtn" @click="closeCatePage(1)">×</a>
          <div class="myChannel">
            <div class="topTitle">
              <h4>我的频道<sub v-if="isDel">拖拽可以排序</sub></h4>
              <a href="javascript:;" class="complete" @click="complete">{{completeBtnVal}}</a>
            </div>
            <div class="myChannelContent">
              <a href="javascript:;">推荐</a>
              <a href="javascript:;">热点</a>
              <draggable v-model="myChannelList" :move="getdata" @update="datadragEnd">
                <transition-group>
                  <a href="javascript:;" v-for="(item,index) in myChannelList" :key="index">{{item.channelName}}<i class="iconfont icon-shanchu" @click="delItem(index)" v-if="isDel"></i></a>
                </transition-group>
              </draggable>
            </div>
          </div>
          <div class="recommendChannel">
            <h4>频道推荐</h4>
            <div class="recommendContent">
              <a href="javascript:;" v-for="(item,index) in myRecommendChannelList" @click="addItem(index)">{{item.channelName}}</a>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import $ from 'jquery'
    export default {
      components: {
        draggable
      },
      data:function () {
        return{
          completeBtnVal:'编辑',
          isDel:false,
          myChannelList:[],
          myRecommendChannelList:[],
        }
      },
      created:function () {
        this.addCateInit()
      },
      methods:{
        addCateInit:function () {
          if(this.$route.path==='/home'){
            this.myChannelList = JSON.parse(sessionStorage.getItem('newsMyChannel'));
            this.myRecommendChannelList = JSON.parse(sessionStorage.getItem('newsRecommendChannel'))
          }else if(this.$route.path==='/video'){
            this.myChannelList = JSON.parse(sessionStorage.getItem('videoMyChannel'));
            this.myRecommendChannelList = JSON.parse(sessionStorage.getItem('videoRecommendChannel'))
          }
        },
        delItem:function (index) {
          if(this.isDel){
            var delItem = this.myChannelList.splice(index,1);
            this.myRecommendChannelList.push(delItem[0]);
          }
        },
        addItem:function (index) {
          if(this.isDel){
            this.myChannelList.push(this.myRecommendChannelList[index]);
            this.myRecommendChannelList.splice(index,1)
          }
        },
        complete:function () {
          if(this.isDel){
            //将变化的数据传递给父组件home
            // this.myChannelList.unshift({channelId:'0001',channelName:'推荐'},{channelId:'0002',channelName:'热点'});
            this.$emit('sentMyChannel',{myChannel:this.myChannelList,recommendChannel:this.myRecommendChannelList});
            this.completeBtnVal = '编辑';
            this.isDel = false
          }else{
            this.completeBtnVal = '完成';
            this.isDel = true
          }
        },
        getdata (evt) {
          if(!this.isDel){
            return false
          }
          // console.log(evt.draggedContext.element.id)
        },
        datadragEnd (evt) {
          // console.log('拖动前的索引 :' + evt.oldIndex)
          // console.log('拖动后的索引 :' + evt.newIndex)
          // console.log(this.myChannelList);
        },
        showCatePage:function () {
          $('.AllList').show();
          $('header').fadeOut(300);
          $('.mint-tabbar').fadeOut(300);
          setTimeout(function () {
            $('.AllList').css('transform','translateY(0)')
          },100)
        },
        closeCatePage:function (type) {
          this.isDel = false;
          $('header').fadeIn(300);
          $('.mint-tabbar').fadeIn(300);
          $('.AllList').css('transform','translateY(100%)');
          setTimeout(function () {
            $('.AllList').hide();
          },300);
          if(type===1){
            if(this.$route.path==='/home'){
              this.$parent.$refs.newsList[0].list = [];
              this.$parent.active = 0;
              this.$parent.loadingShow = -1;
              this.$parent.listObj = {};
              // this.$parent.$refs.newsList[0].show = true;
              this.$parent.$refs.newsList[0].getNewsList();
              this.$parent.$refs.newsSlide.refresh();
            }else if(this.$route.path==='/video'){
              this.$parent.$refs.videoList[0].list = [];
              this.$parent.active = 0;
              this.$parent.loadingShow = -1;
              this.$parent.listObj = {};
              // this.$parent.$refs.newsList[0].show = true;
              this.$parent.$refs.videoList[0].getVideoList();
              this.$parent.$refs.videoSlide.refresh();
            }
          }
        }
      },
      mounted:function () {
        this.$nextTick(function () {
          $('.AllList').height($(window).height())
        })
      }
    }
</script>


<style scoped lang="less" type="text/less">
  .AllList{
    width:100%;
    background-color: #fff;
    /*<!--border-top:1/32rem solid #ccc;-->*/
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99999;
    -webkit-transform: translateY(100%);
    -moz-transform: translateY(100%);
    -ms-transform: translateY(100%);
    -o-transform: translateY(100%);
    transform: translateY(100%);
    -webkit-transition: all .3s;
    -moz-transition: all .3s;
    -ms-transition: all .3s;
    -o-transition: all .3s;
    transition: all .3s;
    display: none;
    .closeBtn{
      position: absolute;
      width: 80/32rem;
      height: 80/32rem;
      line-height: 80/32rem;
      text-align: center;
      right: 0;
      top: 20/32rem;
      font-size: 50/32rem;
      color: #333333;
    }
    .cancelBtn{
      position: absolute;
      top: 20/32rem;
      left: 20/32rem;
      width: 80/32rem;
      height: 80/32rem;
      line-height: 80/32rem;
      text-align: center;
      font-size: 28/32rem;
      color:#9178fa;
    }
    .myChannel{
      width: 100%;
      margin-top: 100/32rem;
      .topTitle{
        width: 100%;
        height: 80/32rem;
        line-height: 80/32rem;
        padding: 0 30/32rem;
        h4{
          float: left;
          font-size: 30/32rem;
          color: #333333;
          sub{
            font-size: 22/32rem;
            color: #999999;
            vertical-align: bottom;
            font-weight: 400;
            margin-left: 15/32rem;
          }
        }
        .complete{
          float: right;
          width: 80/32rem;
          height: 80/32rem;
          text-align: right;
          font-size: 26/32rem;
          color: #53537d;
        }
      }
      .myChannelContent{
        width: 100%;
        padding: 10/32rem 30/32rem 0 30/32rem;
        overflow: hidden;
        a{
          float: left;
          position: relative;
          width: 160/32rem;
          height: 56/32rem;
          line-height: 56/32rem;
          text-align: center;
          font-size: 28/32rem;
          color: #9178fa;
          border: 1/32rem solid #e9e3fe;
          border-radius: 8/32rem;
          margin-right: 6.2/32rem;
          margin-left: 6.2/32rem;
          margin-bottom: 16/32rem;
          i{
            position: absolute;
            font-style: normal;
            top: -20/32rem;
            right: -10/32rem;
            font-size: 26/32rem;
          }
        }
      }

    }
    .recommendChannel{
      width: 100%;
      margin-top: 60/32rem;
      h4{
        font-size: 30/32rem;
        color: #333333;
        padding:0 30/32rem;
      }
      .recommendContent{
        width: 100%;
        margin-top: 30/32rem;
        padding: 0 30/32rem;
        height: 600/32rem;
        a{
          float: left;
          position: relative;
          width: 160/32rem;
          height: 56/32rem;
          line-height: 56/32rem;
          text-align: center;
          font-size: 28/32rem;
          color: #9178fa;
          border: 1/32rem solid #e9e3fe;
          border-radius: 8/32rem;
          margin-right: 16/32rem;
          margin-bottom: 16/32rem;
          &:nth-of-type(4n){
            margin-right: 0;
          }
          i{
            position: absolute;
            font-style: normal;
            top: -20/32rem;
            right: -10/32rem;
            font-size: 26/32rem;
          }
        }
      }
    }
  }
</style>
