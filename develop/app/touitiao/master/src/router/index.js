import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home/home.vue'
import video from '../components/video/video.vue'
import newsInfo from '../components/home/newsInfo.vue'
import videoInfo from '../components/video/videoInfo.vue'
import answerInfo from '../components/answers/answerInfo'
import singleAnswer from '../components/answers/singleAnswer'
import commentReplyInfo from '../components/common/commentReplyInfo'
import login from '../components/login/login.vue'
import logining from '../components/login/logining.vue'
import register from '../components/login/register.vue'
import mine from '../components/mine/mine.vue'
import resetPassword_step1 from '../components/login/resetPassword_step1.vue'
import resetPassword_step2 from '../components/login/resetPassword_step2.vue'
import mineActive from '../components/mine/mine-active.vue'
import mineCollectionAndHistory from '../components/mine/mine-CollectionAndHistory.vue'
import mineAttentionAndFans from '../components/mine/mine-attentionAndFans.vue'
import mineEwCode from '../components/mine/mine-ewCode.vue'
import mineArticleManage from '../components/mine/mineArticleManage'
import writeArticle from '../components/mine/writeArticle'
import mineQuestionManage from  '../components/mine/mineQuestionManage'
import announcmentInfo from '../components/mine/announcmentInfo'
import editMyAnswer from '../components/answers/editMyAnswer'
import toAnswerPage from '../components/answers/toAnswerPage'
import search from '../components/search/search.vue'
import pictures from '../components/common/pictures.vue'
import care from '../components/care/care.vue'
import addCare from '../components/care/addCare.vue'
import friendUpdates from '../components/care/friendUpdates.vue'
import authorPage from '../components/otherAuthor/otherAuthor.vue'
import taAttentionAndFans from '../components/otherAuthor/ta-attentionAndFans.vue'
import topicHome from '../components/topic/topicHome.vue'
import topicInfo from '../components/topic/topicInfo.vue'
import topicDetails from '../components/topic/topicDetails.vue'
import voteInfo from '../components/vote/voteInfo'
// import test from '../components/common/test.vue'
import Navigator from '../components/common/Navigator.vue'

Vue.component(Navigator.name, Navigator);
Vue.use(Router);
// Vue.config.productionTip = false
export default new Router({
  linkActiveClass: 'tabbar-active',
  // mode: 'history',
  routes: [
    {path: '/', redirect: '/home',},//路由重定向
    {
      path: '/home', component: home,
      meta: {
        requiredAuth: true
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.requiredAuth) {
          var os = function () {
            var ua = navigator.userAgent,
              isWindowsPhone = /(?:Windows Phone)/.test(ua),
              isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
              isAndroid = /(?:Android)/.test(ua),
              isFireFox = /(?:Firefox)/.test(ua),
              isChrome = /(?:Chrome|CriOS)/.test(ua),
              isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
              isPhone = /(?:iPhone)/.test(ua) && !isTablet,
              isPc = !isPhone && !isAndroid && !isSymbian;
            return {
              isTablet: isTablet,
              isPhone: isPhone,
              isAndroid: isAndroid,
              isPc: isPc
            };
          }();
          if (os.isPc) {
            window.location.href = 'http://news.izxcs.com'
          } else {
            next()
          }
        } else {
          next()
        }
      },
    },
    {path: '/search', component: search, name: 'search'},
    {path: '/newsInfo/:articleId', component: newsInfo, name: 'newsInfo'},
    {path: '/pictures/:articleId', component: pictures, name: 'pictures'},
    {path: '/videoInfo/:videoId', component: videoInfo, name: 'videoInfo'},
    {path: '/answerInfo/:articleId', component: answerInfo, name: 'answerInfo'},
    {path: '/singleAnswer/:articleId', component: singleAnswer, name: 'singleAnswer'},
    {path: '/commentReplyInfo', component: commentReplyInfo, name: 'commentReplyInfo'},
    {path: '/video', component: video,},
    {
      path: '/mine',
      component: mine,
      // meta: {
      //   requiredAuth: true
      // },
      // beforeEnter: (to, from, next) => {
      //   if (to.meta.requiredAuth) {
      //     if (sessionStorage.getItem('userId')) {
      //       next()
      //     } else {
      //       next({
      //         path: '/login?to=mine'
      //       })
      //     }
      //   } else {
      //     next()
      //   }
      // },
    },
    {path: '/mine/mine-active', component: mineActive, name: 'mine-active'},
    {path: '/mine/mine-CollectionAndHistory/:cate', component: mineCollectionAndHistory},
    {path: '/mine/mine-attentionAndFans/:cate', component: mineAttentionAndFans},
    {path: '/mine/min-ewCode/:userId', component: mineEwCode},
    {path: '/mine/mineArticleManage', component: mineArticleManage},
    {path: '/mine/mineQuestionManage', component: mineQuestionManage,name:'mineQuestionManage'},
    {path: '/announcmentInfo/:announcmentId', component: announcmentInfo, name: 'announcmentInfo'},
    {path: '/editMyAnswer/:articleId/:articleTitle', component: editMyAnswer, name: 'editMyAnswer'},
    {path: '/toAnswerPage', component: toAnswerPage, name: 'toAnswerPage'},
    {path: '/writeArticle', component: writeArticle, name: 'writeArticle'},
    {
      path: '/care',
      component: care,
      // meta: {
      //   requiredAuth: true
      // },
      // beforeEnter: (to, from, next) => {
      //   if (to.meta.requiredAuth) {
      //     if (sessionStorage.getItem('userId')) {
      //       next()
      //     } else {
      //       next({
      //         path: '/login?to=care'
      //       })
      //     }
      //   } else {
      //     next()
      //   }
      // },
    },
    {path: '/care/addCare', component: addCare},
    {path: '/care/friendUpdates', component: friendUpdates, name: friendUpdates},

    {path: '/author/authorPage/homePage/:authorId', component: authorPage},
    {path: '/author/authorPage/homePage/ta-attentionAndFans/:cate/:authorId', component: taAttentionAndFans},
    {path: '/author/authorPage/homePage/newsInfo/:articleId', component: newsInfo,name:'newsInfo'},
    {path: '/author/authorPage/homePage/pictures/:articleId', component: pictures,name:'pictures'},
    {path: '/author/authorPage/homePage/videoInfo/:videoId', component: videoInfo,name:'videoInfo'},
    {path: '/author/authorPage/homePage/answerInfo/:articleId', component: answerInfo,name:'answerInfo'},
    {path: '/author/authorPage/homePage/singleAnswer/:articleId', component: singleAnswer,name:'singleAnswer'},

    {path: '/topicHome', component: topicHome,},
    {path: '/topicInfo/:scCmsSpecialId', component: topicInfo,name:'topicInfo'},
    // {path: '/topicHome/topicInfo/newsInfo/:articleId', component: newsInfo,name:'newsInfo'},
    // {path: '/topicHome/topicInfo/pictures/:articleId', component: pictures,name:'pictures'},
    // {path: '/topicHome/topicInfo/videoInfo/:videoId', component: videoInfo,name:'videoInfo'},
    {path: '/topicDetails/:scCmsSpecialId', component: topicDetails, name: 'topicDetails'},
    {path:'/voteInfo/:articleId',component:voteInfo,name:'voteInfo'}
    // {path: '/test', component: test, name: 'test'},
  ],
})
