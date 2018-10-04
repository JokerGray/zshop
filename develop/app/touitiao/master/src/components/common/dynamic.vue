<template>
    <div>
      <ul>
        <li
          v-for="(item,index) in list"
          :key="index"
          @click="goInfo(item.scCmsDynamicType,
          item.article.articleId,
          item.article.previewImgType,
          item.cmsFollowSubscription?item.cmsFollowSubscription.userId:'',
          item.cmsNewComment
          )">
          <div class="temp1" v-if="1==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p>{{item.article.articleTitle?item.article.articleTitle:'该文章已被删除或屏蔽'}}</p>
              <!--<p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>-->
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp2" v-if="2==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p v-if="item.article.scCmsResourcesList.length!=0">{{item.article.articleTitle}}</p>
              <p v-if="item.article.scCmsResourcesList.length==0">该文章已被屏蔽或删除</p>
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp3" v-if="3==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
              <span>{{item.scCmsDynamicCreatetime}}</span>
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p v-if="item.article.scCmsResourcesList.length!=0"> {{item.article.articleTitle}}</p>
              <p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp4" v-if="4==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
              <span>{{item.scCmsDynamicCreatetime}}</span>
            </div>
            <div class="updateContent">
              <p v-if="item.cmsNewComment"><span>{{item.cmsNewComment.userName}}:</span><span>{{item.cmsNewComment.commentComment}}</span></p>
              <p v-if="!item.cmsNewComment">该评论已被删除</p>
            </div>
            <div class="replyContent">
              <p v-if="item.cmsReplyNewComment"><span>{{item.cmsReplyNewComment.userName}}:</span><span>{{item.cmsReplyNewComment.commentComment}}</span></p>
              <p v-if="!item.cmsReplyNewComment">该回复已被删除</p>
            </div>
          </div>
          <div class="temp5" v-if="5==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p v-if="item.article.scCmsResourcesList.length!=0"> {{item.article.articleTitle}}</p>
              <p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>
            </div>
            <div class="replyContent">
              <p v-if="item.cmsNewComment"><span>{{item.cmsNewComment.userName}}:</span><span>{{item.cmsNewComment.commentComment}}</span></p>
              <p v-if="!item.cmsNewComment">该评论已被删除或屏蔽</p>
            </div>
          </div>
          <div class="temp6" v-if="6==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p v-if="item.article.scCmsResourcesList.length!=0"> {{item.article.articleTitle}}</p>
              <p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp7" v-if="7==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
              <span>{{item.scCmsDynamicCreatetime}}</span>
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.cmsFollowSubscription.subscriptionImgUrl?item.cmsFollowSubscription.subscriptionImgUrl:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/mrtx.png')}">
              <!--<img :src="item.cmsFollowSubscription.subscriptionImgUrl" alt="">-->
              <p>{{item.cmsFollowSubscription.subscriptionName}}</p>
              <span>{{item.cmsFollowSubscription.followNum}}人关注</span>
            </div>
          </div>
          <div class="temp9" v-if="9==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p>{{item.article.articleTitle?item.article.articleTitle:'该问题已被删除或屏蔽'}}</p>
              <!--<p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>-->
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp12" v-if="12==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p>{{item.article.articleTitle?item.article.articleTitle:'该问题已被删除或屏蔽'}}</p>
              <!--<p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>-->
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp13" v-if="13==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p> {{item.article.articleTitle}}</p>
              <!--<p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>-->
            </div>
            <div class="careNum">
              <p><span>{{item.cmsNewComment.userName}}</span><span>：{{item.cmsNewComment.commentComment}}</span></p>
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp14" v-if="14==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p>{{item.article.articleTitle?item.article.articleTitle:'该问题已被删除或屏蔽'}}</p>
              <!--<p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>-->
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
          <div class="temp15" v-if="15==item.scCmsDynamicType">
          <div class="authorMsg">
            <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
            <div>
              <h4>{{item.scSysUser.username}}</h4>
              <p>{{item.scCmsTitle}}</p>
            </div>
            <span>{{item.scCmsDynamicCreatetime}}</span>
            <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
          </div>
          <div class="updateContent">
            <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
            <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
            <p>{{item.article.articleTitle?item.article.articleTitle:'该问题已被删除或屏蔽'}}</p>
            <!--<p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>-->
          </div>
          <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
            <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
          </div>
        </div>
          <div class="temp0" v-if="null==item.scCmsDynamicType">
            <div class="authorMsg">
              <img v-lazy="{src:item.scSysUser.userpic?item.scSysUser.userpic:require('../../../static/images/mrtx.png'),loading:require('../../../static/images/zw166.png')}">
              <div>
                <h4>{{item.scSysUser.username}}</h4>
                <p>{{item.scCmsTitle}}</p>
              </div>
              <span>{{item.scCmsDynamicCreatetime}}</span>
              <!--<span>{{item.scCmsDynamicCreatetime.substr(0,10)}}</span>-->
            </div>
            <div class="updateContent">
              <img v-lazy="{src:item.article.scCmsResourcesList.length!=0?item.article.scCmsResourcesList[0].resourcesUrl:require('../../../static/images/zw166.png'),loading:require('../../../static/images/zw166.png'),error:require('../../../static/images/zw166.png')}">
              <!--<img :src="item.article.scCmsResourcesList[0].resourcesUrl" alt="">-->
              <p>{{item.article.articleTitle?item.article.articleTitle:'该文章已被删除或屏蔽'}}</p>
              <!--<p v-if="item.article.scCmsResourcesList.length==0"> 该文章已被删除或屏蔽</p>-->
            </div>
            <div class="careNum">
              <span>
                <i class="iconfont icon-dianzanshu"></i>
                <s>{{item.article.praiseNumber?item.article.praiseNumber:0}}</s>
              </span>
              <span>
                <i class="iconfont icon-xinxi"></i>
                <s>{{item.article.commentNum}}</s>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>
<!--3:分享文章，7：关注，4：回复评论，6：收藏文章，5，评论文章，2:点赞文章,1:发布新文章，13：评论回答，9.发布新问题，12:收藏问题，15:点赞回答,14:发布新回答-->
<script>
    export default {
      props:['list'],
      methods:{
        goInfo:function (type,articleId,previewImgType,authorId,cmsNewComment) {
          this.$emit('toInfo',type,articleId,previewImgType,authorId,cmsNewComment)
        }
      }
    }
</script>

<style scoped lang="less" type="text/less">
  ul{
    width: 100%;
    background-color: #f8f8f8;
    li{
      width: 100%;
      padding: 0 24/32rem;
      margin-top: 20/32rem;
      background-color: #fff;
      border-top: 1/32rem solid #e5e5e5;
      border-bottom: 1/32rem solid #e5e5e5;
      &:nth-of-type(1){
        margin-top: 0;
      }
      .authorMsg{
        width: 100%;
        height: 129/32rem;
        >img{
          float: left;
          width: 65/32rem;
          height: 65/32rem;
          border-radius: 50%;
          margin-top: 20/32rem;
        }
        >div{
          float: left;
          margin-left: 30/32rem;
          margin-top: 28/32rem;
          font-size: 28/32rem;
          h4{
            color: #9189f2;
          }
          p{
            color: #333333;
            margin-top: 10/32rem;
          }
        }
        >span{
          float: right;
          margin-top: 50/32rem;
          font-size: 24/32rem;
          color: #bdbdbd;
        }
      }
      .updateContent{
        width: 100%;
        height: 120/32rem;
        background-color: #f8f8f8;
        img{
          width: 120/32rem;
          height: 120/32rem;
          float: left;
        }
        p{
          font-size: 30/32rem;
          color: #53537d;
          padding-left: 16/32rem;
          padding-top: 28/32rem;
          line-height: 35/32rem;
          white-space:pre-wrap;
          display: -webkit-box!important;
          -webkit-line-clamp: 2!important;
          -webkit-box-orient: vertical!important;
          overflow: hidden!important;
        }
      }
      .careNum{
        width: 100%;
        height: 102/32rem;
        line-height: 102/32rem;
        text-align: right;
        p{
          float: left;
          width: 60%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          text-align: left;
          span:first-of-type{
            font-size: 26/32rem;
            color: #9189f2;
          }
          span:last-of-type{
            font-size: 26/32rem;
            color: #999999;
          }
        }
        >span{
          display: inline-block;
          height: 60/32rem;
          line-height: 60/32rem;
          color: #787878;
          margin-right: 30/32rem;
          i{
            font-size: 36/32rem;
          }
          s{
            text-decoration: none;
          }
        }
      }
      .temp7{
        padding-bottom: 60/32rem;
        .updateContent{
          p{
            color: #333333;
            padding-top: 20/32rem;
            font-size: 28/32rem;
            font-weight: 700;
          }
          span{
            display: inline-block;
            font-size: 24/32rem;
            color: #999999;
            padding-left: 16/32rem;
            padding-top: 16/32rem;
          }
        }
      }
      .temp4{
        .updateContent{
          height: 60/32rem;
          padding-left: 20/32rem;
          p{
            display: block;
            height: 60/32rem;
            line-height: 60/32rem;
            padding: 0;
            font-size: 26/32rem;
            span:first-child{
              color: #9189f2;
            }
            span:last-child{
              color: #999999;
            }
          }
        }
        .replyContent{
          height: 80/32rem;
          line-height: 80/32rem;
          font-size: 26/32rem;
          p{
            span:first-child{
              color: #9189f2;
            }
            span:last-child{
              color: #999999;
            }
          }

        }
      }
      .temp5{
        .replyContent{
          height: 80/32rem;
          line-height: 80/32rem;
          font-size: 26/32rem;
          p{
            span:first-child{
              color: #9189f2;
            }
            span:last-child{
              color: #999999;
            }
          }

        }

      }
    }
  }
</style>
